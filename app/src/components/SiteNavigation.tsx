import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "about", label: "About", number: "01" },
  { id: "capabilities", label: "Capabilities", number: "02" },
  { id: "focus", label: "Now", number: "03" },
];

export function SiteNavigation() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = "home";
        for (const { id } of sections) {
          const section = document.getElementById(id);
          if (section && section.getBoundingClientRect().top <= window.innerHeight * .38) current = id;
        }
        setActive(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 721px)");
    const closeOnWide = () => { if (wide.matches) dialog.current?.close(); };
    wide.addEventListener("change", closeOnWide);
    return () => wide.removeEventListener("change", closeOnWide);
  }, []);

  function openMenu() {
    dialog.current?.showModal();
    setOpen(true);
  }

  function closeMenu() {
    dialog.current?.close();
    setOpen(false);
  }

  return (
    <>
      <nav className="nav liquid-glass" aria-label="Main navigation">
        {sections.map(({ id, label }) => (
          <a href={`#${id}`} aria-current={active === id ? "location" : undefined} key={id}>
            {label}
          </a>
        ))}
      </nav>
      <button className="menu-trigger" type="button" aria-label="Open menu" aria-controls="mobile-nav" aria-expanded={open} onClick={openMenu}>
        <Menu size={21} strokeWidth={1.7} aria-hidden="true" />
      </button>
      <dialog className="mobile-menu" id="mobile-nav" ref={dialog} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }}>
        <div className="mobile-menu-panel">
          <div className="mobile-menu-head"><span>Explore / DT</span><button type="button" aria-label="Close menu" onClick={closeMenu}><X size={22} aria-hidden="true" /></button></div>
          <nav className="mobile-menu-links" aria-label="Mobile navigation">
            {sections.map(({ id, label, number }) => (
              <a href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={closeMenu} key={id}><span>{number}</span>{label}<span aria-hidden="true">↗</span></a>
            ))}
          </nav>
          <div className="mobile-menu-footer">
            <span>Connect</span>
            <a href="https://github.com/ruokei" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/derrick8tan/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a href="mailto:modquack@gmail.com">Email ↗</a>
          </div>
        </div>
      </dialog>
    </>
  );
}
