"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import styles from "./Hero.module.css";

const taglines = [
  "intelligent systems.",
  "predictive models.",
  "LLM applications.",
  "data pipelines.",
];

export default function Hero() {
  const [tagIdx, setTagIdx] = useState(0);
  const [hud, setHud] = useState({ epoch: 42, loss: 0.0241, acc: 97.8 });

  useEffect(() => {
    const i = setInterval(() => setTagIdx((p) => (p + 1) % taglines.length), 2200);
    const j = setInterval(() => {
      setHud((h) => ({
        epoch: h.epoch + 1,
        loss: 0.018 + Math.random() * 0.012,
        acc: 97 + Math.random() * 1.8,
      }));
    }, 1400);
    return () => {
      clearInterval(i);
      clearInterval(j);
    };
  }, []);

  const word = (text: string, idx: number, outline = false) => (
    <motion.span
      key={text}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 + idx * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`${styles.word} ${outline ? styles.outline : ""}`}
      data-text={text}
    >
      {text}
    </motion.span>
  );

  return (
    <section id="home" className={styles.hero}>
      {/* HUD */}
      <motion.div
        className={`${styles.hud} ${styles.hudTL}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className={styles.hudLine}>
          <span className={styles.hudK}>model</span>
          <span className={styles.hudV}>jsk-net · 4 layer</span>
        </div>
        <div className={styles.hudLine}>
          <span className={styles.hudK}>params</span>
          <span className={styles.hudV}>2.4M</span>
        </div>
        <div className={styles.hudLine}>
          <span className={styles.hudK}>status</span>
          <span className={styles.hudV}>
            <span className={styles.hudDot} />
            training
          </span>
        </div>
      </motion.div>

      <motion.div
        className={`${styles.hud} ${styles.hudTR}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <div className={styles.hudLine}>
          <span className={styles.hudK}>epoch</span>
          <span className={styles.hudV}>{String(hud.epoch).padStart(3, "0")}</span>
        </div>
        <div className={styles.hudLine}>
          <span className={styles.hudK}>loss</span>
          <span className={styles.hudV}>{hud.loss.toFixed(4)}</span>
        </div>
        <div className={styles.hudLine}>
          <span className={styles.hudK}>acc</span>
          <span className={styles.hudV}>{hud.acc.toFixed(1)}%</span>
        </div>
      </motion.div>

      <div className={styles.content}>
        <motion.div
          className={styles.meta}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <span className={styles.lineDeco} />
          <span>AI · ML · GenAI engineer</span>
          <span className={styles.lineDeco} />
        </motion.div>

        <h1 className={styles.title}>
          {word("Jyothi", 0)} {word("Swaroop", 1)} {word("Kumar.", 2, true)}
        </h1>

        <motion.div
          className={styles.tagline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span>I build</span>
          <span className={styles.rotateWrap}>
            <motion.span
              key={tagIdx}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={styles.rotateText}
            >
              {taglines[tagIdx]}
            </motion.span>
          </span>
        </motion.div>

        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <MagneticButton href="#work" className={styles.btnPrimary}>
            <span className={styles.btnCircle} />
            <span className={styles.btnText}>explore work</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </MagneticButton>
          <MagneticButton href="#contact" className={styles.btnGhost}>
            say hello →
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div
        className={styles.scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span>scroll</span>
        <div className={styles.scrollBar}>
          <div className={styles.scrollFill} />
        </div>
      </motion.div>

      <span className={`${styles.corner} ${styles.cornerTL}`}>[ N 40.7° · W 74.0° ]</span>
      <span className={`${styles.corner} ${styles.cornerTR}`}>[ portfolio · v.2026 ]</span>
      <span className={`${styles.corner} ${styles.cornerBL}`}>[ new jersey, USA ]</span>
      <span className={`${styles.corner} ${styles.cornerBR}`}>[ scroll to begin ↓ ]</span>
    </section>
  );
}
