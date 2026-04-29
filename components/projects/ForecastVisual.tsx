"use client";

import styles from "./ForecastVisual.module.css";

export default function ForecastVisual() {
  return (
    <div className={styles.wrap}>
      <div className={styles.window}>
        <div className={styles.titlebar}>
          <span className={`${styles.dot} ${styles.r}`} />
          <span className={`${styles.dot} ${styles.y}`} />
          <span className={`${styles.dot} ${styles.g}`} />
          <span className={styles.name}>demand · forecast.py</span>
        </div>
        <div className={styles.body}>
          <svg className={styles.chart} viewBox="0 0 400 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c8ff3e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#c8ff3e" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6b5cff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6b5cff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4">
              <line x1="0" y1="40" x2="400" y2="40" />
              <line x1="0" y1="80" x2="400" y2="80" />
              <line x1="0" y1="120" x2="400" y2="120" />
              <line x1="200" y1="0" x2="200" y2="180" />
            </g>
            <path
              d="M0,140 L30,120 L60,128 L90,90 L120,100 L150,70 L180,80 L200,60 L200,180 L0,180 Z"
              fill="url(#g1)"
            />
            <path
              className={styles.lineAnim}
              d="M0,140 L30,120 L60,128 L90,90 L120,100 L150,70 L180,80 L200,60"
              fill="none"
              stroke="#c8ff3e"
              strokeWidth="2"
            />
            <path
              d="M200,60 L230,50 L260,55 L290,40 L320,45 L350,30 L380,35 L400,28 L400,180 L200,180 Z"
              fill="url(#g2)"
            />
            <path
              className={styles.lineDash}
              d="M200,60 L230,50 L260,55 L290,40 L320,45 L350,30 L380,35 L400,28"
              fill="none"
              stroke="#6b5cff"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
            <circle className={styles.pulsePoint} cx="200" cy="60" r="5" fill="#c8ff3e" />
            <circle cx="290" cy="40" r="3" fill="#6b5cff" />
            <circle cx="350" cy="30" r="3" fill="#6b5cff" />
          </svg>
          <div className={styles.legend}>
            <span>
              <i className={styles.legendDot} style={{ background: "#c8ff3e" }} />
              actual
            </span>
            <span>
              <i className={styles.legendDot} style={{ background: "#6b5cff" }} />
              forecast
            </span>
          </div>
        </div>
      </div>

      <div className={styles.chat}>
        <div className={`${styles.msg} ${styles.user}`}>which SKU spikes next month?</div>
        <div className={`${styles.msg} ${styles.bot}`}>
          <span className={styles.typing} />
          <span>SKU-A21 — projected ↑ 47% by July 12.</span>
        </div>
      </div>

      <div className={styles.metric}>
        <div className={styles.mLbl}>accuracy</div>
        <div className={styles.mVal}>
          92.4<span>%</span>
        </div>
        <div className={styles.spark}>
          {[30, 55, 40, 75, 60, 90, 80].map((h, i) => (
            <span key={i} style={{ ["--h" as string]: `${h}%`, animationDelay: `${i * 0.06}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
