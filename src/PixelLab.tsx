import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { profile, links, projects, papers, experience } from "./data";
import "./pixel-lab.css";

type Section = "projects" | "research" | "profile" | "contact";

const sections: { id: Section; label: string; place: string; glyph: string }[] =
  [
    { id: "projects", label: "Projects", place: "The terminal", glyph: ">_" },
    { id: "research", label: "Research", place: "The bookshelf", glyph: "▤" },
    { id: "profile", label: "Journey", place: "The noticeboard", glyph: "⌑" },
    { id: "contact", label: "Connect", place: "The mailbox", glyph: "✉" },
  ];

function PixelRoom({
  active,
  onSelect,
  paused,
}: {
  active: Section;
  onSelect: (section: Section) => void;
  paused: boolean;
}) {
  const patternId = useId().replaceAll(":", "");
  const [robotMessage, setRobotMessage] = useState(0);
  const robotMessages = [
    "Every idea starts with a question.",
    "Try the terminal. There is plenty to explore.",
    "A little code. A lot of curiosity.",
  ];

  return (
    <div className={`pl-room ${paused ? "pl-room-paused" : ""}`}>
      <svg
        className="pl-room-art"
        viewBox="0 0 960 650"
        aria-hidden="true"
        shapeRendering="crispEdges"
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

        <path d="M78 109H854V586H831V609H111V586H78Z" fill="#0e1424" />
        <path d="M66 88H842V556H819V579H89V556H66Z" fill="#18243d" />
        <rect
          x="82"
          y="102"
          width="744"
          height="245"
          fill={`url(#${patternId}-wall)`}
        />
        <rect
          x="82"
          y="347"
          width="744"
          height="211"
          fill={`url(#${patternId}-floor)`}
        />
        <rect x="82" y="336" width="744" height="13" fill="#182c48" />
        <rect x="82" y="349" width="744" height="6" fill="#627288" />
        <rect x="82" y="556" width="744" height="12" fill="#293850" />
        <rect x="826" y="102" width="16" height="454" fill="#35465e" />
        <rect x="66" y="88" width="776" height="14" fill="#596b84" />
        <rect x="66" y="102" width="16" height="454" fill="#405371" />

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
        <g className="pl-stars">
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
        <rect x="489" y="123" width="8" height="178" fill="#b88f83" />
        <rect x="397" y="211" width="189" height="8" fill="#b88f83" />
        <rect x="381" y="301" width="221" height="12" fill="#e6c7a9" />
        <rect x="381" y="313" width="221" height="7" fill="#94777a" />

        {/* Noticeboard. */}
        <rect x="117" y="142" width="91" height="125" fill="#152238" />
        <rect x="110" y="135" width="91" height="125" fill="#cba087" />
        <rect x="116" y="141" width="79" height="113" fill="#866e68" />
        <rect x="127" y="153" width="54" height="39" fill="#f0dfbf" />
        <rect x="146" y="149" width="15" height="7" fill="#c2776b" />
        <path
          d="M134 163H173V167H134ZM134 172H164V175H134ZM134 179H170V182H134Z"
          fill="#9b968b"
        />
        <rect x="126" y="205" width="25" height="34" fill="#9fbab4" />
        <rect x="159" y="201" width="23" height="32" fill="#d89782" />
        <rect x="132" y="212" width="13" height="3" fill="#4e7780" />
        <rect x="166" y="208" width="10" height="3" fill="#8b6665" />
        <rect x="130" y="145" width="4" height="4" fill="#f2c57f" />

        {/* Warm task light. */}
        <path d="M337 267H344V302H365V308H328V302H337Z" fill="#8a9aa2" />
        <path d="M340 267H347V230H370V223H340Z" fill="#abb9b7" />
        <path d="M363 215H389V222H396V237H356V222H363Z" fill="#df9b7d" />
        <rect x="362" y="237" width="28" height="5" fill="#f5dfac" />
        <path
          className="pl-lamp-light"
          d="M363 242H389L415 314H335Z"
          fill="#f5d28e"
          opacity=".075"
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
        <path
          d="M215 207H220V212H225V217H220V222H215V217H219V212H215ZM232 221H250V225H232Z"
          fill="#b3d5af"
        />
        <path
          className="pl-screen-code"
          d="M215 233H240V236H215ZM245 233H271V236H245ZM215 241H256V244H215Z"
          fill="#75a8a3"
        />
        <rect
          className="pl-screen-cursor"
          x="278"
          y="239"
          width="6"
          height="8"
          fill="#e1c282"
        />
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
          className="pl-coffee-steam"
          d="M171 278V269H175V262"
          fill="none"
          stroke="#d7ccba"
          strokeWidth="3"
          opacity=".55"
        />

        {/* Chair. */}
        <rect x="249" y="370" width="12" height="76" fill="#25314c" />
        <path d="M230 363H276V369H283V398H223V369H230Z" fill="#26334c" />
        <rect x="230" y="363" width="46" height="29" fill="#729792" />
        <rect x="224" y="399" width="60" height="12" fill="#597f80" />
        <rect x="231" y="411" width="46" height="8" fill="#365669" />
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
        <rect x="694" y="231" width="15" height="48" fill="#799e9c" />
        <rect x="711" y="243" width="12" height="36" fill="#8a9db7" />
        <path d="M731 240H743L756 276L744 279Z" fill="#cb917e" />
        <path
          d="M665 244H676V247H665ZM682 249H689V252H682ZM696 241H707V244H696ZM713 252H721V255H713Z"
          fill="#f4dfb5"
        />
        <rect x="663" y="330" width="52" height="9" fill="#ccbea0" />
        <rect x="659" y="340" width="61" height="10" fill="#7a9a9b" />
        <rect x="668" y="319" width="48" height="11" fill="#ce8e7b" />
        <rect x="735" y="303" width="24" height="47" fill="#adad99" />
        <rect x="740" y="310" width="14" height="13" fill="#6a7d80" />
        <rect x="738" y="332" width="18" height="4" fill="#d8d0b4" />
        <rect x="664" y="380" width="37" height="46" fill="#899dab" />
        <rect x="669" y="387" width="27" height="16" fill="#c8cfbd" />
        <rect x="674" y="392" width="17" height="3" fill="#7c8d91" />
        <rect x="711" y="395" width="52" height="31" fill="#c1a58a" />
        <rect x="711" y="389" width="52" height="7" fill="#ddc3a0" />
        <rect x="729" y="402" width="17" height="7" fill="#846e6a" />

        {/* Pixel fern. */}
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

        {/* Rug and friendly robot. */}
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
        <rect x="472" y="488" width="65" height="11" fill="#936f67" />
        <g className="pl-robot-body">
          <rect x="483" y="466" width="12" height="21" fill="#536e7c" />
          <rect x="516" y="466" width="12" height="21" fill="#536e7c" />
          <rect x="479" y="482" width="19" height="8" fill="#22364d" />
          <rect x="513" y="482" width="19" height="8" fill="#22364d" />
          <rect x="480" y="427" width="52" height="43" fill="#c1c8b7" />
          <rect x="486" y="435" width="39" height="27" fill="#95aea4" />
          <rect x="498" y="441" width="14" height="13" fill="#cb8e77" />
          <rect x="470" y="434" width="10" height="27" fill="#94aba3" />
          <rect x="532" y="434" width="10" height="27" fill="#94aba3" />
          <rect x="501" y="391" width="6" height="13" fill="#b3c4b4" />
          <rect x="497" y="387" width="14" height="8" fill="#e4a784" />
          <path d="M479 403H532V410H539V429H472V410H479Z" fill="#d5d6ba" />
          <rect x="481" y="409" width="49" height="14" fill="#2e5060" />
          <g className="pl-robot-eyes" fill="#b9d5b1">
            <rect x="489" y="413" width="7" height="6" />
            <rect x="513" y="413" width="7" height="6" />
          </g>
        </g>

        {/* Door to the internet: a small mailbox. */}
        <rect x="794" y="451" width="43" height="8" fill="#344057" />
        <rect x="809" y="389" width="10" height="63" fill="#bc9b83" />
        <path d="M790 350H831V357H838V392H783V357H790Z" fill="#cb8d79" />
        <rect x="788" y="362" width="45" height="24" fill="#e4b094" />
        <path
          d="M795 367H826V380H795ZM795 367L810 375L826 367"
          fill="#f0dbb6"
        />
        <path
          d="M795 367L810 375L826 367"
          fill="none"
          stroke="#b99784"
          strokeWidth="3"
        />
        <rect x="834" y="336" width="5" height="27" fill="#e4bf9b" />
        <rect x="837" y="336" width="18" height="10" fill="#d68577" />

        {/* Tiny wall details and a power cable. */}
        <rect x="662" y="142" width="86" height="40" fill="#17263e" />
        <rect x="657" y="137" width="86" height="40" fill="#bed0bd" />
        <rect x="663" y="143" width="74" height="28" fill="#385564" />
        <path
          d="M671 157H681V151H690V160H699V151H708V160H717V151H729"
          fill="none"
          stroke="#a9cbb2"
          strokeWidth="3"
        />
        <path
          d="M328 288H334V349H320V360H309"
          fill="none"
          stroke="#15243c"
          strokeWidth="4"
        />
      </svg>

      <button
        className={`pl-hotspot pl-hotspot-terminal ${active === "projects" ? "pl-hotspot-active" : ""}`}
        onClick={() => onSelect("projects")}
        aria-label="Open projects from the terminal"
        aria-pressed={active === "projects"}
      >
        <span className="pl-object-label">&gt;_ Projects</span>
      </button>
      <button
        className={`pl-hotspot pl-hotspot-board ${active === "profile" ? "pl-hotspot-active" : ""}`}
        onClick={() => onSelect("profile")}
        aria-label="Open the professional journey from the noticeboard"
        aria-pressed={active === "profile"}
      >
        <span className="pl-object-label">⌑ Journey</span>
      </button>
      <button
        className={`pl-hotspot pl-hotspot-books ${active === "research" ? "pl-hotspot-active" : ""}`}
        onClick={() => onSelect("research")}
        aria-label="Open publications from the bookshelf"
        aria-pressed={active === "research"}
      >
        <span className="pl-object-label">▤ Research</span>
      </button>
      <button
        className={`pl-hotspot pl-hotspot-mail ${active === "contact" ? "pl-hotspot-active" : ""}`}
        onClick={() => onSelect("contact")}
        aria-label="Open professional links from the mailbox"
        aria-pressed={active === "contact"}
      >
        <span className="pl-object-label">✉ Connect</span>
      </button>
      <button
        className="pl-robot-button"
        aria-label="Read a thought from the little robot"
        onClick={() =>
          setRobotMessage((robotMessage + 1) % robotMessages.length)
        }
      >
        <span className="pl-robot-spark">?</span>
      </button>
      <div className="pl-room-caption" aria-live="polite">
        <span className="pl-caption-dot" />
        {robotMessages[robotMessage]}
      </div>
    </div>
  );
}

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={`pl-link ${className}`}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <span aria-hidden="true">↗</span>
      <span className="pl-sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export default function PixelLab({ onExit }: { onExit: () => void }) {
  const [active, setActive] = useState<Section>("projects");
  const [paused, setPaused] = useState(false);
  const current = sections.find((section) => section.id === active)!;

  function handleTabKey(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % sections.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + sections.length) % sections.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = sections.length - 1;
    else return;
    event.preventDefault();
    setActive(sections[next].id);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [next]?.focus();
  }

  return (
    <div className={`pixel-lab ${paused ? "pl-motion-paused" : ""}`}>
      <a className="pl-skip" href="#pl-content">
        Skip to content
      </a>
      <header className="pl-header">
        <button
          className="pl-brand"
          onClick={onExit}
          aria-label="Return to the other portfolio versions"
        >
          <span className="pl-brand-icon" aria-hidden="true">
            rb<span>.</span>
          </span>
          <span>
            {profile.name}
            <small>Engineering, research and code.</small>
          </span>
        </button>
        <button className="pl-exit" onClick={onExit}>
          <span aria-hidden="true">←</span> Switch universe
        </button>
      </header>

      <main className="pl-main">
        <div className="pl-intro">
          <div>
            <p className="pl-intro-tag">
              <span aria-hidden="true">✦</span> A different way to explore
            </p>
            <h1>
              Little studio.
              <br />
              <span>Big curiosity.</span>
            </h1>
          </div>
          <p className="pl-intro-copy">
            Welcome to my digital workshop.
            <br />
            Make yourself at home among ideas and experiments.
            <br />
            <span>Every object has a story to tell.</span>
          </p>
        </div>

        <div className="pl-workspace">
          <section
            className="pl-scene-window"
            aria-label="Interactive pixel art laboratory"
          >
            <div className="pl-window-bar">
              <span className="pl-window-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>raffaele / little-lab</span>
              <button
                className="pl-motion"
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
              >
                {paused ? "▷ Play" : "Ⅱ Pause"}
              </button>
            </div>
            <PixelRoom active={active} onSelect={setActive} paused={paused} />
            <div className="pl-scene-help">
              <span>
                <span aria-hidden="true">⌖</span> Choose an object in the room
              </span>
              <span>
                Or use the menu <span aria-hidden="true">↗</span>
              </span>
            </div>
          </section>

          <aside className="pl-info-window" aria-label="Portfolio contents">
            <div
              className="pl-tab-nav"
              role="tablist"
              aria-label="Portfolio sections"
            >
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  id={`pl-tab-${section.id}`}
                  role="tab"
                  tabIndex={active === section.id ? 0 : -1}
                  onKeyDown={(event) => handleTabKey(event, index)}
                  aria-selected={active === section.id}
                  aria-controls="pl-content"
                  className={active === section.id ? "pl-tab-active" : ""}
                  onClick={() => setActive(section.id)}
                >
                  <span aria-hidden="true">{section.glyph}</span>
                  {section.label}
                </button>
              ))}
            </div>
            <section
              key={active}
              id="pl-content"
              className="pl-content"
              role="tabpanel"
              tabIndex={0}
              aria-labelledby={`pl-tab-${active}`}
            >
              <div className="pl-panel-heading">
                <span className="pl-panel-glyph" aria-hidden="true">
                  {current.glyph}
                </span>
                <div>
                  <p>{current.place}</p>
                  <h2>
                    {active === "projects"
                      ? "Ideas, put into practice."
                      : active === "research"
                        ? "Questions become research."
                        : active === "profile"
                          ? "Connecting the dots."
                          : "Let’s take it from here."}
                  </h2>
                </div>
              </div>

              {active === "projects" && (
                <div className="pl-item-list">
                  <p className="pl-panel-intro">
                    From a first experiment to something you can use. A
                    selection of my projects.
                  </p>
                  {projects.map((project) => (
                    <article className="pl-project-item" key={project.id}>
                      <div className="pl-item-meta">
                        <span>{project.category}</span>
                        <span>{project.year}</span>
                      </div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="pl-tech-list">
                        {project.tech.slice(0, 5).map((tech) => (
                          <span key={tech}>{tech}</span>
                        ))}
                      </div>
                      <ExternalLink href={project.url}>
                        Explore the project
                      </ExternalLink>
                    </article>
                  ))}
                  <ExternalLink href={links.github} className="pl-full-link">
                    More code on GitHub
                  </ExternalLink>
                </div>
              )}

              {active === "research" && (
                <div className="pl-item-list">
                  <p className="pl-panel-intro">
                    Publications, methods and findings. Each work links to its
                    original source.
                  </p>
                  {papers.map((paper) => (
                    <article className="pl-paper-item" key={paper.id}>
                      <div className="pl-item-meta">
                        <span>{paper.venue}</span>
                        <span>{paper.year}</span>
                      </div>
                      <h3>{paper.title}</h3>
                      <p>{paper.description}</p>
                      <details className="pl-paper-details">
                        <summary>Authors and references</summary>
                        <p>{paper.authors.join(", ")}</p>
                        {paper.doi && (
                          <p className="pl-doi">DOI: {paper.doi}</p>
                        )}
                      </details>
                      <ExternalLink href={paper.url}>
                        Read the publication
                      </ExternalLink>
                    </article>
                  ))}
                </div>
              )}

              {active === "profile" && (
                <div className="pl-item-list">
                  <p className="pl-profile-summary">{profile.summary}</p>
                  <div className="pl-education">
                    <span aria-hidden="true">⌂</span>
                    <div>
                      <h3>Politecnico di Milano</h3>
                      <p>{profile.education}</p>
                      <ExternalLink href={links.polimi}>
                        Research profile
                      </ExternalLink>
                    </div>
                  </div>
                  <h3 className="pl-timeline-title">The journey</h3>
                  <div className="pl-timeline">
                    {experience.map((item) => (
                      <article key={`${item.period}-${item.title}`}>
                        <p className="pl-item-meta">{item.period}</p>
                        <h3>{item.title}</h3>
                        <p className="pl-organization">{item.organization}</p>
                        <p>{item.description}</p>
                        {item.url && (
                          <ExternalLink href={item.url}>
                            Explore further
                          </ExternalLink>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {active === "contact" && (
                <div className="pl-item-list">
                  <p className="pl-contact-intro">
                    A good conversation is often the start of a good project.
                  </p>
                  <p className="pl-panel-intro">
                    Research, technology, or an idea to explore together: here
                    is where to find me.
                  </p>
                  <div className="pl-contact-links">
                    <ExternalLink href={links.linkedin}>
                      <span>
                        <strong>LinkedIn</strong>
                        <small>
                          Professional experience and conversations.
                        </small>
                      </span>
                    </ExternalLink>
                    <ExternalLink href={links.github}>
                      <span>
                        <strong>GitHub</strong>
                        <small>Projects, experiments and code.</small>
                      </span>
                    </ExternalLink>
                    <ExternalLink href={links.musemind}>
                      <span>
                        <strong>MuseMind</strong>
                        <small>A project worth a closer look.</small>
                      </span>
                    </ExternalLink>
                  </div>
                  <div className="pl-contact-note">
                    <span aria-hidden="true">✦</span>
                    <p>The best connections start with curiosity.</p>
                  </div>
                </div>
              )}
            </section>
            <div className="pl-panel-footer">
              <span className="pl-tiny-square" />
              Made of ideas. Built with care.
            </div>
          </aside>
        </div>

        <footer className="pl-footer">
          <p>
            A little space for <strong>{profile.name}</strong>.
          </p>
          <p>
            Biomedical <span aria-hidden="true">/</span> Technology{" "}
            <span aria-hidden="true">/</span> Research
          </p>
          <button onClick={onExit}>
            Explore the other versions <span aria-hidden="true">↗</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
