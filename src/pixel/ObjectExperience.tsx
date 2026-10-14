import { useEffect, useRef, useState, type ReactNode } from "react";
import { experience, links, papers, profile, projects } from "../data";
import "./object-experience.css";

export type RoomSection = "projects" | "research" | "profile" | "contact";

type ObjectExperienceProps = { section: RoomSection; onClose: () => void };

function PixelIcon({
  kind,
  className = "",
}: {
  kind:
    "computer" | "book" | "chip" | "museum" | "game" | "mail" | "link" | "code";
  className?: string;
}) {
  const shapes: Record<typeof kind, ReactNode> = {
    computer: (
      <>
        <path d="M4 4h24v18H4zM2 26h28v3H2zM13 22h6v4h-6z" />
        <path className="ox-icon-cutout" d="M7 7h18v12H7z" />
        <path d="m10 10 4 3-4 3v-3l2 0-2-1zM17 15h5v2h-5z" />
      </>
    ),
    book: (
      <>
        <path d="M3 4h11l2 2 2-2h11v24H18l-2 2-2-2H3z" />
        <path className="ox-icon-cutout" d="M6 7h7v17H6zM19 7h7v17h-7z" />
        <path d="M8 11h4v2H8zM8 16h4v2H8zM20 11h4v2h-4zM20 16h4v2h-4z" />
      </>
    ),
    chip: (
      <>
        <path d="M8 8h16v16H8zM11 2h3v6h-3zM18 2h3v6h-3zM11 24h3v6h-3zM18 24h3v6h-3zM2 11h6v3H2zM2 18h6v3H2zM24 11h6v3h-6zM24 18h6v3h-6z" />
        <path className="ox-icon-cutout" d="M12 12h8v8h-8z" />
      </>
    ),
    museum: (
      <>
        <path d="M2 11h28v4H2zM6 8h20v3H6zM10 5h12v3H10zM14 2h4v3h-4zM5 17h4v9H5zM14 17h4v9h-4zM23 17h4v9h-4zM2 28h28v3H2z" />
      </>
    ),
    game: (
      <>
        <path d="M7 8h18v3h3v3h3v14H20v-4h-8v4H1V14h3v-3h3z" />
        <path
          className="ox-icon-cutout"
          d="M8 14h3v3h3v3h-3v3H8v-3H5v-3h3zM22 14h4v4h-4zM18 19h4v4h-4z"
        />
      </>
    ),
    mail: (
      <>
        <path d="M2 6h28v22H2z" />
        <path
          className="ox-icon-cutout"
          d="M5 10h3v3h4v3h8v-3h4v-3h3v3h-3v3h-4v3h-8v-3H8v-3H5z"
        />
      </>
    ),
    link: (
      <>
        <path d="M18 3h11v11h-4V9l-9 9-3-3 9-8h-4zM3 10h10v4H7v12h12v-6h4v10H3z" />
      </>
    ),
    code: (
      <>
        <path d="M8 7h4v4H8v4H4v2h4v4h4v4H8v-4H4v-4H0v-2h4v-4h4zM24 7h-4v4h4v4h4v2h-4v4h-4v4h4v-4h4v-4h4v-2h-4v-4h-4zM17 5h4l-7 23h-4z" />
      </>
    ),
  };
  return (
    <svg
      className={`ox-pixel-icon ${className}`}
      viewBox="0 0 32 32"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {shapes[kind]}
    </svg>
  );
}

