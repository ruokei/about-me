import { motion, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotionEnabled } from "@/lib/motion-preference";

interface HyperTextProps {
  text: string;
  duration?: number;
  framerProps?: Variants;
  className?: string;
  animateOnLoad?: boolean;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const defaultVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 3 },
};

export function HyperText({
  text,
  duration = 700,
  framerProps = defaultVariants,
  className,
  animateOnLoad = true,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const root = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedMotion = !useMotionEnabled();

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setDisplayText(text);
  }, [text]);

  const scramble = useCallback(() => {
    if (reducedMotion) return;
    if (timer.current) clearInterval(timer.current);
    const letters = [...text];
    const started = performance.now();
    timer.current = setInterval(() => {
      const progress = Math.min((performance.now() - started) / duration, 1);
      const settled = Math.floor(progress * letters.length);
      setDisplayText(letters.map((letter, index) => {
        if (index < settled || !/[A-Za-z]/.test(letter)) return letter;
        return alphabet[Math.floor(Math.random() * alphabet.length)];
      }).join(""));
      if (progress === 1) stop();
    }, 32);
  }, [duration, reducedMotion, stop, text]);

  useEffect(() => {
    if (!animateOnLoad || reducedMotion || !root.current || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        scramble();
        observer.disconnect();
      }
    }, { threshold: 0.7 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [animateOnLoad, reducedMotion, scramble]);

  useEffect(() => {
    if (reducedMotion) stop();
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [reducedMotion, stop]);

  return (
    <span
      ref={root}
      className={cn("hyper-text", className)}
      onMouseEnter={() => {
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) scramble();
      }}
    >
      <span className="hyper-glyphs" aria-hidden="true">
        {[...displayText].map((letter, index) => (
          <motion.span
            key={index}
            variants={framerProps}
            initial={reducedMotion ? false : "initial"}
            animate="animate"
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {letter}
          </motion.span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
