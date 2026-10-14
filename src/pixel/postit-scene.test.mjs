import assert from "node:assert/strict";
import { after, test } from "node:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Isolate the scene math from React/artwork so these checks can run without a DOM.
const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
const temporaryRoot = realpathSync(tmpdir());
const buildDirectory = mkdtempSync(join(temporaryRoot, "portfolio-postits-"));
assert.equal(dirname(buildDirectory), temporaryRoot);
after(() => rmSync(buildDirectory, { recursive: true, force: true }));
writeFileSync(join(buildDirectory, "package.json"), '{"type":"module"}');
execFileSync(
  process.execPath,
  [
    resolve(projectRoot, "node_modules/typescript/bin/tsc"),
    resolve(projectRoot, "src/pixel/postit-scene.ts"),
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
const {
  NOTES,
  FALLING_NOTES,
  CAT_HOME,
  SCENE_DURATION,
  shuffleNotes,
  samplePostitScene,
} = await import(pathToFileURL(join(buildDirectory, "postit-scene.js")).href);

const indices = NOTES.map((_, index) => index);
const close = (actual, expected, message, tolerance = 1e-4) => {
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `${message}: expected ${expected}, got ${actual}`,
  );
};

test("only the two reachable lower notes are shuffled, with either eligible to go first", () => {
  assert.deepEqual(FALLING_NOTES, [2, 3]);
  const permutations = new Set();
  for (const value of [0, 0.25, 0.5, 0.75, 0.999999]) {
    const bag = shuffleNotes(-1, () => value);
    assert.deepEqual([...bag].sort(), [2, 3]);
    permutations.add(bag.join(","));
  }
  assert.deepEqual([...permutations].sort(), ["2,3", "3,2"]);
});

test("consecutive bags never repeat the last note at the next bag boundary", () => {
  let seed = 27;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  let previous = -1;
  for (let round = 0; round < 100; round++) {
    const bag = shuffleNotes(previous, random);
    assert.deepEqual([...bag].sort(), [2, 3]);
    assert.notEqual(bag[0], previous);
    previous = bag.at(-1);
  }
  for (const previous of FALLING_NOTES)
    for (const value of [0, 0.5, 0.999999]) {
      assert.notEqual(shuffleNotes(previous, () => value)[0], previous);
    }
});

test("the two upper notes stay attached and cannot trigger a helper excursion", () => {
  for (const index of [0, 1]) {
    const initial = samplePostitScene(index, 0);
    assert.equal(initial.paper.x, NOTES[index].x);
    assert.equal(initial.paper.y, NOTES[index].y);
    assert.equal(initial.cat.pose, "sleep");
    for (let step = 0; step <= SCENE_DURATION * 10; step++) {
      assert.deepEqual(samplePostitScene(index, step / 10), initial);
    }
  }
});

test("the 78-second story leaves time for a six-second fall, five-second rest and three-second wake", () => {
  assert.equal(SCENE_DURATION, 78);
  const phases = [
    [0, "rest"],
    [17.999, "rest"],
    [18, "fall"],
    [23.999, "fall"],
    [24, "ground"],
    [28.999, "ground"],
    [29, "wake"],
    [31.999, "wake"],
    [32, "approach"],
    [35, "pickup"],
    [38, "carry"],
    [43, "to-board"],
    [47, "rise"],
    [49.5, "pin"],
    [51.5, "lower"],
    [54, "back-away"],
    [58, "return"],
    [65, "settle"],
    [68, "rest"],
    [78, "rest"],
  ];
  for (const index of FALLING_NOTES)
    for (const [elapsed, phase] of phases) {
      assert.equal(samplePostitScene(index, elapsed).phase, phase);
    }
});

test("paper and helper positions stay continuous at every animation boundary", () => {
  const boundaries = [
    18, 24, 29, 32, 35, 38, 43, 44.2, 47, 49.5, 51.5, 54, 58, 65, 68, 78,
  ];
  for (const index of FALLING_NOTES)
    for (const boundary of boundaries) {
      const before = samplePostitScene(index, boundary - 1e-7);
      const at = samplePostitScene(index, boundary);
      const after = samplePostitScene(index, boundary + 1e-7);
      for (const adjacent of [before, after]) {
        for (const key of ["x", "y", "rise"]) {
          close(
            adjacent.cat[key],
            at.cat[key],
            `note ${index}, cat ${key} at ${boundary}`,
          );
        }
        for (const key of ["x", "y", "rotation", "scaleX", "scaleY"]) {
          close(
            adjacent.paper[key],
            at.paper[key],
            `note ${index}, paper ${key} at ${boundary}`,
          );
        }
      }
    }
});

test("the falling note descends with alternating leaf rotation and rests before the cat approaches", () => {
  for (const index of FALLING_NOTES) {
    let previousY = NOTES[index].y;
    let turnedLeft = false,
      turnedRight = false;
    for (let step = 0; step <= 300; step++) {
      const { paper } = samplePostitScene(index, 18 + step * 0.02);
      assert.ok(paper.y >= previousY - 1e-8);
      previousY = paper.y;
      turnedLeft ||= paper.rotation < -1;
      turnedRight ||= paper.rotation > 1;
    }
    assert.ok(turnedLeft && turnedRight);
    const ground = samplePostitScene(index, 24);
    assert.ok(ground.paper.y > NOTES[index].y);
    assert.ok(ground.paper.scaleY < ground.paper.scaleX);
    for (let step = 0; step < 80; step++) {
      const time = 24 + step / 10;
      const resting = samplePostitScene(index, time);
      assert.deepEqual(resting.paper, ground.paper);
      assert.equal(resting.cat.x, CAT_HOME.x);
      assert.equal(resting.cat.y, CAT_HOME.y);
      assert.equal(resting.cat.carrying, false);
      assert.equal(resting.cat.pose, time < 29 ? "sleep" : "wake");
    }
  }
});

test("paper stays at the walking mouth (-18, -22) throughout pickup and transport", () => {
  for (const index of FALLING_NOTES) {
    for (let step = 0; step < 400; step++) {
      const { cat, paper } = samplePostitScene(index, 35 + step * 0.02);
      assert.equal(cat.facing, 1);
      assert.equal(cat.carrying, true);
      close(paper.x, cat.x - 18, `note ${index}, mouth x`);
      close(paper.y, cat.y - 22, `note ${index}, mouth y`);
    }
  }
});

test("turning toward the board centers the carried paper smoothly while showing the cat's back", () => {
  for (const index of FALLING_NOTES) {
    let previousX = -18;
    let previousY = -22;
    for (let step = 0; step <= 200; step++) {
      const { cat, paper } = samplePostitScene(index, 43 + step * 0.02);
      if (step < 200) assert.equal(cat.pose, "back");
      assert.equal(cat.carrying, true);
      const offsetX = paper.x - cat.x;
      const offsetY = paper.y - cat.y;
      assert.ok(offsetX >= previousX - 1e-8 && offsetX <= 1e-8);
      assert.ok(offsetY <= previousY + 1e-8 && offsetY >= -31 - 1e-8);
      previousX = offsetX;
      previousY = offsetY;
    }
    close(previousX, 0, "paper centered behind cat");
    close(previousY, -31, "paper at rear carry height");
  }
});

test("the cat's feet stay on the floor while its paws raise the paper to each note's exact pin height", () => {
  for (const index of FALLING_NOTES) {
    const feet = samplePostitScene(index, 47).cat;
    assert.equal(feet.y, 350);
    assert.equal(feet.reach, feet.y - NOTES[index].y);
    let previousRise = 0;
    for (let step = 0; step <= 350; step++) {
      const time = 47 + step * 0.02;
      const { cat, paper } = samplePostitScene(index, time);
      assert.equal(cat.x, feet.x);
      assert.equal(cat.y, feet.y);
      assert.ok(cat.rise >= 0 && cat.rise <= 1);
      if (time < 54) assert.equal(cat.pose, "stand");
      if (time <= 49.5) {
        assert.ok(cat.rise >= previousRise - 1e-8);
        close(paper.x, cat.x, "raised paper remains centered");
        close(
          paper.y,
          cat.y - 31 - cat.rise * (cat.reach - 31),
          "paper follows raised paws",
        );
      } else if (time < 51.5) {
        assert.equal(cat.rise, 1);
        assert.equal(cat.carrying, false);
        close(paper.y, cat.y - cat.reach, "pin height");
      } else {
        assert.ok(cat.rise <= previousRise + 1e-8);
        assert.equal(cat.carrying, false);
        assert.equal(paper.x, NOTES[index].x);
        assert.equal(paper.y, NOTES[index].y);
      }
      previousRise = cat.rise;
    }
    assert.equal(previousRise, 0);
  }
});

test("the helper walks continuously without a jump pose or sudden airborne excursion", () => {
  const floorPoses = new Set([
    "sleep",
    "wake",
    "walk",
    "pickup",
    "back",
    "stand",
    "settle",
  ]);
  for (const index of FALLING_NOTES) {
    let previous = samplePostitScene(index, 0).cat;
    for (let step = 1; step <= SCENE_DURATION * 100; step++) {
      const { cat } = samplePostitScene(index, step / 100);
      assert.ok(floorPoses.has(cat.pose));
      assert.ok(cat.y >= 347, "helper feet cannot move above the room's floor");
      // Walking is capped at 50 world units/second. The old jump violates this.
      assert.ok(Math.hypot(cat.x - previous.x, cat.y - previous.y) <= 0.5);
      previous = cat;
    }
  }
});

test("the pinned note stays restored while the cat walks home and sleeps before the next cycle", () => {
  for (const index of FALLING_NOTES) {
    const initial = samplePostitScene(index, 0);
    for (const time of [51.5, 53, 54, 58, 65, 68, SCENE_DURATION]) {
      assert.deepEqual(samplePostitScene(index, time).paper, initial.paper);
    }
    const settling = samplePostitScene(index, 65).cat;
    assert.equal(settling.x, CAT_HOME.x);
    assert.equal(settling.y, CAT_HOME.y);
    assert.equal(settling.pose, "settle");
    assert.deepEqual(samplePostitScene(index, 68), initial);
    assert.deepEqual(samplePostitScene(index, SCENE_DURATION), initial);
  }
});

test("all sampled transforms are finite, have positive scale, and elapsed time is bounded", () => {
  for (const index of indices) {
    for (let step = 0; step <= Math.ceil(SCENE_DURATION * 100); step++) {
      const { cat, paper } = samplePostitScene(index, step / 100);
      for (const value of [
        cat.x,
        cat.y,
        cat.facing,
        cat.rise,
        cat.reach,
        ...Object.values(paper),
      ]) {
        assert.ok(Number.isFinite(value));
      }
      assert.ok(paper.scaleX > 0 && paper.scaleY > 0);
    }
    assert.deepEqual(samplePostitScene(index, -1), samplePostitScene(index, 0));
    assert.deepEqual(
      samplePostitScene(index, Infinity),
      samplePostitScene(index, SCENE_DURATION),
    );
  }
});