function ObjectLink({
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
      className={`ox-external ${className}`}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <span aria-hidden="true">↗</span>
      <span className="ox-sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function CloseButton({
  onClose,
  label = "Back to the room",
}: {
  onClose: () => void;
  label?: string;
}) {
  return (
    <button className="ox-close" onClick={onClose} aria-label={label}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <path
          d="M2 2h4v4h4v4h4v4h2v2h-4v-4H8V8H4V4H2zM12 2h4v4h-4v4H8v4H4v2H2v-4h4V8h4V4h2z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}

function Stepper({
  index,
  count,
  onChange,
  noun,
}: {
  index: number;
  count: number;
  onChange: (index: number) => void;
  noun: string;
}) {
  return (
    <div className="ox-stepper">
      <button
        onClick={() => onChange((index - 1 + count) % count)}
        aria-label={`Previous ${noun}`}
      >
        <span aria-hidden="true">←</span> Prev
      </button>
      <span aria-live="polite">
        {String(index + 1).padStart(2, "0")}{" "}
        <span className="ox-step-divider">/</span>{" "}
        {String(count).padStart(2, "0")}
      </span>
      <button
        onClick={() => onChange((index + 1) % count)}
        aria-label={`Next ${noun}`}
      >
        Next <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

function ProjectComputer({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const project = projects[selected];
  const projectIcon =
    project.visual === "musemind"
      ? "museum"
      : project.visual === "game"
        ? "game"
        : project.visual === "nerone"
          ? "chip"
          : "computer";

  return (
    <div className="ox-computer">
      <div className="ox-crt-case">
        <div className="ox-computer-brand">
          <span>
            <span className="ox-brand-square" /> BERZOINI SYSTEMS{" "}
            <span className="ox-case-model">/ PERSONAL COMPUTER</span>
          </span>
          <CloseButton onClose={onClose} />
        </div>
        <div className="ox-crt-bezel">
          <div className="ox-crt-screen">
            <header className="ox-terminal-title">
              <PixelIcon kind="computer" />
              <h2 id="ox-dialog-title">Project terminal</h2>
              <span className="ox-terminal-cursor" aria-hidden="true">
                ▮
              </span>
            </header>
            <div className="ox-terminal-workspace">
              <nav className="ox-directory" aria-label="Choose a project">
                <p className="ox-directory-label">~/selected-work</p>
                {projects.map((item, index) => (
                  <button
                    key={item.id}
                    className={index === selected ? "ox-file-active" : ""}
                    onClick={() => setSelected(index)}
                    aria-pressed={index === selected}
                  >
                    <span className="ox-file-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.title}</span>
                    <span className="ox-file-marker" aria-hidden="true">
                      {index === selected ? "◀" : ""}
                    </span>
                  </button>
                ))}
                <ObjectLink href={links.github} className="ox-directory-github">
                  Open GitHub
                </ObjectLink>
              </nav>
              <article
                className="ox-project-details"
                key={project.id}
                aria-label={project.title}
              >
                <div className="ox-project-top">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <div className="ox-project-hero">
                  <PixelIcon kind={projectIcon} />
                  <h3>{project.title}</h3>
                </div>
                <p className="ox-project-description">{project.description}</p>
                <div className="ox-project-tools">
                  <h4>Built with</h4>
                  <ul>
                    {project.tech.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>
                <ObjectLink href={project.url} className="ox-project-launch">
                  Open project
                </ObjectLink>
              </article>
            </div>
            <footer className="ox-terminal-footer">
              <span className="ox-terminal-hint">
                Select a file to explore.
              </span>
              <Stepper
                index={selected}
                count={projects.length}
                onChange={setSelected}
                noun="project"
              />
            </footer>
          </div>
        </div>
        <div className="ox-computer-bottom">
          <span className="ox-computer-vents" aria-hidden="true" />
          <span className="ox-computer-label">Curiosity inside.</span>
          <span className="ox-computer-power" aria-hidden="true" />
        </div>
      </div>
      <div className="ox-computer-neck" aria-hidden="true" />
      <div className="ox-computer-foot" aria-hidden="true" />
    </div>
  );
}

function ResearchBook({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const paper = papers[selected];
  const shortTitles: Record<string, string> = {
    memory: "Memory",
    nerone: "NERONE",
    seneca: "SENECA",
    bionet: "BIONET",
  };

  return (
    <div className="ox-research-object">
      <div className="ox-book-top">
        <h2 id="ox-dialog-title">
          <PixelIcon kind="book" /> The research shelf
        </h2>
        <CloseButton onClose={onClose} />
      </div>
      <nav className="ox-bookmarks" aria-label="Choose a publication">
        {papers.map((item, index) => (
          <button
            key={item.id}
            className={`ox-bookmark ox-bookmark-${index} ${index === selected ? "ox-bookmark-selected" : ""}`}
            onClick={() => setSelected(index)}
            aria-pressed={index === selected}
          >
            <span>{shortTitles[item.id] ?? item.title}</span>
            <small>{item.year}</small>
          </button>
        ))}
      </nav>
      <div className="ox-open-book">
        <div className="ox-book-pages" key={paper.id}>
          <section
            className="ox-book-page ox-book-left"
            aria-label="Publication title page"
          >
            <div className="ox-book-running">
              Selected research <span aria-hidden="true">✦</span> {paper.year}
            </div>
            <div className="ox-book-ornament" aria-hidden="true">
              <PixelIcon
                kind={selected === 1 || selected === 2 ? "chip" : "computer"}
              />
            </div>
            <p className="ox-publication-venue">{paper.venue}</p>
            <h3>{paper.title}</h3>
            <div className="ox-book-topic-list">
              {paper.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <span className="ox-book-page-number">
              {String(selected * 2 + 1).padStart(2, "0")}
            </span>
          </section>
          <section
            className="ox-book-page ox-book-right"
            aria-label="Publication details"
          >
            <div className="ox-book-running">Notes from the paper</div>
            <h4>At a glance</h4>
            <p className="ox-book-abstract">{paper.description}</p>
            <h4>Written with</h4>
            <p className="ox-book-authors">{paper.authors.join(", ")}</p>
            <div className="ox-book-reference">
              <h4>Reference</h4>
              <p>{paper.doi}</p>
            </div>
            <ObjectLink href={paper.url} className="ox-book-read">
              Read the publication
            </ObjectLink>
            <span className="ox-book-page-number">
              {String(selected * 2 + 2).padStart(2, "0")}
            </span>
          </section>
        </div>
        <div className="ox-book-binding" aria-hidden="true" />
        <footer className="ox-book-footer">
          <span>A few questions worth following.</span>
          <Stepper
            index={selected}
            count={papers.length}
            onChange={setSelected}
            noun="publication"
          />
        </footer>
      </div>
      <div className="ox-book-page-edges" aria-hidden="true" />
    </div>
  );
}

function JourneyBoard({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const item = experience[selected];

  return (
    <div className="ox-corkboard">
      <header className="ox-board-header">
        <div className="ox-board-title-tape">
          <h2 id="ox-dialog-title">Connecting the dots.</h2>
          <p>{profile.name}</p>
        </div>
        <CloseButton onClose={onClose} />
      </header>
      <div className="ox-board-body">
        <nav
          className="ox-pinned-notes"
          aria-label="Choose a chapter of the journey"
        >
          {experience.map((event, index) => (
            <button
              key={`${event.title}-${event.period}`}
              className={`ox-small-note ox-small-note-${index} ${index === selected ? "ox-small-note-selected" : ""}`}
              onClick={() => setSelected(index)}
              aria-pressed={index === selected}
            >
              <span className="ox-note-pin" aria-hidden="true" />
              <small>{event.period}</small>
              <strong>{event.organization}</strong>
              <span>
                {index === selected ? "Reading now" : "Read this note"}{" "}
                <span aria-hidden="true">↗</span>
              </span>
            </button>
          ))}
        </nav>
        <article className="ox-large-note" key={`${item.title}-${item.period}`}>
          <span className="ox-note-pin" aria-hidden="true" />
          <div className="ox-note-meta">
            <span>From the journey</span>
            <span>{item.period}</span>
          </div>
          <h3>{item.title}</h3>
          <p className="ox-note-organization">{item.organization}</p>
          <div className="ox-note-rule" />
          <p className="ox-note-description">{item.description}</p>
          <ObjectLink href={item.url} className="ox-note-source">
            Follow the story
          </ObjectLink>
          <div className="ox-note-signature">
            <span aria-hidden="true">rb.</span>
            <p>
              Engineering, research
              <br />
              and a curious mind.
            </p>
          </div>
        </article>
      </div>
      <footer className="ox-board-footer">
        <p>{profile.education}</p>
        <Stepper
          index={selected}
          count={experience.length}
          onChange={setSelected}
          noun="chapter"
        />
      </footer>
    </div>
  );
}

function ContactLetter({ onClose }: { onClose: () => void }) {
  return (
    <div className="ox-mail-object">
      <div className="ox-envelope-back" aria-hidden="true" />
      <article className="ox-letter">
        <header className="ox-letter-header">
          <span className="ox-letter-from">
            A little note from
            <br />
            <strong>{profile.name}</strong>
          </span>
          <div className="ox-letter-stamp" aria-hidden="true">
            <PixelIcon kind="mail" />
            <span>HELLO</span>
          </div>
          <CloseButton onClose={onClose} />
        </header>
        <div className="ox-letter-content">
          <p className="ox-letter-greeting">Hello, fellow curious person.</p>
          <h2 id="ox-dialog-title">
            Good things start
            <br />
            with a conversation.
          </h2>
          <p className="ox-letter-intro">
            An idea, a technical rabbit hole, or a project worth building
            together. Here is where you can find me.
          </p>
          <div className="ox-letter-links">
            <ObjectLink href={links.linkedin}>
              <PixelIcon kind="link" />
              <span>
                <strong>LinkedIn</strong>
                <small>Experience and conversations.</small>
              </span>
            </ObjectLink>
            <ObjectLink href={links.github}>
              <PixelIcon kind="code" />
              <span>
                <strong>GitHub</strong>
                <small>Code, experiments and things I have built.</small>
              </span>
            </ObjectLink>
            <ObjectLink href={links.musemind}>
              <PixelIcon kind="museum" />
              <span>
                <strong>MuseMind</strong>
                <small>A closer look at what we are building.</small>
              </span>
            </ObjectLink>
          </div>
          <div className="ox-letter-signoff">
            <span>See you out there,</span>
            <strong>
              Raffaele<span aria-hidden="true">✦</span>
            </strong>
          </div>
        </div>
      </article>
      <div className="ox-envelope-front" aria-hidden="true">
        <span>Sent with curiosity.</span>
      </div>
    </div>
  );
}

export default function ObjectExperience({
  section,
  onClose,
}: ObjectExperienceProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused?.isConnected)
        previouslyFocused.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={`object-experience ox-experience-${section}`}
      aria-labelledby="ox-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      {section === "projects" && <ProjectComputer onClose={onClose} />}
      {section === "research" && <ResearchBook onClose={onClose} />}
      {section === "profile" && <JourneyBoard onClose={onClose} />}
      {section === "contact" && <ContactLetter onClose={onClose} />}
    </dialog>
  );
}
