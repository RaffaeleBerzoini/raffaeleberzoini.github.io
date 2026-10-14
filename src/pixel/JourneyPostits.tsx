import { useEffect, useRef, useState } from "react";
import { CatBed, HelperTabby } from "./TabbyCats";
import {
  sampleCatGait,
  type CatGaitSample,
  type CatLegOffset,
} from "./cat-gait";
import {
  CAT_HOME,
  NOTES,
  SCENE_DURATION,
  samplePostitScene,
  shuffleNotes,
  type CatPose,
} from "./postit-scene";

function Paper({ index }: { index: number }) {
  const note = NOTES[index];
  const w = note.width,
    h = note.height;
  return (
    <g transform={`translate(${-w / 2} ${-h / 2})`}>
      <path d={`M0 0H${w}V${h - 7}L${w - 7} ${h}H0Z`} fill={note.color} />
      <path
        d={`M${w - 7} ${h - 7}H${w}L${w - 7} ${h}Z`}
        fill={note.ink}
        opacity=".5"
      />
      <text x="7" y="17" className="pr-postit-label" fill={note.ink}>
        {note.label}
      </text>
      <path
        d={`M7 25H${w - 9}V28H7Z${h > 40 ? `M7 33H${w - 17}V36H7Z` : ""}`}
        fill={note.ink}
        opacity=".6"
      />
    </g>
  );
}

