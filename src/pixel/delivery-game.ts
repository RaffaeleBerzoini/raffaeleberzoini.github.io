/** Pure courier simulation. Coordinates are canvas pixels; dt and timers are seconds. */
export const WIDTH = 640;
export const HEIGHT = 360;
export const DURATION = 60;
export const DEPOT = { x: 50, y: 105 } as const;

export const TARGETS = [
  { id: 0, x: 148, y: 198, name: "Paper Street" },
  { id: 1, x: 247, y: 142, name: "Maple House" },
  { id: 2, x: 352, y: 249, name: "Canal Loft" },
  { id: 3, x: 455, y: 172, name: "Moonlight Flat" },
  { id: 4, x: 563, y: 264, name: "Garden Studio" },
  { id: 5, x: 573, y: 136, name: "Skyline Lab" },
] as const;

export const ANTENNAS = [
  { x: 194, y: 186, width: 8, height: 54 },
  { x: 390, y: 112, width: 8, height: 65 },
  { x: 510, y: 220, width: 8, height: 62 },
] as const;

export const DRONE_HALF_WIDTH = 20;
export const DRONE_HALF_HEIGHT = 12;
export const MAX_SPEED = 145;
export const DOCK_RADIUS = 22;
export const DOCK_SECONDS = 0.35;

export type DeliveryPhase = "ready" | "playing" | "paused" | "won" | "lost";
export type DeliveryEvent = "none" | "delivery" | "pickup" | "bump";
export type DeliveryInput = { x: number; y: number };

export interface DeliveryState {
  phase: DeliveryPhase;
  x: number;
  y: number;
  vx: number;
  vy: number;
  remaining: number;
  delivered: number[];
  /** The next window's array index. Remains valid (5) after the final delivery. */
  targetIndex: number;
  carrying: boolean;
  /** Continuous hover progress, normalized to 0..1. */
  dockProgress: number;
  hitCooldown: number;
  time: number;
  /** Monotonic event counter. `event` remains sticky until another event occurs. */
  eventId: number;
  event: DeliveryEvent;
  lastDelivery: number | null;
  /** Seconds remaining for the last delivery's celebratory effect. */
  celebrate: number;
}

export type State = DeliveryState;

const RESPONSE = 10;
const MAX_STEP = 1 / 120;
const DOCK_SPEED = 45;
const CONTACT_GAP = 0.001;
const EPSILON = 1e-9;

export function createDeliveryGame(): DeliveryState {
  return {
    phase: "ready",
    x: DEPOT.x,
    y: DEPOT.y,
    vx: 0,
    vy: 0,
    remaining: DURATION,
    delivered: [],
    targetIndex: 0,
    carrying: true,
    dockProgress: 0,
    hitCooldown: 0,
    time: 0,
    eventId: 0,
    event: "none",
    lastDelivery: null,
    celebrate: 0,
  };
}

export function startDeliveryGame(): DeliveryState {
  return { ...createDeliveryGame(), phase: "playing" };
}

function emit(state: DeliveryState, event: DeliveryEvent): void {
  state.event = event;
  state.eventId++;
}

function finishExpired(state: DeliveryState): void {
  state.phase = "lost";
  state.remaining = 0;
  state.vx = 0;
  state.vy = 0;
  state.dockProgress = 0;
}

function constrainToWorld(state: DeliveryState): void {
  const x = Math.max(DRONE_HALF_WIDTH, Math.min(WIDTH - DRONE_HALF_WIDTH, state.x));
  const y = Math.max(DRONE_HALF_HEIGHT, Math.min(HEIGHT - DRONE_HALF_HEIGHT, state.y));
  if (x !== state.x) state.vx = 0;
  if (y !== state.y) state.vy = 0;
  state.x = x;
  state.y = y;
}

