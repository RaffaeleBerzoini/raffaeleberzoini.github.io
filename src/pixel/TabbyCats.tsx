import "./tabby-cats.css";
import type { CatGaitSample, CatLegOffset } from "./cat-gait";

const restingPaw = { x: 0, y: 0, bend: 0 };
const restingGait: CatGaitSample = {
  frontNear: restingPaw,
  backNear: restingPaw,
  frontFar: restingPaw,
  backFar: restingPaw,
  bodyY: 0,
  headY: 0,
  tailAngle: 0,
};

const fur = {
  coat: "#949c94",
  light: "#c0c4b3",
  shade: "#73817a",
  stripe: "#52665e",
  outline: "#3a5150",
  muzzle: "#d0d0ba",
  ear: "#b79a93",
  nose: "#b88d86",
  eye: "#ced6a5",
};

/** Broad cheeks, a small muzzle and smiling lids keep the resting face soft. */
function CatFace({
  sleepy = false,
  threeQuarter = false,
  carrying = false,
}: {
  sleepy?: boolean;
  threeQuarter?: boolean;
  carrying?: boolean;
}) {
  const noseX = threeQuarter ? -4 : 0;
  const eyeCenters = threeQuarter ? [-11, 6] : [-10, 10];
  return (
    <g className={`pr-tabby-face ${sleepy ? "pr-tabby-face-sleepy" : ""}`}>
      <g className="pr-tabby-face-ear">
        <path d="M-21-8V-22H-18V-25H-15V-22H-11V-17H-7V-8Z" fill="#707c75" />
        <path d="M-19-9V-20H-16V-22H-14V-18H-11V-14H-9V-9Z" fill={fur.coat} />
        <path d="M-17-11V-18H-15V-19H-13V-15H-11V-11Z" fill="#cbaaa2" />
      </g>
      <g className="pr-tabby-face-ear-right">
        <path d="M8-8V-17H12V-22H16V-25H19V-22H22V-8Z" fill="#707c75" />
        <path d="M10-9V-14H13V-18H16V-22H18V-20H20V-9Z" fill={fur.coat} />
        <path d="M12-11V-15H14V-19H16V-18H18V-11Z" fill="#cbaaa2" />
      </g>
      <path
        d="M-12-17H12V-15H17V-12H21V-7H24V2H21V7H17V11H9V14H-9V11H-17V7H-21V2H-24V-7H-21V-12H-17V-15H-12Z"
        fill="#748179"
      />
      <path
        d="M-12-15H12V-13H17V-9H21V-5H22V1H19V6H15V9H8V12H-8V9H-15V6H-19V1H-22V-5H-21V-9H-17V-13H-12Z"
        fill="#b1b8ac"
      />
      <path d="M-10-14H9V-12H15V-9H18V-6H-18V-9H-15V-12H-10Z" fill="#c1c7b8" />
      {/* Small crown stripes end well above the eyes; no eyebrow-shaped markings. */}
      <path
        d="M-9-15H-6V-10H-9ZM-2-16H2V-10H-2ZM6-15H9V-10H6Z"
        fill="#8a998c"
      />
      <path
        d="M-22-5H-17V-2H-22ZM-20 2H-16V4H-20ZM17-5H22V-2H17ZM16 2H20V4H16Z"
        fill="#8b9a8d"
      />
      {/* Round pale cheek pads, with a few warm pixels below each eye. */}
      <path
        d="M-18 0H-7V3H-4V8H-9V10H-15V7H-19V3H-18ZM7 0H18V3H19V7H15V10H9V8H4V3H7Z"
        fill="#d6d9c7"
      />
      <path d="M-17 3H-12V5H-17ZM12 3H17V5H12Z" fill="#c8a9a0" opacity=".55" />
      {!sleepy && (
        <g className="pr-tabby-open-eyes">
          {eyeCenters.map((x, i) => (
            <g key={i} transform={`translate(${x} -3)`}>
              <path
                d="M-2-5H2V-4H4V-1H5V3H3V5H-3V3H-5V-1H-4V-4H-2Z"
                fill="#6b7c73"
              />
              <path d="M-2-4H2V-2H3V3H1V4H-2V2H-3V-2H-2Z" fill="#d5d6b0" />
              <path d="M-1-3H2V-1H3V2H1V3H-2V1H-3V-1H-1Z" fill="#485e58" />
              <rect x="-2" y="-3" width="3" height="3" fill="#f3edd4" />
              <rect x="1" y="2" width="1" height="1" fill="#d7ddbd" />
            </g>
          ))}
        </g>
      )}
      <g
        className={sleepy ? "pr-tabby-sleep-eyes" : "pr-tabby-blink-eyes"}
        fill="#65766d"
      >
        {eyeCenters.map((x, i) => (
          <path
            key={i}
            transform={`translate(${x} 0)`}
            d="M-6 1V-2H-4V-4H-1V-5H2V-4H4V-2H6V1H4V-1H2V-2H-2V-1H-4V1Z"
          />
        ))}
      </g>
      <path
        d={`M${noseX - 7} 5H${noseX - 2}V4H${noseX + 3}V5H${noseX + 7}V9H${noseX + 3}V11H${noseX - 3}V9H${noseX - 7}Z`}
        fill="#e1dfca"
      />
      <path
        d={`M${noseX - 2} 4H${noseX + 3}V6H${noseX + 1}V7H${noseX - 1}V6H${noseX - 2}Z`}
        fill="#bc9993"
      />
      <path
        d={
          carrying
            ? `M${noseX - 2} 7H${noseX + 2}V9H${noseX - 2}Z`
            : `M${noseX} 7H${noseX + 1}V9H${noseX + 3}V8H${noseX + 4}V9H${noseX + 3}V10H${noseX + 1}V9H${noseX - 1}V10H${noseX - 3}V9H${noseX - 4}V8H${noseX - 3}V9H${noseX}Z`
        }
        fill="#839183"
      />
      <path
        d="M-28 3H-18V4H-28ZM-26 7H-17V8H-26ZM18 3H28V4H18ZM17 7H26V8H17Z"
        fill="#d6d8c5"
      />
    </g>
  );
}
/** World-space sleeper. Round front-facing head, paws at y213, hanging tail to y255. */
export function SleepingTabby() {
  return (
    <g
      className="pr-sleeping-tabby"
      transform="translate(657 178)"
      shapeRendering="crispEdges"
      aria-hidden="true"
      pointerEvents="none"
    >
      <path d="M8 33H95V36H8Z" fill="#4c554e" opacity=".5" />
      <g className="pr-sleeping-tail">
        <path
          d="M87 20H96V26H101V49H105V65H102V72H96V77H86V72H93V67H96V49H93V31H87Z"
          fill={fur.outline}
        />
        <path
          d="M89 22H95V28H99V50H102V65H99V70H94V74H88V72H94V66H97V48H95V30H89Z"
          fill={fur.coat}
        />
        <path
          d="M95 34H99V38H95ZM96 45H100V49H96ZM98 56H102V60H98ZM96 67H101V71H96ZM86 72H94V77H86Z"
          fill={fur.stripe}
        />
      </g>
      <g className="pr-sleeping-breath">
        <path
          d="M35 10H45V5H72V8H83V13H90V20H94V28H90V33H31V29H26V21H30V14H35Z"
          fill={fur.outline}
        />
        <path
          d="M36 12H46V7H71V10H81V15H88V22H91V27H87V31H33V27H29V21H33V16H36Z"
          fill={fur.coat}
        />
        <path d="M39 12H48V10H68V12H78V15H82V18H39Z" fill={fur.light} />
        <path
          d="M42 9H48V18H44V23H40V17H42ZM56 7H62V16H58V21H54V15H56ZM70 10H76V18H72V23H68V17H70ZM82 16H88V23H84V28H80V23H82Z"
          fill={fur.stripe}
        />
        <path d="M32 25H40V28H82V25H90V29H86V32H33Z" fill={fur.shade} />
      </g>
      <path
        d="M23 29H45V32H50V35H22V33H18V30H23ZM69 29H89V32H94V35H72V33H68Z"
        fill={fur.light}
      />
      <path
        d="M29 32H31V35H29ZM36 32H38V35H36ZM81 32H83V35H81ZM87 32H89V35H87Z"
        fill={fur.shade}
      />
      <g
        className="pr-sleeping-front-head"
        transform="translate(23 22) rotate(8)"
      >
        <CatFace sleepy />
      </g>
    </g>
  );
}

