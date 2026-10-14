import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Command,
  Copy,
  Github,
  Linkedin,
  Menu,
  Moon,
  Pause,
  Play,
  Search,
  Sun,
  X,
} from "lucide-react";
import { links, projects, papers, experience } from "./data";
import SignalField from "./components/SignalField";
import Atlas from "./Atlas";
const PixelLab = lazy(() => import("./PixelLab"));
type Edition = "signal" | "atlas" | "pixel";

function Mark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <ellipse cx="20" cy="20" rx="17" ry="7" transform="rotate(-45 20 20)" />
      <ellipse cx="20" cy="20" rx="17" ry="7" transform="rotate(45 20 20)" />
      <circle cx="20" cy="20" r="2" />
    </svg>
  );
}

export function ProjectVisual({ kind }: { kind: string }) {
  if (kind === "musemind")
    return (
      <div className="project-art muse-art" aria-hidden="true">
        <div className="museum-arch">
          <div className="sculpture-bust">
            <span />
            <i />
            <b />
          </div>
        </div>
        <div className="muse-caption">
          Every artwork
          <br />
          has a story.
        </div>
        <div className="audio-capsule">
          <span className="audio-dot" />
          {Array.from({ length: 23 }, (_, i) => (
            <i key={i} style={{ height: 8 + Math.sin(i * 1.7) ** 2 * 24 }} />
          ))}
          <span>Ask MuseMind</span>
        </div>
        <span className="art-note">Art meets intelligence</span>
      </div>
    );
  if (kind === "game")
    return (
      <div className="project-art game-art" aria-hidden="true">
        <div className="game-board">
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i} className={"tile tile-" + (i % 4)}>
              <i>{["✦", "◆", "✳", "◈"][i % 4]}</i>
            </span>
          ))}
        </div>
        <div className="game-label">
          Master of
          <br />
          Renaissance<span>Java · Multiplayer · Strategy</span>
        </div>
      </div>
    );
  if (kind === "lstm")
    return (
      <div className="project-art lstm-art" aria-hidden="true">
        <div className="scan-stack">
          {[0, 1, 2, 3].map((i) => (
            <div className="scan-slice" key={i}>
              <svg viewBox="0 0 180 180">
                <path
                  d="M88 20C48 17 22 48 25 96s29 67 64 67 70-24 66-71-28-70-67-72Z"
                  fill="#9cacb1"
                />
                <path
                  d="M83 40C56 34 37 62 42 94s13 45 35 47l8-21 8 21c30-5 46-29 44-50S122 44 99 38L88 58Z"
                  fill="#374647"
                />
                <path
                  d="M96 75q36-22 34 22t-32 35q-14-22-2-57Z"
                  fill="#cdf0ac"
                />
                <path d="M55 83q19-20 25 1t-6 33q-20 2-19-34" fill="#ed9574" />
              </svg>
            </div>
          ))}
        </div>
        <div className="scan-note">
          2D input.
          <br />
          Volumetric understanding.
        </div>
      </div>
    );
  return (
    <div className="project-art chip-art" aria-hidden="true">
      <div className="circuit-lines">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ transform: `rotate(${i * 30}deg)` }} />
        ))}
      </div>
      <div className="chip">
        <span>NECST</span>
        <strong>NERONE</strong>
        <small>Intelligence at the edge</small>
      </div>
      <span className="chip-corner">FPGA / Neural inference</span>
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Rome",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="clock">
      <i />
      Italy <span>{time}</span>
    </span>
  );
}

