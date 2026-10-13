import { useState } from "react";

const markers = [
  { key: "build", label: "Build", heading: "Build the foundation", detail: "Shape cloud infrastructure and reusable services with code, so each environment starts from a reliable pattern." },
  { key: "deploy", label: "Deploy", heading: "Deliver with confidence", detail: "Move changes through automated pipelines and GitOps workflows with a clear, repeatable release path." },
  { key: "observe", label: "Observe", heading: "Know what is happening", detail: "Connect metrics, logs, and alerts so teams can spot issues early and understand production behavior." },
] as const;

export function OrbTooltips() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="orb-stage" role="group" aria-label="Build, Deploy, and Observe: how I work" onKeyDown={(event) => { if (event.key === "Escape") setActive(null); }}>
      <div className="orb-core" aria-hidden="true" />
      {markers.map((marker) => (
        <div className={`orb-marker ${marker.key}${active === marker.key ? " is-active" : ""}`} key={marker.key}
          onMouseEnter={() => setActive(marker.key)} onMouseLeave={() => setActive(null)}>
          <button className="orb-label" type="button" aria-expanded={active === marker.key}
            aria-controls={`orb-tip-${marker.key}`}
            onFocus={() => setActive(marker.key)}
            onBlur={(event) => { if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) setActive(null); }}
            onClick={() => setActive((current) => window.matchMedia("(hover: hover) and (pointer: fine)").matches ? marker.key : current === marker.key ? null : marker.key)}>{marker.label}</button>
          <div className="orb-tooltip" id={`orb-tip-${marker.key}`} role="status" aria-hidden={active !== marker.key}>
            <span className="orb-tooltip-kicker">{marker.label} / 0{markers.indexOf(marker) + 1}</span>
            <strong>{marker.heading}</strong>
            <p>{marker.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
