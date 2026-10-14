import assert from "node:assert/strict";
import { after, test } from "node:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Compile only this dependency-free module; no project configuration or test
// framework changes are needed. The temporary output is always outside src.
const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
const temporaryRoot = realpathSync(tmpdir());
const buildDirectory = mkdtempSync(
  join(temporaryRoot, "portfolio-navigation-"),
);
assert.equal(dirname(buildDirectory), temporaryRoot);
after(() => rmSync(buildDirectory, { recursive: true, force: true }));
writeFileSync(join(buildDirectory, "package.json"), '{"type":"module"}');
execFileSync(
  process.execPath,
  [
    resolve(projectRoot, "node_modules/typescript/bin/tsc"),
    resolve(projectRoot, "src/pixel/navigation.ts"),
    "--outDir",
    buildDirectory,
    "--target",
    "ES2022",
    "--module",
    "ES2022",
    "--moduleResolution",
    "Bundler",
    "--strict",
    "--skipLibCheck",
  ],
  { cwd: projectRoot, stdio: "pipe" },
);
const { isWalkable, findPath, moveWithCollisions, WALK_BOUNDS } = await import(
  pathToFileURL(join(buildDirectory, "navigation.js")).href
);

// Match PixelLab's actual START and station approach positions.
const spawn = { x: 491, y: 515 };
const stations = {
  projects: { x: 254, y: 486 },
  profile: { x: -20, y: 420 },
  research: { x: 700, y: 486 },
  contact: { x: 799, y: 495 },
  window: { x: 491, y: 379 },
};

function assertSafePath(start, path) {
  let previous = start;
  for (const waypoint of path) {
    assert.ok(
      isWalkable(waypoint),
      `Unwalkable waypoint ${JSON.stringify(waypoint)}`,
    );
    const distance = Math.hypot(
      waypoint.x - previous.x,
      waypoint.y - previous.y,
    );
    const samples = Math.max(1, Math.ceil(distance * 4));
    for (let step = 0; step <= samples; step++) {
      const amount = step / samples;
      const sample = {
        x: previous.x + (waypoint.x - previous.x) * amount,
        y: previous.y + (waypoint.y - previous.y) * amount,
      };
      assert.ok(
        isWalkable(sample),
        `Path crosses furniture at ${JSON.stringify(sample)}`,
      );
    }
    previous = waypoint;
  }
}

/** Integrate paths using the controller's 180 units/s, delta cap and snap rule. */
function followLikeController(start, destination, frameDurations = [1 / 60]) {
  const path = findPath(start, destination);
  assert.ok(
    path.length > 0 ||
      Math.hypot(start.x - destination.x, start.y - destination.y) < 1e-8,
  );
  const expected = path.at(-1) ?? start;
  let position = { ...start };
  let frame = 0;
  let stuckFrames = 0;
  while (path.length && frame < 2000) {
    const old = position;
    const waypoint = path[0];
    const distance = Math.hypot(waypoint.x - old.x, waypoint.y - old.y);
    const delta = Math.min(frameDurations[frame % frameDurations.length], 0.04);
    if (distance < 0.01) {
      // A controller snap must not cut across a corner after sliding.
      assertSafePath(old, [waypoint]);
      position = { ...waypoint };
      path.shift();
    } else {
      const step = Math.min(180 * delta, distance);
      position = moveWithCollisions(
        old,
        ((waypoint.x - old.x) / distance) * step,
        ((waypoint.y - old.y) / distance) * step,
      );
    }
    assert.ok(
      isWalkable(position),
      `Controller entered furniture at ${JSON.stringify(position)}`,
    );
    if (
      delta &&
      distance >= 0.01 &&
      Math.hypot(position.x - old.x, position.y - old.y) < 1e-8
    )
      stuckFrames++;
    else stuckFrames = 0;
    assert.ok(
      stuckFrames < 5,
      `Stuck from ${JSON.stringify(start)} toward ${JSON.stringify(destination)} at ${JSON.stringify(position)}, waypoint ${JSON.stringify(path[0])}`,
    );
    frame++;
  }
  assert.equal(
    path.length,
    0,
    `Controller did not arrive from ${JSON.stringify(start)} to ${JSON.stringify(destination)}`,
  );
  assert.deepEqual(position, expected);
  return position;
}

