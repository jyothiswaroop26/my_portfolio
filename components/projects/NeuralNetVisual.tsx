"use client";

import { useEffect, useRef, useState } from "react";
import { NeuralNetwork } from "@/lib/neural-network";
import styles from "./NeuralNetVisual.module.css";

const features = [
  { name: "age", weight: 92, val: "0.31" },
  { name: "city", weight: 78, val: "0.24" },
  { name: "category", weight: 60, val: "0.18" },
  { name: "marital", weight: 42, val: "0.13" },
  { name: "occupation", weight: 30, val: "0.09" },
];

export default function NeuralNetVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pred, setPred] = useState(9247);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const net = new NeuralNetwork(canvas, {
      layers: [5, 8, 8, 1],
      edgeAlpha: 0.12,
      spawnRate: 0.65,
      mouseRadius: 100,
      dim: 1,
    });
    net.start();

    const t = setInterval(() => {
      setPred(9000 + Math.floor(Math.random() * 800));
    }, 1500);

    return () => {
      net.destroy();
      clearInterval(t);
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.layers}>
        <span style={{ left: "8%" }}>input</span>
        <span style={{ left: "38%" }}>hidden</span>
        <span style={{ left: "68%" }}>hidden</span>
        <span style={{ left: "92%" }}>output</span>
      </div>

      <div className={styles.feat}>
        <div className={styles.featTitle}>feature importance</div>
        {features.map((f) => (
          <div key={f.name} className={styles.featRow}>
            <span>{f.name}</span>
            <div className={styles.featBar}>
              <span style={{ ["--w" as string]: `${f.weight}%` }} />
            </div>
            <span className={styles.featV}>{f.val}</span>
          </div>
        ))}
      </div>

      <div className={styles.pred}>
        <div className={styles.predLbl}>prediction</div>
        <div className={styles.predVal}>${pred.toLocaleString()}</div>
        <div className={styles.predConf}>±412 · 95% CI</div>
      </div>
    </div>
  );
}
