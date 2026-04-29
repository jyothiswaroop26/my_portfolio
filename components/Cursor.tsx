"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 900px)").matches) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { x: mouse.x, y: mouse.y };
    const ring = { x: mouse.x, y: mouse.y };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    let raf = 0;
    const loop = () => {
      dot.x += (mouse.x - dot.x) * 0.85;
      dot.y += (mouse.y - dot.y) * 0.85;
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const setHover = (on: boolean) => {
      dotRef.current?.classList.toggle(styles.hover, on);
      ringRef.current?.classList.toggle(styles.hover, on);
    };

    const hoverSelector =
      'a, button, [data-magnetic], [data-tilt], .project-card, .nav-link, .contact-tile, .tag-pill';

    const addListeners = () => {
      document.querySelectorAll(hoverSelector).forEach((el) => {
        el.addEventListener("mouseenter", () => setHover(true));
        el.addEventListener("mouseleave", () => setHover(false));
      });
    };

    window.addEventListener("mousemove", onMove);
    // Defer until DOM is fully populated by other components.
    const t = setTimeout(addListeners, 100);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} aria-hidden />
      <div ref={ringRef} className={styles.ring} aria-hidden />
      <div ref={orbRef} className="bg-orb" aria-hidden />
    </>
  );
}
