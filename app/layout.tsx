import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Jyothi Swaroop Kumar — AI Engineer",
  description:
    "AI Engineer building intelligent systems with machine learning, deep learning, and generative AI.",
  keywords: [
    "AI Engineer",
    "Machine Learning",
    "Deep Learning",
    "Generative AI",
    "Portfolio",
    "Jyothi Swaroop Kumar",
  ],
  authors: [{ name: "Jyothi Swaroop Kumar" }],
  openGraph: {
    title: "Jyothi Swaroop Kumar — AI Engineer",
    description: "AI Engineer building intelligent systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
