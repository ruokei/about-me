import { useSyncExternalStore } from "react";

const key = "portfolio-motion";
const event = "portfolio-motion-change";
let sessionOverride: boolean | null = null;

export function isMotionEnabled() {
  if (sessionOverride !== null) return sessionOverride;
  try {
    const saved = window.localStorage.getItem(key);
    if (saved === "on") return true;
    if (saved === "off") return false;
  } catch {
    // Use the device preference when storage is unavailable.
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function syncMotionClass() {
  const enabled = isMotionEnabled();
  document.documentElement.classList.toggle("motion-enabled", enabled);
  document.documentElement.classList.toggle("motion-paused", !enabled);
}

export function setMotionEnabled(enabled: boolean) {
  sessionOverride = enabled;
  try {
    window.localStorage.setItem(key, enabled ? "on" : "off");
  } catch {
    // The current page still responds even when storage is unavailable.
  }
  syncMotionClass();
  window.dispatchEvent(new Event(event));
}

export function subscribeMotion(listener: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const update = () => { syncMotionClass(); listener(); };
  window.addEventListener(event, update);
  preference.addEventListener("change", update);
  return () => {
    window.removeEventListener(event, update);
    preference.removeEventListener("change", update);
  };
}

export function useMotionEnabled() {
  return useSyncExternalStore(subscribeMotion, isMotionEnabled, () => false);
}
