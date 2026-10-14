import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

// Pure module: compile in memory without writing into the shared workspace.
const source = readFileSync(new URL("./cat-gait.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const { sampleCatGait, CAT_STRIDE } = await import(
  "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
);

const legs = ["frontNear", "backNear", "frontFar", "backFar"];
const touchdowns = { backNear: 0, frontNear: 4, backFar: 8, frontFar: 12 };
const close = (actual, expected, tolerance = 1e-9) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${actual} differs from ${expected}`,
  );

test("a planted paw stays at a fixed world position while the body advances", () => {
  for (const backward of [false, true]) {
    const bodySign = backward ? 1 : -1;
    for (const [leg, touchdown] of Object.entries(touchdowns)) {
      const start = touchdown + 0.1;
      const plantedWorldX =
        bodySign * start + sampleCatGait(start, backward)[leg].x;
      for (let travelled = 0; travelled <= 11.7; travelled += 0.13) {
        const distance = start + travelled;
        const paw = sampleCatGait(distance, backward)[leg];
        close(bodySign * distance + paw.x, plantedWorldX);
        assert.equal(
          paw.y,
          0,
          `${leg} must remain on the floor throughout stance`,
        );
      }
    }
  }
});

test("four distinct footfalls form a walk with three supporting paws, never a diagonal trot", () => {
  const grounded = Object.fromEntries(legs.map((leg) => [leg, 0]));
  for (let index = 0; index < 640; index++) {
    const sample = sampleCatGait(((index + 0.5) / 640) * CAT_STRIDE);
    const planted = legs.filter((leg) => sample[leg].y === 0);
    assert.equal(
      planted.length,
      3,
      "exactly one foot is swinging between beats",
    );
    planted.forEach((leg) => grounded[leg]++);
  }
  for (const leg of legs)
    assert.equal(grounded[leg], 480, "75% stance duty cycle");
  for (const [leg, touchdown] of Object.entries(touchdowns)) {
    assert.ok(sampleCatGait(touchdown - 0.01)[leg].y < 0, `${leg} is landing`);
    assert.equal(
      sampleCatGait(touchdown + 0.01)[leg].y,
      0,
      `${leg} has landed`,
    );
  }
});

test("position and velocity are continuous through lift-off, landing and cycle wrap", () => {
  const epsilon = 0.0001;
  for (const backward of [false, true]) {
    for (const boundary of [0, 4, 8, 12, 16, 20]) {
      const before = sampleCatGait(boundary - epsilon, backward);
      const at = sampleCatGait(boundary, backward);
      const after = sampleCatGait(boundary + epsilon, backward);
      for (const leg of legs) {
        for (const coordinate of ["x", "y", "bend"]) {
          close(before[leg][coordinate], after[leg][coordinate], 0.002);
          const leftVelocity =
            (at[leg][coordinate] - before[leg][coordinate]) / epsilon;
          const rightVelocity =
            (after[leg][coordinate] - at[leg][coordinate]) / epsilon;
          close(leftVelocity, rightVelocity, 0.0001);
        }
      }
    }
  }
});

test("paws clear the ground without sinking and body, head and tail remain restrained", () => {
  const peakLift = Object.fromEntries(legs.map((leg) => [leg, 0]));
  for (let index = 0; index <= 1600; index++) {
    const sample = sampleCatGait(index / 100);
    for (const leg of legs) {
      const paw = sample[leg];
      assert.ok(paw.y <= 0 && paw.y >= -4.75);
      assert.ok(Math.abs(paw.x) < 6.3);
      assert.ok(paw.bend >= 0 && paw.bend <= 3.6);
      peakLift[leg] = Math.max(peakLift[leg], -paw.y);
    }
    assert.ok(Math.abs(sample.bodyY) < 1.3);
    assert.ok(Math.abs(sample.headY) < 0.8);
    assert.ok(
      Math.abs(sample.bodyY + sample.headY) < 0.8,
      "carried note shares the stabilized head",
    );
    assert.ok(Math.abs(sample.tailAngle) <= 5);
  }
  for (const leg of legs) close(peakLift[leg], 4.75);
});

test("backing reverses the grounded stroke while preserving lift and four-beat timing", () => {
  for (let index = 0; index < 160; index++) {
    const forward = sampleCatGait(index / 10);
    const backward = sampleCatGait(index / 10, true);
    for (const leg of legs) {
      close(backward[leg].x, -forward[leg].x);
      close(backward[leg].y, forward[leg].y);
      close(backward[leg].bend, forward[leg].bend);
    }
  }
});

test("samples are deterministic, periodic and finite for signed or invalid input", () => {
  for (const distance of [-32.5, -17.25, -0.125, 0, 3.75, 18.5, 100_000.125]) {
    assert.deepEqual(sampleCatGait(distance), sampleCatGait(distance));
    assert.deepEqual(
      sampleCatGait(distance),
      sampleCatGait(distance + CAT_STRIDE),
    );
  }
  for (const distance of [NaN, Infinity, -Infinity]) {
    assert.deepEqual(sampleCatGait(distance), sampleCatGait(0));
  }
  for (const distance of [Number.MAX_VALUE, -Number.MAX_VALUE]) {
    const sample = sampleCatGait(distance);
    for (const leg of legs)
      assert.ok(Object.values(sample[leg]).every(Number.isFinite));
  }
});
