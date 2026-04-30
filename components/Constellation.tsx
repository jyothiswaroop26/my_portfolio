"use client";

import { useEffect, useRef } from "react";
import styles from "./Constellation.module.css";

/* ============================================================
   Constellation — interactive canvas network graph
   - Labelled tech-skill nodes scattered across the viewport
   - Color-coded by category
   - Mouse proximity: nodes glow + enlarge, lines brighten
   - Particles travel along connections
   - Subtle breathing pulse via Math.sin
   ============================================================ */

type Category = "ml" | "genai" | "data" | "vision" | "deploy" | "lang";

const CATEGORIES: Record<Category, string> = {
  ml: "#c8ff3e",      // lime
  genai: "#a78bfa",   // violet
  data: "#22d3ee",    // cyan
  vision: "#34d399",  // emerald
  deploy: "#fbbf24",  // amber
  lang: "#ff5cb1",    // pink
};

interface NodeDef {
  id: string;
  label: string;
  category: Category;
  x: number; // 0..1 of viewport width
  y: number; // 0..1 of viewport height
  size?: number; // base radius
}

/* Nodes hug the viewport perimeter so the centred name never collides with them.
   The canvas is position:fixed, so any node at small y stays glued under each
   section header as the page scrolls — that's why we leave the top strip empty.
   Safe-zones to dodge:
     - Top strip:    y < 0.28  (hero HUDs + every section header lives here)
     - Center name:  x: 0.24..0.76 · y: 0.06..0.78  (in hero) */
const NODES: NodeDef[] = [
  // === LEFT COLUMN — below the top-left HUD ===
  { id: "ml", label: "ML", category: "ml", x: 0.16, y: 0.32, size: 6 },
  { id: "dl", label: "Deep Learning", category: "ml", x: 0.05, y: 0.42 },
  { id: "pytorch", label: "PyTorch", category: "ml", x: 0.18, y: 0.50 },
  { id: "tensorflow", label: "TensorFlow", category: "ml", x: 0.06, y: 0.60 },
  { id: "sklearn", label: "Scikit-learn", category: "ml", x: 0.18, y: 0.70 },
  { id: "opencv", label: "OpenCV", category: "vision", x: 0.06, y: 0.80 },

  // === RIGHT COLUMN — below the top-right HUD ===
  { id: "llm", label: "LLMs", category: "genai", x: 0.84, y: 0.32, size: 6 },
  { id: "rag", label: "RAG", category: "genai", x: 0.96, y: 0.42 },
  { id: "nlp", label: "NLP", category: "genai", x: 0.84, y: 0.50 },
  { id: "transformers", label: "Transformers", category: "genai", x: 0.96, y: 0.58 },
  { id: "flask", label: "Flask", category: "deploy", x: 0.84, y: 0.66 },
  { id: "fastapi", label: "FastAPI", category: "deploy", x: 0.96, y: 0.74 },
  { id: "docker", label: "Docker", category: "deploy", x: 0.84, y: 0.82 },

  // === BOTTOM STRIP — below the CTA buttons ===
  { id: "cnn", label: "CNN", category: "vision", x: 0.16, y: 0.92 },
  { id: "pandas", label: "Pandas", category: "data", x: 0.27, y: 0.94 },
  { id: "numpy", label: "NumPy", category: "data", x: 0.36, y: 0.92 },
  { id: "python", label: "Python", category: "lang", x: 0.46, y: 0.94, size: 8 },
  { id: "sql", label: "SQL", category: "data", x: 0.58, y: 0.92 },
  { id: "powerbi", label: "Power BI", category: "data", x: 0.70, y: 0.94 },
  { id: "cicd", label: "CI/CD", category: "deploy", x: 0.86, y: 0.92 },
];

const CONNECTIONS: [string, string][] = [
  // python hub
  ["python", "pytorch"], ["python", "tensorflow"], ["python", "sklearn"],
  ["python", "pandas"], ["python", "numpy"], ["python", "opencv"],
  ["python", "flask"], ["python", "fastapi"], ["python", "ml"],
  ["python", "llm"],

  // ml chain
  ["ml", "dl"], ["ml", "sklearn"],
  ["dl", "pytorch"], ["dl", "tensorflow"], ["dl", "cnn"],
  ["pytorch", "transformers"], ["tensorflow", "cnn"],

  // genai
  ["llm", "rag"], ["llm", "transformers"], ["llm", "nlp"],
  ["nlp", "transformers"],

  // data
  ["pandas", "numpy"], ["pandas", "sql"], ["sql", "powerbi"],
  ["pandas", "powerbi"],

  // vision
  ["opencv", "cnn"],

  // deploy
  ["flask", "docker"], ["fastapi", "docker"], ["docker", "cicd"],

  // a few cross-links so the graph feels woven
  ["pandas", "ml"], ["nlp", "pandas"], ["sql", "ml"],
];

