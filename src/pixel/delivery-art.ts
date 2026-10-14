import {
  ANTENNAS,
  DEPOT,
  HEIGHT,
  TARGETS,
  WIDTH,
  type DeliveryState,
} from "./delivery-game";

const ink = {
  sky: "#101b32",
  skyLow: "#16233b",
  haze: "#20314a",
  far: "#1c2c43",
  mid: "#283951",
  outline: "#152638",
  masonry: "#39485b",
  masonryLight: "#475569",
  roof: "#697481",
  frame: "#84928e",
  glass: "#172c3d",
  glassLight: "#243d4c",
  mint: "#a7cbb0",
  green: "#c8e7b0",
  coral: "#d98b7b",
  gold: "#e5bc7c",
  cream: "#e3d5ae",
  steel: "#627880",
  shadow: "#203241",
};

type Rect = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
) => void;

// Tiny original bitmap lettering keeps every mark on the same pixel grid.
const glyphs: Record<string, string[]> = {
  P: ["111", "101", "111", "100", "100"],
  O: ["111", "101", "101", "101", "111"],
  S: ["111", "100", "111", "001", "111"],
  T: ["111", "010", "010", "010", "010"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "011", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"],
};

function lettering(
  r: Rect,
  word: string,
  x: number,
  y: number,
  color: string,
  scale = 1,
) {
  [...word].forEach((letter, index) => {
    glyphs[letter]?.forEach((row, rowIndex) => {
      [...row].forEach((pixel, column) => {
        if (pixel === "1")
          r(
            x + (index * 4 + column) * scale,
            y + rowIndex * scale,
            scale,
            scale,
            color,
          );
      });
    });
  });
}

function corners(
  r: Rect,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  r(x, y, 9, 2, color);
  r(x, y, 2, 8, color);
  r(x + w - 9, y, 9, 2, color);
  r(x + w - 2, y, 2, 8, color);
  r(x, y + h - 2, 9, 2, color);
  r(x, y + h - 8, 2, 8, color);
  r(x + w - 9, y + h - 2, 9, 2, color);
  r(x + w - 2, y + h - 8, 2, 8, color);
}

function envelope(r: Rect, x: number, y: number, color = ink.cream, scale = 1) {
  r(x, y, 13 * scale, 9 * scale, ink.outline);
  r(x + scale, y + scale, 11 * scale, 7 * scale, color);
  r(x + scale, y + scale, 2 * scale, scale, ink.steel);
  r(x + 3 * scale, y + 2 * scale, 2 * scale, scale, ink.steel);
  r(x + 5 * scale, y + 3 * scale, 3 * scale, scale, ink.steel);
  r(x + 8 * scale, y + 2 * scale, 2 * scale, scale, ink.steel);
  r(x + 10 * scale, y + scale, 2 * scale, scale, ink.steel);
  r(x + 9 * scale, y + 5 * scale, 2 * scale, 2 * scale, ink.coral);
}

function plant(r: Rect, x: number, y: number, variation = 0) {
  r(x + 3, y - 10, 2, 10, "#5c8c79");
  r(x, y - 8, 4, 3, "#7eaa85");
  r(x + 4, y - 12 + variation, 4, 4, "#719a7e");
  r(x + 5, y - 5, 4, 2, "#9eb28a");
  r(x, y, 9, 3, "#bc8672");
  r(x + 1, y + 3, 7, 4, "#966e63");
}

function sky(r: Rect, state: DeliveryState, reduced: boolean) {
  r(0, 0, WIDTH, HEIGHT, ink.sky);
  r(0, 96, WIDTH, HEIGHT - 96, ink.skyLow);
  r(0, 190, WIDTH, HEIGHT - 190, "#1a2a43");
  // Two square-edged mist bands make depth without gradients or blur.
  r(0, 221, WIDTH, 12, "#1c2c45");
  r(0, 262, WIDTH, 18, "#1d2e46");
  const points = [
    [27, 33],
    [94, 62],
    [134, 28],
    [176, 82],
    [223, 31],
    [263, 69],
    [301, 22],
    [343, 91],
    [374, 49],
    [420, 24],
    [453, 76],
    [497, 39],
    [544, 60],
    [588, 22],
    [619, 83],
    [330, 137],
    [90, 145],
    [474, 111],
    [120, 111],
  ];
  points.forEach(([x, y], i) => {
    const shining =
      !reduced && Math.floor(state.time * 0.7 + i * 1.73) % 9 === 0;
    const color = shining ? "#d6d5b3" : i % 3 === 0 ? "#82949c" : "#506881";
    r(x, y, i % 4 === 0 ? 2 : 1, 2, color);
    if (shining && i % 4 === 0) {
      r(x - 2, y, 6, 1, color);
      r(x, y - 2, 1, 6, color);
    }
  });
  // A stepped crescent, cut out using the exact sky color.
  r(514, 20, 20, 4, "#b4beb2");
  r(508, 24, 30, 4, "#cbd1b9");
  r(504, 28, 38, 20, "#dcd9b7");
  r(508, 48, 30, 5, "#cbd1b9");
  r(514, 53, 20, 3, "#b4beb2");
  r(520, 20, 20, 5, ink.sky);
  r(517, 25, 26, 7, ink.sky);
  r(520, 32, 24, 12, ink.sky);
  r(526, 44, 19, 4, ink.sky);
  r(509, 35, 4, 3, "#bec8b3");
  r(513, 45, 3, 3, "#bec8b3");
}

function skyline(r: Rect, state: DeliveryState, reduced: boolean) {
  const camera = reduced ? 0 : Math.round((state.x - WIDTH / 2) * 0.014);
  const farBuildings = [
    [-18, 181, 46],
    [35, 212, 33],
    [79, 172, 50],
    [142, 161, 30],
    [176, 184, 45],
    [229, 192, 34],
    [277, 148, 38],
    [328, 188, 47],
    [382, 159, 38],
    [433, 201, 51],
    [498, 172, 29],
    [539, 187, 48],
    [601, 160, 49],
  ];
  farBuildings.forEach(([x, roof, width], i) => {
    const xx = x - camera;
    r(xx, roof, width, HEIGHT - roof, ink.far);
    r(xx + 5, roof - 5, width - 10, 5, ink.far);
    if (i % 3 === 0) r(xx + width / 2, roof - 20, 2, 15, ink.far);
    for (let row = roof + 13; row < HEIGHT; row += 18) {
      for (let col = 7; col < width - 5; col += 12) {
        if ((row + col + i) % 5 < 2) r(xx + col, row, 3, 5, "#33465a");
      }
    }
  });
  const nearCamera = camera * 2;
  [
    [-15, 266, 72],
    [66, 241, 53],
    [151, 278, 75],
    [269, 256, 45],
    [366, 257, 71],
    [479, 296, 67],
    [590, 246, 61],
  ].forEach(([x, roof, width], i) => {
    const xx = x - nearCamera;
    r(xx, roof, width, HEIGHT - roof, ink.mid);
    r(xx - 2, roof, width + 4, 3, "#35465b");
    for (let y = roof + 15; y < HEIGHT; y += 21) {
      for (let col = 10; col < width - 7; col += 16)
        r(xx + col, y, 5, 8, (i + col) % 3 === 0 ? "#475467" : "#1d3148");
    }
  });
}

function building(
  r: Rect,
  x: number,
  y: number,
  w: number,
  tone: string,
  style: number,
) {
  r(x, y, w, HEIGHT - y, ink.outline);
  r(x + 3, y + 5, w - 6, HEIGHT - y - 5, tone);
  r(x + 4, y + 6, 3, HEIGHT - y - 6, "#526072");
  r(x + w - 7, y + 6, 4, HEIGHT - y - 6, "#273b50");
  r(x - 3, y, w + 6, 5, "#65707c");
  r(x - 1, y + 5, w + 2, 3, "#26364b");
  for (let row = y + 17; row < HEIGHT; row += 14) {
    const parity = Math.floor((row - y) / 14) % 2;
    for (let col = x + 9 + parity * 16; col < x + w - 9; col += 27) {
      r(col, row, 12, 1, style % 2 === 0 ? "#526074" : "#515b6a");
      r(col + 13, row - 3, 1, 4, "#2d3d50");
    }
  }
  // Pipes, brackets and roof ornaments stay distinct from solid antenna hazards.
  const pipeX = style % 2 ? x + w - 11 : x + 9;
  r(pipeX, y + 10, 3, HEIGHT - y - 10, "#69717b");
  r(pipeX + 3, y + 10, 1, HEIGHT - y - 10, "#26384c");
  for (let py = y + 22; py < HEIGHT; py += 37)
    r(pipeX - 1, py, 5, 2, "#8b8c8c");
  if (style === 1) {
    r(x + 16, y - 10, 22, 10, ink.outline);
    r(x + 18, y - 8, 18, 6, "#63717b");
    for (let i = 0; i < 4; i++) r(x + 20 + i * 4, y - 7, 1, 4, "#34485b");
  }
  if (style === 2) {
    r(x + 20, y - 10, 24, 10, "#27394f");
    r(x + 23, y - 8, 18, 8, "#687176");
    r(x + 22, y - 11, 20, 3, "#8c938e");
  }
}

function targetWindow(
  r: Rect,
  state: DeliveryState,
  index: number,
  reduced: boolean,
) {
  const target = TARGETS[index];
  const { x, y } = target;
  const done = state.delivered.includes(target.id);
  const current = !done && index === state.targetIndex;
  if (done) {
    r(x - 27, y - 23, 54, 51, "#596054");
    r(x - 23, y - 20, 46, 45, "#747257");
  }
  r(x - 21, y - 20, 42, 38, ink.outline);
  r(x - 19, y - 18, 38, 34, done ? "#c9b27b" : ink.frame);
  r(x - 16, y - 15, 32, 28, done ? "#ddb774" : ink.glass);
  r(x - 14, y - 13, 28, 24, done ? "#ebcb8f" : ink.glassLight);
  // Curtains, each slightly different, with a clear crossbar at the front.
  const curtain = done ? "#bc8869" : "#5a6d76";
  const curtainLight = done ? "#d3a17a" : "#71808a";
  r(x - 15, y - 14, 6, 18, curtain);
  r(x - 14, y - 13, 2, 15, curtainLight);
  r(x + 10, y - 14, 5, 23, curtain);
  r(x + 11, y - 13, 2, 20, curtainLight);
  r(x - 15, y + 3, 4, 7, curtain);
  r(x + 12, y + 5, 3, 6, curtainLight);
  if (index % 2 === 0) {
    r(x + 3, y + 4, 5, 6, done ? "#8d7961" : "#34515a");
    r(x + 4, y - 2, 2, 7, done ? "#a49b6d" : "#426765");
    r(x + 1, y, 3, 2, done ? "#a49b6d" : "#426765");
  } else {
    r(x - 6, y + 7, 12, 3, done ? "#b18d66" : "#3c5260");
    r(x - 3, y + 3, 3, 4, done ? "#97a17e" : "#586974");
  }
  r(x - 1, y - 15, 2, 28, done ? "#907f67" : "#637984");
  r(x - 16, y - 2, 32, 2, done ? "#907f67" : "#637984");
  r(x - 23, y + 16, 46, 4, "#93988f");
  r(x - 23, y + 20, 46, 3, ink.outline);
  // Shallow balconies and flowerpots, all within the same six target façades.
  r(x - 25, y + 29, 50, 4, ink.outline);
  r(x - 23, y + 29, 46, 2, "#657980");
  for (let i = -21; i <= 21; i += 7) r(x + i, y + 22, 2, 8, "#2c3e4b");
  r(x - 24, y + 21, 48, 2, "#778b88");
  if (index === 1 || index === 4 || index === 5)
    plant(r, x + 13, y + 22, index % 3);
  // Route plates are quiet; only the current window receives a visual waypoint.
  r(x - 4, y - 31, 9, 9, ink.outline);
  lettering(r, String(index + 1), x - 1, y - 29, done ? ink.gold : "#a3b1af");
  if (current) {
    const edge =
      !reduced && Math.floor(state.time * 2) % 2 ? ink.green : ink.mint;
    corners(r, x - 28, y - 24, 56, 48, edge);
    const bob = reduced ? 0 : Math.floor(state.time * 2) % 2;
    envelope(r, x - 6, y - 46 - bob, ink.mint);
    r(x - 1, y - 35, 3, 2, edge);
    r(x, y - 33, 1, 2, edge);
    if (state.dockProgress > 0 && state.carrying) {
      r(x - 20, y + 36, 40, 4, ink.outline);
      r(x - 19, y + 37, Math.round(38 * state.dockProgress), 2, ink.green);
    }
  }
}

function antennas(r: Rect, time: number, reduced: boolean) {
  const foundations = [
    [178, 240, 38],
    [379, 177, 34],
    [494, 282, 38],
  ];
  ANTENNAS.forEach((antenna, index) => {
    const { x, y, width, height } = antenna;
    const [baseX, baseY, baseWidth] = foundations[index];
    r(baseX, baseY, baseWidth, HEIGHT - baseY, "#2c4055");
    r(baseX - 2, baseY, baseWidth + 4, 4, "#71808a");
    r(baseX + 4, baseY + 9, baseWidth - 8, 3, "#445c6d");
    r(x, y, width, height, "#172838");
    r(x + 2, y + 3, width - 4, height - 3, "#86969a");
    r(x + width - 3, y + 6, 1, height - 6, "#506b79");
    for (let cross = y + 13; cross < y + height - 5; cross += 13) {
      r(x + 1, cross, width - 2, 3, "#c3ab7c");
      r(x + 2, cross + 3, width - 4, 2, "#2c4050");
    }
    // All aerial parts remain inside the engine's exact collision rectangle.
    r(x, y + 8, width, 2, "#a9a899");
    r(
      x + 1,
      y,
      width - 2,
      4,
      !reduced && Math.floor(time * 1.6 + index) % 3 === 0
        ? "#ecc09b"
        : ink.coral,
    );
    r(x - 3, y + height - 4, width + 6, 4, "#71818b");
  });
}

function depot(r: Rect, state: DeliveryState, reduced: boolean) {
  const { x, y } = DEPOT;
  r(0, y - 34, x + 31, 5, "#4c6172");
  r(0, y - 34, x + 31, 2, "#87968d");
  r(x - 24, 0, 2, y + 23, "#526677");
  r(x + 25, 0, 2, y + 23, "#526677");
  r(x - 25, y - 36, 4, 7, "#9ca893");
  r(x + 24, y - 36, 4, 7, "#9ca893");
  r(x - 38, y + 23, 76, 6, ink.outline);
  r(x - 35, y + 23, 70, 3, "#9ab2a2");
  r(x - 31, y + 29, 62, 24, "#6a8c86");
  r(x - 27, y + 32, 54, 18, "#87a697");
  r(x - 31, y + 50, 62, 5, "#3b5964");
  r(x - 21, y + 35, 40, 12, "#253f4a");
  lettering(r, "POST", x - 15, y + 38, ink.cream);
  r(x - 27, y + 36, 3, 7, ink.coral);
  r(x + 23, y + 36, 3, 7, ink.coral);
  r(x - 30, y + 17, 17, 6, "#c6bd98");
  r(x - 27, y + 13, 13, 4, "#e0d1ac");
  r(x + 20, y + 11, 9, 12, "#536d72");
  r(x + 22, y + 13, 5, 3, ink.green);
  if (!state.carrying && state.phase !== "won") {
    corners(r, x - 31, y - 28, 62, 49, ink.mint);
    const bob = reduced ? 0 : Math.floor(state.time * 2) % 2;
    envelope(r, x - 6, y - 24 - bob, ink.cream);
    if (state.dockProgress > 0) {
      r(x - 18, y + 56, 36, 4, ink.outline);
      r(x - 17, y + 57, Math.round(state.dockProgress * 34), 2, ink.green);
    }
  }
}

function deliveryParticles(r: Rect, state: DeliveryState, reduced: boolean) {
  if (state.celebrate <= 0 || !state.delivered.length) return;
  const target = TARGETS.find(
    (item) => item.id === state.delivered[state.delivered.length - 1],
  );
  if (!target) return;
  const progress = Math.max(0, Math.min(1, 1 - state.celebrate / 0.8));
  const distance = reduced ? 21 : 14 + Math.round(progress * 26);
  const points = [
    [-1, -0.8],
    [0, -1.2],
    [1, -0.7],
    [-1.1, 0.2],
    [1.1, 0.3],
    [-0.5, 0.8],
    [0.5, 0.9],
  ];
  points.forEach(([dx, dy], index) => {
    const size = progress > 0.65 ? 2 : 3;
    r(
      target.x + dx * distance,
      target.y + dy * distance,
      size,
      size,
      index % 2 ? ink.mint : ink.gold,
    );
  });
}

function drone(r: Rect, state: DeliveryState, reduced: boolean) {
  const x = Math.round(state.x);
  const y = Math.round(state.y);
  const moving = state.phase === "playing";
  const rotor = !reduced && moving ? Math.floor(state.time * 18) % 3 : 0;
  const hurt = state.hitCooldown > 0;
  const hull =
    hurt && (reduced || Math.floor(state.time * 9) % 2 === 0)
      ? "#cf9c91"
      : "#a7b6a8";
  if (!reduced && moving && Math.abs(state.vx) > 25) {
    const side = state.vx > 0 ? -1 : 1;
    r(x + side * 28, y - 1, 4, 1, "#617a7e");
    r(x + side * 33, y + 4, 2, 1, "#3f606e");
  }
  // Rotor arms and propellers: three integer silhouettes, never motion blur.
  r(x - 20, y - 5, 40, 3, "#6d8d8d");
  [-18, 18].forEach((offset) => {
    r(x + offset - 3, y - 11, 6, 9, "#233b4b");
    r(x + offset - 2, y - 10, 4, 5, "#9eb2a7");
    if (rotor === 0) {
      r(x + offset - 9, y - 13, 18, 2, "#adc5ba");
      r(x + offset - 6, y - 14, 12, 1, "#6e9392");
    } else if (rotor === 1) {
      r(x + offset - 5, y - 14, 10, 2, "#bcd2bd");
      r(x + offset - 9, y - 12, 18, 1, "#6e9392");
    } else {
      r(x + offset - 9, y - 13, 18, 1, "#6e9392");
      r(x + offset - 3, y - 15, 6, 3, "#bcd2bd");
    }
  });
  r(x - 2, y - 16, 2, 7, "#677e83");
  r(x - 4, y - 19, 6, 4, ink.coral);
  r(x - 10, y - 10, 20, 2, "#273e4b");
  r(x - 13, y - 8, 26, 15, "#273e4b");
  r(x - 10, y + 7, 20, 3, "#273e4b");
  r(x - 11, y - 7, 22, 13, hull);
  r(x - 8, y - 9, 16, 2, "#d0d3b8");
  r(x - 10, y - 5, 20, 8, "#284a54");
  r(x - 9, y - 5, 18, 2, "#203943");
  r(x - 6, y - 2, 3, 3, ink.green);
  r(x + 3, y - 2, 3, 3, ink.green);
  r(x - 7, y + 5, 14, 2, "#6a938c");
  r(x - 14, y - 3, 2, 6, "#d4bc98");
  r(x + 12, y - 3, 2, 6, "#d4bc98");
  r(x - 7, y + 10, 3, 3, "#7f9c96");
  r(x + 4, y + 10, 3, 3, "#7f9c96");
  if (state.carrying) {
    r(x - 1, y + 9, 2, 6, "#809f96");
    envelope(r, x - 6, y + 14);
  }
  if (hurt) {
    r(x - 17, y - 10, 2, 3, ink.coral);
    r(x + 16, y - 8, 2, 3, ink.coral);
  }
}

/** Original 640×360 pixel city. The game engine owns all motion and collision data. */
export function drawDeliveryGame(
  ctx: CanvasRenderingContext2D,
  state: DeliveryState,
  reducedMotion: boolean,
): void {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const r: Rect = (x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(
      Math.round(x),
      Math.round(y),
      Math.round(width),
      Math.round(height),
    );
  };
  sky(r, state, reducedMotion);
  skyline(r, state, reducedMotion);
  building(r, 105, 174, 80, "#3d4b5f", 0);
  building(r, 214, 112, 72, "#425365", 1);
  building(r, 312, 218, 73, "#48525f", 2);
  building(r, 418, 140, 73, "#3c5061", 3);
  building(r, 533, 106, 87, "#3f4b60", 4);
  // A quiet laundry line and rooftop planters establish a lived-in neighborhood.
  r(291, 280, 19, 1, "#6d7f83");
  r(293, 281, 5, 9, "#a6a597");
  r(301, 281, 5, 7, "#778f91");
  plant(r, 601, 104, 2);
  plant(r, 427, 138, 0);
  antennas(r, state.time, reducedMotion);
  TARGETS.forEach((_, index) => targetWindow(r, state, index, reducedMotion));
  depot(r, state, reducedMotion);
  deliveryParticles(r, state, reducedMotion);
  drone(r, state, reducedMotion);
  // Foreground roof edging anchors the city at the bottom of the window.
  r(0, HEIGHT - 5, WIDTH, 5, "#192e40");
  r(0, HEIGHT - 6, WIDTH, 1, "#536879");
  ctx.restore();
}