test("foot-position bounds include their endpoints and reject out-of-range/nonfinite coordinates", () => {
  assert.equal(isWalkable({ x: -120, y: 500 }), true);
  assert.equal(isWalkable({ x: 0, y: 400 }), true);
  assert.equal(isWalkable({ x: 815, y: 543 }), true);
  assert.equal(isWalkable({ x: 500, y: 350 }), true);
  for (const point of [
    { x: 0, y: 0 },
    { x: -120.001, y: 500 },
    { x: 815.001, y: 500 },
    { x: 500, y: 349.999 },
    { x: 500, y: 543.001 },
    { x: NaN, y: 500 },
    { x: 500, y: Infinity },
  ])
    assert.equal(isWalkable(point), false);
});

test("all five furniture pieces reserve exactly the 11-unit character margin", () => {
  for (const [blocked, free] of [
    [
      { x: 436, y: 400 },
      { x: 436.01, y: 400 },
    ], // Desk right
    [
      { x: 250, y: 473 },
      { x: 250, y: 473.01 },
    ], // Chair bottom
    [
      { x: -104, y: 446 },
      { x: -104, y: 446.01 },
    ], // Plant bottom
    [
      { x: 634, y: 400 },
      { x: 633.99, y: 400 },
    ], // Shelf left
    [
      { x: 815, y: 470 },
      { x: 815, y: 470.01 },
    ], // Mailbox bottom
  ]) {
    assert.equal(isWalkable(blocked), false, JSON.stringify(blocked));
    assert.equal(isWalkable(free), true, JSON.stringify(free));
  }
});

for (const [name, station] of Object.entries(stations)) {
  test(`walk from spawn to the exact ${name} interaction position`, () => {
    const path = findPath(spawn, station);
    assert.ok(path.length > 0);
    assert.deepEqual(path.at(-1), station);
    assertSafePath(spawn, path);
  });
}

test("all station pairs are connected without crossing furniture", () => {
  for (const start of Object.values(stations)) {
    for (const target of Object.values(stations)) {
      if (start === target) continue;
      const path = findPath(start, target);
      assert.ok(path.length > 0);
      assert.deepEqual(path.at(-1), target);
      assertSafePath(start, path);
    }
  }
});

test("controller integration reaches every exact station from START and every other station", () => {
  for (const delta of [1 / 144, 1 / 60, 0.04]) {
    for (const start of [spawn, ...Object.values(stations)]) {
      for (const target of Object.values(stations)) {
        if (start === target) continue;
        assert.deepEqual(followLikeController(start, target, [delta]), target);
      }
    }
  }
});

test("manual movement against walls and furniture can hand over to click navigation", () => {
  for (const [dx, dy] of [
    [-6, -6],
    [6, -6],
    [-6, 0],
    [6, 0],
    [0, -6],
    [0, 6],
  ]) {
    let position = { ...spawn };
    for (let frame = 0; frame < 120; frame++)
      position = moveWithCollisions(position, dx, dy);
    assert.ok(isWalkable(position));
    for (const station of Object.values(stations)) {
      assert.deepEqual(
        followLikeController(position, station, [0, 1 / 120, 1 / 60, 0.08]),
        station,
      );
    }
  }
});

test("controller integration reaches arbitrary floor points, including tight furniture corners", () => {
  for (const target of [
    { x: 430, y: 462 },
    { x: 442, y: 450 },
    { x: 436.001, y: 456.001 },
    { x: 301.001, y: 473.001 },
    { x: 138.999, y: 443.001 },
    { x: 633.999, y: 460.001 },
    { x: 803.001, y: 470.001 },
    { x: 100, y: 444 },
    { x: 815, y: 471 },
    { x: 500, y: 350 },
  ]) {
    assert.ok(
      isWalkable(target),
      `Floor test fixture must be walkable: ${JSON.stringify(target)}`,
    );
    assert.deepEqual(followLikeController(spawn, target), target);
    assert.deepEqual(followLikeController(target, spawn, [0.04]), spawn);
  }
});

