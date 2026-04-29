"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import styles from "./Contact.module.css";

const tiles = [
  {
    href: "mailto:pallajyothiswaroopkumar@gmail.com",
    icon: "✉",
    label: "mail",
    value: "pallajyothiswaroopkumar@gmail.com",
  },
  {
    href: "tel:+15513281999",
    icon: "☎",
    label: "phone",
    value: "+1 (551) 328-1999",
  },
  {
    href: "https://www.linkedin.com/in/jyothiswaroopkumarpalla/",
    icon: "in",
    label: "linkedin",
    value: "/jyothiswaroopkumarpalla",
    external: true,
  },
  {
    href: "https://github.com/jyothiswaroop26",
    icon: "</>",
    label: "github",
    value: "/jyothiswaroop26",
    external: true,
  },
];

export default function Contact() {
  const [time, setTime] = useState("--:--:-- EST");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/New_York",
      };
      setTime(`${now.toLocaleTimeString("en-US", opts)} EST`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <motion.p
          className={styles.pre}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          [ 04 — let&apos;s talk ]
        </motion.p>

        <motion.h2
          className={styles.headline}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          got an <em>idea</em>?<br />
          <MagneticButton
            href="mailto:pallajyothiswaroopkumar@gmail.com"
            className={styles.mailLink}
          >
            <span>let&apos;s build it.</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </MagneticButton>
        </motion.h2>

        <div className={styles.grid}>
          {tiles.map((t, i) => (
            <motion.a
              key={t.label}
              href={t.href}
              target={t.external ? "_blank" : undefined}
              rel={t.external ? "noopener noreferrer" : undefined}
              className={`${styles.tile} contact-tile`}
              data-magnetic
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <div className={styles.tileIcon}>{t.icon}</div>
              <span className={styles.tileLbl}>{t.label}</span>
              <span className={styles.tileVal}>{t.value}</span>
            </motion.a>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <span>© 2026 jyothi swaroop kumar</span>
        <span className={styles.footerMid}>crafted with curiosity in NJ</span>
        <span className={styles.time}>{time}</span>
      </footer>
    </section>
  );
}
