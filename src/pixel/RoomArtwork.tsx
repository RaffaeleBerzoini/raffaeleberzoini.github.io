import { useId } from "react";
import "./room-ambience.css";
import JourneyPostits from "./JourneyPostits";
import { SleepingTabby } from "./TabbyCats";

type RoomTopic = "projects" | "research" | "profile" | "contact";

const TERMINAL_TOPICS: {
  id: RoomTopic;
  title: string;
  lines: [string, string];
}[] = [
  {
    id: "projects",
    title: "> PROJECTS",
    lines: ["MuseMind + NERONE", "build / explore"],
  },
  {
    id: "research",
    title: "> RESEARCH",
    lines: ["imaging + edge AI", "4 papers / IEEE"],
  },
  {
    id: "profile",
    title: "> JOURNEY",
    lines: ["Polimi > systems", "learn. build. repeat."],
  },
  {
    id: "contact",
    title: "> CONNECT",
    lines: ["github / linkedin", "musemind.it"],
  },
];

/** Only the chair back and seat, for compositing in front of a seated visitor. */
export function ChairForeground() {
  return (
    <g
      className="pr-chair-foreground"
      shapeRendering="crispEdges"
      aria-hidden="true"
      pointerEvents="none"
    >
      <path d="M230 363H276V369H283V398H223V369H230Z" fill="#26334c" />
      <rect x="230" y="363" width="46" height="29" fill="#729792" />
      <rect x="234" y="367" width="38" height="3" fill="#8caaa1" />
      <rect x="224" y="399" width="60" height="12" fill="#597f80" />
      <rect x="230" y="399" width="48" height="3" fill="#88a49a" />
      <rect x="231" y="411" width="46" height="8" fill="#365669" />
    </g>
  );
}

function TerminalScreen({ activeTopic }: { activeTopic?: RoomTopic | null }) {
  const topics = activeTopic
    ? TERMINAL_TOPICS.filter((topic) => topic.id === activeTopic)
    : TERMINAL_TOPICS;
  return (
    <g className="pr-terminal-display">
      {topics.map((topic) => (
        <g
          key={topic.id}
          className={`pr-terminal-topic pr-terminal-${topic.id} ${activeTopic ? "pr-terminal-fixed" : "pr-terminal-cycle"}`}
        >
          <text x="214" y="207" className="pr-terminal-heading">
            {topic.title}
          </text>
          <g className="pr-terminal-type-line pr-terminal-type-first">
            <text x="214" y="221" className="pr-terminal-reference">
              {topic.lines[0]}
            </text>
          </g>
          <g className="pr-terminal-type-line pr-terminal-type-second">
            <text
              x="214"
              y="233"
              className="pr-terminal-reference pr-terminal-reference-muted"
            >
              {topic.lines[1]}
            </text>
          </g>
        </g>
      ))}
      <path
        d="M214 244H225V247H214ZM229 244H250V247H229ZM254 244H271V247H254Z"
        fill="#436e6b"
      />
      <rect
        className="pr-screen-cursor"
        x="277"
        y="241"
        width="4"
        height="7"
        fill="#d0bd83"
      />
      <rect x="207" y="250" width="102" height="1" fill="#355952" />
    </g>
  );
}

/** Furnished world artwork, with its left wall extended into the journey nook.
 * The viewport/camera and interactive objects are owned by the game scene.
 */
