import "./character.css";

export type CharacterDirection = "up" | "down" | "left" | "right";
export type CharacterPose = "standing" | "seating" | "seated" | "exiting";

export interface CharacterSpriteProps {
  x: number;
  y: number;
  direction: CharacterDirection;
  moving: boolean;
  pose?: CharacterPose;
}

/** A 44 × 66 pixel-grid robot, positioned by the midpoint between its feet. */
export default function CharacterSprite({
  x,
  y,
  direction,
  moving,
  pose = "standing",
}: CharacterSpriteProps) {
  const facing = pose === "standing" ? direction : "up";
  const side = facing === "left" || facing === "right";
  const back = facing === "up";

  return (
    <g
      className={`pr-character${moving && pose === "standing" ? " pr-character-moving" : ""}`}
      transform={`translate(${Math.round(x)} ${Math.round(y)})`}
      data-direction={facing}
      data-pose={pose}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path
        className="pr-character-shadow"
        d="M-17-3H17V-1H22V3H16V5H-16V3H-22V-1H-17Z"
        fill="#14283e"
        opacity=".34"
      />
      <g transform={facing === "right" ? "scale(-1 1)" : undefined}>
        {side ? (
          <>
            <g className="pr-character-step pr-character-step-back">
              <rect
                className="pr-character-leg"
                x="4"
                y="-16"
                width="8"
                height="14"
                fill="#526d79"
              />
              <g className="pr-character-foot">
                <path d="M1-5H13V0H-2V-3H1Z" fill="#20364d" />
                <rect x="1" y="-5" width="8" height="2" fill="#71908b" />
              </g>
            </g>
            <g className="pr-character-step pr-character-step-front">
              <rect
                className="pr-character-leg"
                x="-9"
                y="-16"
                width="9"
                height="14"
                fill="#758e91"
              />
              <g className="pr-character-foot">
                <path d="M-13-5H1V0H-16V-3H-13Z" fill="#20364d" />
                <rect x="-13" y="-5" width="9" height="2" fill="#adc1af" />
              </g>
            </g>
          </>
        ) : (
          <>
            <g className="pr-character-step pr-character-step-front">
              <rect
                className="pr-character-leg"
                x="-12"
                y="-16"
                width="8"
                height="13"
                fill="#69838a"
              />
              <g className="pr-character-foot">
                <rect x="-15" y="-5" width="13" height="5" fill="#20364d" />
                <rect x="-13" y="-5" width="9" height="2" fill="#a3b5a6" />
              </g>
            </g>
            <g className="pr-character-step pr-character-step-back">
              <rect
                className="pr-character-leg"
                x="5"
                y="-16"
                width="8"
                height="13"
                fill="#69838a"
              />
              <g className="pr-character-foot">
                <rect x="3" y="-5" width="13" height="5" fill="#20364d" />
                <rect x="5" y="-5" width="9" height="2" fill="#a3b5a6" />
              </g>
            </g>
          </>
        )}

        <g className="pr-character-upper">
          {/* The compact copper antenna is visible from every direction. */}
          <rect x="-2" y="-62" width="4" height="10" fill="#b6c8b7" />
          <rect x="-5" y="-66" width="10" height="5" fill="#e5a685" />
          <rect x="-3" y="-66" width="3" height="2" fill="#f5d7ad" />

          {side ? (
            <>
              <rect x="-11" y="-34" width="24" height="22" fill="#aebdb0" />
              <rect x="7" y="-31" width="6" height="17" fill="#7e9993" />
              <rect x="-8" y="-30" width="14" height="14" fill="#8fa99f" />
              <path d="M-17-53H14V-49H19V-36H-21V-49H-17Z" fill="#d2d6bb" />
              <rect x="-21" y="-48" width="15" height="9" fill="#2b4d59" />
              <rect x="-18" y="-46" width="5" height="5" fill="#c1ddb7" />
              <rect x="-21" y="-39" width="10" height="3" fill="#a5b8a7" />
              <rect x="10" y="-47" width="7" height="7" fill="#9db4a5" />
              <rect x="12" y="-45" width="3" height="3" fill="#6d8d8c" />
              <g className="pr-character-arm">
                <rect x="-4" y="-31" width="9" height="17" fill="#bfd0bc" />
                <rect x="-4" y="-17" width="9" height="5" fill="#88a39b" />
                <rect x="-2" y="-28" width="3" height="7" fill="#d7ddc0" />
              </g>
            </>
          ) : (
            <>
              <rect x="-16" y="-35" width="32" height="23" fill="#c4ccba" />
              <rect
                x="-12"
                y="-31"
                width="24"
                height="15"
                fill={back ? "#92a89f" : "#94afa3"}
              />
              {back ? (
                <>
                  <rect x="-7" y="-29" width="15" height="3" fill="#58767d" />
                  <rect x="-7" y="-23" width="15" height="3" fill="#58767d" />
                  <rect x="-12" y="-16" width="24" height="3" fill="#a8bcb0" />
                </>
              ) : (
                <>
                  <rect x="-5" y="-28" width="10" height="9" fill="#ce9179" />
                  <rect x="-2" y="-26" width="4" height="4" fill="#eed1a4" />
                  <rect x="8" y="-18" width="3" height="2" fill="#507c75" />
                </>
              )}
              <g className="pr-character-arm pr-character-arm-left">
                <rect x="-22" y="-31" width="6" height="17" fill="#93ada2" />
                <rect x="-22" y="-17" width="6" height="4" fill="#c0ceba" />
              </g>
              <g className="pr-character-arm pr-character-arm-right">
                <rect x="16" y="-31" width="6" height="17" fill="#93ada2" />
                <rect x="16" y="-17" width="6" height="4" fill="#c0ceba" />
              </g>
              <path d="M-17-54H17V-49H22V-36H-22V-49H-17Z" fill="#d7d9be" />
              <rect x="-15" y="-54" width="27" height="3" fill="#e5e5c9" />
              {back ? (
                <>
                  <rect x="-15" y="-47" width="30" height="9" fill="#a6b9aa" />
                  <rect x="-8" y="-44" width="16" height="3" fill="#819f98" />
                  <rect x="-20" y="-44" width="3" height="6" fill="#73918b" />
                  <rect x="17" y="-44" width="3" height="6" fill="#73918b" />
                </>
              ) : (
                <>
                  <rect x="-16" y="-49" width="32" height="10" fill="#2d5060" />
                  <g className="pr-character-eyes" fill="#c0dcb4">
                    <rect x="-11" y="-46" width="5" height="4" />
                    <rect x="7" y="-46" width="5" height="4" />
                  </g>
                  <rect x="-3" y="-41" width="7" height="2" fill="#719e98" />
                </>
              )}
            </>
          )}
        </g>
      </g>
    </g>
  );
}