/** World-independent bed. Origin is the kitten's feet; basket bounds x±40, y-14..14. */
export function CatBed() {
  return (
    <g
      className="pr-cat-bed"
      shapeRendering="crispEdges"
      aria-hidden="true"
      pointerEvents="none"
    >
      <path
        d="M-34-14H34V-11H39V-6H40V6H36V11H29V14H-29V11H-36V6H-40V-6H-39V-11H-34Z"
        fill="#66564c"
      />
      <path
        d="M-33-12H33V-9H37V-5H39V4H34V9H28V12H-28V9H-34V4H-38V-5H-37V-9H-33Z"
        fill="#ba9472"
      />
      <path
        d="M-29-10H29V-7H34V-3H36V2H31V6H-31V2H-35V-3H-33V-7H-29Z"
        fill="#d4ac82"
      />
      <path d="M-27-8H27V-5H32V0H27V4H-27V0H-32V-5H-27Z" fill="#7f9991" />
      <path d="M-23-6H23V-3H29V0H24V2H-24V0H-29V-3H-23Z" fill="#a3b7a2" />
      <path
        d="M-37 1H-32V5H-26V8H26V5H32V1H38V6H33V10H27V13H-27V10H-33V6H-37Z"
        fill="#c7a17c"
      />
      <path
        d="M-29 5H-26V11H-29ZM-18 8H-15V13H-18ZM-7 8H-4V13H-7ZM4 8H7V13H4ZM15 8H18V13H15ZM26 5H29V11H26Z"
        fill="#9d785f"
      />
      <path
        d="M-32 6H-27V8H-32ZM-24 10H24V12H-24ZM27 6H32V8H27Z"
        fill="#e0ba8d"
      />
    </g>
  );
}

