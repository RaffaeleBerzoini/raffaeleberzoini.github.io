export type Point = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";
export type Obstacle = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

/** Bounds apply to the character's foot/centre position in room coordinates. */
export const WALK_BOUNDS = Object.freeze({
  minX: 100,
  maxX: 815,
  minY: 350,
  maxY: 543,
});
export const PLAYER_RADIUS = 11;
export const OBSTACLES: readonly Readonly<Obstacle>[] = Object.freeze([
  Object.freeze({ left: 150, right: 425, top: 310, bottom: 445 }), // Desk
  Object.freeze({ left: 220, right: 290, top: 365, bottom: 462 }), // Chair
  Object.freeze({ left: 95, right: 157, top: 320, bottom: 432 }), // Plant
  Object.freeze({ left: 645, right: 792, top: 210, bottom: 449 }), // Shelf
  Object.freeze({ left: 783, right: 850, top: 336, bottom: 459 }), // Mailbox
]);

const CLEARANCE = 0.001;
const GRID_STEP = 8;
const inflated = OBSTACLES.map(({ left, right, top, bottom }) => ({
  left: left - PLAYER_RADIUS,
  right: right + PLAYER_RADIUS,
  top: top - PLAYER_RADIUS,
  bottom: bottom + PLAYER_RADIUS,
}));

