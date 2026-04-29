"use client";

import Link from "next/link";
import styles from "./Navigation.module.css";

const items = [
  { num: "01", label: "work", href: "#work" },
  { num: "02", label: "stack", href: "#stack" },
  { num: "03", label: "about", href: "#about" },
  { num: "04", label: "contact", href: "#contact" },
];

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="#home" className={styles.brand} data-magnetic>
          <span>J</span>
          <span>S</span>
          <span>K</span>
        </Link>

        <ul className={styles.menu}>
          {items.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className={`${styles.link} nav-link`}>
                <span className={styles.linkNum}>{item.num}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.status}>
          <span className={styles.statusDot} />
          <span>open to work</span>
        </div>
      </div>
    </nav>
  );
}
