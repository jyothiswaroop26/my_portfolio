/* ============================================
   Neural Network rendering engine
   - Multi-layer feed-forward visualisation
   - Bezier-curved synapses
   - Signal pulses propagate forward
   - Cursor activates nearby nodes
   ============================================ */

export interface NNNode {
  x: number;
  y: number;
  layer: number;
  idx: number;
  activation: number;
  baseR: number;
  phase: number;
}

export interface NNEdge {
  from: NNNode;
  to: NNNode;
  weight: number;
}

export interface NNSignal {
  edge: NNEdge;
  t: number;
  speed: number;
  color: string;
}

export interface NeuralNetworkOptions {
  layers?: number[];
  padX?: number;
  padY?: number;
  colors?: string[];
  edgeAlpha?: number;
  spawnRate?: number;
  mouseRadius?: number;
  dim?: number;
  fixed?: boolean;
}

export class NeuralNetwork {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private layers: number[];
  private padX: number;
  private padY: number;
  private colors: string[];
  private baseEdgeAlpha: number;
  private spawnRate: number;
  private mouseRadius: number;
  private dim: number;
  private fixed: boolean;
  private dpr: number;
  private mouse = { x: -9999, y: -9999 };
  private nodes: NNNode[] = [];
  private edges: NNEdge[] = [];
  private signals: NNSignal[] = [];
  private w = 0;
  private h = 0;
  private rafId: number | null = null;
  private resizeHandler: () => void;
  private moveHandler: (e: MouseEvent) => void;
  private leaveHandler: () => void;
  private moveTarget: Window | HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, opts: NeuralNetworkOptions = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D context not available");
    this.ctx = ctx;