export type HelperTabbyPose =
  "sleep" | "wake" | "walk" | "pickup" | "back" | "stand" | "settle";

function CurledKitten({ waking = false }: { waking?: boolean }) {
  return (
    <>
      <g className="pr-helper-curled-body">
        <path
          d="M-13-28H9V-25H18V-20H24V-11H21V-5H15V-2H-17V-5H-24V-14H-20V-22H-13Z"
          fill={fur.outline}
        />
        <path
          d="M-12-26H8V-23H16V-18H21V-11H18V-7H13V-4H-16V-7H-21V-14H-18V-21H-12Z"
          fill={fur.coat}
        />
        <path
          d="M-4-25H1V-17H-4ZM6-23H11V-15H6ZM15-18H20V-12H15Z"
          fill={fur.stripe}
        />
        <path d="M-2-11H12V-8H16V-5H-6V-8H-2Z" fill={fur.light} />
      </g>
      <g className="pr-helper-curled-tail">
        <path
          d="M18-12H25V-4H21V0H-6V-3H-13V-8H-7V-5H17V-7H18Z"
          fill={fur.outline}
        />
        <path
          d="M19-11H23V-5H20V-2H-5V-5H-10V-7H-6V-4H18V-7H19Z"
          fill={fur.coat}
        />
        <path d="M-6-5H-2V-1H-6ZM5-4H9V0H5ZM15-5H19V-1H15Z" fill={fur.stripe} />
      </g>
      <g className="pr-helper-rest-paws">
        <path d="M-25-5H-14V0H-25ZM-11-4H-3V0H-11Z" fill={fur.light} />
        <path d="M-22-2H-21V0H-22ZM-18-2H-17V0H-18Z" fill={fur.shade} />
      </g>
      <g
        className="pr-helper-rest-head"
        transform={`translate(-13 ${waking ? -22 : -17}) rotate(-6)`}
      >
        <g className="pr-helper-rest-head-motion">
          <CatFace sleepy={!waking} />
        </g>
      </g>
    </>
  );
}

/** Hips follow the torso; articulated knees connect to independently planted paws. */
function WalkingLeg({
  hipX,
  offset,
  bodyY,
  rear = false,
  far = false,
}: {
  hipX: number;
  offset: CatLegOffset;
  bodyY: number;
  rear?: boolean;
  far?: boolean;
}) {
  const hipY = -16 + bodyY;
  const footX = hipX - 3 + offset.x;
  const footY = offset.y;
  const kneeX =
    hipX + offset.x * 0.35 + (rear ? -2 - offset.bend : 1 + offset.bend);
  const kneeY = hipY * 0.48 + footY * 0.45;
  return (
    <g
      className={`pr-helper-leg pr-helper-leg-${far ? "far" : "near"}-${rear ? "back" : "front"}`}
    >
      <path
        d={`M${hipX - 3} ${hipY}H${hipX + 4}L${kneeX + 3} ${kneeY}L${footX + 3} ${footY - 2}H${footX - 3}L${kneeX - 3} ${kneeY}Z`}
        fill={far ? "#6c7b73" : fur.coat}
      />
      <path
        d={`M${kneeX - 3} ${kneeY - 1}L${footX - 3} ${footY - 2}H${footX - 1}L${kneeX - 1} ${kneeY - 1}Z`}
        fill={far ? "#596d65" : fur.shade}
      />
      <path
        className="pr-helper-paw"
        d={`M${footX - 5} ${footY - 3}H${footX + 3}V${footY - 1}H${footX + 2}V${footY}H${footX - 6}V${footY - 2}H${footX - 5}Z`}
        fill={far ? "#98a696" : "#cdd1bd"}
      />
      {!far && (
        <path
          d={`M${footX - 4} ${footY - 2}V${footY}H${footX - 3}V${footY - 2}Z`}
          fill={fur.shade}
        />
      )}
    </g>
  );
}