/* runtime types */
interface RNode {
  id: string;
  label: string;
  color: string;
  baseR: number;
  px: number; // percentage x
  py: number; // percentage y
  x: number;  // pixels
  y: number;
  phase: number;
  activation: number;
}

interface RConn {
  a: RNode;
  b: RNode;
  particles: { t: number; speed: number; color: string }[];
  spawnTimer: number;
}

export default function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };
    const MOUSE_R = 200;
    const FONT = "11px ui-monospace, SFMono-Regular, Menlo, monospace";

    const nodes: RNode[] = NODES.map((n) => ({
      id: n.id,
      label: n.label,
      color: CATEGORIES[n.category],
      baseR: n.size ?? 4,
      px: n.x,
      py: n.y,
      x: 0,
      y: 0,
      phase: Math.random() * Math.PI * 2,
      activation: 0,
    }));
    const byId = new Map(nodes.map((n) => [n.id, n]));

    const conns: RConn[] = CONNECTIONS.map(([a, b]) => ({
      a: byId.get(a)!,
      b: byId.get(b)!,
      particles: [],
      spawnTimer: Math.random() * 100,
    })).filter((c) => c.a && c.b);

    function resize() {
      if (!canvas || !ctx) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const n of nodes) {
        n.x = n.px * w;
        n.y = n.py * h;
      }
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(now - last, 50); // ms, clamp
      last = now;
      step(dt, now);
      render(now);
      raf = requestAnimationFrame(loop);
    };

    function step(dt: number, time: number) {
      // node activation by mouse proximity
      for (const n of nodes) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_R) {
          const f = (MOUSE_R - d) / MOUSE_R;
          n.activation = Math.min(1, n.activation + f * 0.04 * (dt / 16));
        }
        n.activation *= Math.pow(0.94, dt / 16);
      }

      // connection particle spawning + movement
      for (const c of conns) {
        const lit = (c.a.activation + c.b.activation) / 2;
        c.spawnTimer -= dt;
        const spawnInterval = 1500 - lit * 1200; // hot connections spawn fast
        if (c.spawnTimer <= 0) {
          c.particles.push({
            t: 0,
            speed: 0.0006 + Math.random() * 0.0005,
            color: Math.random() < 0.5 ? c.a.color : c.b.color,
          });
          c.spawnTimer = spawnInterval + Math.random() * 1500;
        }
        for (const p of c.particles) p.t += p.speed * dt;
        c.particles = c.particles.filter((p) => p.t < 1);
      }
    }

    function render(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // connections
      for (const c of conns) {
        const lit = (c.a.activation + c.b.activation) / 2;
        const baseAlpha = 0.05;
        const alpha = baseAlpha + lit * 0.45;
        // gradient stroke between two node colors
        const grd = ctx.createLinearGradient(c.a.x, c.a.y, c.b.x, c.b.y);
        grd.addColorStop(0, hexA(c.a.color, alpha));
        grd.addColorStop(1, hexA(c.b.color, alpha));
        ctx.strokeStyle = grd;
        ctx.lineWidth = 0.6 + lit * 1.4;
        ctx.beginPath();
        ctx.moveTo(c.a.x, c.a.y);
        ctx.lineTo(c.b.x, c.b.y);
        ctx.stroke();
      }

      // particles
      for (const c of conns) {
        for (const p of c.particles) {
          const x = c.a.x + (c.b.x - c.a.x) * p.t;
          const y = c.a.y + (c.b.y - c.a.y) * p.t;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      // nodes
      for (const n of nodes) {
        const pulse = Math.sin(time * 0.001 + n.phase) * 0.15 + 1;
        const r = n.baseR * pulse + n.activation * 4;

        // outer halo when active
        if (n.activation > 0.05) {
          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 8);
          glow.addColorStop(0, hexA(n.color, n.activation * 0.45));
          glow.addColorStop(1, hexA(n.color, 0));
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 8, 0, Math.PI * 2);
          ctx.fill();
        }

        // ring
        ctx.strokeStyle = hexA(n.color, 0.4 + n.activation * 0.6);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 3, 0, Math.PI * 2);
        ctx.stroke();

        // core
        ctx.shadowBlur = 6 + n.activation * 16;
        ctx.shadowColor = n.color;
        ctx.fillStyle = hexA(n.color, 0.7 + n.activation * 0.3);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // label — flip to left side near right edge
        const lblAlpha = 0.55 + n.activation * 0.45;
        const labelOnLeft = n.x > w * 0.78;
        ctx.font = FONT;
        ctx.textBaseline = "middle";
        ctx.textAlign = labelOnLeft ? "right" : "left";
        const offset = r + 10;
        ctx.fillStyle = `rgba(245, 245, 247, ${lblAlpha})`;
        ctx.fillText(n.label, n.x + (labelOnLeft ? -offset : offset), n.y);
      }
    }

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />;
}

/* utility — convert "#rrggbb" + alpha → "rgba(r,g,b,a)" */
function hexA(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
