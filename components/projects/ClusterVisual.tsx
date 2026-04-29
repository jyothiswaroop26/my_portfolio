"use client";

import styles from "./ClusterVisual.module.css";

const clusters = [
  {
    cls: "c1",
    color: "#c8ff3e",
    centroid: { x: "18%", y: "25%" },
    points: [
      { x: "10%", y: "20%" },
      { x: "25%", y: "15%" },
      { x: "18%", y: "30%" },
      { x: "30%", y: "28%" },
      { x: "5%", y: "35%" },
      { x: "22%", y: "42%" },
    ],
  },
  {
    cls: "c2",
    color: "#6b5cff",
    centroid: { x: "75%", y: "25%" },
    points: [
      { x: "65%", y: "20%" },
      { x: "75%", y: "25%" },
      { x: "80%", y: "15%" },
      { x: "90%", y: "30%" },
      { x: "70%", y: "35%" },
      { x: "85%", y: "40%" },
    ],
  },
  {
    cls: "c3",
    color: "#ff5cb1",
    centroid: { x: "20%", y: "80%" },
    points: [
      { x: "15%", y: "70%" },
      { x: "25%", y: "75%" },
      { x: "10%", y: "80%" },
      { x: "30%", y: "85%" },
      { x: "20%", y: "90%" },
    ],
  },
  {
    cls: "c4",
    color: "#ffaa3e",
    centroid: { x: "78%", y: "80%" },
    points: [
      { x: "65%", y: "70%" },
      { x: "75%", y: "80%" },
      { x: "85%", y: "75%" },
      { x: "90%", y: "88%" },
      { x: "70%", y: "90%" },
      { x: "80%", y: "65%" },
    ],
  },
];

export default function ClusterVisual() {
  return (
    <div className={styles.wrap}>
      <div className={styles.canvas}>
        {clusters.map((c) => (
          <div key={c.cls} className={styles.group}>
            <div
              className={styles.centroid}
              style={{ left: c.centroid.x, top: c.centroid.y, borderColor: c.color }}
            />
            {c.points.map((p, i) => (
              <span
                key={i}
                className={styles.pt}
                style={{
                  left: p.x,
                  top: p.y,
                  background: c.color,
                  boxShadow: `0 0 8px ${c.color}`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        ))}

        <div className={styles.axisX} />
        <div className={styles.axisY} />
        <div className={`${styles.axisLabel} ${styles.x}`}>recency</div>
        <div className={`${styles.axisLabel} ${styles.y}`}>spend</div>
      </div>

      <div className={styles.donutCard}>
        <svg viewBox="0 0 100 100" className={styles.donut}>
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#c8ff3e"
            strokeWidth="14"
            strokeDasharray="75 251"
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#6b5cff"
            strokeWidth="14"
            strokeDasharray="60 251"
            strokeDashoffset="-75"
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#ff5cb1"
            strokeWidth="14"
            strokeDasharray="55 251"
            strokeDashoffset="-135"
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#ffaa3e"
            strokeWidth="14"
            strokeDasharray="61 251"
            strokeDashoffset="-190"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className={styles.donutLegend}>
          <span>
            <i style={{ background: "#c8ff3e" }} />
            loyal · 30%
          </span>
          <span>
            <i style={{ background: "#6b5cff" }} />
            new · 24%
          </span>
          <span>
            <i style={{ background: "#ff5cb1" }} />
            at-risk · 22%
          </span>
          <span>
            <i style={{ background: "#ffaa3e" }} />
            churn · 24%
          </span>
        </div>
      </div>
    </div>
  );
}