function WalkingKitten({
  pickup,
  carrying,
  gait,
}: {
  pickup: boolean;
  carrying: boolean;
  gait: CatGaitSample;
}) {
  const bodyY = pickup ? 3 : gait.bodyY;
  // The note attaches to (-18,-22); stabilize the mouth while it is held.
  const headY = carrying || pickup ? 0 : gait.bodyY + gait.headY;
  return (
    <>
      <g
        className="pr-helper-tail"
        transform={`translate(0 ${bodyY}) rotate(${pickup ? -6 : gait.tailAngle} 18 -10)`}
      >
        <path
          d="M16-9H22V-15H25V-26H21V-30H16V-27H20V-17H16Z"
          fill={fur.outline}
        />
        <path
          d="M18-10H21V-16H23V-25H20V-28H17V-27H21V-17H18Z"
          fill={fur.coat}
        />
        <path d="M20-22H24V-25H20ZM17-13H22V-16H17Z" fill={fur.stripe} />
      </g>
      <WalkingLeg hipX={-5} offset={gait.frontFar} bodyY={bodyY} far />
      <WalkingLeg hipX={15} offset={gait.backFar} bodyY={bodyY} far rear />
      <g className="pr-helper-walking-body" transform={`translate(0 ${bodyY})`}>
        <path
          d="M-11-28H4V-25H15V-21H21V-14H24V-8H18V-4H-9V-7H-15V-16H-13Z"
          fill={fur.outline}
        />
        <path
          d="M-10-26H3V-23H14V-19H19V-13H21V-9H16V-6H-8V-9H-12V-16H-11Z"
          fill={fur.coat}
        />
        <path d="M-10-19H-4V-11H6V-7H-8V-10H-12V-15H-10Z" fill={fur.light} />
        <path
          d="M-2-26H3V-17H-2ZM7-23H12V-14H7ZM15-18H21V-12H15Z"
          fill={fur.stripe}
        />
      </g>
      <WalkingLeg hipX={-10} offset={gait.frontNear} bodyY={bodyY} />
      <WalkingLeg hipX={15} offset={gait.backNear} bodyY={bodyY} rear />
      <g
        className="pr-helper-three-quarter-head"
        transform={`translate(-14 ${-30 + headY})`}
      >
        <CatFace threeQuarter carrying={carrying} />
      </g>
    </>
  );
}