export default function RoomArtwork({
  activeTopic,
  ambientEnabled = true,
}: {
  activeTopic?: RoomTopic | null;
  ambientEnabled?: boolean;
}) {
  const patternId = useId().replaceAll(":", "");
  return (
    <g
      className="pr-room-artwork"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`${patternId}-floor`}
          width="96"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <rect width="96" height="40" fill="#46546e" />
          <path
            d="M0 0H96V3H0ZM0 20H96V23H0ZM24 0H27V20H24ZM72 20H75V40H72Z"
            fill="#394660"
          />
          <path d="M3 6H46V8H3ZM34 28H66V30H34Z" fill="#52617b" />
        </pattern>
        <pattern
          id={`${patternId}-wall`}
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <rect width="80" height="80" fill="#293a57" />
          <rect x="0" y="0" width="3" height="80" fill="#30425f" />
          <rect x="0" y="0" width="80" height="3" fill="#30425f" />
        </pattern>
      </defs>

      <path d="M-142 109H854V586H831V609H-109V586H-142Z" fill="#0e1424" />
      <path d="M-154 88H842V556H819V579H-131V556H-154Z" fill="#18243d" />
      <rect
        x="-138"
        y="102"
        width="964"
        height="245"
        fill={`url(#${patternId}-wall)`}
      />
      <rect
        x="-138"
        y="347"
        width="964"
        height="211"
        fill={`url(#${patternId}-floor)`}
      />
      {/* Cool moonlight falls across the boards, in small square pools. */}
      <path
        d="M413 356H480V362H491V385H424V379H413ZM501 356H566V362H577V385H512V379H501ZM433 393H500V400H511V420H444V414H433ZM521 393H586V400H597V420H532V414H521Z"
        fill="#a0b6ba"
        opacity=".10"
      />
      <path
        d="M323 477H346V480H323ZM664 492H698V495H664ZM178 521H199V524H178ZM729 529H759V532H729ZM104 462H121V465H104Z"
        fill="#7c8c9a"
        opacity=".4"
      />
      <rect x="-138" y="336" width="964" height="13" fill="#182c48" />
      <rect x="-138" y="349" width="964" height="6" fill="#627288" />
      <rect x="-138" y="556" width="964" height="12" fill="#293850" />
      <rect x="826" y="102" width="16" height="454" fill="#35465e" />
      <rect x="-154" y="88" width="996" height="14" fill="#596b84" />
      <rect x="-154" y="102" width="16" height="454" fill="#405371" />

      {/* A little night sky, entirely drawn on the pixel grid. */}
      <rect x="397" y="123" width="205" height="194" fill="#152238" />
      <rect x="389" y="115" width="205" height="194" fill="#d9b7a0" />
      <rect x="397" y="123" width="189" height="178" fill="#0e1a33" />
      <rect x="405" y="131" width="173" height="162" fill="#14213b" />
      <rect x="405" y="241" width="173" height="52" fill="#20314d" />
      <path
        d="M405 262H422V247H447V270H462V253H488V266H508V235H530V259H558V246H578V293H405Z"
        fill="#283f5d"
      />
      <path
        d="M405 278H433V266H458V281H480V270H502V285H542V270H578V293H405Z"
        fill="#354d65"
      />
      <path
        d="M531 148H551V153H559V173H551V181H531V173H523V153H531Z"
        fill="#f2e6bd"
      />
      <path
        d="M542 148H551V153H559V173H551V179H542V174H548V156H542Z"
        fill="#bdbfbe"
      />
      <g className="pr-stars">
        <path
          d="M427 146H431V150H427ZM462 170H466V174H462ZM560 214H564V218H560ZM419 214H423V218H419ZM509 204H513V208H509Z"
          fill="#e7dac2"
        />
        <path
          d="M469 136H473V140H477V144H473V148H469V144H465V140H469Z"
          fill="#91c2c1"
        />
        <rect x="549" y="192" width="3" height="3" fill="#91c2c1" />
      </g>
      <g className="pr-meteor" opacity=".55">
        <path
          d="M443 179H447V183H443ZM447 175H451V179H447ZM451 171H455V175H451Z"
          fill="#7898a8"
        />
        <rect x="455" y="167" width="4" height="4" fill="#dae8cf" />
      </g>
      <rect x="489" y="123" width="8" height="178" fill="#b88f83" />
      <rect x="397" y="211" width="189" height="8" fill="#b88f83" />
      <rect x="381" y="301" width="221" height="12" fill="#e6c7a9" />
      <rect x="381" y="313" width="221" height="7" fill="#94777a" />

      {/* The journey nook: a bigger corkboard, safely clear of the computer. */}
      <g className="pr-journey-board">
        <rect x="-98" y="147" width="165" height="180" fill="#17263e" />
        <rect x="-105" y="140" width="165" height="180" fill="#cba087" />
        <rect x="-105" y="140" width="165" height="5" fill="#e0b794" />
        <rect x="-100" y="145" width="155" height="170" fill="#967b67" />
        <rect x="-98" y="147" width="151" height="166" fill="#876d60" />
        <path
          d="M-91 181H47V183H-91ZM-91 244H47V246H-91ZM-91 307H47V309H-91ZM-94 171H-92V299H-94ZM46 173H48V301H46Z"
          fill="#9a7e68"
        />
        <rect x="-82" y="152" width="120" height="25" fill="#5b5653" />
        <rect x="-78" y="155" width="112" height="18" fill="#344c52" />
        <text x="-22" y="168" textAnchor="middle" className="pr-journey-sign">
          JOURNEY
        </text>
        <path
          d="M-70 212H-2V270H13M-62 273H-9"
          fill="none"
          stroke="#be8c79"
          strokeWidth="2"
        />
        <path
          d="M-67 185H-54V192H-67ZM5 185H10V190H5ZM-65 247H-59V253H-65ZM-3 237H13V243H-3Z"
          fill="#c08270"
        />
        <path
          d="M-101 144H-97V148H-101ZM52 144H56V148H52ZM-101 312H-97V316H-101ZM52 312H56V316H52Z"
          fill="#e8c6a0"
        />
      </g>

      {/* Warm task light. */}
      <path d="M337 267H344V302H365V308H328V302H337Z" fill="#8a9aa2" />
      <path d="M340 267H347V230H370V223H340Z" fill="#abb9b7" />
      <path d="M363 215H389V222H396V237H356V222H363Z" fill="#df9b7d" />
      <rect x="362" y="237" width="28" height="5" fill="#f5dfac" />
      <path
        className="pr-lamp-light"
        d="M363 242H389L415 314H335Z"
        fill="#f5d28e"
        opacity=".075"
      />
      <path
        d="M350 307H400V310H407V313H342V310H350Z"
        fill="#f5d28e"
        opacity=".18"
      />

      {/* Computer desk. */}
      <rect x="161" y="365" width="263" height="76" fill="#2f3b52" />
      <rect x="164" y="326" width="20" height="114" fill="#a88275" />
      <rect x="394" y="326" width="18" height="114" fill="#a88275" />
      <rect x="164" y="434" width="26" height="8" fill="#25334c" />
      <rect x="388" y="434" width="30" height="8" fill="#25334c" />
      <rect x="149" y="313" width="279" height="15" fill="#e0ba95" />
      <rect x="149" y="328" width="279" height="9" fill="#a17e74" />
      <rect x="341" y="343" width="57" height="53" fill="#8f7770" />
      <rect x="347" y="350" width="45" height="14" fill="#af8e7c" />
      <rect x="347" y="370" width="45" height="19" fill="#af8e7c" />
      <rect x="364" y="353" width="12" height="4" fill="#485365" />
      <rect x="364" y="375" width="12" height="4" fill="#485365" />
      <rect x="250" y="276" width="31" height="26" fill="#9aafa9" />
      <rect x="235" y="300" width="61" height="8" fill="#c6cfbc" />
      <path
        d="M207 184H325V191H332V274H325V281H207V274H200V191H207Z"
        fill="#142235"
      />
      <path
        d="M199 179H317V186H324V269H317V276H199V269H192V186H199Z"
        fill="#c7cbbb"
      />
      <rect x="201" y="188" width="114" height="73" fill="#28464c" />
      <rect x="207" y="194" width="102" height="61" fill="#163b42" />
      <TerminalScreen activeTopic={activeTopic} />
      <rect x="251" y="265" width="9" height="4" fill="#718e87" />
      <path d="M217 306H304V311H311V317H210V311H217Z" fill="#d6d0b8" />
      <path
        d="M223 310H228V313H223ZM233 310H238V313H233ZM243 310H248V313H243ZM253 310H258V313H253ZM263 310H268V313H263ZM273 310H278V313H273ZM283 310H288V313H283Z"
        fill="#969b90"
      />
      <rect x="164" y="289" width="21" height="24" fill="#d69078" />
      <path d="M185 293H193V307H185V302H188V298H185Z" fill="#d69078" />
      <rect x="167" y="286" width="15" height="5" fill="#5f514f" />
      <path
        className="pr-coffee-steam"
        d="M171 278V269H175V262"
        fill="none"
        stroke="#d7ccba"
        strokeWidth="3"
        opacity=".55"
      />

      {/* Chair. */}
      <rect x="249" y="370" width="12" height="76" fill="#25314c" />
      <ChairForeground />
      <path d="M224 448H247V440H263V448H287V454H224Z" fill="#26334c" />
      <rect x="223" y="454" width="10" height="7" fill="#17263d" />
      <rect x="277" y="454" width="10" height="7" fill="#17263d" />

      {/* A whole shelf of ideas. */}
      <rect x="658" y="224" width="134" height="223" fill="#1b2a43" />
      <rect x="645" y="213" width="135" height="223" fill="#9b7c70" />
      <rect x="655" y="223" width="115" height="203" fill="#514e58" />
      <rect x="655" y="279" width="115" height="10" fill="#c0a18b" />
      <rect x="655" y="350" width="115" height="10" fill="#c0a18b" />
      <rect x="645" y="426" width="135" height="10" fill="#c0a18b" />
      <rect x="650" y="436" width="11" height="13" fill="#836e67" />
      <rect x="763" y="436" width="11" height="13" fill="#836e67" />
      <rect x="663" y="235" width="15" height="44" fill="#cf8f7e" />
      <rect x="680" y="240" width="11" height="39" fill="#cfbd92" />
      <g className="pr-shelf-book pr-shelf-book-green">
        <rect x="694" y="231" width="15" height="48" fill="#799e9c" />
        <path d="M696 241H707V244H696ZM697 267H706V269H697Z" fill="#f4dfb5" />
      </g>
      <rect x="711" y="243" width="12" height="36" fill="#8a9db7" />
      <g className="pr-shelf-book pr-shelf-book-coral">
        <path d="M731 240H743L756 276L744 279Z" fill="#cb917e" />
        <path d="M735 249H745V252H735Z" fill="#e7c49e" />
      </g>
      <path
        d="M665 244H676V247H665ZM682 249H689V252H682ZM713 252H721V255H713Z"
        fill="#f4dfb5"
      />
      <rect x="663" y="330" width="52" height="9" fill="#ccbea0" />
      <rect x="659" y="340" width="61" height="10" fill="#7a9a9b" />
      <rect x="668" y="319" width="48" height="11" fill="#ce8e7b" />
      <g className="pr-shelf-trinket">
        <rect x="683" y="314" width="22" height="5" fill="#b8bea6" />
        <rect x="692" y="298" width="4" height="16" fill="#809c98" />
        <path
          d="M680 301H708V304H680ZM683 296H687V309H683ZM702 296H706V309H702Z"
          fill="#a0b6a5"
        />
        <rect x="689" y="297" width="10" height="10" fill="#d1ad79" />
        <rect x="692" y="300" width="4" height="4" fill="#efd1a2" />
        <g className="pr-trinket-orbit">
          <rect x="704" y="297" width="5" height="5" fill="#a9c0bb" />
          <rect x="704" y="297" width="2" height="2" fill="#dfddbb" />
        </g>
      </g>
      <rect x="735" y="303" width="24" height="47" fill="#adad99" />
      <rect x="740" y="310" width="14" height="13" fill="#6a7d80" />
      <rect x="738" y="332" width="18" height="4" fill="#d8d0b4" />
      <rect x="664" y="380" width="37" height="46" fill="#899dab" />
      <rect x="669" y="387" width="27" height="16" fill="#c8cfbd" />
      <rect x="674" y="392" width="17" height="3" fill="#7c8d91" />
      <rect x="711" y="395" width="52" height="31" fill="#c1a58a" />
      <rect x="711" y="389" width="52" height="7" fill="#ddc3a0" />
      <rect x="729" y="402" width="17" height="7" fill="#846e6a" />
      <SleepingTabby />

      {/* Leave a little floor space for the cat to reach the lower notes. */}
      <g transform="translate(-203 108) scale(.75)">
        <rect x="104" y="426" width="43" height="9" fill="#334259" />
        <path d="M109 391H147V411H141V426H115V411H109Z" fill="#c7856f" />
        <rect x="105" y="385" width="46" height="10" fill="#dfa28a" />
        <rect x="124" y="335" width="6" height="50" fill="#789e88" />
        <path
          d="M119 355H105V348H96V335H109V340H119ZM131 343H143V331H154V320H140V327H131ZM121 374H104V366H94V354H108V360H121ZM131 366H146V357H158V345H145V352H131Z"
          fill="#86b496"
        />
        <path d="M121 344H112V331H117V317H125V330H129V344Z" fill="#acd0a2" />
        <rect x="125" y="378" width="5" height="7" fill="#557e79" />
      </g>

      {/* A woven rug. The player is drawn in its own layer. */}
      <path
        d="M378 454H616V465H627V533H616V544H378V533H367V465H378Z"
        fill="#36465e"
      />
      <rect x="380" y="461" width="234" height="73" fill="#ba806f" />
      <rect x="389" y="469" width="216" height="57" fill="#d79d80" />
      <rect x="398" y="478" width="198" height="39" fill="#bc8473" />
      <path
        d="M405 482H416V490H425V482H436V491H427V501H418V511H407V502H414V493H405ZM561 482H572V490H581V482H592V491H583V501H574V511H563V502H570V493H561Z"
        fill="#e4b692"
      />
      <path
        d="M373 469H380V476H373ZM373 483H380V490H373ZM373 497H380V504H373ZM373 511H380V518H373ZM614 469H621V476H614ZM614 483H621V490H614ZM614 497H621V504H614ZM614 511H621V518H614Z"
        fill="#d6aa89"
      />
      {/* Door to the internet: a small mailbox. */}
      <rect x="794" y="451" width="43" height="8" fill="#344057" />
      <rect x="809" y="389" width="10" height="63" fill="#bc9b83" />
      <path d="M790 350H831V357H838V392H783V357H790Z" fill="#cb8d79" />
      <rect x="788" y="362" width="45" height="24" fill="#e4b094" />
      <path d="M795 367H826V380H795ZM795 367L810 375L826 367" fill="#f0dbb6" />
      <path
        d="M795 367L810 375L826 367"
        fill="none"
        stroke="#b99784"
        strokeWidth="3"
      />
      <g className="pr-mailbox-flag">
        <rect x="834" y="336" width="5" height="27" fill="#e4bf9b" />
        <rect x="837" y="336" width="18" height="10" fill="#d68577" />
      </g>
      <g transform="translate(785 302)" className="pr-mail-courier-anchor">
        <g className="pr-mail-courier">
          <g className="pr-courier-thruster">
            <path
              d="M10 24H16V31H14V34H12V31H10ZM24 24H30V31H28V34H26V31H24Z"
              fill="#7eafab"
            />
            <path d="M12 25H14V30H12ZM26 25H28V30H26Z" fill="#cad6bb" />
          </g>
          <rect x="18" y="-6" width="3" height="8" fill="#93b2ac" />
          <rect x="16" y="-9" width="7" height="5" fill="#d0a077" />
          <path d="M8 0H30V5H35V20H30V25H8V20H3V5H8Z" fill="#b7c8b1" />
          <rect x="8" y="5" width="22" height="12" fill="#355863" />
          <path d="M11 9H15V12H11ZM23 9H27V12H23Z" fill="#d6dfb4" />
          <path d="M17 14H22V16H17Z" fill="#87afa2" />
          <rect x="11" y="21" width="16" height="4" fill="#7d9c96" />
          <rect x="-1" y="9" width="5" height="11" fill="#7e9f99" />
          <rect x="34" y="9" width="5" height="11" fill="#7e9f99" />
          <g className="pr-courier-envelope">
            <rect x="11" y="23" width="20" height="13" fill="#efdcaf" />
            <path
              d="M11 23H15V26H19V29H23V26H27V23H31V26H27V29H23V32H19V29H15V26H11Z"
              fill="#b89c7f"
            />
            <rect x="27" y="25" width="2" height="3" fill="#be8170" />
          </g>
        </g>
      </g>

      {/* Tiny wall details and a power cable. */}
      <g transform="translate(0 -28)">
        <rect x="662" y="142" width="86" height="40" fill="#17263e" />
        <rect x="657" y="137" width="86" height="40" fill="#bed0bd" />
        <rect x="663" y="143" width="74" height="28" fill="#385564" />
        <path
          d="M671 157H681V151H690V160H699V151H708V160H717V151H729"
          fill="none"
          stroke="#a9cbb2"
          strokeWidth="3"
        />
      </g>
      <path
        d="M328 288H334V349H320V360H309"
        fill="none"
        stroke="#15243c"
        strokeWidth="4"
      />
      <JourneyPostits enabled={ambientEnabled} />
    </g>
  );
}