function finite(point: Point): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function distanceSquared(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

export function isWalkable(point: Point): boolean {
  if (!finite(point)) return false;
  if (
    point.x < WALK_BOUNDS.minX ||
    point.x > WALK_BOUNDS.maxX ||
    point.y < WALK_BOUNDS.minY ||
    point.y > WALK_BOUNDS.maxY
  )
    return false;
  return !inflated.some(
    (rect) =>
      point.x >= rect.left &&
      point.x <= rect.right &&
      point.y >= rect.top &&
      point.y <= rect.bottom,
  );
}

/** Closed rectangle intersections also reject paths tangent to an obstacle corner. */
function segmentIsWalkable(from: Point, to: Point): boolean {
  if (!isWalkable(from) || !isWalkable(to)) return false;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return !inflated.some((rect) => {
    let enter = 0;
    let leave = 1;
    for (const [origin, delta, lower, upper] of [
      [from.x, dx, rect.left, rect.right],
      [from.y, dy, rect.top, rect.bottom],
    ]) {
      if (delta === 0) {
        if (origin < lower || origin > upper) return false;
      } else {
        const first = (lower - origin) / delta;
        const last = (upper - origin) / delta;
        enter = Math.max(enter, Math.min(first, last));
        leave = Math.min(leave, Math.max(first, last));
        if (enter > leave) return false;
      }
    }
    return enter <= leave;
  });
}

function moveAxis(position: Point, delta: number, axis: "x" | "y"): Point {
  const horizontal = axis === "x";
  const start = position[axis];
  const perpendicular = position[horizontal ? "y" : "x"];
  let end = clamp(
    start + delta,
    horizontal ? WALK_BOUNDS.minX : WALK_BOUNDS.minY,
    horizontal ? WALK_BOUNDS.maxX : WALK_BOUNDS.maxY,
  );

  for (const rect of inflated) {
    const perpendicularMin = horizontal ? rect.top : rect.left;
    const perpendicularMax = horizontal ? rect.bottom : rect.right;
    if (perpendicular < perpendicularMin || perpendicular > perpendicularMax)
      continue;
    const lower = horizontal ? rect.left : rect.top;
    const upper = horizontal ? rect.right : rect.bottom;
    if (delta > 0 && start < lower && end >= lower)
      end = Math.min(end, lower - CLEARANCE);
    if (delta < 0 && start > upper && end <= upper)
      end = Math.max(end, upper + CLEARANCE);
  }
  return horizontal ? { x: end, y: position.y } : { x: position.x, y: end };
}

/**
 * Sweep each axis and slide along furniture. Substeps keep diagonal input stable
 * at corners; sweeping prevents tunnelling even after an unusually long frame.
 * Invalid starting positions are preserved, never relocated through furniture.
 */
export function moveWithCollisions(
  position: Point,
  dx: number,
  dy: number,
): Point {
  if (!isWalkable(position) || !Number.isFinite(dx) || !Number.isFinite(dy))
    return { ...position };
  const horizontal = clamp(
    dx,
    -(WALK_BOUNDS.maxX - WALK_BOUNDS.minX),
    WALK_BOUNDS.maxX - WALK_BOUNDS.minX,
  );
  const vertical = clamp(
    dy,
    -(WALK_BOUNDS.maxY - WALK_BOUNDS.minY),
    WALK_BOUNDS.maxY - WALK_BOUNDS.minY,
  );
  const steps = Math.max(
    1,
    Math.ceil(Math.max(Math.abs(horizontal), Math.abs(vertical)) / GRID_STEP),
  );
  let next = { ...position };
  for (let step = 0; step < steps; step++) {
    next = moveAxis(next, horizontal / steps, "x");
    next = moveAxis(next, vertical / steps, "y");
  }
  return next;
}

type GridNode = { point: Point; neighbors: { id: number; cost: number }[] };
let cachedGrid: GridNode[] | undefined;

function coordinates(min: number, max: number): number[] {
  const values: number[] = [];
  for (let value = min; value < max; value += GRID_STEP) values.push(value);
  values.push(max);
  return values;
}

function getGrid(): GridNode[] {
  if (cachedGrid) return cachedGrid;
  const xs = coordinates(WALK_BOUNDS.minX, WALK_BOUNDS.maxX);
  const ys = coordinates(WALK_BOUNDS.minY, WALK_BOUNDS.maxY);
  const cells = ys.map(() => xs.map(() => -1));
  const nodes: GridNode[] = [];
  for (let row = 0; row < ys.length; row++) {
    for (let column = 0; column < xs.length; column++) {
      const point = { x: xs[column], y: ys[row] };
      if (!isWalkable(point)) continue;
      cells[row][column] = nodes.length;
      nodes.push({ point, neighbors: [] });
    }
  }
  const directions = [
    [0, -1],
    [-1, 0],
    [1, 0],
    [0, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];
  for (let row = 0; row < ys.length; row++) {
    for (let column = 0; column < xs.length; column++) {
      const id = cells[row][column];
      if (id < 0) continue;
      for (const [dx, dy] of directions) {
        const neighbor = cells[row + dy]?.[column + dx];
        if (neighbor === undefined || neighbor < 0) continue;
        // A diagonal is allowed only when both adjacent orthogonal cells are floor.
        if (
          dx &&
          dy &&
          (cells[row]?.[column + dx] < 0 || cells[row + dy]?.[column] < 0)
        )
          continue;
        if (!segmentIsWalkable(nodes[id].point, nodes[neighbor].point))
          continue;
        nodes[id].neighbors.push({
          id: neighbor,
          cost: Math.sqrt(
            distanceSquared(nodes[id].point, nodes[neighbor].point),
          ),
        });
      }
    }
  }
  cachedGrid = nodes;
  return nodes;
}

type QueueEntry = { id: number; cost: number; estimate: number };

/** Stable tie-breaking makes repeated clicks produce the same path. */
class MinHeap {
  private entries: QueueEntry[] = [];

  private before(a: QueueEntry, b: QueueEntry): boolean {
    return (
      a.estimate < b.estimate ||
      (a.estimate === b.estimate &&
        (a.cost < b.cost || (a.cost === b.cost && a.id < b.id)))
    );
  }

  push(entry: QueueEntry): void {
    this.entries.push(entry);
    let index = this.entries.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (!this.before(this.entries[index], this.entries[parent])) break;
      [this.entries[index], this.entries[parent]] = [
        this.entries[parent],
        this.entries[index],
      ];
      index = parent;
    }
  }

  pop(): QueueEntry | undefined {
    const first = this.entries[0];
    const last = this.entries.pop();
    if (this.entries.length && last) {
      this.entries[0] = last;
      let index = 0;
      while (true) {
        const left = index * 2 + 1;
        const right = left + 1;
        let smallest = index;
        if (
          left < this.entries.length &&
          this.before(this.entries[left], this.entries[smallest])
        )
          smallest = left;
        if (
          right < this.entries.length &&
          this.before(this.entries[right], this.entries[smallest])
        )
          smallest = right;
        if (smallest === index) break;
        [this.entries[index], this.entries[smallest]] = [
          this.entries[smallest],
          this.entries[index],
        ];
        index = smallest;
      }
    }
    return first;
  }
}

function simplify(points: Point[]): Point[] {
  const result: Point[] = [];
  let current = 0;
  while (current < points.length - 1) {
    let next = points.length - 1;
    while (
      next > current + 1 &&
      !segmentIsWalkable(points[current], points[next])
    )
      next--;
    if (distanceSquared(points[current], points[next]) > 1e-12)
      result.push({ ...points[next] });
    current = next;
  }
  return result;
}

/**
 * Return collision-free waypoints, excluding start. Valid floor targets are
 * reached exactly; other clicks snap to the closest reachable grid floor point.
 * Invalid starts/targets and unroutable inputs return an empty path.
 */
export function findPath(start: Point, target: Point): Point[] {
  if (!isWalkable(start) || !finite(target)) return [];
  const boundedTarget = {
    x: clamp(target.x, WALK_BOUNDS.minX, WALK_BOUNDS.maxX),
    y: clamp(target.y, WALK_BOUNDS.minY, WALK_BOUNDS.maxY),
  };
  if (distanceSquared(start, boundedTarget) < 1e-12) return [];
  if (segmentIsWalkable(start, boundedTarget)) return [{ ...boundedTarget }];

  const nodes = getGrid();
  let startId = -1;
  let nearestStart = Infinity;
  for (let id = 0; id < nodes.length; id++) {
    const distance = distanceSquared(start, nodes[id].point);
    if (distance < nearestStart && segmentIsWalkable(start, nodes[id].point)) {
      nearestStart = distance;
      startId = id;
    }
  }
  if (startId < 0) return [];

  // Select goals only inside the start's connected component.
  const reachable = new Uint8Array(nodes.length);
  const component = [startId];
  reachable[startId] = 1;
  for (let cursor = 0; cursor < component.length; cursor++) {
    for (const neighbor of nodes[component[cursor]].neighbors) {
      if (reachable[neighbor.id]) continue;
      reachable[neighbor.id] = 1;
      component.push(neighbor.id);
    }
  }
  const targetIsFloor = isWalkable(boundedTarget);
  let goalId = -1;
  let nearestGoal = Infinity;
  for (let id = 0; id < nodes.length; id++) {
    if (!reachable[id]) continue;
    const distance = distanceSquared(boundedTarget, nodes[id].point);
    if (distance >= nearestGoal) continue;
    if (targetIsFloor && !segmentIsWalkable(nodes[id].point, boundedTarget))
      continue;
    nearestGoal = distance;
    goalId = id;
  }
  if (goalId < 0) return [];

  const costs = new Float64Array(nodes.length).fill(Infinity);
  const previous = new Int32Array(nodes.length).fill(-1);
  const queue = new MinHeap();
  const heuristic = (id: number) =>
    Math.sqrt(distanceSquared(nodes[id].point, nodes[goalId].point));
  costs[startId] = 0;
  queue.push({ id: startId, cost: 0, estimate: heuristic(startId) });
  let entry: QueueEntry | undefined;
  while ((entry = queue.pop())) {
    if (entry.cost !== costs[entry.id]) continue;
    if (entry.id === goalId) break;
    for (const neighbor of nodes[entry.id].neighbors) {
      const cost = entry.cost + neighbor.cost;
      if (cost >= costs[neighbor.id]) continue;
      costs[neighbor.id] = cost;
      previous[neighbor.id] = entry.id;
      queue.push({
        id: neighbor.id,
        cost,
        estimate: cost + heuristic(neighbor.id),
      });
    }
  }
  if (!entry) return [];

  const route: Point[] = [];
  for (let id = goalId; id >= 0; id = previous[id]) {
    route.push(nodes[id].point);
    if (id === startId) break;
  }
  route.reverse();
  const end = targetIsFloor ? boundedTarget : nodes[goalId].point;
  return simplify([start, ...route, end]);
}
