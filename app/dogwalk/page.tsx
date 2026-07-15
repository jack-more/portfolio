import type { Metadata } from "next";
import DogwalkField from "./DogwalkField";
import WalkScheduler from "./WalkScheduler";
import styles from "./page.module.css";

const phoneDisplay = "(310) 902-5854";
const phoneHref = "+13109025854";

const tees = [
  {
    name: "Carthay Square",
    src: "/dogwalk/CarthaySquare-print.png",
    alt: "Hand-lettered Carthay Square tee print in cobalt and green",
  },
  {
    name: "Wilshire Vista",
    src: "/dogwalk/WilshireVista-print.png",
    alt: "Blackletter Wilshire Vista tee print in blue and green",
  },
];

export const metadata: Metadata = {
  title: "Dogwalk Los Angeles | Dog Walks with Jack",
  description:
    "Dogwalk Los Angeles offers safe neighborly weekly dog walks with Jack M. in Carthay Square and Wilshire Vista.",
};

export default function DogWalkPage() {
  return (
    <main className={styles.page}>
      <DogwalkField />

      <div className={styles.content}>
        <header className={styles.topbar}>
          <span className={styles.label}>DOGWALK — LOS ANGELES</span>
          <span className={styles.labelDim}>EST. 2026</span>
          <a className={styles.label} href={`tel:${phoneHref}`}>
            {phoneDisplay}
          </a>
        </header>

        <section className={styles.hero}>
          <p className={styles.kicker}>SAFE WEEKLY DOG WALKS</p>
          <h1 className={styles.title}>dogwalk</h1>
          <p className={styles.subtitle}>CARTHAY SQUARE · WILSHIRE VISTA</p>

          <div className={styles.heroCorners}>
            <span className={styles.cornerBL}>AVAILABLE FOR WEEKLY WALKS</span>
            <a className={styles.cornerC} href="#schedule">
              ↓ SCHEDULE
            </a>
            <span className={styles.cornerBR}>© 2026 JACK M.</span>
          </div>
        </section>

        <WalkScheduler />

        <section className={styles.shirts} id="shirts">
          <div className={styles.schedHead}>
            <span className={styles.labelDim}>03 — NEIGHBORHOOD TEES</span>
            <h2 className={styles.schedTitle}>Free with a weekly walk.</h2>
          </div>
          <div className={styles.showGrid}>
            {tees.map((tee) => (
              <article className={styles.showCard} key={tee.name}>
                <div className={styles.showArtWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tee.src} alt={tee.alt} className={styles.showArt} />
                </div>
                <div className={styles.showMeta}>
                  <div className={styles.showMetaTop}>
                    <span>NEIGHBORHOOD TEE</span>
                    <strong>$38</strong>
                  </div>
                  <h3>{tee.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className={styles.foot}>
          <span className={styles.labelDim}>DOGWALK LOS ANGELES</span>
          <a className={styles.label} href={`tel:${phoneHref}`}>
            {phoneDisplay}
          </a>
        </footer>
      </div>
    </main>
  );
}
