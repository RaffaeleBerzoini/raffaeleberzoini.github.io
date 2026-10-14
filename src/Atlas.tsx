import { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDot,
  Compass,
  Github,
  Layers3,
  Linkedin,
  MoveUpRight,
} from "lucide-react";
import { experience, links, papers, profile, projects } from "./data";
import "./atlas.css";

type AtlasNode = {
  id: string;
  label: string;
  kind: "Origin" | "Project" | "Paper";
  x: number;
  y: number;
  index: string;
};

const nodes: AtlasNode[] = [
  {
    id: "origin",
    label: "Raffaele Berzoini",
    kind: "Origin",
    x: 48,
    y: 47,
    index: "00",
  },
  {
    id: "project-musemind",
    label: "MuseMind",
    kind: "Project",
    x: 77,
    y: 22,
    index: "01",
  },
  {
    id: "project-nerone",
    label: "NERONE",
    kind: "Project",
    x: 77,
    y: 70,
    index: "02",
  },
  {
    id: "project-lstm",
    label: "2D LSTM U-Net",
    kind: "Project",
    x: 28,
    y: 76,
    index: "03",
  },
  {
    id: "project-renaissance",
    label: "Master of Renaissance",
    kind: "Project",
    x: 22,
    y: 25,
    index: "04",
  },
  {
    id: "paper-memory",
    label: "Memory & segmentation",
    kind: "Paper",
    x: 47,
    y: 12,
    index: "P1",
  },
  {
    id: "paper-nerone",
    label: "Efficient inference",
    kind: "Paper",
    x: 55,
    y: 89,
    index: "P2",
  },
  {
    id: "paper-seneca",
    label: "SENECA",
    kind: "Paper",
    x: 85,
    y: 47,
    index: "P3",
  },
  {
    id: "paper-bionet",
    label: "BIONET",
    kind: "Paper",
    x: 15,
    y: 52,
    index: "P4",
  },
];

const connections = [
  ["origin", "project-musemind"],
  ["origin", "project-nerone"],
  ["origin", "project-lstm"],
  ["origin", "project-renaissance"],
  ["project-lstm", "paper-memory"],
  ["project-nerone", "paper-nerone"],
  ["project-nerone", "paper-seneca"],
  ["project-lstm", "paper-bionet"],
];

