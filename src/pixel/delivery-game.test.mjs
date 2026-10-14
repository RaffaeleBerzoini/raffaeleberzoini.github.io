import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("./delivery-game.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const {
  WIDTH, HEIGHT, DURATION, DEPOT, TARGETS, ANTENNAS,
  DRONE_HALF_WIDTH, DRONE_HALF_HEIGHT, MAX_SPEED,
  createDeliveryGame, startDeliveryGame, stepDeliveryGame,
} = await import("data:text/javascript;base64," + Buffer.from(compiled).toString("base64"));

const idle = { x: 0, y: 0 };
const close = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
const advance = (state, seconds, input = idle) => stepDeliveryGame(state, input, seconds);
const at = (point) => ({ ...startDeliveryGame(), x: point.x, y: point.y });

function intersectsAntenna(state) {
  return ANTENNAS.some((antenna) =>
    state.x > antenna.x - DRONE_HALF_WIDTH &&
    state.x < antenna.x + antenna.width + DRONE_HALF_WIDTH &&
    state.y > antenna.y - DRONE_HALF_HEIGHT &&
    state.y < antenna.y + antenna.height + DRONE_HALF_HEIGHT);
}

test("start and restart produce independent, complete states", () => {
  const ready = createDeliveryGame();
  assert.equal(ready.phase, "ready");
  assert.equal(ready.carrying, true);
  assert.equal(ready.remaining, DURATION);
  assert.equal(ready.x, DEPOT.x);
  assert.equal(ready.y, DEPOT.y);
  assert.deepEqual(ready.delivered, []);
  const first = startDeliveryGame();
  first.delivered.push(0);
  const restarted = startDeliveryGame();
  assert.deepEqual(restarted, { ...ready, phase: "playing" });
  assert.notEqual(ready.delivered, restarted.delivered);
  assert.notEqual(first.delivered, restarted.delivered);
});

test("ready, paused and terminal states freeze all fields, timers and events", () => {
  for (const phase of ["ready", "paused", "won", "lost"]) {
    const state = Object.freeze({ ...startDeliveryGame(), phase, dockProgress: 0.5, hitCooldown: 0.8, celebrate: 0.7 });
    assert.equal(advance(state, 10, { x: 1, y: -1 }), state);
  }
  let state = advance(startDeliveryGame(), 0.5, { x: 1, y: 0 });
  const paused = { ...state, phase: "paused" };
  assert.equal(advance(paused, 15), paused);
  state = advance({ ...paused, phase: "playing" }, 0.5);
  close(state.time, 1);
  close(state.remaining, 59);
});

test("each delivery requires a continuous hover and depot reload; events remain sticky", () => {
  let state = advance(at(TARGETS[0]), 0.34);
  assert.deepEqual(state.delivered, []);
  assert.ok(state.dockProgress > 0.95 && state.dockProgress < 1);
  state = advance(state, 0.02);
  assert.deepEqual(state.delivered, [0]);
  assert.equal(state.lastDelivery, 0);
  assert.equal(state.targetIndex, 1);
  assert.equal(state.carrying, false);
  assert.equal(state.eventId, 1);
  assert.equal(state.event, "delivery");
  assert.ok(state.celebrate > 0);
  state = advance(state, 1.5);
  assert.equal(state.eventId, 1);
  assert.equal(state.event, "delivery");
  assert.deepEqual(state.delivered, [0]);
  assert.equal(state.celebrate, 0);
  state = advance({ ...state, x: TARGETS[1].x, y: TARGETS[1].y }, 0.6);
  assert.deepEqual(state.delivered, [0], "empty drone cannot deliver the next letter");
  state = advance({ ...state, x: DEPOT.x, y: DEPOT.y }, 0.36);
  assert.equal(state.carrying, true);
  assert.equal(state.event, "pickup");
  assert.equal(state.eventId, 2);
  state = advance(state, 0.5);
  assert.equal(state.eventId, 2, "remaining at depot must not repeatedly pick up");
  state = advance({ ...state, x: TARGETS[1].x, y: TARGETS[1].y }, 0.36);
  assert.deepEqual(state.delivered, [0, 1]);
  assert.equal(state.eventId, 3);
});

test("leaving a docking area resets progress and passing at speed does not deliver", () => {
  let state = advance(at(TARGETS[0]), 0.2);
  state = advance({ ...state, x: TARGETS[0].x - 23 }, 0.01);
  assert.equal(state.dockProgress, 0);
  state = advance({ ...state, x: TARGETS[0].x }, 0.2);
  assert.deepEqual(state.delivered, []);
  state = advance(state, 0.15);
  assert.deepEqual(state.delivered, [0]);
  const flyby = advance({ ...at(TARGETS[0]), x: TARGETS[0].x - 21, vx: MAX_SPEED }, 0.25, { x: 1, y: 0 });
  assert.deepEqual(flyby.delivered, []);
  assert.equal(flyby.dockProgress, 0);
});

test("normalized diagonals have the same acceleration and speed as cardinal motion", () => {
  const origin = at({ x: 50, y: 25 });
  const cardinal = advance(origin, 0.6, { x: 1, y: 0 });
  const diagonal = advance(origin, 0.6, { x: 1, y: 1 });
  close(Math.hypot(diagonal.vx, diagonal.vy), cardinal.vx);
  close(Math.hypot(diagonal.x - origin.x, diagonal.y - origin.y), cardinal.x - origin.x);
  assert.ok(cardinal.vx <= MAX_SPEED);
  assert.ok(cardinal.vx > MAX_SPEED * 0.99);
  const analog = advance(origin, 0.6, { x: 0.5, y: 0 });
  close(analog.vx, cardinal.vx / 2);
});

