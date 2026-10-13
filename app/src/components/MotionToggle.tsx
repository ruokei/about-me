import { useMotionEnabled, setMotionEnabled } from "@/lib/motion-preference";

export function MotionToggle() {
  const enabled = useMotionEnabled();
  return (
    <button
      className="motion-toggle"
      type="button"
      aria-label={enabled ? "Pause animations" : "Enable animations"}
      aria-pressed={enabled}
      onClick={() => setMotionEnabled(!enabled)}
    >
      <span className="motion-toggle-dot" aria-hidden="true" />
      Motion {enabled ? "on" : "off"}
    </button>
  );
}
