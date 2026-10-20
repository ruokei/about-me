import { useEffect, useId, useRef, useState, type ReactNode } from "react";

const previews = {
  infrastructure: {
    title: "Built to be repeated",
    description: "I turn infrastructure changes into version-controlled workflows that can be reviewed, reproduced, and improved.",
    flow: ["Define", "Review", "Provision"],
  },
  delivery: {
    title: "A clearer path to production",
    description: "I connect build pipelines, containers, and GitOps so releases are easier to trace and manage.",
    flow: ["Build", "Package", "Deploy"],
  },
  observability: {
    title: "Know what changed",
    description: "Metrics, logs, and alerts help turn production signals into useful action.",
    flow: ["Metrics", "Logs", "Respond"],
  },
} as const;

export type PreviewKey = keyof typeof previews;

export function HoverPreview({ kind, children }: { kind: PreviewKey; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const id = useId();
  const preview = previews[kind];

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return <span className="inline-preview" ref={root} data-open={open}>
    <button type="button" className="inline-preview-trigger" aria-expanded={open} aria-describedby={id} onClick={() => setOpen((value) => !value)}>{children}</button>
    <span className="inline-preview-card" id={id} role="tooltip">
      <span className="inline-preview-kicker">How I work / {kind}</span>
      <strong>{preview.title}</strong>
      <span className="inline-preview-description">{preview.description}</span>
      <span className="inline-preview-flow" aria-hidden="true">{preview.flow.map((step, index) => <span className="inline-preview-step" key={step}>{step}{index < preview.flow.length - 1 && <span className="inline-preview-arrow">→</span>}</span>)}</span>
    </span>
  </span>;
}