function Publications() {
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState("");
  const [manualCitation, setManualCitation] = useState<{
    id: string;
    text: string;
  } | null>(null);
  async function copyPaper(p: (typeof papers)[number]) {
    const citation = `${p.authors.join(", ")}. ${p.title}. ${p.venue}, ${p.year}. https://doi.org/${p.doi}`;
    setManualCitation(null);
    setCopied("pending-" + p.id);
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        navigator.clipboard.writeText(citation),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(
            () => reject(Error("Clipboard unavailable")),
            1500,
          );
        }),
      ]);
      setCopied(p.id);
      setTimeout(() => setCopied(""), 4000);
    } catch {
      setCopied("failed");
      setManualCitation({ id: p.id, text: citation });
    } finally {
      clearTimeout(timeout);
    }
  }
  return (
    <section id="research" className="research-section section-wrap">
      <div className="section-heading">
        <div>
          <span className="section-label">Published work</span>
          <h2>
            A little less theory.
            <br />A little more evidence.
          </h2>
        </div>
        <p>
          Medical imaging, efficient neural networks
          <br className="desktop-br" /> and intelligence beyond the datacenter.
        </p>
      </div>
      <div className="paper-list">
        {papers.map((p) => (
          <article
            className={"paper " + (selected === p.id ? "paper-open" : "")}
            key={p.id}
          >
            <button
              className="paper-trigger"
              onClick={() => setSelected(selected === p.id ? null : p.id)}
              aria-expanded={selected === p.id}
              aria-controls={"paper-" + p.id}
            >
              <span className="paper-year">{p.year}</span>
              <div>
                <span className="paper-venue">{p.venue}</span>
                <h3>{p.title}</h3>
              </div>
              <span className="paper-expand">
                <ChevronDown size={20} />
              </span>
            </button>
            <div
              id={"paper-" + p.id}
              hidden={selected !== p.id}
              className="paper-detail"
            >
              <p>{p.description}</p>
              <p className="paper-authors">{p.authors.join(" / ")}</p>
              <div className="paper-actions">
                <a href={p.url} target="_blank" rel="noreferrer">
                  Read publication <ArrowUpRight size={16} />
                </a>
                <button onClick={() => copyPaper(p)}>
                  {copied === p.id ? <Check size={15} /> : <Copy size={15} />}{" "}
                  {copied === p.id
                    ? "Copied"
                    : copied === "pending-" + p.id
                      ? "Copying…"
                      : "Copy citation"}
                </button>
              </div>
              {manualCitation?.id === p.id && (
                <label className="manual-citation">
                  Select and copy the citation
                  <input
                    readOnly
                    aria-label="Citation text"
                    value={manualCitation.text}
                    onFocus={(e) => e.currentTarget.select()}
                  />
                </label>
              )}
            </div>
          </article>
        ))}
      </div>
      <p className="copy-status" role="status">
        {copied === "failed"
          ? "Automatic copying is unavailable. Select the citation text above to copy it manually."
          : ""}
      </p>
    </section>
  );
}