    this.layers = opts.layers ?? [6, 10, 12, 10, 4];
    this.padX = opts.padX ?? 0.08;
    this.padY = opts.padY ?? 0.08;
    this.colors = opts.colors ?? ["#c8ff3e", "#6b5cff", "#ff5cb1"];
    this.baseEdgeAlpha = opts.edgeAlpha ?? 0.06;
    this.spawnRate = opts.spawnRate ?? 0.4;
    this.mouseRadius = opts.mouseRadius ?? 180;
    this.dim = opts.dim ?? 1;
    this.fixed = opts.fixed ?? false;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.resizeHandler = () => {
      this.resize();
      this.build();
    };
    this.moveHandler = (e: MouseEvent) => this.onMove(e);
    this.leaveHandler = () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    };
    this.moveTarget = this.fixed ? window : this.canvas;

    this.resize();
    this.build();

    this.moveTarget.addEventListener("mousemove", this.moveHandler as EventListener);
    if (!this.fixed) {
      this.canvas.addEventListener("mouseleave", this.leaveHandler);
    }
    window.addEventListener("resize", this.resizeHandler);
  }

  private onMove(e: MouseEvent) {
    if (this.fixed) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    } else {
      const r = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    }
  }

  private resize() {
    const w = this.canvas.offsetWidth || this.canvas.parentElement?.clientWidth || 0;
    const h = this.canvas.offsetHeight || this.canvas.parentElement?.clientHeight || 0;
    this.canvas.width = Math.max(1, w * this.dpr);
    this.canvas.height = Math.max(1, h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.w = w;
    this.h = h;
  }

  private build() {
    this.nodes = [];
    const padX = this.w * this.padX;
    const padY = this.h * this.padY;
    const usableW = this.w - 2 * padX;
    const usableH = this.h - 2 * padY;
    const L = this.layers.length;

    this.layers.forEach((count, li) => {
      const x = L === 1 ? this.w / 2 : padX + (usableW * li) / (L - 1);
      for (let i = 0; i < count; i++) {
        const y = padY + (usableH * (i + 0.5)) / count;
        this.nodes.push({
          x,
          y,
          layer: li,
          idx: i,
          activation: 0,
          baseR: 1.8 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2,
        });
      }
    });

    this.edges = [];
    for (let li = 0; li < L - 1; li++) {
      const fromN = this.nodes.filter((n) => n.layer === li);
      const toN = this.nodes.filter((n) => n.layer === li + 1);
      for (const f of fromN) {
        for (const t of toN) {
          this.edges.push({ from: f, to: t, weight: Math.random() });
        }
      }
    }
  }

  private spawnSignal(edge: NNEdge | undefined, color?: string) {
    if (!edge) return;
    this.signals.push({
      edge,
      t: 0,
      speed: 0.012 + Math.random() * 0.018,
      color: color ?? this.colors[Math.floor(Math.random() * this.colors.length)],
    });
  }

  private edgesFrom(node: NNNode) {
    return this.edges.filter((e) => e.from === node);
  }

  private step() {
    if (Math.random() < this.spawnRate) {
      const e = this.edges[Math.floor(Math.random() * this.edges.length)];
      this.spawnSignal(e);
    }

    if (this.mouse.x > -100) {
      for (const n of this.nodes) {
        const dx = n.x - this.mouse.x;
        const dy = n.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < this.mouseRadius) {
          const f = (this.mouseRadius - d) / this.mouseRadius;
          n.activation = Math.min(1, n.activation + f * 0.08);
          if (Math.random() < 0.04 * f) {
            const out = this.edgesFrom(n);
            if (out.length) {
              this.spawnSignal(out[Math.floor(Math.random() * out.length)], this.colors[2]);
            }
          }
        }
      }
    }

    for (const n of this.nodes) n.activation *= 0.93;

    const remaining: NNSignal[] = [];
    for (const s of this.signals) {
      s.t += s.speed;
      if (s.t >= 1) {
        s.edge.to.activation = Math.min(1, s.edge.to.activation + 0.5);
        if (Math.random() < 0.65) {
          const out = this.edgesFrom(s.edge.to);
          if (out.length) {
            this.spawnSignal(out[Math.floor(Math.random() * out.length)], s.color);
          }
        }
      } else {
        remaining.push(s);
      }
    }
    this.signals = remaining;
    if (this.signals.length > 200) this.signals.splice(0, this.signals.length - 200);
  }

  private bezPoint(e: NNEdge, t: number) {
    const cx = (e.from.x + e.to.x) / 2;
    const p0 = e.from;
    const p3 = e.to;
    const p1x = cx;
    const p1y = e.from.y;
    const p2x = cx;
    const p2y = e.to.y;
    const mt = 1 - t;
    const x =
      mt * mt * mt * p0.x +
      3 * mt * mt * t * p1x +
      3 * mt * t * t * p2x +
      t * t * t * p3.x;
    const y =
      mt * mt * mt * p0.y +
      3 * mt * mt * t * p1y +
      3 * mt * t * t * p2y +
      t * t * t * p3.y;
    return { x, y };
  }

  private render(time: number) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // edges
    for (const e of this.edges) {
      const lit = (e.from.activation + e.to.activation) / 2;
      const op = (this.baseEdgeAlpha + e.weight * 0.04 + lit * 0.3) * this.dim;
      ctx.strokeStyle = `rgba(200, 255, 62, ${op})`;
      ctx.lineWidth = 0.6 + lit * 1.2;
      const cx = (e.from.x + e.to.x) / 2;
      ctx.beginPath();
      ctx.moveTo(e.from.x, e.from.y);
      ctx.bezierCurveTo(cx, e.from.y, cx, e.to.y, e.to.x, e.to.y);
      ctx.stroke();
    }

    // signals
    for (const s of this.signals) {
      const head = this.bezPoint(s.edge, s.t);
      ctx.shadowBlur = 14 * this.dim;
      ctx.shadowColor = s.color;
      ctx.fillStyle = s.color;
      ctx.globalAlpha = this.dim;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 2.4, 0, Math.PI * 2);
      ctx.fill();

      const tailT = Math.max(0, s.t - 0.08);
      const tail = this.bezPoint(s.edge, tailT);
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = 0.4 * this.dim;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(head.x, head.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.shadowBlur = 0;

    // nodes
    for (const n of this.nodes) {
      const pulse = Math.sin(time * 0.001 + n.phase) * 0.15 + 0.85;
      const r = n.baseR * pulse + n.activation * 4;

      if (n.activation > 0.05) {
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 6);
        grd.addColorStop(0, `rgba(200, 255, 62, ${n.activation * 0.35 * this.dim})`);
        grd.addColorStop(1, "rgba(200, 255, 62, 0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      const coreOp = (0.45 + n.activation * 0.55) * this.dim;
      ctx.fillStyle =
        n.activation > 0.2
          ? `rgba(200, 255, 62, ${coreOp})`
          : `rgba(200, 255, 62, ${0.35 * this.dim})`;
      ctx.shadowBlur = (4 + n.activation * 16) * this.dim;
      ctx.shadowColor = "#c8ff3e";
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  private loop = (time: number) => {
    this.step();
    this.render(time || 0);
    this.rafId = requestAnimationFrame(this.loop);
  };

  start() {
    if (this.rafId === null) this.loop(0);
  }

  destroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.moveTarget.removeEventListener("mousemove", this.moveHandler as EventListener);
    if (!this.fixed) {
      this.canvas.removeEventListener("mouseleave", this.leaveHandler);
    }
    window.removeEventListener("resize", this.resizeHandler);
  }
}
