import type { Metadata } from "next";
import Image from "next/image";
import {
  CalendarCheck,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Shirt,
  ShoppingBag,
} from "lucide-react";
import styles from "./page.module.css";

const phoneDisplay = "(310) 902-5854";
const phoneHref = "+13109025854";
const smsBody = encodeURIComponent(
  "Hi Jack, I saw the Dogwalk Los Angeles flyer. My dog is [name]. We live in [neighborhood]. I am looking for a weekly walk around [days/times]."
);
const smsHref = `sms:${phoneHref}?&body=${smsBody}`;

export const metadata: Metadata = {
  title: "Dogwalk Los Angeles | Dog Walks with Jack",
  description:
    "Dogwalk Los Angeles offers safe neighborly weekly dog walks with Jack M. in Carthay Square and Wilshire Vista.",
};

const trustPoints = [
  {
    icon: CalendarCheck,
    title: "Weekly rhythm",
    body: "A repeat time and familiar route so your dog can settle into a real routine.",
  },
  {
    icon: ShieldCheck,
    title: "Neighborly standard",
    body: "Calm leash handling, careful group fit, and no random off-leash chaos.",
  },
  {
    icon: Shirt,
    title: "First shirt free",
    body: "Weekly bookings get the first Dogwalk Los Angeles shirt while founding slots are open.",
  },
];

const textChecklist = [
  "Your name and nearest cross streets",
  "Dog name, size, age, and energy level",
  "Your ideal weekly days and times",
  "Anything Jack should know about leash style, triggers, or routines",
  "Shirt size for the weekly booking offer",
];

const brandImages = [
  {
    src: "/dogwalk/brand/dogwalk-los-angeles-neighborhood-walk-2026.jpg",
    alt: "Dogwalk Los Angeles neighborhood walk artwork",
  },
  {
    src: "/dogwalk/brand/dogwalk-blue-green-la-runner-dog.jpg",
    alt: "Blue and green Los Angeles dog run artwork",
  },
  {
    src: "/dogwalk/brand/dogwalk-los-angeles-blue-type-2026.jpg",
    alt: "Dogwalk Los Angeles blue type shirt artwork",
  },
  {
    src: "/dogwalk/brand/dogwalk-handwritten-dog-2026.jpg",
    alt: "Handwritten Dog Walk Los Angeles 2026 artwork",
  },
];

const shirtProducts = [
  {
    name: "Gray Runner",
    tag: "Most wearable",
    price: "$38",
    src: "/dogwalk/brand/dogwalk-los-angeles-gray-dog-2026.jpg",
    alt: "Gray Dogwalk Los Angeles 2026 shirt design",
    description:
      "Sparse gray mark, big Dogwalk Los Angeles lockup, faded art-school tee energy.",
  },
  {
    name: "Blue Type Dog",
    tag: "Logo tee",
    price: "$38",
    src: "/dogwalk/brand/dogwalk-los-angeles-blue-type-2026.jpg",
    alt: "Blue Dogwalk Los Angeles 2026 shirt design",
    description:
      "Bold blue type with the loose green dog sketch. Clean, graphic, very LA.",
  },
  {
    name: "Green Blue Runner",
    tag: "Art print",
    price: "$38",
    src: "/dogwalk/brand/dogwalk-green-blue-running-dog.jpg",
    alt: "Green and blue running dog shirt design",
    description:
      "Two-color runner with mountain and marker lines. The most vintage chic one.",
  },
];

