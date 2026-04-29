"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./Stack.module.css";

interface Item {
  num: string;
  icon: string;
  title: string;
  desc: string;
  width: number;
}

const items: Item[] = [
  { num: "01", icon: "🧠", title: "ML / DL", desc: "regression · classification · clustering · CNNs · transformers", width: 92 },
  { num: "02", icon: "🤖", title: "Generative AI", desc: "LLMs · RAG · NLP · prompt engineering · vector search", width: 85 },
  { num: "03", icon: "🐍", title: "Python Stack", desc: "pytorch · tensorflow · scikit-learn · keras", width: 95 },
  { num: "04", icon: "📊", title: "Data & Viz", desc: "pandas · numpy · power BI · feature engineering", width: 90 },
  { num: "05", icon: "⚡", title: "Deploy", desc: "flask · fastAPI · docker · CI/CD · model serving", width: 78 },
  { num: "06", icon: "👁", title: "Vision", desc: "openCV · image processing · object detection", width: 75 },
];

function StackCard({ item, idx }: { item: Item; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const card = ref.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    const rx = ((y - cy) / cy) * -6;
    const ry = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      data-tilt
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.num}>{item.num}</div>
      <div className={styles.icon}>{item.icon}</div>
      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.desc}>{item.desc}</p>
      <div className={styles.bar}>
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: `${item.width}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.3 + idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className={styles.glow} />
    </motion.div>
  );
}

export default function Stack() {
  return (
    <section id="stack" className={styles.section}>
      <div className={`${styles.head} section-head`}>
        <span className="section-num">02</span>
        <h2 className="section-title">the stack</h2>
        <span className="section-count">[ tools · tech ]</span>
      </div>
      <div className={styles.grid}>
        {items.map((item, idx) => (
          <StackCard key={item.num} item={item} idx={idx} />
        ))}
      </div>
    </section>
  );
}
