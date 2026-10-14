import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  WIDTH,
  HEIGHT,
  DURATION,
  TARGETS,
  createDeliveryGame,
  startDeliveryGame,
  stepDeliveryGame,
  type DeliveryState,
} from "./delivery-game";
import { drawDeliveryGame } from "./delivery-art";
import "./window-delivery.css";

type Props = { onClose: () => void; onProgress: (count: number) => void };
type FlightDirection = "up" | "down" | "left" | "right";
const KEYS: Record<string, FlightDirection> = {
  w: "up",
  arrowup: "up",
  s: "down",
  arrowdown: "down",
  a: "left",
  arrowleft: "left",
  d: "right",
  arrowright: "right",
};
const RECORD_KEY = "rb-night-post-best-v1";
function readRecord() {
  try {
    const value = Number(localStorage.getItem(RECORD_KEY));
    return Number.isInteger(value) && value >= 0 && value <= TARGETS.length
      ? value
      : 0;
  } catch {
    return 0;
  }
}

export default function WindowDelivery({ onClose, onProgress }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const game = useRef(createDeliveryGame());
  const held = useRef(new Map<string, FlightDirection>());
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const progressCallback = useRef(onProgress);
  const record = useRef(readRecord());
  const [best, setBest] = useState(record.current);
  const [view, setView] = useState<DeliveryState>(game.current);
  const [announcement, setAnnouncement] = useState(
    "Night Post. Six windows are waiting for a letter.",
  );

  useEffect(() => {
    progressCallback.current = onProgress;
  }, [onProgress]);
  const clearInput = useCallback(() => {
    held.current.clear();
    pointer.current = null;
  }, []);
  const start = useCallback(() => {
    clearInput();
    game.current = startDeliveryGame();
    setView(game.current);
    setAnnouncement(
      "Off we go. Deliver your first letter to " + TARGETS[0].name + ".",
    );
    canvas.current?.focus({ preventScroll: true });
  }, [clearInput]);
  const pause = useCallback(
    (force = false) => {
      const current = game.current;
      if (current.phase !== "playing" && current.phase !== "paused") return;
      clearInput();
      const phase = force || current.phase === "playing" ? "paused" : "playing";
      game.current = { ...current, phase };
      setView(game.current);
      setAnnouncement(
        phase === "paused"
          ? "Flight paused. Your battery is safe."
          : "Back in the sky.",
      );
      if (phase === "playing") canvas.current?.focus({ preventScroll: true });
    },
    [clearInput],
  );

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    startButton.current?.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing)
        return;
      const key = event.key.toLowerCase();
      if (KEYS[key]) {
        event.preventDefault();
        if (game.current.phase === "playing") {
          pointer.current = null;
          held.current.set("key:" + (event.code || key), KEYS[key]);
        }
      } else if (key === "p" && !event.repeat) {
        event.preventDefault();
        pause();
      } else if (
        (key === "enter" || key === " ") &&
        !event.repeat &&
        !(event.target instanceof Element && event.target.closest("button"))
      ) {
        event.preventDefault();
        if (
          game.current.phase === "ready" ||
          game.current.phase === "won" ||
          game.current.phase === "lost"
        )
          start();
        else pause();
      }
    };
    const keyup = (event: KeyboardEvent) => {
      const key = event.code || event.key.toLowerCase();
      held.current.delete("key:" + key);
      held.current.delete("button:" + key);
    };
    const blur = () => {
      clearInput();
      if (game.current.phase === "playing") pause(true);
    };
    const visibility = () => {
      if (document.hidden) blur();
    };
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearInput();
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", visibility);
      element.close();
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [clearInput, pause, start]);

  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      previous = 0,
      lastUI = 0;
    function tick(now: number) {
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      const before = game.current;
      let x = 0,
        y = 0;
      for (const direction of held.current.values()) {
        if (direction === "left") x -= 1;
        if (direction === "right") x += 1;
        if (direction === "up") y -= 1;
        if (direction === "down") y += 1;
      }
      x = Math.sign(x);
      y = Math.sign(y);
      if (!x && !y && pointer.current) {
        const dx = pointer.current.x - before.x,
          dy = pointer.current.y - before.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 3) {
          const strength = Math.min(1, distance / 35);
          x = (dx / distance) * strength;
          y = (dy / distance) * strength;
        }
      }
      const next = document.hidden
        ? before
        : stepDeliveryGame(before, { x, y }, dt);
      game.current = next;
      if (next.eventId !== before.eventId) {
        if (next.event === "delivery") {
          const count = next.delivered.length;
          progressCallback.current(count);
          setAnnouncement(
            TARGETS.find((target) => target.id === next.lastDelivery)?.name +
              " is lit. " +
              count +
              " of " +
              TARGETS.length +
              " letters delivered.",
          );
          if (count > record.current) {
            record.current = count;
            setBest(count);
            try {
              localStorage.setItem(RECORD_KEY, String(count));
            } catch {
              /* The game also works without browser storage. */
            }
          }
        } else if (next.event === "pickup") {
          setAnnouncement(
            "Letter collected. Next stop: " +
              TARGETS[next.targetIndex].name +
              ".",
          );
        } else if (next.event === "bump") {
          setAnnouncement(
            "Antenna bump. Five percent of battery lost. Keep flying.",
          );
        }
      }
      if (next.phase !== before.phase) {
        clearInput();
        if (next.phase === "won")
          setAnnouncement(
            "All six windows are lit. A good night for everyone.",
          );
        if (next.phase === "lost")
          setAnnouncement(
            "Battery empty. " +
              next.delivered.length +
              " letters delivered. Ready for another flight?",
          );
      }
      drawDeliveryGame(context!, next, media.matches);
      if (
        now - lastUI > 80 ||
        next.phase !== before.phase ||
        next.eventId !== before.eventId
      ) {
        setView(next);
        lastUI = now;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [clearInput]);

  function pointAt(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      id: event.pointerId,
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    };
  }
  function releasePointer(event: PointerEvent<HTMLCanvasElement>) {
    if (pointer.current?.id === event.pointerId) pointer.current = null;
  }
  function holdDirection(
    event: PointerEvent<HTMLButtonElement>,
    direction: FlightDirection,
  ) {
    if (event.button !== 0 || game.current.phase !== "playing") return;
    event.preventDefault();
    pointer.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    held.current.set("pointer:" + event.pointerId, direction);
  }
  const flying = view.phase === "playing";
  const finished = view.phase === "won" || view.phase === "lost";
  const target = TARGETS[view.targetIndex];
  const batteryLevel = Math.max(0, Math.min(100, (view.remaining / DURATION) * 100));
  const batteryPercent = Math.ceil(batteryLevel);
  return (
    <dialog
      ref={dialog}
      className={`night-post np-${view.phase}`}
      aria-labelledby="np-title"
      aria-describedby="np-instructions"
      data-phase={view.phase}
      data-deliveries={view.delivered.length}
      data-drone-x={Math.round(view.x)}
      data-drone-y={Math.round(view.y)}
      data-carrying={view.carrying}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className="np-header">
        <div className="np-title-block">
          <span className="np-stamp" aria-hidden="true">
            ✉
          </span>
          <div>
            <p>THE WINDOW / AFTER HOURS</p>
            <h2 id="np-title">Night Post</h2>
          </div>
        </div>
        <button
          className="np-close"
          onClick={onClose}
          aria-label="Close Night Post and return to the room"
        >
          ×<small>ESC</small>
        </button>
      </header>
      <div className="np-window-frame">
        <div className="np-flight-hud">
          <div className="np-route">
            <span className="np-live-light" />
            {view.phase === "ready"
              ? "LOCAL DELIVERY SERVICE"
              : view.phase === "won"
                ? "EVERY WINDOW, A GOOD NIGHT"
                : view.carrying
                  ? "TO: " + target.name
                  : "RETURN TO: POST DOCK"}
          </div>
          <div
            className={`np-battery ${batteryLevel <= 25 ? "np-battery-low" : ""}`}
            aria-label={batteryPercent + " percent battery remaining"}
          >
            <span className="np-battery-icon">
              <i style={{ width: batteryLevel + "%" }} />
            </span>
            <strong>
              {batteryPercent}
              <small>%</small>
            </strong>
          </div>
        </div>
        <div className="np-glass">
          <canvas
            ref={canvas}
            width={WIDTH}
            height={HEIGHT}
            tabIndex={0}
            role="application"
            aria-label="Night Post flight area"
            aria-describedby="np-instructions"
            onPointerDown={(event) => {
              if (event.button !== 0 || !flying || pointer.current) return;
              event.preventDefault();
              event.currentTarget.focus({ preventScroll: true });
              event.currentTarget.setPointerCapture(event.pointerId);
              pointer.current = pointAt(event);
            }}
            onPointerMove={(event) => {
              if (pointer.current?.id === event.pointerId)
                pointer.current = pointAt(event);
            }}
            onPointerUp={releasePointer}
            onPointerCancel={releasePointer}
            onLostPointerCapture={releasePointer}
          >
            A pixel-art city. Fly to the green outlined balcony, hover to
            deliver, then return to the POST dock for the next letter.
          </canvas>
          {view.phase === "ready" && (
            <div className="np-window-cross" aria-hidden="true">
              <i />
              <i />
            </div>
          )}
          {(view.phase === "ready" || view.phase === "paused" || finished) && (
            <div className="np-overlay">
              <div className="np-flight-card">
                <span className="np-card-eyebrow">
                  {view.phase === "ready"
                    ? "ONE COURIER. SIX GOOD NIGHTS."
                    : view.phase === "paused"
                      ? "PARKED IN THE MOONLIGHT"
                      : view.phase === "won"
                        ? "ROUTE COMPLETE / 06 OF 06"
                        : "TIME TO RECHARGE"}
                </span>
                <h3>
                  {view.phase === "ready"
                    ? "A little light, delivered."
                    : view.phase === "paused"
                      ? "Take a breath."
                      : view.phase === "won"
                        ? "The city says thanks."
                        : "Even robots need a rest."}
                </h3>
                <p>
                  {view.phase === "ready"
                    ? "Fly to the glowing balcony. Hover to deliver. Return to POST for your next letter."
                    : view.phase === "paused"
                      ? "Your letters and battery will be right here."
                      : view.phase === "won"
                        ? "Six warm windows. Six letters home. A lovely night’s work."
                        : `${view.delivered.length} of 6 windows lit. The next flight is yours.`}
                </p>
                <button
                  ref={startButton}
                  className="np-primary"
                  onClick={() => (view.phase === "paused" ? pause() : start())}
                >
                  {view.phase === "ready"
                    ? "Start the night shift"
                    : view.phase === "paused"
                      ? "Resume flight"
                      : "Fly again"}
                  <span aria-hidden="true">→</span>
                </button>
                {view.phase === "ready" && (
                  <small>60 seconds · WASD / arrows · touch to steer</small>
                )}
              </div>
            </div>
          )}
          {flying && view.dockProgress > 0 && (
            <div className="np-docking">
              <span>{view.carrying ? "Delivering…" : "Picking up…"}</span>
              <i style={{ width: view.dockProgress * 100 + "%" }} />
            </div>
          )}
        </div>
        <div className="np-window-sill">
          <div
            className="np-delivery-count"
            aria-label={`${view.delivered.length} of ${TARGETS.length} windows lit`}
          >
            {TARGETS.map((item) => (
              <span
                key={item.id}
                className={
                  view.delivered.includes(item.id) ? "np-window-lit" : ""
                }
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
                <i />
              </span>
            ))}
            <strong>
              {view.delivered.length}
              <small> / {TARGETS.length} lit</small>
            </strong>
          </div>
          <span className="np-record">
            BEST {best}/{TARGETS.length}
          </span>
        </div>
      </div>
      <footer className="np-controls">
        <p id="np-instructions">
          <span>
            <kbd>WASD</kbd> / <kbd>↑↓←→</kbd> fly <b>·</b> hold a point to steer
          </span>
          <small>
            Hover at the green beacon. Avoid antennas. <kbd>P</kbd> pause.
          </small>
        </p>
        <button
          className="np-pause"
          onClick={() => pause()}
          disabled={!flying && view.phase !== "paused"}
          aria-label={
            view.phase === "paused" ? "Resume flight" : "Pause flight"
          }
        >
          {view.phase === "paused" ? "▶" : "Ⅱ"}
        </button>
        <div className="np-dpad" aria-label="Drone touch controls">
          {(["up", "left", "down", "right"] as const).map((direction) => (
            <button
              key={direction}
              className={`np-fly-${direction}`}
              aria-label={"Fly " + direction}
              disabled={!flying}
              onPointerDown={(event) => holdDirection(event, direction)}
              onPointerUp={(event) =>
                held.current.delete("pointer:" + event.pointerId)
              }
              onPointerCancel={(event) =>
                held.current.delete("pointer:" + event.pointerId)
              }
              onLostPointerCapture={(event) =>
                held.current.delete("pointer:" + event.pointerId)
              }
              onKeyDown={(event) => {
                if ((event.key === " " || event.key === "Enter") && flying) {
                  event.preventDefault();
                  held.current.set(
                    "button:" + (event.code || event.key.toLowerCase()),
                    direction,
                  );
                }
              }}
              onKeyUp={(event) =>
                held.current.delete(
                  "button:" + (event.code || event.key.toLowerCase()),
                )
              }
            >
              {{ up: "↑", left: "←", down: "↓", right: "→" }[direction]}
            </button>
          ))}
        </div>
      </footer>
      <p className="pr-sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </dialog>
  );
}