function NodeDetail({ node }: { node: AtlasNode }) {
  const project =
    node.kind === "Project"
      ? projects.find((item) => `project-${item.id}` === node.id)
      : undefined;
  const paper =
    node.kind === "Paper"
      ? papers.find((item) => `paper-${item.id}` === node.id)
      : undefined;
  return (
    <div className="atlas-detail-content" key={node.id}>
      <div className="atlas-detail-coordinate">
        <span>
          {node.kind} / {node.index}
        </span>
        <CircleDot size={14} />
      </div>
      {node.kind === "Origin" ? (
        <>
          <div className="atlas-person-mark" aria-hidden="true">
            r<span>b</span>
            <i>↗</i>
          </div>
          <h3>
            One practice.
            <br />
            Many connections.
          </h3>
          <p>{profile.summary}</p>
          <div className="atlas-detail-fact">
            <span>THE FOUNDATION</span>
            <p>{profile.education}</p>
          </div>
          <a
            className="atlas-text-link"
            href={links.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            Meet Raffaele <ArrowUpRight size={18} />
          </a>
        </>
      ) : project ? (
        <>
          <div className="atlas-detail-meta">
            {project.category}
            <span>{project.year}</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="atlas-detail-tags">
            {project.tech.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <div className="atlas-detail-fact">
            <span>CONNECTED DISCIPLINES</span>
            <p>
              {project.id === "musemind"
                ? "Applied AI ↔ human experience"
                : project.id === "nerone"
                  ? "Neural networks ↔ embedded systems"
                  : project.id === "lstm"
                    ? "Biomedical engineering ↔ machine learning"
                    : "Software architecture ↔ interaction"}
            </p>
          </div>
          <a
            className="atlas-text-link"
            href={project.url}
            target="_blank"
            rel="noreferrer"
          >
            {project.category === "Product"
              ? "Explore the product"
              : project.id === "lstm"
                ? "Read the thesis"
                : "Explore the repository"}{" "}
            <ArrowUpRight size={18} />
          </a>
        </>
      ) : paper ? (
        <>
          <div className="atlas-detail-meta">
            Publication<span>{paper.year}</span>
          </div>
          <h3 className="atlas-detail-paper-title">{paper.title}</h3>
          <p>{paper.description}</p>
          <div className="atlas-detail-tags">
            {paper.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="atlas-detail-fact">
            <span>PUBLISHED IN</span>
            <p>{paper.venue}</p>
            <small>{paper.authors.join(" · ")}</small>
          </div>
          <a
            className="atlas-text-link"
            href={paper.url}
            target="_blank"
            rel="noreferrer"
          >
            Read publication <ArrowUpRight size={18} />
          </a>
        </>
      ) : null}
    </div>
  );
}

export default function Atlas({ onExit }: { onExit: () => void }) {
  const [selectedId, setSelectedId] = useState("origin");
  const [filter, setFilter] = useState<"All" | "Projects" | "Papers">("All");
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];

  function selectFilter(next: typeof filter) {
    setFilter(next);
    if (next === "Projects" && selected.kind !== "Project")
      setSelectedId("project-musemind");
    if (next === "Papers" && selected.kind !== "Paper")
      setSelectedId("paper-memory");
  }

  const nodeIsVisible = (node: AtlasNode) =>
    filter === "All" ||
    node.kind === "Origin" ||
    (filter === "Projects" ? node.kind === "Project" : node.kind === "Paper");

  return (
    <div className="atlas-site">
      <header className="atlas-header">
        <a
          className="atlas-brand"
          href="#atlas-top"
          aria-label="Research Atlas home"
        >
          <span className="atlas-brand-monogram">rb.</span>
          <span>
            RESEARCH
            <br />
            ATLAS
          </span>
        </a>
        <nav
          className="atlas-navigation"
          aria-label="Research Atlas navigation"
        >
          <a href="#atlas-map">Explore the map</a>
          <a href="#atlas-research">Research</a>
          <a href="#atlas-profile">Profile</a>
        </nav>
        <button type="button" className="atlas-exit" onClick={onExit}>
          <ArrowLeft size={15} /> Change perspective
        </button>
      </header>

      <main>
        <section
          className="atlas-hero"
          id="atlas-top"
          aria-labelledby="atlas-title"
        >
          <div className="atlas-hero-topline">
            <span>
              <i /> AN OPEN INDEX OF IDEAS & ENGINEERING
            </span>
            <span>RAFFAELE BERZOINI / PORTFOLIO</span>
          </div>
          <h1 id="atlas-title">
            Everything is
            <br />
            <span>connected.</span>
            <svg
              className="atlas-hero-asterisk"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <path d="M50 0v100M0 50h100M15 15l70 70M15 85l70-70" />
            </svg>
          </h1>
          <div className="atlas-hero-bottom">
            <a className="atlas-explore-link" href="#atlas-map">
              <span className="atlas-round-arrow">
                <ArrowDown size={20} />
              </span>
              Follow the connections
            </a>
            <p>
              I'm Raffaele, a software engineer with a biomedical background. I
              connect intelligent models, useful systems, and the people they’re
              built for.
            </p>
            <div className="atlas-hero-note">
              <span>01 — SOFTWARE</span>
              <span>02 — INTELLIGENCE</span>
              <span>03 — BIOMEDICINE</span>
            </div>
          </div>
        </section>

        <section
          className="atlas-map-section"
          id="atlas-map"
          aria-labelledby="atlas-map-heading"
        >
          <div className="atlas-section-heading">
            <div>
              <span className="atlas-eyebrow">01 / THE CONNECTION MAP</span>
              <h2 id="atlas-map-heading">
                Different paths.
                <br />
                Shared questions.
              </h2>
            </div>
            <p>
              From a model to a medical image.
              <br />
              From a conversation to a museum visit.
              <br />
              <strong>Select a point. Explore a connection.</strong>
            </p>
          </div>
          <div className="atlas-map-toolbar">
            <div
              className="atlas-filters"
              role="group"
              aria-label="Filter connection map"
            >
              {(["All", "Projects", "Papers"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => selectFilter(item)}
                  aria-pressed={filter === item}
                >
                  {item}
                  {filter === item && <Check size={12} />}
                </button>
              ))}
            </div>
            <span className="atlas-map-caption">
              <Compass size={14} /> A living index of selected work
            </span>
          </div>
          <div className="atlas-map-layout">
            <div
              className="atlas-map"
              role="group"
              aria-label="Interactive map of projects and publications"
            >
              <svg
                className="atlas-map-lines"
                viewBox="0 0 1000 780"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="atlas-grid-pattern"
                    width="36"
                    height="36"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="1"
                      cy="1"
                      r="1"
                      fill="currentColor"
                      opacity=".16"
                    />
                  </pattern>
                </defs>
                <rect
                  width="1000"
                  height="780"
                  fill="url(#atlas-grid-pattern)"
                />
                <ellipse
                  cx="480"
                  cy="367"
                  rx="190"
                  ry="148"
                  className="atlas-guide"
                />
                <ellipse
                  cx="480"
                  cy="367"
                  rx="362"
                  ry="278"
                  className="atlas-guide"
                />
                <path className="atlas-guide-axis" d="M480 0V780M0 367H1000" />
                {connections.map(([from, to]) => {
                  const start = nodes.find((node) => node.id === from)!;
                  const end = nodes.find((node) => node.id === to)!;
                  const active = from === selectedId || to === selectedId;
                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={start.x * 10}
                      y1={start.y * 7.8}
                      x2={end.x * 10}
                      y2={end.y * 7.8}
                      className={`atlas-connection ${active ? "atlas-connection-active" : ""}`}
                      style={{
                        opacity:
                          nodeIsVisible(start) && nodeIsVisible(end)
                            ? undefined
                            : 0.09,
                      }}
                    />
                  );
                })}
              </svg>
              <span className="atlas-map-axis-label atlas-map-axis-label-top">
                APPLIED INTELLIGENCE
              </span>
              <span className="atlas-map-axis-label atlas-map-axis-label-bottom">
                BIOMEDICAL SYSTEMS
              </span>
              {nodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className={`atlas-node atlas-node-${node.kind.toLowerCase()} ${selectedId === node.id ? "atlas-node-selected" : ""} ${!nodeIsVisible(node) ? "atlas-node-muted" : ""}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onClick={() => {
                    setSelectedId(node.id);
                    if (!nodeIsVisible(node)) setFilter("All");
                  }}
                  aria-pressed={selectedId === node.id}
                  aria-controls="atlas-selection"
                >
                  <span className="atlas-node-dot">
                    {node.kind === "Origin" ? "rb" : node.index}
                  </span>
                  <span className="atlas-node-label">
                    {node.label}
                    <small>
                      {node.kind === "Origin" ? "THE COMMON THREAD" : node.kind}
                    </small>
                  </span>
                </button>
              ))}
              <span className="atlas-map-scale">
                <span /> CONNECTIONS, NOT BOUNDARIES
              </span>
            </div>
            <div
              className="atlas-map-mobile"
              aria-label="Select a project or publication"
            >
              {nodes.filter(nodeIsVisible).map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedId(node.id)}
                  aria-pressed={selectedId === node.id}
                  aria-controls="atlas-selection"
                >
                  <span>{node.index}</span>
                  {node.label}
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
            <aside
              className="atlas-detail"
              id="atlas-selection"
              aria-label="Selected connection"
              aria-live="polite"
            >
              <NodeDetail node={selected} />
              <div className="atlas-detail-bottom">
                <span>EXPLORE AT YOUR OWN PACE</span>
                <span>{selected.index} / ↗</span>
              </div>
            </aside>
          </div>
          <div className="atlas-map-footer">
            <span>
              <i className="atlas-legend-project" /> Project / product
            </span>
            <span>
              <i className="atlas-legend-paper" /> Research publication
            </span>
            <span>Click any coordinate to learn more</span>
          </div>
        </section>

        <section
          className="atlas-projects-section"
          aria-labelledby="atlas-projects-heading"
        >
          <div className="atlas-section-heading">
            <div>
              <span className="atlas-eyebrow">02 / BUILT & EXPLORED</span>
              <h2 id="atlas-projects-heading">Ideas, made tangible.</h2>
            </div>
            <a
              className="atlas-text-link"
              href={links.github}
              target="_blank"
              rel="noreferrer"
            >
              More on GitHub <Github size={17} />
            </a>
          </div>
          <div className="atlas-project-index">
            {projects.map((project, index) => (
              <a
                className="atlas-project-row"
                href={project.url}
                key={project.id}
                target="_blank"
                rel="noreferrer"
              >
                <span className="atlas-project-number">0{index + 1}</span>
                <div className="atlas-project-main">
                  <span className="atlas-project-category">
                    {project.category} / {project.year}
                  </span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="atlas-project-stack">
                  {project.tech.slice(0, 3).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <span className="atlas-project-arrow">
                  <MoveUpRight size={29} strokeWidth={1.4} />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section
          className="atlas-research-section"
          id="atlas-research"
          aria-labelledby="atlas-research-heading"
        >
          <div className="atlas-research-intro">
            <span className="atlas-eyebrow">03 / PEER-REVIEWED RESEARCH</span>
            <h2 id="atlas-research-heading">
              Better models.
              <br />
              Smaller footprint.
            </h2>
            <p>
              Four co-authored publications exploring medical image
              segmentation, recurrent memory, and efficient inference at the
              edge.
            </p>
            <a
              className="atlas-text-link"
              href={links.polimi}
              target="_blank"
              rel="noreferrer"
            >
              Politecnico research profile <ArrowUpRight size={17} />
            </a>
            <div className="atlas-research-glyph" aria-hidden="true">
              <Layers3 size={136} strokeWidth={0.65} />
              <span>IMAGING → MODELS → SYSTEMS</span>
            </div>
          </div>
          <div className="atlas-paper-index">
            {papers.map((paper, index) => (
              <a
                href={paper.url}
                target="_blank"
                rel="noreferrer"
                className="atlas-paper-row"
                key={paper.id}
              >
                <div className="atlas-paper-meta">
                  <span>P0{index + 1}</span>
                  <span>{paper.year}</span>
                  <ArrowUpRight size={19} />
                </div>
                <h3>{paper.title}</h3>
                <p>{paper.venue}</p>
                <span className="atlas-paper-doi">DOI: {paper.doi}</span>
              </a>
            ))}
          </div>
        </section>

        <section
          className="atlas-profile-section"
          id="atlas-profile"
          aria-labelledby="atlas-profile-heading"
        >
          <div className="atlas-section-heading">
            <div>
              <span className="atlas-eyebrow">04 / THE PERSON IN THE LOOP</span>
              <h2 id="atlas-profile-heading">
                A biomedical foundation.
                <br />
                An engineering mindset.
              </h2>
            </div>
            <span className="atlas-profile-stamp">
              RB
              <br />
              <small>
                WORK IN PROGRESS,
                <br />
                ALWAYS.
              </small>
            </span>
          </div>
          <div className="atlas-profile-layout">
            <div className="atlas-profile-copy">
              <p>{profile.summary}</p>
              <p>
                My path connects research at Politecnico di Milano, edge
                software engineering, and the software and cloud architecture
                behind MuseMind.
              </p>
              <div className="atlas-profile-links">
                <a href={links.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={16} /> LinkedIn <ArrowUpRight size={15} />
                </a>
                <a href={links.github} target="_blank" rel="noreferrer">
                  <Github size={16} /> GitHub <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
            <div className="atlas-experience">
              {experience.map((item) => (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="atlas-experience-row"
                  key={item.title}
                >
                  <span>{item.period}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <h4>{item.organization}</h4>
                    <p>{item.description}</p>
                  </div>
                  <ArrowUpRight size={17} />
                </a>
              ))}
            </div>
          </div>
        </section>

        <footer className="atlas-footer">
          <span className="atlas-eyebrow">THE NEXT CONNECTION</span>
          <a
            className="atlas-contact"
            href={links.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            Let’s connect.
            <ArrowUpRight strokeWidth={1.1} />
          </a>
          <div className="atlas-footer-meta">
            <span>© {new Date().getFullYear()} Raffaele Berzoini</span>
            <span>RESEARCH ATLAS / EDITION 02</span>
            <a href="#atlas-top">Back to the top ↑</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