test("A* routes around the desk rather than crossing it diagonally", () => {
  const start = { x: 180, y: 480 };
  const target = { x: 500, y: 370 };
  const path = findPath(start, target);
  assert.ok(path.length > 1);
  assert.deepEqual(path.at(-1), target);
  assertSafePath(start, path);
});

test("path smoothing cannot cut or touch a furniture corner", () => {
  const start = { x: 430, y: 462 };
  const target = { x: 442, y: 450 }; // Direct segment touches desk corner (436,456).
  const path = findPath(start, target);
  assert.ok(path.length > 1);
  assert.deepEqual(path.at(-1), target);
  assertSafePath(start, path);
});

test("clicking furniture selects nearby reachable floor deterministically", () => {
  const target = { x: 310, y: 380 };
  const path = findPath(spawn, target);
  assert.ok(path.length > 0);
  assert.deepEqual(path, findPath(spawn, target));
  assert.equal(path.at(-1).y, 462);
  assert.ok(Math.abs(path.at(-1).x - target.x) <= 8);
  assertSafePath(spawn, path);
});

test("out-of-bounds clicks, including zero coordinates, clamp to reachable floor", () => {
  for (const target of [
    { x: 0, y: 0 },
    { x: -1000, y: 800 },
    { x: 10000, y: 10000 },
  ]) {
    const path = findPath(spawn, target);
    assert.ok(path.length > 0);
    assertSafePath(spawn, path);
  }
  assert.deepEqual(findPath(spawn, { x: 10000, y: 10000 }).at(-1), {
    x: 815,
    y: 543,
  });
});

test("invalid starts, nonfinite targets and an already reached target return empty paths", () => {
  assert.deepEqual(findPath({ x: 310, y: 380 }, spawn), []);
  assert.deepEqual(findPath({ x: 0, y: 0 }, spawn), []);
  assert.deepEqual(findPath(spawn, { x: Infinity, y: 500 }), []);
  assert.deepEqual(findPath(spawn, { x: 500, y: NaN }), []);
  assert.deepEqual(findPath(spawn, spawn), []);
});

test("keyboard movement stops at inflated furniture even for an oversized delta", () => {
  const start = { x: 450, y: 400 };
  for (const dx of [-30, -10000]) {
    const result = moveWithCollisions(start, dx, 0);
    assert.ok(result.x > 436 && result.x < 436.01);
    assert.equal(result.y, 400);
    assertSafePath(start, [result]);
  }
});

test("diagonal keyboard motion slides along the desk without teleporting", () => {
  const start = { x: 440, y: 450 };
  const result = moveWithCollisions(start, -8, 8);
  assert.ok(result.x > 436 && result.x < 436.01);
  assert.equal(result.y, 458);
  assert.ok(isWalkable(result));
  assert.ok(
    Math.hypot(result.x - start.x, result.y - start.y) <= Math.hypot(8, 8),
  );
  assert.deepEqual(start, { x: 440, y: 450 });
});

test("repeated small diagonal steps never enter furniture or exceed input distance", () => {
  let point = { x: 520, y: 500 };
  for (let step = 0; step < 100; step++) {
    const next = moveWithCollisions(point, -6, -6);
    assert.ok(isWalkable(next));
    assert.ok(
      Math.hypot(next.x - point.x, next.y - point.y) <= Math.hypot(6, 6) + 1e-8,
    );
    point = next;
  }
});

test("keyboard movement clamps room bounds and safely handles zero or invalid delta", () => {
  assert.deepEqual(moveWithCollisions({ x: 500, y: 500 }, -10000, 0), {
    x: WALK_BOUNDS.minX,
    y: 500,
  });
  assert.deepEqual(moveWithCollisions({ x: 500, y: 500 }, 10000, 0), {
    x: WALK_BOUNDS.maxX,
    y: 500,
  });
  assert.deepEqual(moveWithCollisions({ x: 500, y: 500 }, 0, -10000), {
    x: 500,
    y: WALK_BOUNDS.minY,
  });
  assert.deepEqual(moveWithCollisions({ x: 500, y: 500 }, 0, 10000), {
    x: 500,
    y: WALK_BOUNDS.maxY,
  });
  assert.deepEqual(moveWithCollisions(spawn, 0, 0), spawn);
  assert.deepEqual(moveWithCollisions(spawn, NaN, 0), spawn);
});