export default function DogWalkPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="dogwalk-title">
        <div className={styles.heroPoster}>
          <Image
            src="/dogwalk/brand/dogwalk-los-angeles-gray-dog-2026.jpg"
            alt="Dogwalk Los Angeles 2026 gray dog brand poster"
            width={1024}
            height={1024}
            priority
            className={styles.heroPosterArt}
          />
        </div>

        <div className={styles.heroContent}>
          <p className={styles.kicker}>Carthay Square - Wilshire Vista - LA</p>
          <h1 id="dogwalk-title">Dogwalk Los Angeles</h1>
          <p className={styles.heroQuestion}>Is your dog walking enough?</p>
          <p className={styles.heroCopy}>
            Safe neighborly Dog Walks with Jack for Carthay Square and Wilshire
            Vista. Steady weekly routes, familiar dogs, clear handoffs, and a
            free shirt for weekly booking.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href={smsHref}>
              <MessageCircle size={20} aria-hidden="true" />
              Text Jack
            </a>
            <a className={styles.secondaryButton} href={`tel:${phoneHref}`}>
              <Phone size={19} aria-hidden="true" />
              {phoneDisplay}
            </a>
            <a className={styles.secondaryButton} href="#shirts">
              <ShoppingBag size={19} aria-hidden="true" />
              Shop shirts
            </a>
          </div>
        </div>
      </section>

      <section className={styles.quickStrip} aria-label="Dog walk details">
        <div>
          <span>Area</span>
          <strong>Carthay Square and Wilshire Vista</strong>
        </div>
        <div>
          <span>Best for</span>
          <strong>Dogs who need a weekly rhythm</strong>
        </div>
        <div>
          <span>Start</span>
          <strong>Text Jack your ideal time</strong>
        </div>
      </section>

      <section className={styles.brandSection} aria-labelledby="brand-title">
        <div className={styles.brandCopy}>
          <p className={styles.kickerDark}>Dogwalk Los Angeles 2026</p>
          <h2 id="brand-title">A local walk with a shirt worth wanting.</h2>
          <p>
            Weekly booking gets the first shirt while founding slots are open.
            The feel is local, faded, and collectible without getting precious.
          </p>
        </div>

        <div className={styles.brandGrid}>
          {brandImages.map((image) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={1024}
              height={1024}
              className={styles.brandImage}
            />
          ))}
        </div>
      </section>

      <section className={styles.shopSection} id="shirts" aria-labelledby="shop-title">
        <div className={styles.shopHeader}>
          <div>
            <p className={styles.kickerDark}>Top three shirt drop</p>
            <h2 id="shop-title">For weekly walkers. Also for sale.</h2>
          </div>
          <p>
            The first shirt is free with a weekly booking. The same founding
            designs are available separately while the first run is open.
          </p>
        </div>

        <div className={styles.productGrid}>
          {shirtProducts.map((shirt) => {
            const shirtSms = `sms:${phoneHref}?&body=${encodeURIComponent(
              `Hi Jack, I want the ${shirt.name} Dogwalk Los Angeles shirt in size [size].`
            )}`;

            return (
              <article className={styles.productCard} key={shirt.name}>
                <div className={styles.productImageWrap}>
                  <Image
                    src={shirt.src}
                    alt={shirt.alt}
                    width={1024}
                    height={1024}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productMeta}>
                    <span>{shirt.tag}</span>
                    <strong>{shirt.price}</strong>
                  </div>
                  <h3>{shirt.name}</h3>
                  <p>{shirt.description}</p>
                  <a className={styles.buyButton} href={shirtSms}>
                    <ShoppingBag size={18} aria-hidden="true" />
                    Text to buy
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="standard-title">
        <div className={styles.sectionIntro}>
          <p className={styles.kickerDark}>The standard</p>
          <h2 id="standard-title">Small enough to feel personal. Structured enough to feel safe.</h2>
          <p>
            The best version of this is local and selective. The goal is a calm
            repeat walk, not an anonymous app handoff.
          </p>
        </div>

        <div className={styles.trustGrid}>
          {trustPoints.map((item) => {
            const Icon = item.icon;
            return (
              <article className={styles.trustCard} key={item.title}>
                <Icon size={24} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.bookingBand} id="book" aria-labelledby="book-title">
        <div className={styles.bookingCopy}>
          <p className={styles.kickerDark}>Fastest way to book</p>
          <h2 id="book-title">Text the basics. Jack confirms fit and timing.</h2>
          <p>
            Send a short note now. If the route and weekly window make sense,
            Jack will follow up with the next step.
          </p>
          <a className={styles.primaryButtonDark} href={smsHref}>
            <MessageCircle size={20} aria-hidden="true" />
            Text {phoneDisplay}
          </a>
        </div>

        <div className={styles.textBox}>
          <h3>What to text</h3>
          <ul>
            {textChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.routeSection} aria-labelledby="route-title">
        <div className={styles.routeCopy}>
          <p className={styles.kickerDark}>Weekly route</p>
          <h2 id="route-title">Designed for the neighborhood, not the feed.</h2>
          <p>
            Calm sidewalks, repeat pickup habits, and enough structure that both
            dogs and owners know what to expect.
          </p>
        </div>

        <div className={styles.routeList}>
          <div>
            <MapPin size={22} aria-hidden="true" />
            <span>Local pickup windows</span>
          </div>
          <div>
            <ShieldCheck size={22} aria-hidden="true" />
            <span>Fit checked before weekly booking</span>
          </div>
          <div>
            <CalendarCheck size={22} aria-hidden="true" />
            <span>Same weekly slot when available</span>
          </div>
        </div>
      </section>

      <section className={styles.shirtSection} aria-labelledby="shirt-title">
        <div>
          <p className={styles.kickerDark}>Founding weekly offer</p>
          <h2 id="shirt-title">Book weekly. Get the Dog Walk shirt.</h2>
          <p>
            Book weekly and get the first faded neighborhood dog walk shirt.
            Quiet, local, and a little strange in the right way.
          </p>
        </div>
        <div className={styles.shirtDeck}>
          <Image
            src="/dogwalk/brand/dogwalk-los-angeles-blue-type-2026.jpg"
            alt="Dogwalk Los Angeles blue type shirt artwork"
            width={1024}
            height={1024}
            className={styles.shirtArt}
          />
          <Image
            src="/dogwalk/brand/dogwalk-green-blue-running-dog.jpg"
            alt="Green and blue running dog shirt artwork"
            width={1024}
            height={1024}
            className={styles.shirtArt}
          />
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="final-title">
        <h2 id="final-title">Want a weekly walk?</h2>
        <p>Text Jack and include your dog&apos;s name, neighborhood, and ideal weekly time.</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href={smsHref}>
            <MessageCircle size={20} aria-hidden="true" />
            Text Jack
          </a>
          <a className={styles.secondaryButton} href={`tel:${phoneHref}`}>
            <Phone size={19} aria-hidden="true" />
            {phoneDisplay}
          </a>
        </div>
      </section>

      <div className={styles.mobileBar}>
        <a href={smsHref}>
          <MessageCircle size={18} aria-hidden="true" />
          Text Jack
        </a>
        <a href={`tel:${phoneHref}`}>
          <Phone size={18} aria-hidden="true" />
          Call
        </a>
      </div>
    </main>
  );
}
