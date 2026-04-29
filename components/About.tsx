"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./About.module.css";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.floor(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="section-shell">
      <div className="section-head">
        <span className="section-num">03</span>
        <h2 className="section-title">about</h2>
        <span className="section-count">[ snapshot ]</span>
      </div>

      <div className={styles.grid}>
        <div>
          <motion.p
            className={styles.quote}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            AI engineer turning <em>messy data</em> into <em>clean decisions</em>. I build models, ship them, and care about the <em>last mile</em> — interpretability, dashboards, real impact.
          </motion.p>

          <div className={styles.edu}>
            <div className={styles.eduRow}>
              <span className={styles.eduYear}>2024</span>
              <span className={styles.eduDeg}>M.S. Information Technology</span>
              <span className={styles.eduSchool}>Stevens Institute · NJ</span>
            </div>
            <div className={styles.eduRow}>
              <span className={styles.eduYear}>grad</span>
              <span className={styles.eduDeg}>B.S. Computer Engineering</span>
              <span className={styles.eduSchool}>Gayatri Vidya Parishad</span>
            </div>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statNum}>
              <Counter target={3} />
            </div>
            <div className={styles.statLbl}>live projects</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>M.S.</div>
            <div className={styles.statLbl}>stevens IT</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>NJ</div>
            <div className={styles.statLbl}>based · USA</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>
              <Counter target={100} />
            </div>
            <div className={styles.statLbl}>% caffeinated</div>
          </div>
        </div>
      </div>
    </section>
  );
}
