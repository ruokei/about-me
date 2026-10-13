import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Check, Code2, Copy, Mail, UserRound } from "lucide-react";

const email = "modquack@gmail.com";

const cards = [
  { label: "GitHub", title: "github.com/ruokei", note: "Infrastructure, automation, and experiments ↗" },
  { label: "LinkedIn", title: "Derrick Tan", note: "Cloud systems · platform engineering ↗" },
  { label: "Email", title: email, note: "Click to copy the address" },
];

export function ContactCards() {
  const [active, setActive] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const previous = useRef<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show(index: number) {
    if (window.matchMedia("(max-width: 720px)").matches) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    previous.current = active;
    setActive(index);
  }

  function hide() {
    setActive(null);
    previous.current = null;
  }

  function showOnHover(index: number) {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) show(index);
  }

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setStatus("Email address copied");
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => { setCopied(false); setStatus(""); }, 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  const direction = active !== null && previous.current !== null && active < previous.current ? -8 : 8;

  return (
    <>
      <div
        className="text-links"
        aria-label="Profile and email links"
        onPointerLeave={() => { closeTimer.current = setTimeout(hide, 80); }}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) hide(); }}
        onKeyDown={(event) => { if (event.key === "Escape") hide(); }}
      >
        <a href="https://github.com/ruokei" target="_blank" rel="noopener noreferrer" onMouseEnter={() => showOnHover(0)} onFocus={() => show(0)}>GitHub ↗</a>
        <a href="https://www.linkedin.com/in/derrick8tan/" target="_blank" rel="noopener noreferrer" onMouseEnter={() => showOnHover(1)} onFocus={() => show(1)}>LinkedIn ↗</a>
        <button type="button" aria-label="Copy email address" onMouseEnter={() => showOnHover(2)} onFocus={() => show(2)} onClick={copyEmail}>{copied ? "Copied ✓" : "Email ↗"}</button>
        <div className={`contact-preview${active !== null ? " is-visible" : ""}`} style={{ "--card-shift": `${direction}px` } as CSSProperties} aria-hidden="true">
          {cards.map((card, index) => (
            <div className={`contact-panel${active === index ? " is-active" : ""}`} key={card.label}>
              <span className="card-kicker">{card.label}</span>
              <strong>{card.title}</strong>
              <span className="card-note">{index === 2 && copied ? "Copied to clipboard" : card.note}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mobile-contact-cards" aria-label="Profile and email cards">
        <a className="mobile-contact-card" href="https://github.com/ruokei" target="_blank" rel="noopener noreferrer">
          <span className="mobile-contact-icon"><Code2 size={22} strokeWidth={1.8} aria-hidden="true" /></span>
          <span className="mobile-contact-copy"><strong>GitHub</strong><span>github.com/ruokei</span></span>
          <ArrowUpRight className="mobile-contact-action" size={19} aria-hidden="true" />
        </a>
        <a className="mobile-contact-card" href="https://www.linkedin.com/in/derrick8tan/" target="_blank" rel="noopener noreferrer">
          <span className="mobile-contact-icon"><UserRound size={22} strokeWidth={1.8} aria-hidden="true" /></span>
          <span className="mobile-contact-copy"><strong>LinkedIn</strong><span>Derrick Tan · platform engineering</span></span>
          <ArrowUpRight className="mobile-contact-action" size={19} aria-hidden="true" />
        </a>
        <button className="mobile-contact-card" type="button" onClick={copyEmail} aria-label="Copy modquack@gmail.com">
          <span className="mobile-contact-icon"><Mail size={22} strokeWidth={1.8} aria-hidden="true" /></span>
          <span className="mobile-contact-copy"><strong>{copied ? "Copied" : "Email"}</strong><span>{email}</span></span>
          {copied ? <Check className="mobile-contact-action" size={19} aria-hidden="true" /> : <Copy className="mobile-contact-action" size={19} aria-hidden="true" />}
        </button>
      </div>
      <span className="copy-status" role="status" aria-live="polite">{status}</span>
    </>
  );
}
