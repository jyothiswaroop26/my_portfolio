"use client";

import { motion } from "framer-motion";
import ForecastVisual from "./projects/ForecastVisual";
import NeuralNetVisual from "./projects/NeuralNetVisual";
import ClusterVisual from "./projects/ClusterVisual";
import styles from "./Projects.module.css";

interface Project {
  num: string;
  status: string;
  pulse?: boolean;
  title: { line1: string; line2: string };
  desc: string;
  tags: string[];
  impact: { num: string; lbl: string }[];
  visual: "forecast" | "nn" | "cluster";
  reverse?: boolean;
}

const projects: Project[] = [
  {
    num: "001",
    status: "live · 2026",
    pulse: true,
    title: { line1: "Supply Chain", line2: "Intelligence" },
    desc: "A conversational AI co-pilot for inventory teams. Forecasts demand from historical data and answers business questions in plain English.",
    tags: ["LLM", "RAG", "Time Series", "Python", "Flask"],
    impact: [
      { num: "↓ 32%", lbl: "stock-out risk" },
      { num: "↑ 4×", lbl: "decision speed" },
    ],
    visual: "forecast",
  },
  {
    num: "002",
    status: "shipped · sept 2025",
    title: { line1: "Spending", line2: "Predictor" },
    desc: "Random-forest regression on Black Friday transactions. Predicts customer spend from demographics and basket signals, surfacing high-value segments.",
    tags: ["Random Forest", "Scikit-learn", "Regression", "EDA"],
    impact: [
      { num: "R² 0.86", lbl: "model fit" },
      { num: "12K+", lbl: "rows trained" },
    ],
    visual: "nn",
    reverse: true,
  },
  {
    num: "003",
    status: "shipped · sept 2025",
    title: { line1: "Customer", line2: "Segmentation" },
    desc: "K-means clustering pipeline that groups customers by behavior. Drives targeted campaigns through interactive Power BI dashboards.",
    tags: ["K-Means", "Power BI", "Clustering", "Pandas"],
    impact: [
      { num: "4", lbl: "distinct segments" },
      { num: "↑ 28%", lbl: "campaign CTR" },
    ],
    visual: "cluster",
  },
];

const visuals = {
  forecast: ForecastVisual,
  nn: NeuralNetVisual,
  cluster: ClusterVisual,
};

export default function Projects() {
  return (
    <section id="work" className="section-shell">
      <div className="section-head">
        <span className="section-num">01</span>
        <h2 className="section-title">selected work</h2>
        <span className="section-count">[ 3 projects ]</span>
      </div>

      <div className={styles.list}>
        {projects.map((p, idx) => {
          const Visual = visuals[p.visual];
          return (
            <motion.article
              key={p.num}
              className={`${styles.project} ${p.reverse ? styles.reverse : ""} project-card`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
            >
              <div className={styles.info}>
                <div className={styles.meta}>
                  <span className={styles.metaNum}>/ {p.num}</span>
                  <span className={`${styles.metaStatus} ${p.pulse ? styles.metaPulse : ""}`}>
                    {p.status}
                  </span>
                </div>
                <h3 className={styles.title}>
                  {p.title.line1}
                  <br />
                  {p.title.line2}
                  <span className={styles.dotAccent}>.</span>
                </h3>
                <p className={styles.desc}>{p.desc}</p>
                <div className={styles.tags}>
                  {p.tags.map((t) => (
                    <span key={t} className={`${styles.tag} tag-pill`}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className={styles.impact}>
                  {p.impact.map((i, k) => (
                    <div key={k} className={styles.impactCell}>
                      <div className={styles.impactNum}>{i.num}</div>
                      <div className={styles.impactLbl}>{i.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.visual}>
                <Visual />
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