function LiveRepos() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [repos, setRepos] = useState<
    { name: string; html_url: string; language: string; updated_at: string }[]
  >([]);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  async function refresh() {
    setStatus("loading");
    try {
      const response = await fetch(
        "https://api.github.com/users/RaffaeleBerzoini/repos?sort=updated&per_page=3",
        { signal: AbortSignal.timeout(8000) },
      );
      if (!response.ok) throw Error();
      const list = await response.json();
      if (!Array.isArray(list)) throw Error();
      if (mounted.current) {
        setRepos(list);
        setStatus("done");
      }
    } catch {
      if (mounted.current) setStatus("error");
    }
  }
  return (
    <div className="live-repos">
      <div className="repo-topline">
        <Github size={21} />
        <span>From the source</span>
        <button onClick={refresh} disabled={status === "loading"}>
          {status === "loading"
            ? "Connecting…"
            : status === "done"
              ? "Refresh"
              : "Load GitHub activity"}
          <ArrowUpRight size={14} />
        </button>
      </div>
      <div aria-live="polite">
        {status === "idle" && (
          <p>
            Public repositories, straight from GitHub.
            <br />
            Load the latest updates to see what’s moving.
          </p>
        )}
        {status === "error" && (
          <p>
            GitHub is currently unavailable.{" "}
            <a href={links.github} target="_blank" rel="noreferrer">
              Explore the profile directly.
            </a>
          </p>
        )}
        {status === "done" && (
          <div className="repo-list">
            {repos.map((r) => (
              <a
                key={r.name}
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
              >
                <span>{r.name.replaceAll("_", " ")}</span>
                <small>
                  {r.language || "Repository"} · updated{" "}
                  {new Date(r.updated_at).toLocaleDateString("en-GB")}
                </small>
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TraceDemo() {
  const [run, setRun] = useState(0);
  return (
    <a
      className={"talk-card trace-" + run}
      href="https://devfest.modena.it/en/2025/sessions/comprendere-i-sistemi-distribuiti-con-il-w3c-trace-context/"
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setRun((x) => x + 1)}
    >
      <div className="talk-top">
        <span>On stage / DevFest Modena 2025</span>
        <ArrowUpRight size={22} />
      </div>
      <div className="trace-visual" aria-hidden="true">
        <span>Client</span>
        <i />
        <span>Service</span>
        <i />
        <span>Edge</span>
        <b key={run} />
      </div>
      <h3>
        Making distributed
        <br />
        systems make sense.
      </h3>
      <p>
        W3C Trace Context & OpenTelemetry.
        <br />A talk with Federico Fustini.
      </p>
    </a>
  );
}

function Signal({ onPalette }: { onPalette: () => void }) {
  const [mode, setMode] = useState<"orbit" | "wave" | "helix">("orbit");
  const [paused, setPaused] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [reducedMotion, setReducedMotion] = useState(paused);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setPaused(true);
    };
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  const [dark, setDark] = useState(false);
  const [filter, setFilter] = useState("All");
  const [intensity, setIntensity] = useState(0.45);
  const [navOpen, setNavOpen] = useState(false);
  const shown = projects.filter(
    (p) => filter === "All" || p.category === filter,
  );
  return (
    <div className={"signal-site " + (dark ? "night" : "")}>
      <a href="#work" className="skip-link">
        Skip to selected work
      </a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Raffaele Berzoini, home">
          <Mark />
          <span>
            Raffaele
            <br />
            Berzoini
          </span>
        </a>
        <nav className={navOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="#work" onClick={() => setNavOpen(false)}>
            Work <span>↗</span>
          </a>
          <a href="#research" onClick={() => setNavOpen(false)}>
            Research <span>↗</span>
          </a>
          <a href="#about" onClick={() => setNavOpen(false)}>
            About <span>↗</span>
          </a>
        </nav>
        <div className="header-right">
          <Clock />
          <button
            className="icon-button search-button"
            onClick={onPalette}
            aria-label="Search portfolio (Control K)"
          >
            <Command size={18} />
          </button>
          <button
            className="icon-button"
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="icon-button mobile-menu"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle navigation"
            aria-expanded={navOpen}
          >
            {navOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section id="top" className="hero section-wrap">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="status-point" /> Software engineer & AI
              researcher
            </div>
            <h1>
              Engineering
              <br />
              intelligence<span className="period">.</span>
            </h1>
            <p className="hero-intro">
              I’m Raffaele. I turn complex ideas into
              <br className="desktop-br" /> software that lives in the real
              world.
              <br />
              <span>From biomedical research to applied AI.</span>
            </p>
            <a className="primary-link" href="#work">
              Explore my work{" "}
              <span>
                <ArrowDown size={18} />
              </span>
            </a>
            <div className="hero-credentials">
              <span>Politecnico di Milano</span>
              <i />
              <span>CTO @ MuseMind</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="field-label">
              <span className="field-cross">+</span>
              <span>A study in emergent intelligence</span>
            </div>
            <SignalField
              variant={dark ? "dark" : "light"}
              mode={mode}
              intensity={intensity}
              paused={paused}
            />
            <div className="field-bottom">
              <span>Move your cursor. Change the field.</span>
              <span className="field-cross">+</span>
            </div>
          </div>
          <div className="hero-bottom">
            <span>Research driven. Built for the real world.</span>
            <a href="#work">
              Scroll to explore <ArrowDown size={13} />
            </a>
          </div>
          <div className="field-controls">
            <div className="shape-buttons" aria-label="Sculpture shape">
              {(["orbit", "wave", "helix"] as const).map((m) => (
                <button
                  key={m}
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                >
                  {m}
                </button>
              ))}
            </div>
            <label className="field-range">
              <span>Energy</span>
              <input
                aria-label="Particle energy"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
              />
            </label>
            <button
              className="pause-button"
              aria-label={
                reducedMotion
                  ? "Animation disabled by reduced motion preference"
                  : paused ? "Play particle animation" : "Pause particle animation"
              }
              title={reducedMotion ? "Your system prefers reduced motion" : undefined}
              disabled={reducedMotion}
              aria-pressed={paused}
              onClick={() => setPaused(!paused)}
            >
              {paused ? <Play size={14} /> : <Pause size={14} />}
            </button>
          </div>
        </section>
        <div className="discipline-strip" aria-label="Areas of work">
          <span>Software engineering</span>
          <i>✳</i>
          <span>Applied AI</span>
          <i>✳</i>
          <span>Edge computing</span>
          <i>✳</i>
          <span>Biomedical research</span>
        </div>
        <section id="work" className="work-section section-wrap">
          <div className="section-heading">
            <div>
              <span className="section-label">Selected work</span>
              <h2>
                Ideas are good.
                <br />
                Building is better.
              </h2>
            </div>
            <div className="work-filters" aria-label="Filter projects">
              {["All", "Product", "Research", "Open source"].map((f) => (
                <button
                  key={f}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="project-grid">
            {shown.map((p) => (
              <a
                className="project-card"
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="project-preview">
                  <ProjectVisual kind={p.visual} />
                  <span className="project-open">
                    <ArrowUpRight size={23} />
                  </span>
                </div>
                <div className="project-meta">
                  <span>{p.category}</span>
                  <span>{p.year}</span>
                </div>
                <div className="project-title">
                  <h3>{p.title}</h3>
                  <ArrowUpRight size={24} />
                </div>
                <p>{p.description}</p>
                <div className="tech-tags">
                  {p.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
          <a
            className="text-link"
            href={links.github}
            target="_blank"
            rel="noreferrer"
          >
            More experiments on GitHub <ArrowUpRight size={16} />
          </a>
        </section>
        <Publications />
        <section id="about" className="about-section section-wrap">
          <div className="about-intro">
            <span className="section-label">The connecting thread</span>
            <h2>
              Curiosity.
              <br />
              With an
              <br />
              engineering
              <br />
              mindset<span>.</span>
            </h2>
            <p>
              Biomedical engineering taught me to look at systems. Software gave
              me a way to build them.
            </p>
            <p>
              Today, that same curiosity connects my work across intelligent
              products, efficient computing and research.
            </p>
            <div className="about-links">
              <a href={links.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={17} /> LinkedIn <ArrowUpRight size={15} />
              </a>
              <a href={links.github} target="_blank" rel="noreferrer">
                <Github size={17} /> GitHub <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
          <div className="about-detail">
            <div className="experience-list">
              {experience.map((e) => (
                <a key={e.title} href={e.url} target="_blank" rel="noreferrer">
                  <span>{e.period}</span>
                  <div>
                    <h3>{e.title}</h3>
                    <strong>{e.organization}</strong>
                    <p>{e.description}</p>
                  </div>
                  <ArrowUpRight size={18} />
                </a>
              ))}
            </div>
            <TraceDemo />
            <LiveRepos />
          </div>
        </section>
        <section id="contact" className="contact-section section-wrap">
          <div className="contact-top">
            <span className="section-label">Let’s connect</span>
            <span>Good things start with a conversation.</span>
          </div>
          <a href={links.linkedin} target="_blank" rel="noreferrer">
            Have something
            <br />
            in mind?
            <ArrowUpRight />
          </a>
          <div className="contact-bottom">
            <p>Research, software, or an idea worth exploring.</p>
            <div>
              <a href={links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight size={15} />
              </a>
              <a href={links.github} target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Raffaele Berzoini</span>
        <span>Somewhere between science & software.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}

function SearchDialog({
  onClose,
  onEdition,
}: {
  onClose: () => void;
  onEdition: (e: Edition) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  const items = [
    ...projects.map((p) => ({
      name: p.title,
      detail: p.category,
      url: p.url,
      keywords: p.description + " " + p.tech.join(" "),
    })),
    ...papers.map((p) => ({
      name: p.title,
      detail: p.venue,
      url: p.url,
      keywords: p.description + " " + p.tags.join(" "),
    })),
    { name: "LinkedIn", detail: "Connect", url: links.linkedin },
    { name: "GitHub", detail: "Code", url: links.github },
  ].filter((p) =>
    (p.name + " " + p.detail + " " + ("keywords" in p ? p.keywords : ""))
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <dialog
      aria-label="Search portfolio"
      className="search-dialog"
      ref={dialog}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-input">
        <Search size={20} />
        <input
          aria-label="Search projects and publications"
          autoFocus
          placeholder="Search projects, research, links…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button aria-label="Close search" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="search-results">
        {!query && (
          <div className="search-editions">
            {(["signal", "atlas", "pixel"] as const).map((e) => (
              <button
                key={e}
                onClick={() => {
                  onEdition(e);
                  onClose();
                }}
              >
                Open {e === "pixel" ? "Pixel Lab" : e}
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
        )}
        {items.length ? (
          items.map((item, i) => (
            <a
              href={item.url}
              key={i}
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
            >
              <div>
                <span>{item.detail}</span>
                <strong>{item.name}</strong>
              </div>
              <ArrowUpRight size={18} />
            </a>
          ))
        ) : (
          <p>No matching work. Try “AI”, “U-Net” or “MuseMind”.</p>
        )}
      </div>
      <div className="search-hint">
        Navigate with Tab · Open with Enter · Close with Esc
      </div>
    </dialog>
  );
}

export default function App() {
  const readEdition = (): Edition => {
    const e = new URLSearchParams(location.search).get("version");
    return e === "atlas" || e === "pixel" ? e : "signal";
  };
  const [edition, setEdition] = useState<Edition>(readEdition);
  const [search, setSearch] = useState(false);
  function changeEdition(e: Edition) {
    setEdition(e);
    const url = new URL(location.href);
    url.searchParams.set("version", e);
    url.hash = "";
    history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  useEffect(() => {
    const pop = () => setEdition(readEdition());
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((x) => !x);
      }
    };
    window.addEventListener("popstate", pop);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("keydown", key);
    };
  }, []);
  useEffect(() => {
    document.title = `Raffaele Berzoini — ${edition === "signal" ? "Engineering intelligence" : edition === "atlas" ? "Research Atlas" : "Pixel Lab"}`;
  }, [edition]);
  return (
    <>
      <Suspense
        fallback={<div className="edition-loading">Opening the lab…</div>}
      >
        {edition === "signal" ? (
          <Signal onPalette={() => setSearch(true)} />
        ) : edition === "atlas" ? (
          <Atlas onExit={() => changeEdition("signal")} />
        ) : (
          <PixelLab onExit={() => changeEdition("signal")} />
        )}
      </Suspense>
      <nav className="edition-dock" aria-label="Choose portfolio design">
        <span className="edition-label">Explore a different perspective</span>
        <div>
          {(["signal", "atlas", "pixel"] as const).map((e, i) => (
            <button
              key={e}
              aria-pressed={edition === e}
              onClick={() => changeEdition(e)}
            >
              <span className={"edition-icon edition-icon-" + e}>
                {i === 0 ? "◉" : i === 1 ? "✳" : "▦"}
              </span>
              {e === "signal"
                ? "Signal"
                : e === "atlas"
                  ? "Atlas"
                  : "Pixel Lab"}
            </button>
          ))}
        </div>
      </nav>
      {search && (
        <SearchDialog
          onClose={() => setSearch(false)}
          onEdition={changeEdition}
        />
      )}
    </>
  );
}