export default function JourneyPostits({ enabled }: { enabled: boolean }) {
  const root = useRef<SVGGElement>(null);
  const papers = useRef<(SVGGElement | null)[]>([]);
  const helper = useRef<SVGGElement>(null);
  const [cat, setCat] = useState({
    pose: "sleep" as CatPose,
    carrying: false,
    rise: 0,
    reach: 80,
    gait: undefined as CatGaitSample | undefined,
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      previousTime = 0,
      elapsed = 0,
      lastPaint = 0;
    let bag = shuffleNotes(),
      selected = bag.shift()!;
    let lastPhase = "",
      lastRise = -1;
    let lastPosition = { ...CAT_HOME },
      lastSceneTime = 0,
      distanceTravelled = 0;
    let lastGait: CatGaitSample | undefined;
    const reset = () => {
      NOTES.forEach((note, index) =>
        papers.current[index]?.setAttribute(
          "transform",
          `translate(${note.x} ${note.y})`,
        ),
      );
      helper.current?.setAttribute(
        "transform",
        `translate(${CAT_HOME.x} ${CAT_HOME.y})`,
      );
      root.current?.setAttribute("data-phase", "rest");
      setCat({
        pose: "sleep",
        carrying: false,
        rise: 0,
        reach: 80,
        gait: undefined,
      });
      lastPhase = "";
      lastRise = -1;
      lastPosition = { ...CAT_HOME };
      lastSceneTime = 0;
      distanceTravelled = 0;
      lastGait = undefined;
    };
    const tick = (now: number) => {
      if (!enabled || media.matches) {
        previousTime = 0;
        reset();
        return;
      }
      if (document.hidden) {
        previousTime = 0;
        return;
      }
      if (previousTime) elapsed += Math.min((now - previousTime) / 1000, 0.1);
      previousTime = now;
      if (elapsed >= SCENE_DURATION) {
        const old = NOTES[selected];
        papers.current[selected]?.setAttribute(
          "transform",
          `translate(${old.x} ${old.y})`,
        );
        if (!bag.length) bag = shuffleNotes(selected);
        selected = bag.shift()!;
        elapsed %= SCENE_DURATION;
      }
      // World motion and the articulated gait share a 30 fps clock.
      if (now - lastPaint >= 32) {
        const scene = samplePostitScene(selected, elapsed);
        const p = scene.paper,
          c = scene.cat;
        const walking = c.pose === "walk" || c.pose === "back";
        let gait = walking ? lastGait : undefined;
        if (walking) {
          const dx = c.x - lastPosition.x;
          const dy = c.y - lastPosition.y;
          const travelled = Math.hypot(dx, dy);
          distanceTravelled += travelled;
          const dt = elapsed - lastSceneTime;
          // Preserve the exact stance on the first frame after visibility resumes.
          if (travelled > 0 && dt > 0) {
            const sample = sampleCatGait(distanceTravelled);
            const weight = Math.min(1, travelled / dt / 8);
            let directionX = dx,
              directionY = dy,
              directionLength = travelled;
            if (lastPhase !== scene.phase) {
              // The displacement at an exact phase boundary belongs to the old
              // path. Turn the new pose toward its own next step immediately.
              const ahead = samplePostitScene(selected, elapsed + 0.01);
              const nextX = ahead.cat.x - c.x;
              const nextY = ahead.cat.y - c.y;
              const nextLength = Math.hypot(nextX, nextY);
              if (ahead.phase === scene.phase && nextLength > 0) {
                directionX = nextX;
                directionY = nextY;
                directionLength = nextLength;
              }
            }
            const axisX = -directionX / directionLength / c.facing;
            const axisY = -directionY / directionLength;
            // Project the stroke onto the floor path. Never scale planted paws
            // with speed: their ground contact must survive acceleration too.
            const projectPaw = (paw: CatLegOffset): CatLegOffset => ({
              x: paw.x * axisX,
              y: paw.y + paw.x * axisY,
              bend: paw.bend,
            });
            gait = {
              frontNear: projectPaw(sample.frontNear),
              backNear: projectPaw(sample.backNear),
              frontFar: projectPaw(sample.frontFar),
              backFar: projectPaw(sample.backFar),
              bodyY: sample.bodyY * weight,
              headY: sample.headY * weight,
              tailAngle: sample.tailAngle * weight,
            };
          }
        }
        lastGait = gait;
        papers.current[selected]?.setAttribute(
          "transform",
          `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${p.rotation.toFixed(2)}) scale(${p.scaleX.toFixed(3)} ${p.scaleY.toFixed(3)})`,
        );
        helper.current?.setAttribute(
          "transform",
          `translate(${c.x.toFixed(2)} ${c.y.toFixed(2)}) scale(${c.facing} 1)`,
        );
        root.current?.setAttribute("data-note", NOTES[selected].label);
        if (
          walking ||
          lastPhase !== scene.phase ||
          Math.abs(lastRise - c.rise) > 0.002
        ) {
          root.current?.setAttribute("data-phase", scene.phase);
          setCat({
            pose: c.pose,
            carrying: c.carrying,
            rise: c.rise,
            reach: c.reach,
            gait,
          });
          lastPhase = scene.phase;
          lastRise = c.rise;
        }
        lastPosition = { x: c.x, y: c.y };
        lastSceneTime = elapsed;
        lastPaint = now;
      }
      frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      previousTime = 0;
      if (!enabled || media.matches) {
        elapsed = 0;
        reset();
      } else if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    reset();
    resume();
    media.addEventListener("change", resume);
    document.addEventListener("visibilitychange", resume);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", resume);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [enabled]);

  return (
    <g
      ref={root}
      className="pr-postit-story"
      pointerEvents="none"
      aria-hidden="true"
    >
      <g transform={`translate(${CAT_HOME.x} ${CAT_HOME.y})`}>
        <CatBed />
      </g>
      {NOTES.map((note, index) => (
        <g
          key={note.label}
          ref={(element) => {
            papers.current[index] = element;
          }}
          className="pr-story-paper"
          transform={`translate(${note.x} ${note.y})`}
        >
          <Paper index={index} />
        </g>
      ))}
      <g
        ref={helper}
        className="pr-helper-position"
        transform={`translate(${CAT_HOME.x} ${CAT_HOME.y})`}
      >
        <HelperTabby
          pose={cat.pose}
          carrying={cat.carrying}
          rise={cat.rise}
          reach={cat.reach}
          gait={cat.gait}
        />
      </g>
    </g>
  );
}