test("substeps prevent tunnelling, keep the body in bounds and consume long elapsed time", () => {
  const right = advance(at({ x: 50, y: 25 }), 10, { x: 1, y: 0 });
  close(right.x, WIDTH - DRONE_HALF_WIDTH);
  close(right.remaining, 50);
  const bottom = advance(at({ x: 50, y: 25 }), 10, { x: 0, y: 1 });
  close(bottom.y, HEIGHT - DRONE_HALF_HEIGHT);
  const corner = advance(at({ x: 50, y: 25 }), 10, { x: -1, y: -1 });
  close(corner.x, DRONE_HALF_WIDTH);
  close(corner.y, DRONE_HALF_HEIGHT);
  const collided = advance(at({ x: 130, y: 210 }), 0.8, { x: 1, y: 0 });
  assert.equal(collided.event, "bump");
  assert.ok(collided.x < ANTENNAS[0].x - DRONE_HALF_WIDTH);
  assert.equal(intersectsAntenna(collided), false);
  const expired = advance(startDeliveryGame(), Number.MAX_VALUE);
  assert.equal(expired.phase, "lost");
  assert.equal(expired.remaining, 0);
  close(expired.time, DURATION);
  assert.equal(expired.vx, 0);
  assert.equal(expired.vy, 0);
});

test("antenna impacts penalize three seconds at most once per second and allow escape", () => {
  let state = at({ x: 173, y: 210 });
  const hitTimes = [];
  for (let frame = 0; frame < 240; frame++) {
    const previousEvent = state.eventId;
    state = advance(state, 1 / 60, { x: 1, y: 0 });
    assert.equal(intersectsAntenna(state), false);
    if (state.eventId !== previousEvent) hitTimes.push(state.time);
  }
  assert.ok(hitTimes.length >= 2 && hitTimes.length <= 4);
  for (let index = 1; index < hitTimes.length; index++) {
    assert.ok(hitTimes[index] - hitTimes[index - 1] >= 1 - 1 / 60 - 1e-8);
  }
  close(state.remaining, DURATION - state.time - hitTimes.length * 3);
  const escaped = advance(state, 0.6, { x: -1, y: 0 });
  assert.ok(escaped.x < 125);
  assert.equal(intersectsAntenna(escaped), false);
  const inside = advance(at({ x: 198, y: 210 }), 1 / 60);
  assert.equal(intersectsAntenna(inside), false, "an initially overlapping body must also escape");
  assert.equal(inside.eventId, 1);
});

test("timeout during an impact ends the game without a negative clock", () => {
  const state = advance({ ...at({ x: 173.9, y: 210 }), remaining: 2, vx: 145 }, 0.02, { x: 1, y: 0 });
  assert.equal(state.phase, "lost");
  assert.equal(state.remaining, 0);
  assert.equal(state.event, "bump");
  assert.equal(state.vx, 0);
});

test("invalid deltas freeze and bad input components cannot poison the simulation", () => {
  const state = startDeliveryGame();
  for (const dt of [0, -1, NaN, Infinity, -Infinity]) assert.equal(advance(state, dt), state);
  const advanced = advance(state, 0.5, { x: NaN, y: Infinity });
  assert.equal(advanced.x, state.x);
  assert.equal(advanced.y, state.y);
  close(advanced.remaining, 59.5);
});

test("stepping and docking do not mutate the provided state or delivered array", () => {
  const state = Object.freeze({ ...at(TARGETS[0]), delivered: Object.freeze([]) });
  const result = advance(state, 0.4);
  assert.deepEqual(state.delivered, []);
  assert.deepEqual(result.delivered, [0]);
  assert.equal(state.time, 0);
  assert.notEqual(result.delivered, state.delivered);
});

test("all six deliveries are reachable within one minute using only movement input", () => {
  let state = startDeliveryGame();
  let frames = 0;
  const tick = (input) => {
    state = advance(state, 1 / 60, input);
    frames++;
    assert.notEqual(state.phase, "lost", `route timed out after ${state.delivered.length} deliveries`);
    assert.ok(frames <= 3600);
    assert.equal(intersectsAntenna(state), false);
  };
  const flyTo = (point) => {
    for (let frame = 0; frame < 600; frame++) {
      const dx = point.x - state.x;
      const dy = point.y - state.y;
      if (Math.hypot(dx, dy) < 6 && Math.hypot(state.vx, state.vy) < 25) return;
      tick({ x: (dx * 5 - state.vx * 0.6) / MAX_SPEED, y: (dy * 5 - state.vy * 0.6) / MAX_SPEED });
      if (state.phase === "won") return;
    }
    assert.fail(`could not reach waypoint ${point.x},${point.y}`);
  };
  const waitFor = (condition) => {
    for (let frame = 0; frame < 120 && !condition(); frame++) tick(idle);
    assert.ok(condition(), "hover should complete docking");
  };
  for (const target of TARGETS) {
    flyTo({ x: DEPOT.x, y: 70 });
    flyTo({ x: target.x, y: 70 });
    flyTo(target);
    waitFor(() => state.delivered.includes(target.id));
    if (state.phase === "won") break;
    flyTo({ x: target.x, y: 70 });
    flyTo({ x: DEPOT.x, y: 70 });
    flyTo(DEPOT);
    waitFor(() => state.carrying);
  }
  assert.equal(state.phase, "won");
  assert.deepEqual(state.delivered, TARGETS.map((target) => target.id));
  assert.equal(state.eventId, 11, "six deliveries plus five depot pickups, with no impacts");
  assert.equal(state.targetIndex, TARGETS.length - 1);
  assert.equal(state.lastDelivery, TARGETS.at(-1).id);
  assert.ok(state.remaining > 0);
  assert.ok(state.time < DURATION);
  assert.equal(advance(state, 5, { x: 1, y: 0 }), state);
});
