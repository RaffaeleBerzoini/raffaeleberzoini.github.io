import { useEffect, useRef } from "react";
import "./signal-field.css";

export interface SignalFieldProps {
  variant?: "light" | "dark" | "blue";
  mode?: "orbit" | "wave" | "helix";
  intensity?: number;
  paused?: boolean;
  className?: string;
}

type FieldMode = NonNullable<SignalFieldProps["mode"]>;
type FieldVariant = NonNullable<SignalFieldProps["variant"]>;

const TAU = Math.PI * 2;
const COLUMNS = 104;
const ROWS = 32;
const COUNT = COLUMNS * ROWS;
const SHADE_COUNT = 9;
const SIZES = [0.67, 1.03, 1.4];
const MODE_INDEX: Record<FieldMode, number> = { orbit: 0, wave: 1, helix: 2 };

const PALETTES: Record<
  FieldVariant,
  { near: number[]; far: number[]; line: string }
> = {
  light: { near: [26, 57, 35], far: [142, 158, 103], line: "61, 83, 59" },
  dark: { near: [183, 237, 192], far: [66, 118, 96], line: "147, 192, 160" },
  blue: { near: [189, 241, 252], far: [62, 146, 165], line: "155, 219, 241" },
};

/** A generated point-cloud sculpture; no WebGL, assets or animation dependencies. */
export default function SignalField({
  variant = "light",
  mode = "orbit",
  intensity = 1,
  paused = false,
  className = "",
}: SignalFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optionsRef = useRef({ variant, mode, intensity, paused });
  const invalidateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    optionsRef.current = { variant, mode, intensity, paused };
    invalidateRef.current?.();
  }, [variant, mode, intensity, paused]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = reducedMotion.matches;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let visible = true;
    let disposed = false;
    let frame = 0;
    let previousTime = 0;
    let time = 0;
    let pointerX = 0;
    let pointerY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let liveIntensity = Math.max(0, Math.min(2, optionsRef.current.intensity));
    let activeVariant: FieldVariant | null = null;
    let styles: string[] = [];
    const weights = [0, 0, 0];
    weights[MODE_INDEX[optionsRef.current.mode]] = 1;

    // Allocate once. A frame never updates React state or creates particle objects.
    const parameters = new Float32Array(COUNT * 5);
    const projected = new Float32Array(COUNT * 3);
    const buckets = Array.from(
      { length: SHADE_COUNT * SIZES.length },
      () => new Float32Array(COUNT * 2),
    );
    const bucketLengths = new Uint16Array(buckets.length);
    for (let column = 0; column < COLUMNS; column++) {
      const u = (column / COLUMNS) * TAU;
      for (let row = 0; row < ROWS; row++) {
        const index = (column * ROWS + row) * 5;
        const v = (row / ROWS) * TAU;
        parameters[index] = u;
        parameters[index + 1] = v;
        parameters[index + 2] = Math.cos(u);
        parameters[index + 3] = Math.sin(u);
        parameters[index + 4] = Math.sin(u * 3 + v * 2);
      }
    }

    function draw(timestamp: number) {
      frame = 0;
      if (disposed || !context || !canvas) return;
      const options = optionsRef.current;
      const animate = !options.paused && !reduceMotion;
      const delta = previousTime
        ? Math.min((timestamp - previousTime) / 1000, 0.05)
        : 1 / 60;
      previousTime = timestamp;
      if (animate) time += delta;
      const smoothing =
        reduceMotion || options.paused ? 1 : 1 - Math.exp(-delta * 4.5);
      smoothX += (pointerX - smoothX) * smoothing;
      smoothY += (pointerY - smoothY) * smoothing;
      liveIntensity +=
        (Math.max(0, Math.min(2, options.intensity)) - liveIntensity) *
        smoothing;
      for (let index = 0; index < 3; index++) {
        weights[index] +=
          ((index === MODE_INDEX[options.mode] ? 1 : 0) - weights[index]) *
          smoothing;
      }

      if (activeVariant !== options.variant) {
        activeVariant = options.variant;
        const palette = PALETTES[activeVariant];
        styles = Array.from({ length: SHADE_COUNT }, (_, index) => {
          const amount = index / (SHADE_COUNT - 1);
          const color = palette.far.map((channel, axis) =>
            Math.round(channel + (palette.near[axis] - channel) * amount),
          );
          return `rgba(${color.join(",")},${0.26 + amount * 0.7})`;
        });
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      const scale = Math.min(width, height) * 0.347;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const tiltX = 0.69 + smoothY * 0.26 + Math.sin(time * 0.12) * 0.09;
      const tiltY = 0.25 + smoothX * 0.48 + time * 0.055;
      const tiltZ = -0.39 + Math.sin(time * 0.09) * 0.14;
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      const cosY = Math.cos(tiltY);
      const sinY = Math.sin(tiltY);
      const cosZ = Math.cos(tiltZ);
      const sinZ = Math.sin(tiltZ);
      const pulse = time * 0.38;

      // Orbital reference traces stay deliberately faint behind the sculpture.
      context.lineWidth = 0.65;
      context.strokeStyle = `rgba(${PALETTES[options.variant].line},0.12)`;
      context.setLineDash([2, 5]);
      for (let orbit = 0; orbit < 2; orbit++) {
        context.beginPath();
        for (let segment = 0; segment <= 112; segment++) {
          const angle = (segment / 112) * TAU;
          const x = Math.cos(angle) * 1.64;
          const y = Math.sin(angle) * (orbit === 0 ? 1.64 : 0.49);
          const z = orbit === 0 ? 0 : Math.sin(angle) * 1.52;
          const y1 = y * cosX - z * sinX;
          const z1 = y * sinX + z * cosX;
          const x2 = x * cosY + z1 * sinY;
          const z2 = -x * sinY + z1 * cosY;
          const perspective = 4.6 / (4.6 - z2);
          const px = centerX + (x2 * cosZ - y1 * sinZ) * scale * perspective;
          const py = centerY + (x2 * sinZ + y1 * cosZ) * scale * perspective;
          if (segment === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.stroke();
      }
      context.setLineDash([]);
      bucketLengths.fill(0);

      for (let index = 0; index < COUNT; index++) {
        const offset = index * 5;
        const u = parameters[offset];
        const v = parameters[offset + 1];
        const cosU = parameters[offset + 2];
        const sinU = parameters[offset + 3];
        const twist = v + 0.52 * Math.sin(u * 3 + pulse);
        const tube = 0.35 + 0.065 * Math.cos(u * 3 - pulse) * liveIntensity;
        const ring =
          0.96 + 0.085 * Math.sin(u * 3 + pulse * 0.5) * liveIntensity;
        const radius = ring + tube * Math.cos(twist);
        let x = radius * cosU * weights[0];
        let y = radius * sinU * weights[0];
        let z =
          (tube * Math.sin(twist) +
            0.14 * Math.sin(u * 3 + pulse) * liveIntensity) *
          weights[0];

        if (weights[1] > 0.001) {
          const waveX = (u / TAU - 0.5) * 3;
          const waveY = (v / TAU - 0.5) * 2.7;
          x += waveX * weights[1];
          y += waveY * weights[1];
          z +=
            (Math.sin(waveX * 2.1 + waveY * 1.3 + pulse * 1.5) * 0.3 +
              Math.cos(waveY * 2.9 - pulse) * 0.17) *
            (0.5 + liveIntensity * 0.5) *
            weights[1];
        }
        if (weights[2] > 0.001) {
          const strand = index % ROWS < ROWS / 2 ? 0 : Math.PI;
          const strandOffset = ((index % (ROWS / 2)) / (ROWS / 2) - 0.5) * 0.34;
          const helixAngle = u * 1.65 + strand + pulse * 0.35;
          const helixRadius = 0.58 + strandOffset;
          x += Math.cos(helixAngle) * helixRadius * weights[2];
          y += (u / TAU - 0.5) * 2.95 * weights[2];
          z += Math.sin(helixAngle) * helixRadius * weights[2];
        }

        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;
        const x2 = x * cosY + z1 * sinY;
        const z2 = -x * sinY + z1 * cosY;
        const perspective = 4.6 / (4.6 - z2);
        const px = centerX + (x2 * cosZ - y1 * sinZ) * scale * perspective;
        const py = centerY + (x2 * sinZ + y1 * cosZ) * scale * perspective;
        const depth = Math.max(0, Math.min(1, (z2 + 1.35) / 2.7));
        const shade = Math.min(
          SHADE_COUNT - 1,
          Math.floor(depth * SHADE_COUNT),
        );
        const size = depth > 0.7 ? 2 : depth > 0.35 ? 1 : 0;
        const bucketIndex = shade * SIZES.length + size;
        const length = bucketLengths[bucketIndex];
        buckets[bucketIndex][length] = px;
        buckets[bucketIndex][length + 1] = py;
        bucketLengths[bucketIndex] = length + 2;
        projected[index * 3] = px;
        projected[index * 3 + 1] = py;
        projected[index * 3 + 2] = z2;
      }

      // A few continuous filaments give the cloud its woven, biological structure.
      context.strokeStyle = `rgba(${PALETTES[options.variant].line},${options.variant === "light" ? 0.095 : 0.12})`;
      context.lineWidth = 0.55;
      for (let row = 0; row < ROWS; row += 4) {
        context.beginPath();
        for (let column = 0; column < COLUMNS; column++) {
          const offset = (column * ROWS + row) * 3;
          if (column === 0)
            context.moveTo(projected[offset], projected[offset + 1]);
          else context.lineTo(projected[offset], projected[offset + 1]);
        }
        if (weights[0] > 0.99) context.closePath();
        context.stroke();
      }

      // Depth/color buckets keep 3,328 particles to at most 27 canvas fill calls.
      const dotScale = Math.max(
        0.72,
        Math.min(1.18, Math.min(width, height) / 590),
      );
      for (let bucketIndex = 0; bucketIndex < buckets.length; bucketIndex++) {
        const length = bucketLengths[bucketIndex];
        if (length === 0) continue;
        const bucket = buckets[bucketIndex];
        const radius = SIZES[bucketIndex % SIZES.length] * dotScale;
        context.fillStyle = styles[Math.floor(bucketIndex / SIZES.length)];
        context.beginPath();
        for (let point = 0; point < length; point += 2) {
          context.moveTo(bucket[point] + radius, bucket[point + 1]);
          context.arc(bucket[point], bucket[point + 1], radius, 0, TAU);
        }
        context.fill();
      }

      if (animate && visible && !document.hidden)
        frame = requestAnimationFrame(draw);
    }

    function invalidate() {
      if (!disposed && visible && !document.hidden && !frame)
        frame = requestAnimationFrame(draw);
    }

    function resize() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      invalidate();
    }

    function onPointerMove(event: PointerEvent) {
      if (reduceMotion || optionsRef.current.paused || !container) return;
      const rect = container.getBoundingClientRect();
      pointerX = Math.max(
        -1,
        Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2),
      );
      pointerY = Math.max(
        -1,
        Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2),
      );
      invalidate();
    }

    function onPointerLeave() {
      pointerX = 0;
      pointerY = 0;
      invalidate();
    }

    function syncVisibility() {
      if (document.hidden || !visible) {
        cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
      } else invalidate();
    }

    function onMotionChange(event: MediaQueryListEvent) {
      reduceMotion = event.matches;
      if (reduceMotion) {
        pointerX = 0;
        pointerY = 0;
      }
      invalidate();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncVisibility();
      },
      { rootMargin: "80px" },
    );
    intersectionObserver.observe(container);
    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("pointercancel", onPointerLeave);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", syncVisibility);
    reducedMotion.addEventListener("change", onMotionChange);
    invalidateRef.current = invalidate;
    resize();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", syncVisibility);
      reducedMotion.removeEventListener("change", onMotionChange);
      invalidateRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`signal-field ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="signal-field__canvas" />
    </div>
  );
}
