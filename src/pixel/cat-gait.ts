/** Distances and offsets use the same world units as the room SVG. */
export const CAT_STRIDE = 16;

export type CatLegOffset = {
  /** Paw offset from its neutral ground anchor, in local room units. */
  x: number;
  /** Paw height relative to the floor: zero is planted; negative is lifted. */
  y: number;
  /** Additional joint flex, 0–3.6 world units; mirror for the desired knee/hock. */
  bend: number;
};

export type CatGaitSample = {
  frontNear: CatLegOffset;
  backNear: CatLegOffset;
  frontFar: CatLegOffset;
  backFar: CatLegOffset;
  /** Torso offset only. Feet must not inherit this vertical bob. */
  bodyY: number;
  /** Extra head offset inside the torso group; a carried note shares this offset. */
  headY: number;
  /** Tail rotation, in degrees, around its attachment point. */
  tailAngle: number;
};

const STANCE_DISTANCE = CAT_STRIDE * 0.75;
const SWING_DISTANCE = CAT_STRIDE - STANCE_DISTANCE;
const HALF_REACH = STANCE_DISTANCE / 2;
const PAW_LIFT = 4.75;

function wrapDistance(distance: number): number {
  const wrapped = distance % CAT_STRIDE;
  return wrapped < 0 ? wrapped + CAT_STRIDE : wrapped;
}

function sampleLeg(
  distance: number,
  touchdown: number,
  sign: number,
): CatLegOffset {
  const phase = wrapDistance(distance - touchdown);
  if (phase <= STANCE_DISTANCE) {
    return { x: sign * (phase - HALF_REACH), y: 0, bend: 0 };
  }

  const swing = (phase - STANCE_DISTANCE) / SWING_DISTANCE;
  const smoother = swing ** 3 * (10 + swing * (-15 + 6 * swing));
  // This quintic return matches the stance velocity (+1 unit per unit travelled)
  // and zero acceleration at both ends. A tiny toe-off overtravel is intentional.
  const x = HALF_REACH + SWING_DISTANCE * swing - CAT_STRIDE * smoother;
  const lift = Math.sin(Math.PI * swing) ** 4;
  return { x: sign * x, y: -PAW_LIFT * lift, bend: 3.6 * lift };
}

/**
 * Sample a four-beat walk from accumulated travel distance, never elapsed time.
 * A full cycle covers 16 world units; each paw is planted for 75% of that cycle.
 * Touchdowns are evenly staggered: backNear → frontNear → backFar → frontFar.
 * Only one paw swings at a time, so diagonal legs never form a trotting pair.
 *
 * The artwork faces LEFT. As its body moves left by d, a planted local paw moves
 * right by exactly d: worldX = bodyOriginX - d + neutralPawX + sample.x is fixed.
 * For backing to the right, pass the same increasing distance with backward=true;
 * the paw stroke is mirrored, preserving that exact ground compensation.
 *
 * Apply offsets to each leg's neutral paw anchor, not its hip. Hip anchors can
 * follow bodyY, while the paw remains ground-relative. For legs nested inside a
 * bobbing torso, subtract bodyY from the paw's local y to avoid vertical skating.
 * A joint may start at the hip/paw midpoint, then flex by `bend` along the local
 * x axis (choose its sign for a front elbow or rear hock). Head and carried note
 * should share the same bodyY + headY transform.
 *
 * Signed finite distances are periodic too. Non-finite input uses the neutral
 * cycle phase, ensuring one bad position cannot propagate NaNs into SVG geometry.
 */
export function sampleCatGait(
  distanceTravelled: number,
  backward = false,
): CatGaitSample {
  const distance = wrapDistance(
    Number.isFinite(distanceTravelled) ? distanceTravelled : 0,
  );
  const phase = (distance / CAT_STRIDE) * Math.PI * 2;
  const sign = backward ? -1 : 1;
  const rock = Math.sin(phase);
  const bodyY = -0.55 * rock * rock;

  return {
    frontNear: sampleLeg(distance, CAT_STRIDE / 4, sign),
    backNear: sampleLeg(distance, 0, sign),
    frontFar: sampleLeg(distance, (CAT_STRIDE * 3) / 4, sign),
    backFar: sampleLeg(distance, CAT_STRIDE / 2, sign),
    bodyY,
    headY: -bodyY * 0.55 + rock * 0.05,
    tailAngle: sign * (rock * 4.2 + Math.sin(phase * 2) * 0.8),
  };
}
