import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "@fontsource/pixelify-sans/400.css";
import "@fontsource/pixelify-sans/500.css";
import RoomArtwork, { ChairForeground } from "./pixel/RoomArtwork";
import CharacterSprite, { type CharacterPose } from "./pixel/CharacterSprite";
import ObjectExperience, { type RoomSection } from "./pixel/ObjectExperience";
import WindowDelivery from "./pixel/WindowDelivery";
import {
  findPath,
  moveWithCollisions,
  type Direction,
  type Point,
} from "./pixel/navigation";
import "./pixel-lab.css";

const Artwork = memo(RoomArtwork);
type StationId = RoomSection | "window";
type Station = {
  id: StationId;
  name: string;
  title: string;
  glyph: string;
  point: Point;
  hit: { x: number; y: number; width: number; height: number };
  label: Point;
};
const STATIONS: Station[] = [
  {
    id: "projects",
    name: "Computer",
    title: "Explore projects",
    glyph: ">_",
    point: { x: 254, y: 486 },
    hit: { x: 190, y: 177, width: 146, height: 155 },
    label: { x: 266, y: 168 },
  },
  {
    id: "research",
    name: "Bookshelf",
    title: "Read publications",
    glyph: "▤",
    point: { x: 700, y: 486 },
    hit: { x: 643, y: 210, width: 145, height: 240 },
    label: { x: 712, y: 165 },
  },
  {
    id: "profile",
    name: "Noticeboard",
    title: "Discover my journey",
    glyph: "⌑",
    point: { x: -20, y: 420 },
    hit: { x: -105, y: 140, width: 165, height: 180 },
    label: { x: -22, y: 125 },
  },
  {
    id: "contact",
    name: "Mailbox",
    title: "Let’s connect",
    glyph: "✉",
    point: { x: 799, y: 495 },
    hit: { x: 781, y: 333, width: 76, height: 122 },
    label: { x: 815, y: 278 },
  },
  {
    id: "window",
    name: "Window",
    title: "Fly the night post",
    glyph: "✦",
    point: { x: 491, y: 379 },
    hit: { x: 389, y: 115, width: 205, height: 205 },
    label: { x: 491, y: 101 },
  },
];
const KEY_DIRECTIONS: Record<string, Direction> = {
  w: "up",
  arrowup: "up",
  s: "down",
  arrowdown: "down",
  a: "left",
  arrowleft: "left",
  d: "right",
  arrowright: "right",
};
const START: Point = { x: 491, y: 515 };
const CHAIR_POINT = STATIONS[0].point;
const SEAT_DURATION = 1.1;
const EXIT_DURATION = 0.8;