/** Resolve the drone's entire body against an expanded antenna rectangle. */
function resolveAntennas(state: DeliveryState): void {
  for (const antenna of ANTENNAS) {
    const left = antenna.x - DRONE_HALF_WIDTH;
    const right = antenna.x + antenna.width + DRONE_HALF_WIDTH;
    const top = antenna.y - DRONE_HALF_HEIGHT;
    const bottom = antenna.y + antenna.height + DRONE_HALF_HEIGHT;
    if (state.x <= left || state.x >= right || state.y <= top || state.y >= bottom) continue;

    const penetration = [state.x - left, right - state.x, state.y - top, bottom - state.y];
    const face = penetration.indexOf(Math.min(...penetration));
    if (face === 0) {
      state.x = left - CONTACT_GAP;
      state.vx = -Math.max(45, Math.abs(state.vx) * 0.4);
    } else if (face === 1) {
      state.x = right + CONTACT_GAP;
      state.vx = Math.max(45, Math.abs(state.vx) * 0.4);
    } else if (face === 2) {
      state.y = top - CONTACT_GAP;
      state.vy = -Math.max(45, Math.abs(state.vy) * 0.4);
    } else {
      state.y = bottom + CONTACT_GAP;
      state.vy = Math.max(45, Math.abs(state.vy) * 0.4);
    }
    state.dockProgress = 0;
    if (state.hitCooldown <= EPSILON) {
      state.remaining = Math.max(0, state.remaining - 3);
      state.hitCooldown = 1;
      emit(state, "bump");
    }
  }
}

function updateDock(state: DeliveryState, dt: number): void {
  const destination = state.carrying ? TARGETS[state.targetIndex] : DEPOT;
  const close = Math.hypot(state.x - destination.x, state.y - destination.y) <= DOCK_RADIUS;
  const hovering = Math.hypot(state.vx, state.vy) <= DOCK_SPEED;
  if (!close || !hovering) {
    state.dockProgress = 0;
    return;
  }
  state.dockProgress = Math.min(1, state.dockProgress + dt / DOCK_SECONDS);
  if (state.dockProgress < 1 - EPSILON) return;
  state.dockProgress = 0;

  if (!state.carrying) {
    state.carrying = true;
    emit(state, "pickup");
    return;
  }

  const deliveredId = TARGETS[state.targetIndex].id;
  // Normally unreachable, but never emit a duplicate if a saved state is replayed.
  if (state.delivered.includes(deliveredId)) return;
  state.delivered = [...state.delivered, deliveredId];
  state.carrying = false;
  state.lastDelivery = deliveredId;
  state.celebrate = 0.9;
  emit(state, "delivery");
  const nextIndex = TARGETS.findIndex((target) => !state.delivered.includes(target.id));
  if (nextIndex < 0) {
    state.phase = "won";
    state.vx = 0;
    state.vy = 0;
    state.celebrate = 1.2;
  } else {
    state.targetIndex = nextIndex;
  }
}

/**
 * Advance without mutating `state` or its delivered array. Inputs are a direction
 * vector (analog magnitudes are preserved, diagonals capped). Invalid/nonpositive
 * elapsed time and every non-playing phase freeze the exact state. Substeps avoid
 * antenna tunnelling, while long finite frames still consume the full game clock.
 */
export function stepDeliveryGame(state: DeliveryState, input: DeliveryInput, dt: number): DeliveryState {
  if (state.phase !== "playing" || !Number.isFinite(dt) || dt <= 0) return state;

  const next = { ...state };
  if (next.remaining <= EPSILON) {
    finishExpired(next);
    return next;
  }
  let ix = Number.isFinite(input.x) ? input.x : 0;
  let iy = Number.isFinite(input.y) ? input.y : 0;
  const magnitude = Math.hypot(ix, iy);
  if (magnitude > 1) {
    ix /= magnitude;
    iy /= magnitude;
  }
  // At most 7,200 iterations even for a very long suspended frame.
  let elapsed = Math.min(dt, next.remaining);
  while (elapsed > EPSILON && next.phase === "playing") {
    const h = Math.min(MAX_STEP, elapsed, next.remaining);
    elapsed -= h;
    next.time += h;
    next.remaining = Math.max(0, next.remaining - h);
    next.hitCooldown = Math.max(0, next.hitCooldown - h);
    next.celebrate = Math.max(0, next.celebrate - h);
    if (next.remaining <= EPSILON) {
      finishExpired(next);
      break;
    }

    const blend = 1 - Math.exp(-RESPONSE * h);
    next.vx += (ix * MAX_SPEED - next.vx) * blend;
    next.vy += (iy * MAX_SPEED - next.vy) * blend;
    next.x += next.vx * h;
    next.y += next.vy * h;
    constrainToWorld(next);
    resolveAntennas(next);
    if (next.remaining <= EPSILON) {
      finishExpired(next);
      break;
    }
    updateDock(next, h);
  }
  return next;
}
