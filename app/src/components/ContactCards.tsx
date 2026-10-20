import { useEffect, useMemo, useRef, useState } from "react";
import { Code2, Mail, UserRound } from "lucide-react";
import { moveSpotlight } from "@/lib/spotlight";

const email = "modquack@gmail.com";
const links = [
  { label: "GitHub", href: "https://github.com/ruokei", icon: Code2 },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/derrick8tan/", icon: UserRound },
];
type Day = { date: string; count: number; level?: number };

async function copyText(value: string) {
  try { await navigator.clipboard.writeText(value); return true; } catch { /* Try the browser's older copy method. */ }
  try {
    const field = document.createElement("textarea");
    field.value = value;
    field.style.cssText = "position:fixed;opacity:0";
    document.body.append(field);
    field.select();
    const result = document.execCommand("copy");
    field.remove();
    return result;
  } catch { return false; }
}

function ContributionGraph({ days }: { days: Day[] }) {
  const cells = useMemo(() => {
    if (!days.length) return [];
    const blanks = Array.from({ length: new Date(`${days[0].date}T00:00:00Z`).getUTCDay() }, () => null);
    return [...blanks, ...days];
  }, [days]);

  return <div className="contact-graph" aria-label="GitHub contribution activity in the last year">
    {cells.map((day, index) => <span key={day?.date ?? `blank-${index}`} className={`contact-graph-day level-${day ? Math.min(4, day.level ?? (day.count === 0 ? 0 : day.count < 3 ? 1 : day.count < 6 ? 2 : day.count < 10 ? 3 : 4)) : 0}`}
      title={day ? `${day.count} contributions on ${day.date}` : undefined} aria-hidden="true" />)}
  </div>;
}

export function ContactCards() {
  const [active, setActive] = useState<number | null>(null);
  const [days, setDays] = useState<Day[] | null>(null);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://github-contributions-api.jogruber.de/v4/ruokei?y=last", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Activity unavailable")))
      .then((data: { contributions?: Day[] }) => { if (Array.isArray(data.contributions)) setDays(data.contributions); else setFetchFailed(true); })
      .catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setFetchFailed(true); });
    return () => { controller.abort(); if (timer.current) clearTimeout(timer.current); };
  }, []);

  async function copyEmail() {
    const copied = await copyText(email);
    setActive(2);
    setCopyState(copied ? "copied" : "manual");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyState("idle"), copied ? 3000 : 8000);
  }

  const total = days?.reduce((sum, day) => sum + day.count, 0);

  return <div className={`contact-cards${active !== null ? " has-preview" : ""}`} aria-label="Profile and email links" onKeyDown={(event) => { if (event.key === "Escape") setActive(null); }}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActive(null); }}>
    <div className="contact-socials" onMouseLeave={() => setActive(null)}>
      {links.map((link, index) => { const Icon = link.icon; return <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
        className="spotlight-control" onPointerMove={moveSpotlight} aria-label={link.label} aria-describedby={active === index ? "contact-card-description" : undefined}
        onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={(event) => {
          if (window.matchMedia("(hover: none), (pointer: coarse)").matches && active !== index) { event.preventDefault(); setActive(index); }
        }}><Icon size={23} strokeWidth={1.8} aria-hidden="true" /><span>{link.label}</span></a>; })}
      <button type="button" className="contact-email spotlight-control" onPointerMove={moveSpotlight} aria-label="Copy my email" aria-describedby={active === 2 ? "contact-card-description" : undefined}
        onMouseEnter={() => setActive(2)} onFocus={() => setActive(2)} onClick={copyEmail}>
        <Mail size={23} strokeWidth={1.8} aria-hidden="true" /><span>{copyState === "copied" ? "Copied" : "Email"}</span>
      </button>
      <div className={`contact-rich-card${active !== null ? " is-visible" : ""} card-${active ?? 0}`} id="contact-card-description" aria-hidden={active === null}>
        {active === 0 ? <div className="contact-rich-inner">
          <div className="contact-rich-head"><span className="contact-avatar">DT</span><span><strong>ruokei</strong><small>{days ? `${total?.toLocaleString()} contributions in the last year` : fetchFailed ? "GitHub activity unavailable" : "Loading GitHub activity…"}</small></span></div>
          {days && <ContributionGraph days={days} />}
          <span className="contact-rich-footer">View GitHub profile ↗</span>
        </div> : active === 1 ? <div className="contact-rich-inner contact-linkedin-card">
          <div className="contact-rich-head"><img className="contact-profile-image" src={`${import.meta.env.BASE_URL}assets/derrick-profile.png`} alt="" width="52" height="52" /><span><span className="contact-rich-kicker">LinkedIn / profile</span><strong>Derrick Tan</strong><small>Platform · DevOps · Systems</small></span></div>
          <p>Building cloud platforms, repeatable delivery paths, and observable infrastructure.</p><span className="contact-rich-footer">View LinkedIn profile ↗</span>
        </div> : <div className="contact-rich-inner contact-email-card">
          <span className="contact-rich-kicker">Email / direct</span><strong>{copyState === "copied" ? "Address copied" : "Let’s connect"}</strong><p>{email}</p><span className="contact-rich-footer">{copyState === "copied" ? "Ready to paste" : copyState === "manual" ? "Select the address to copy it manually" : "Click the email icon to copy the address"}</span>
        </div>}
      </div>
    </div>
    <span className="copy-status" role="status" aria-live="polite">{copyState === "copied" ? "Email address copied" : copyState === "manual" ? `Copy ${email} manually` : ""}</span>
  </div>;
}
