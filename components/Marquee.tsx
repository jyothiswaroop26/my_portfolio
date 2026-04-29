import styles from "./Marquee.module.css";

const items = [
  "machine learning",
  "deep learning",
  "generative ai",
  "natural language",
  "computer vision",
  "data science",
];

export default function Marquee() {
  const repeated = [...items, ...items];
  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        {[...repeated, ...repeated].map((item, i) => (
          <span key={i} className={styles.item}>
            <span>{item}</span>
            <span className={styles.dot}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