export default function PixelLab() {
  const [active, setActive] = useState<StationId | null>(null);
  const [near, setNear] = useState<StationId | null>(null);
  const [visited, setVisited] = useState<StationId[]>([]);
  const [direction, setDirection] = useState<Direction>("down");
  const [moving, setMoving] = useState(false);
  const [pose, setPose] = useState<CharacterPose>("standing");
  const [destination, setDestination] = useState<Point | null>(null);
  const [travelTo, setTravelTo] = useState<StationId | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [help, setHelp] = useState(false);
  const [ambient, setAmbient] = useState(true);
  const [nightLights, setNightLights] = useState(0);
  const [message, setMessage] = useState(
    "A little world of ideas. Make yourself at home.",
  );
  const sceneRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const actorRef = useRef<SVGGElement>(null);
  const position = useRef<Point>({ ...START });
  // Each physical key or pointer owns its input, even when directions coincide.
  const movementInputs = useRef(new Map<string, Direction>());
  // A key already held when auto-seating starts must be released before it can
  // trigger another action. Fresh input during the animation queues standing up.
  const suppressedInputs = useRef(new Set<string>());
  const poseRef = useRef<CharacterPose>("standing");
  const poseElapsed = useRef(0);
  const exitRequested = useRef(false);
  const seatArmed = useRef(true);
  const approachingChair = useRef(false);
  const path = useRef<Point[]>([]);
  const queued = useRef<StationId | null>(null);
  const nearRef = useRef<StationId | null>(null);
  const activeRef = useRef<StationId | null>(null);
  const motionRef = useRef({ moving: false, direction: "down" as Direction });
  const camera = useRef({ width: 1040, x: -170, targetX: -170 });
  const reduced = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const changePose = useCallback((next: CharacterPose) => {
    poseRef.current = next;
    poseElapsed.current = 0;
    setPose(next);
  }, []);

  const beginExit = useCallback(() => {
    seatArmed.current = false;
    exitRequested.current = false;
    if (poseRef.current === "seating") {
      exitRequested.current = true;
      return;
    }
    if (poseRef.current !== "seated") return;
    changePose(reduced.current ? "standing" : "exiting");
    setMessage("Standing up. Your next move is ready.");
  }, [changePose]);

  const beginSeat = useCallback(() => {
    if (poseRef.current !== "standing") return;
    for (const source of movementInputs.current.keys())
      suppressedInputs.current.add(source);
    movementInputs.current.clear();
    path.current = [];
    queued.current = null;
    approachingChair.current = false;
    exitRequested.current = false;
    seatArmed.current = false;
    setTravelTo(null);
    setDestination(null);
    setMoving(false);
    setDirection("up");
    motionRef.current = { moving: false, direction: "up" };
    changePose(reduced.current ? "seated" : "seating");
    setMessage(
      reduced.current
        ? "Seated at the computer. Press E to explore projects. Move to stand up."
        : "Taking a seat at the computer. Your projects will be ready when you press E.",
    );
  }, [changePose]);

  const beginManualMove = useCallback(
    (source: string, facing: Direction) => {
      if (
        activeRef.current ||
        document.querySelector("dialog[open]") ||
        movementInputs.current.has(source) ||
        suppressedInputs.current.has(source)
      )
        return;
      movementInputs.current.set(source, facing);
      approachingChair.current = false;
      if (poseRef.current !== "standing") beginExit();
      path.current = [];
      queued.current = null;
      setDestination(null);
      setTravelTo(null);
      setQuickOpen(false);
      setHelp(false);
    },
    [beginExit],
  );

  const openStation = useCallback((id: StationId) => {
    // The computer becomes usable only after the character has taken a seat.
    if (id === "projects" && poseRef.current !== "seated") return;
    for (const source of movementInputs.current.keys())
      suppressedInputs.current.add(source);
    movementInputs.current.clear();
    exitRequested.current = false;
    path.current = [];
    queued.current = null;
    approachingChair.current = false;
    setTravelTo(null);
    setDestination(null);
    setQuickOpen(false);
    setHelp(false);
    activeRef.current = id;
    setActive(id);
    setMoving(false);
    setDirection("up");
    motionRef.current = { moving: false, direction: "up" };
    setVisited((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setMessage(
      "Exploring " +
        STATIONS.find((s) => s.id === id)!.name.toLowerCase() +
        ". Escape returns to the room.",
    );
  }, []);

  const closeObject = useCallback(() => {
    activeRef.current = null;
    setActive(null);
    movementInputs.current.clear();
    setMessage(
      poseRef.current === "seated"
        ? "Back at the computer. Press E to reopen projects, or move to stand up."
        : "Back in the workshop. There’s more to discover.",
    );
    requestAnimationFrame(() =>
      sceneRef.current?.focus({ preventScroll: true }),
    );
  }, []);

  const walkTo = useCallback(
    (target: Point, station?: StationId) => {
      if (activeRef.current) return;
      if (station === "projects" && poseRef.current === "seated") {
        openStation("projects");
        return;
      }
      if (station === "projects" && poseRef.current === "seating") {
        for (const source of movementInputs.current.keys())
          suppressedInputs.current.add(source);
        movementInputs.current.clear();
        path.current = [];
        queued.current = null;
        exitRequested.current = false;
        setTravelTo(null);
        setDestination(null);
        setQuickOpen(false);
        setHelp(false);
        return;
      }
      for (const source of movementInputs.current.keys())
        suppressedInputs.current.add(source);
      movementInputs.current.clear();
      approachingChair.current = station === "projects";
      if (poseRef.current !== "standing") beginExit();
      if (station === "projects") seatArmed.current = true;
      const route = findPath(position.current, target);
      path.current = route;
      queued.current = station ?? null;
      setTravelTo(station ?? null);
      setQuickOpen(false);
      setHelp(false);
      if (route.length) {
        setDestination(route[route.length - 1]);
        setMessage(
          station
            ? "On my way to the " +
                STATIONS.find((s) => s.id === station)!.name.toLowerCase() +
                "."
            : "Exploring the workshop…",
        );
      } else if (
        station &&
        Math.hypot(
          position.current.x - target.x,
          position.current.y - target.y,
        ) < 20
      ) {
        if (
          station === "projects" &&
          Math.hypot(
            position.current.x - target.x,
            position.current.y - target.y,
          ) < 0.2
        )
          beginSeat();
        else if (poseRef.current === "standing") openStation(station);
      } else {
        queued.current = null;
        setTravelTo(null);
        setDestination(null);
      }
      sceneRef.current?.focus({ preventScroll: true });
    },
    [openStation, beginExit, beginSeat],
  );

  const interact = useCallback(() => {
    if (poseRef.current === "seated") openStation("projects");
    else if (poseRef.current !== "standing") return;
    else if (nearRef.current && nearRef.current !== "projects")
      openStation(nearRef.current);
    else if (nearRef.current === "projects") walkTo(CHAIR_POINT, "projects");
    else
      setMessage(
        "Move closer to an object, or click it and I’ll take you there.",
      );
  }, [openStation, walkTo]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      reduced.current = preference.matches;
    };
    preference.addEventListener("change", syncMotion);
    const stop = () => {
      movementInputs.current.clear();
      suppressedInputs.current.clear();
    };
    const editable = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    const keydown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (
        (activeRef.current || document.querySelector("dialog[open]")) &&
        KEY_DIRECTIONS[key]
      ) {
        // A direction pressed inside a dialog belongs to that dialog until
        // released, including repeated keydown events after the dialog closes.
        suppressedInputs.current.add("key:" + (event.code || key));
      }
      if (
        activeRef.current ||
        document.querySelector("dialog[open]") ||
        editable(event.target) ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      )
        return;
      if (KEY_DIRECTIONS[key]) {
        event.preventDefault();
        beginManualMove("key:" + (event.code || key), KEY_DIRECTIONS[key]);
      } else if (
        (key === "e" || key === " ") &&
        !event.repeat &&
        !(event.target instanceof Element && event.target.closest("button,a"))
      ) {
        event.preventDefault();
        interact();
      } else if (key === "escape") {
        setHelp(false);
        setQuickOpen(false);
      }
    };
    const keyup = (event: KeyboardEvent) => {
      const physicalKey = event.code || event.key.toLowerCase();
      movementInputs.current.delete("key:" + physicalKey);
      suppressedInputs.current.delete("key:" + physicalKey);
      // Release a D-pad key even if focus moved away before keyup.
      movementInputs.current.delete("dpad-key:" + physicalKey);
      suppressedInputs.current.delete("dpad-key:" + physicalKey);
    };
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", stop);
    sceneRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", stop);
      preference.removeEventListener("change", syncMotion);
    };
  }, [interact, beginManualMove]);

  useEffect(() => {
    let frame = 0;
    let previous = 0;
    let disposed = false;
    function updateMotion(isMoving: boolean, facing: Direction) {
      if (motionRef.current.moving !== isMoving) {
        motionRef.current.moving = isMoving;
        setMoving(isMoving);
      }
      if (motionRef.current.direction !== facing) {
        motionRef.current.direction = facing;
        setDirection(facing);
      }
    }
    function draw(now: number) {
      if (disposed) return;
      const delta = Math.min((now - previous) / 1000 || 0, 0.04);
      previous = now;
      if (!document.hidden) {
        if (poseRef.current === "seating") {
          poseElapsed.current += delta;
          if (reduced.current || poseElapsed.current >= SEAT_DURATION) {
            changePose("seated");
            setMessage(
              "Seated at the computer. Press E to explore projects. Move to stand up.",
            );
            if (exitRequested.current) beginExit();
          }
        } else if (poseRef.current === "exiting") {
          poseElapsed.current += delta;
          if (reduced.current || poseElapsed.current >= EXIT_DURATION) {
            changePose("standing");
          }
        }
      }
      const old = position.current;
      let dx = 0,
        dy = 0;
      if (
        !activeRef.current &&
        !document.hidden &&
        !document.querySelector("dialog[open]") &&
        poseRef.current === "standing"
      ) {
        let left = false,
          right = false,
          up = false,
          down = false;
        for (const held of movementInputs.current.values()) {
          if (held === "left") left = true;
          else if (held === "right") right = true;
          else if (held === "up") up = true;
          else down = true;
        }
        dx = Number(right) - Number(left);
        dy = Number(down) - Number(up);
        if (!dx && !dy && path.current.length) {
          const target = path.current[0];
          const distance = Math.hypot(target.x - old.x, target.y - old.y);
          if (distance < 0.01) {
            position.current = { ...target };
            path.current.shift();
            if (!path.current.length) setDestination(null);
          } else {
            dx = (target.x - old.x) / distance;
            dy = (target.y - old.y) / distance;
            const step = Math.min(180 * delta, distance);
            position.current = moveWithCollisions(old, dx * step, dy * step);
          }
        } else if (dx || dy) {
          const length = Math.hypot(dx, dy);
          position.current = moveWithCollisions(
            old,
            (dx / length) * 180 * delta,
            (dy / length) * 180 * delta,
          );
        }
      }
      const current = position.current;
      const isMoving = Math.hypot(current.x - old.x, current.y - old.y) > 0.025;
      const facing: Direction =
        poseRef.current !== "standing"
          ? "up"
          : Math.abs(dx) > Math.abs(dy)
            ? dx > 0
              ? "right"
              : "left"
            : dy > 0
              ? "down"
              : dy < 0
                ? "up"
                : motionRef.current.direction;
      updateMotion(isMoving, facing);
      actorRef.current?.setAttribute(
        "transform",
        "translate(" +
          Math.round(current.x) +
          " " +
          Math.round(current.y) +
          ")",
      );
      const nearest = STATIONS.map((s) => ({
        id: s.id,
        distance: Math.hypot(current.x - s.point.x, current.y - s.point.y),
      })).sort((a, b) => a.distance - b.distance)[0];
      const nearby = nearest.distance < 64 ? nearest.id : null;
      if (nearRef.current !== nearby) {
        nearRef.current = nearby;
        setNear(nearby);
      }
      if (
        !path.current.length &&
        queued.current &&
        !activeRef.current &&
        poseRef.current === "standing"
      ) {
        const id = queued.current;
        queued.current = null;
        if (id === "projects") {
          if (
            Math.hypot(current.x - CHAIR_POINT.x, current.y - CHAIR_POINT.y) <
            0.2
          )
            beginSeat();
        } else openStation(id);
      }
      const chairDistance = Math.hypot(
        current.x - CHAIR_POINT.x,
        current.y - CHAIR_POINT.y,
      );
      if (poseRef.current === "standing" && chairDistance > 42)
        seatArmed.current = true;
      // Capture nearby manual explorers, then finish a collision-safe approach
      // to the exact chair point before the purely visual sitting animation.
      if (
        poseRef.current === "standing" &&
        seatArmed.current &&
        chairDistance < 24 &&
        !approachingChair.current &&
        !activeRef.current &&
        (!queued.current || queued.current === "projects")
      ) {
        for (const source of movementInputs.current.keys())
          suppressedInputs.current.add(source);
        movementInputs.current.clear();
        approachingChair.current = true;
        path.current = findPath(current, CHAIR_POINT);
        queued.current = "projects";
        setTravelTo("projects");
        setDestination(CHAIR_POINT);
        if (!path.current.length && chairDistance < 0.2) beginSeat();
      }
      const cam = camera.current;
      cam.targetX = Math.max(
        -170,
        Math.min(870 - cam.width, current.x - cam.width / 2),
      );
      cam.x +=
        (cam.targetX - cam.x) * (reduced.current ? 1 : Math.min(1, delta * 7));
      if (Math.abs(cam.targetX - cam.x) < 0.1) cam.x = cam.targetX;
      svgRef.current?.setAttribute(
        "viewBox",
        cam.x.toFixed(2) + " 70 " + cam.width.toFixed(2) + " 520",
      );
      frame = requestAnimationFrame(draw);
    }
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const mobile = width < 700;
      camera.current.width = mobile
        ? Math.max(380, Math.min(1040, (width / Math.max(height, 1)) * 520))
        : 1040;
      camera.current.x = Math.max(
        -170,
        Math.min(
          870 - camera.current.width,
          position.current.x - camera.current.width / 2,
        ),
      );
    });
    if (sceneRef.current) observer.observe(sceneRef.current);
    frame = requestAnimationFrame(draw);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [openStation, beginSeat, beginExit, changePose]);

  function floorClick(event: ReactPointerEvent<SVGSVGElement>) {
    if (
      event.button !== 0 ||
      (event.target as Element).closest("[data-station]")
    )
      return;
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const world = point.matrixTransform(matrix.inverse());
    walkTo({ x: world.x, y: world.y });
  }
  function pressDirection(
    event: ReactPointerEvent<HTMLButtonElement>,
    direction: Direction,
  ) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    beginManualMove("pointer:" + event.pointerId, direction);
  }
  function releaseMovement(source: string) {
    movementInputs.current.delete(source);
    suppressedInputs.current.delete(source);
  }
  const nearest = STATIONS.find((s) => s.id === near);
  const canInteract =
    pose === "seated" ||
    (pose === "standing" && Boolean(near) && near !== "projects");

  return (
    <div className={"pixel-room-page " + (!ambient ? "pr-ambient-off" : "")}>
      <header className="pr-hud">
        <div className="pr-identity">
          <span className="pr-brand-mark" aria-hidden="true">
            rb<span>.</span>
          </span>
          <div>
            <h1>Raffaele’s workshop</h1>
            <span>Software, science & a little curiosity.</span>
          </div>
        </div>
        <div className="pr-hud-actions">
          <button
            className="pr-menu-button"
            onClick={() => {
              setQuickOpen(!quickOpen);
              setHelp(false);
            }}
            aria-expanded={quickOpen}
            aria-controls="pr-quick-menu"
          >
            <span aria-hidden="true">▦</span> Explore
          </button>
          <button
            className="pr-hud-icon"
            aria-label="Show movement controls"
            onClick={() => {
              setHelp(!help);
              setQuickOpen(false);
            }}
            aria-expanded={help}
          >
            ?
          </button>
        </div>
      </header>
      <main className="pr-world">
        <div
          className="pr-viewport"
          ref={sceneRef}
          tabIndex={0}
          role="region"
          aria-label="Playable workshop. Move with W A S D or arrow keys. Click an object to walk to it. Sit at the computer for projects, or press E by the window to fly Night Post."
          aria-describedby="pr-controls"
        >
          <svg
            ref={svgRef}
            viewBox="-170 70 1040 520"
            className="pr-world-svg"
            onPointerDown={floorClick}
            aria-label="Pixel art room with a computer, bookshelf, noticeboard, mailbox and a playable night window"
          >
            <Artwork
              activeTopic={active ?? travelTo ?? near}
              ambientEnabled={ambient}
              nightLights={nightLights}
            />
            {destination && (
              <g
                className="pr-destination"
                aria-hidden="true"
                transform={
                  "translate(" + destination.x + " " + destination.y + ")"
                }
              >
                <path d="M-8-5h5v-3h6v3h5v10H3v3h-6V5h-5Z" />
                <path d="M-3 0h6M0-3v6" />
              </g>
            )}
            {STATIONS.map((s) => (
              <g
                key={s.id}
                data-station={s.id}
                role="button"
                tabIndex={0}
                aria-label={s.title + " at the " + s.name.toLowerCase()}
                aria-haspopup="dialog"
                className={
                  "pr-station " +
                  (near === s.id ? "pr-station-near " : "") +
                  (travelTo === s.id ? "pr-station-target " : "") +
                  (visited.includes(s.id) ? "pr-station-visited" : "")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  walkTo(s.point, s.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    walkTo(s.point, s.id);
                  }
                }}
              >
                <rect className="pr-object-hit" {...s.hit} rx="0" />
                {s.id === "projects" && (
                  <rect
                    className="pr-object-hit pr-chair-hit"
                    x="220"
                    y="360"
                    width="70"
                    height="105"
                  />
                )}
                <g
                  className="pr-station-label"
                  transform={"translate(" + s.label.x + " " + s.label.y + ")"}
                >
                  <path d="M-47-18H47V-14H51V5H4L0 10-4 5H-51V-14H-47Z" />
                  <text textAnchor="middle" y="-3">
                    {s.glyph +
                      " " +
                      (s.id === "profile"
                        ? "JOURNEY"
                        : s.id === "contact"
                          ? "CONTACT"
                          : s.id === "window"
                            ? "NIGHT POST"
                            : s.id.toUpperCase())}
                  </text>
                </g>
                {visited.includes(s.id) && (
                  <g
                    className="pr-visited-pixel"
                    transform={
                      "translate(" +
                      (s.hit.x + s.hit.width - 7) +
                      " " +
                      (s.hit.y + 7) +
                      ")"
                    }
                    aria-hidden="true"
                  >
                    <path d="M-4-4h8v8h-8Z" />
                  </g>
                )}
              </g>
            ))}
            <g
              ref={actorRef}
              transform={"translate(" + START.x + " " + START.y + ")"}
              className="pr-player"
              data-pose={pose}
              aria-hidden="true"
            >
              <CharacterSprite
                x={0}
                y={0}
                direction={direction}
                moving={moving}
                pose={pose}
              />
              <g
                className={
                  "pr-player-prompt " +
                  (canInteract && !moving && !active
                    ? "pr-player-prompt-visible"
                    : "")
                }
                transform={
                  pose === "seated" ? "translate(0 -172)" : "translate(0 -82)"
                }
              >
                <path d="M-10-10h20v20H4l-4 5-4-5h-6Z" />
                <text x="0" y="4" textAnchor="middle">
                  E
                </text>
              </g>
            </g>
            {pose !== "standing" && <ChairForeground />}
          </svg>
        </div>
        <div className="pr-room-caption" aria-hidden="true">
          <span className="pr-status-light" /> WORKSHOP / OPEN TO EXPLORATION
        </div>
        <div className="pr-touch-controls" aria-label="Touch movement controls">
          <div className="pr-dpad">
            {(["up", "left", "down", "right"] as Direction[]).map((dir) => (
              <button
                key={dir}
                className={"pr-direction pr-direction-" + dir}
                aria-label={"Move " + dir}
                onPointerDown={(e) => pressDirection(e, dir)}
                onPointerUp={(e) => releaseMovement("pointer:" + e.pointerId)}
                onPointerCancel={(e) =>
                  releaseMovement("pointer:" + e.pointerId)
                }
                onLostPointerCapture={(e) =>
                  releaseMovement("pointer:" + e.pointerId)
                }
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    beginManualMove(
                      "dpad-key:" + (e.code || e.key.toLowerCase()),
                      dir,
                    );
                  }
                }}
                onKeyUp={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    releaseMovement(
                      "dpad-key:" + (e.code || e.key.toLowerCase()),
                    );
                  }
                }}
              >
                {{ up: "↑", down: "↓", left: "←", right: "→" }[dir]}
              </button>
            ))}
          </div>
          <button
            className="pr-touch-action"
            onClick={interact}
            disabled={!canInteract}
            aria-label={
              nearest ? nearest.title : "Move closer to an object to interact"
            }
          >
            E<span>Interact</span>
          </button>
        </div>
      </main>
      <footer className="pr-bottom-hud">
        <div className="pr-location">
          <span className="pr-location-icon" aria-hidden="true">
            {nearest?.glyph ?? "✦"}
          </span>
          <div>
            <span>
              {pose === "seating"
                ? "Taking a seat…"
                : pose === "seated"
                  ? "Computer ready. Explore projects."
                  : pose === "exiting"
                    ? "Standing up…"
                    : travelTo
                      ? "Walking to " +
                        STATIONS.find(
                          (s) => s.id === travelTo,
                        )!.name.toLowerCase()
                      : nearest
                        ? near === "projects"
                          ? "Take a seat at the computer."
                          : nearest.title
                        : "Welcome, explorer."}
            </span>
            <small>
              {pose === "seating"
                ? "A little stretch. Then press E to begin."
                : pose === "seated"
                  ? "Press E to open projects. Move to stand up."
                  : pose === "exiting"
                    ? "Your next move will begin in a moment."
                    : near === "projects"
                      ? "Approach the chair, click it, or press E to sit."
                      : nearest
                        ? "Press E or click the object"
                        : "Click the floor to walk. Find something interesting."}
            </small>
          </div>
          {canInteract && nearest && (
            <button
              onClick={interact}
              className="pr-interact-key"
              aria-label={nearest.title}
            >
              E
            </button>
          )}
        </div>
        <div id="pr-controls" className="pr-key-guide">
          <span>
            <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd> move
          </span>
          <span>
            <kbd>E</kbd> interact
          </span>
        </div>
        <div
          className="pr-progress"
          aria-label={
            visited.length + " of " + STATIONS.length + " places explored"
          }
        >
          {STATIONS.map((s) => (
            <i
              className={visited.includes(s.id) ? "pr-found" : ""}
              key={s.id}
            />
          ))}
          <span>
            {visited.length}/{STATIONS.length} explored
          </span>
        </div>
      </footer>
      <p className="pr-sr-only" role="status">
        {message}
      </p>
      {quickOpen && (
        <nav
          id="pr-quick-menu"
          className="pr-quick-menu"
          aria-label="Quick access to portfolio content"
        >
          <p>Choose your next stop</p>
          {STATIONS.map((s) => (
            <div key={s.id}>
              <button onClick={() => walkTo(s.point, s.id)}>
                <span>{s.glyph}</span>
                <span>
                  {s.title}
                  <small>Walk to the {s.name.toLowerCase()}</small>
                </span>
                <span>→</span>
              </button>
              <button
                className="pr-open-direct"
                onClick={() =>
                  s.id === "projects"
                    ? walkTo(CHAIR_POINT, "projects")
                    : openStation(s.id)
                }
                aria-label={
                  s.id === "projects"
                    ? "Take a seat at the computer"
                    : "Open " + s.id + " immediately"
                }
                title={
                  s.id === "projects"
                    ? "Take a seat, then press E"
                    : "Open without walking"
                }
              >
                ↗
              </button>
            </div>
          ))}
        </nav>
      )}
      {help && (
        <aside className="pr-help" aria-label="How to explore">
          <button
            className="pr-help-close"
            onClick={() => setHelp(false)}
            aria-label="Close movement help"
          >
            ×
          </button>
          <span className="pr-help-icon" aria-hidden="true">
            ✦
          </span>
          <h2>This little robot is you.</h2>
          <p>Follow your curiosity around the room.</p>
          <dl>
            <div>
              <dt>WASD / Arrow keys</dt>
              <dd>Walk around</dd>
            </div>
            <div>
              <dt>E / Space</dt>
              <dd>Interact with a nearby object</dd>
            </div>
            <div>
              <dt>Click or tap</dt>
              <dd>Walk to a spot or explore an object</dd>
            </div>
            <div>
              <dt>The computer</dt>
              <dd>Take a seat, then press E for projects. Move to stand up.</dd>
            </div>
            <div>
              <dt>The window</dt>
              <dd>
                Fly the Night Post drone. Deliver letters and light up the city.
              </dd>
            </div>
            <div>
              <dt>Escape</dt>
              <dd>Return to the room</dd>
            </div>
          </dl>
          <p className="pr-help-note">
            Explore offers direct access to the bookshelf, journey, mailbox and
            window. The computer starts with a seat.
          </p>
          <button
            className="pr-ambient-button"
            aria-pressed={ambient}
            onClick={() => setAmbient(!ambient)}
          >
            {ambient ? "Pause" : "Resume"} room ambience
          </button>
        </aside>
      )}
      {active === "window" && (
        <WindowDelivery
          onClose={closeObject}
          onProgress={(count) =>
            setNightLights((previous) => Math.max(previous, count))
          }
        />
      )}
      {active && active !== "window" && (
        <ObjectExperience section={active} onClose={closeObject} />
      )}
    </div>
  );
}
