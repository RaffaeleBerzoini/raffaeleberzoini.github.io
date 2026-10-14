export const NOTES = [
  {
    label: "POLIMI",
    x: -60,
    y: 212.5,
    width: 56,
    height: 49,
    color: "#f0dfb9",
    ink: "#8e977e",
  },
  {
    label: "CODE",
    x: 8,
    y: 206.5,
    width: 60,
    height: 37,
    color: "#abc5ac",
    ink: "#62877e",
  },
  {
    label: "LEARN",
    x: -62,
    y: 274.5,
    width: 44,
    height: 49,
    color: "#adc3c5",
    ink: "#6b8c98",
  },
  {
    label: "BUILD",
    x: 8,
    y: 270,
    width: 60,
    height: 60,
    color: "#dca68b",
    ink: "#a27363",
  },
] as const;

// The two lower notes are within a standing cat's reach.
export const FALLING_NOTES = [2, 3] as const;
export const SCENE_DURATION = 78;
export const CAT_HOME = { x: 89, y: 449 };
export type CatPose =
  "sleep" | "wake" | "walk" | "pickup" | "back" | "stand" | "settle";
type PaperPose = {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
};

/** Choose the first lower note randomly, then let each have its turn. */
export function shuffleNotes(previous = -1, random = Math.random): number[] {
  const bag: number[] = random() < 0.5 ? [2, 3] : [3, 2];
  if (bag[0] === previous) [bag[0], bag[1]] = [bag[1], bag[0]];
  return bag;
}

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const progress = (t: number, from: number, to: number) =>
  smooth(Math.max(0, Math.min(1, (t - from) / (to - from))));

/** All movement stays on the floor. At the board, only the cat's body and paws rise. */
export function samplePostitScene(index: number, elapsed: number) {
  const note = NOTES[index];
  const t = Math.max(0, Math.min(elapsed, SCENE_DURATION));
  const floor = { x: index === 2 ? 23 : 19, y: 447 };
  const pickup = { x: floor.x + 18, y: floor.y + 22 };
  const turn = { x: note.x, y: 379 };
  const board = { x: note.x, y: 350 };
  const reach = board.y - note.y;
  let phase = "rest";
  let cat = {
    ...CAT_HOME,
    pose: "sleep" as CatPose,
    facing: 1,
    carrying: false,
    rise: 0,
    reach,
  };
  let paper: PaperPose = {
    x: note.x,
    y: note.y,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  };
  if (!(FALLING_NOTES as readonly number[]).includes(index))
    return { phase, cat, paper };
  const onFloor = { ...floor, rotation: 0, scaleX: 0.72, scaleY: 0.22 };
  if (t >= 18 && t < 24) {
    phase = "fall";
    const p = (t - 18) / 6;
    const sway = Math.sin(p * Math.PI * 5) * Math.sin(p * Math.PI);
    paper = {
      x: mix(note.x, floor.x, smooth(p)) + sway * 22,
      y: mix(note.y, floor.y, p),
      rotation: sway * 24,
      scaleX: mix(1, 0.72, p),
      scaleY: mix(1, 0.22, Math.max(0, (p - 0.82) / 0.18)),
    };
  } else if (t >= 24 && t < 32) {
    phase = t < 29 ? "ground" : "wake";
    paper = onFloor;
    if (t >= 29) cat.pose = "wake";
  } else if (t >= 32 && t < 35) {
    phase = "approach";
    const p = progress(t, 32, 35);
    cat = {
      ...cat,
      x: mix(CAT_HOME.x, pickup.x, p),
      y: mix(CAT_HOME.y, pickup.y, p),
      pose: "walk",
    };
    paper = onFloor;
  } else if (t >= 35 && t < 38) {
    phase = "pickup";
    const p = progress(t, 35, 38);
    cat = { ...cat, ...pickup, pose: "pickup", carrying: true };
    paper = {
      ...floor,
      rotation: 0,
      scaleX: 0.72,
      scaleY: mix(0.22, 0.72, p),
    };
  } else if (t >= 38 && t < 43) {
    phase = "carry";
    const p = progress(t, 38, 43);
    cat = {
      ...cat,
      x: mix(pickup.x, turn.x, p),
      y: mix(pickup.y, turn.y, p),
      pose: "walk",
      carrying: true,
    };
    paper = {
      x: cat.x - 18,
      y: cat.y - 22,
      rotation: 0,
      scaleX: 0.72,
      scaleY: 0.72,
    };
  } else if (t >= 43 && t < 47) {
    phase = "to-board";
    const p = progress(t, 43, 47),
      rotation = progress(t, 43, 44.2);
    cat = {
      ...cat,
      ...board,
      y: mix(turn.y, board.y, p),
      pose: "back",
      carrying: true,
    };
    paper = {
      x: cat.x + mix(-18, 0, rotation),
      y: cat.y + mix(-22, -31, rotation),
      rotation: 0,
      scaleX: 0.72,
      scaleY: 0.72,
    };
  } else if (t >= 47 && t < 49.5) {
    phase = "rise";
    const p = progress(t, 47, 49.5);
    cat = { ...cat, ...board, pose: "stand", carrying: true, rise: p };
    paper = {
      x: cat.x,
      y: cat.y + mix(-31, -reach, p),
      rotation: 0,
      scaleX: 0.72,
      scaleY: 0.72,
    };
  } else if (t >= 49.5 && t < 51.5) {
    phase = "pin";
    const p = progress(t, 49.5, 51.5);
    cat = { ...cat, ...board, pose: "stand", rise: 1 };
    paper = {
      x: note.x,
      y: note.y,
      rotation: 0,
      scaleX: mix(0.72, 1, p),
      scaleY: mix(0.72, 1, p),
    };
  } else if (t >= 51.5 && t < 54) {
    phase = "lower";
    cat = { ...cat, ...board, pose: "stand", rise: 1 - progress(t, 51.5, 54) };
  } else if (t >= 54 && t < 58) {
    phase = "back-away";
    cat = {
      ...cat,
      ...board,
      y: mix(board.y, turn.y, progress(t, 54, 58)),
      pose: "back",
    };
  } else if (t >= 58 && t < 65) {
    phase = "return";
    const p = progress(t, 58, 65);
    cat = {
      ...cat,
      x: mix(turn.x, CAT_HOME.x, p),
      y: mix(turn.y, CAT_HOME.y, p),
      pose: "walk",
      facing: -1,
    };
  } else if (t >= 65 && t < 68) {
    phase = "settle";
    cat.pose = "settle";
  }
  return { phase, cat, paper };
}