function RearKitten({
  rise,
  reach,
  gait,
}: {
  rise: number;
  reach: number;
  gait: CatGaitSample;
}) {
  const r = Math.max(0, Math.min(1, Number.isFinite(rise) ? rise : 0));
  const extent = Math.max(
    60,
    Math.min(90, Number.isFinite(reach) ? reach : 70),
  );
  const extra = extent - 70;
  const shoulder = Math.round(-25 - r * (15 + extra * 0.55));
  const head = Math.round(-22 - r * (23 + extra * 0.72));
  const paw = -31 - r * (extent - 31);
  return (
    <>
      <g
        className="pr-helper-rear-tail"
        transform={`rotate(${gait.tailAngle} 12 -8)`}
      >
        <path
          d="M10-8H16V-5H20V-9H23V-18H27V-6H24V0H16V-3H10Z"
          fill={fur.outline}
        />
        <path
          d="M11-7H15V-3H20V-6H23V-15H25V-6H22V-2H17V-5H11Z"
          fill={fur.coat}
        />
        <path d="M22-10H26V-13H22ZM17-3H21V0H17Z" fill={fur.stripe} />
      </g>
      <WalkingLeg hipX={-7} offset={gait.backNear} bodyY={0} rear />
      <WalkingLeg hipX={13} offset={gait.backFar} bodyY={0} rear />
      <path
        d={`M-8 ${shoulder}H8V${shoulder + 4}H12V${Math.round((shoulder - 15) / 2)}H10V-18H14V-13H16V-7H11V-4H7V-3H-7V-4H-11V-7H-16V-13H-14V-18H-10V${Math.round((shoulder - 15) / 2)}H-12V${shoulder + 4}H-8Z`}
        fill={fur.outline}
      />
      <path
        d={`M-7 ${shoulder + 2}H7V${shoulder + 6}H10V${Math.round((shoulder - 15) / 2)}H8V-16H12V-12H14V-8H9V-6H5V-5H-5V-6H-9V-8H-14V-12H-12V-16H-8V${Math.round((shoulder - 15) / 2)}H-10V${shoulder + 6}H-7Z`}
        fill={fur.coat}
      />
      <path
        d={`M-2 ${shoulder + 4}H2V${Math.round((shoulder - 15) / 2) + 2}H-2ZM-2-17H2V-8H-2ZM-10 ${shoulder + 9}H-5V${shoulder + 13}H-10ZM5 ${shoulder + 9}H10V${shoulder + 13}H5ZM-12-15H-7V-11H-12ZM7-15H12V-11H7Z`}
        fill={fur.stripe}
      />
      <g className="pr-helper-reaching-paws">
        <path
          d={`M-12 ${shoulder + 8}H-7V${paw + 7}H-4V${paw}H-12V${paw + 8}H-15V${shoulder + 8}Z`}
          fill={fur.shade}
        />
        <path
          d={`M7 ${shoulder + 8}H12V${paw + 9}H15V${paw + 2}H6V${paw + 9}H7Z`}
          fill={fur.shade}
        />
        <path
          d={`M-12 ${paw}H-4V${paw + 6}H-12ZM6 ${paw + 1}H14V${paw + 7}H6Z`}
          fill={fur.light}
        />
        <path
          d={`M-9 ${paw + 1}H-8V${paw + 4}H-9ZM10 ${paw + 2}H11V${paw + 5}H10Z`}
          fill={fur.shade}
        />
      </g>
      <g
        className="pr-helper-back-head"
        transform={`translate(0 ${head}) scale(1.15)`}
      >
        <path
          d="M-16-7V-18H-12V-15H-8V-11H-5V-6ZM6-6V-12H9V-15H13V-18H17V-7Z"
          fill={fur.outline}
        />
        <path
          d="M-14-8V-14H-11V-11H-8V-7ZM9-7V-10H12V-14H15V-8Z"
          fill={fur.shade}
        />
        <path
          d="M-11-12H10V-9H15V-5H18V3H14V7H9V10H-9V7H-14V3H-18V-5H-14V-9H-11Z"
          fill={fur.outline}
        />
        <path
          d="M-10-10H9V-7H13V-3H16V2H12V5H8V8H-8V5H-12V2H-16V-3H-12V-7H-10Z"
          fill={fur.coat}
        />
        <path
          d="M-2-10H2V5H-2ZM-10-6H-6V0H-10ZM6-6H10V0H6ZM-13 2H-8V5H-13ZM8 2H13V5H8Z"
          fill={fur.stripe}
        />
      </g>
    </>
  );
}

/** Feet (0,0), left-facing three-quarter walk. Carry mouth (-18,-22).
 * Rear view never draws a face. At full rise its paws reach around (0,-reach),
 * while both hind feet stay on y0. Parent owns world motion and note position.
 */
export function HelperTabby({
  pose = "sleep",
  carrying = false,
  rise = 0,
  reach = 70,
  gait = restingGait,
}: {
  pose?: HelperTabbyPose;
  carrying?: boolean;
  rise?: number;
  reach?: number;
  gait?: CatGaitSample;
}) {
  return (
    <g
      className={`pr-helper-tabby pr-helper-${pose}${carrying ? " pr-helper-carrying" : ""}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      pointerEvents="none"
    >
      {pose === "sleep" || pose === "settle" ? (
        <CurledKitten />
      ) : pose === "wake" ? (
        <CurledKitten waking />
      ) : pose === "back" || pose === "stand" ? (
        <RearKitten
          rise={pose === "stand" ? rise : 0}
          reach={reach}
          gait={gait}
        />
      ) : (
        <WalkingKitten
          pickup={pose === "pickup"}
          carrying={carrying}
          gait={gait}
        />
      )}
    </g>
  );
}
