import type { Metadata } from "next";
import Link from "next/link";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "SKO Compounds — Getting Back on Meta — Jack Morello",
  description:
    "Ordered path back onto Meta after a Business Manager or Page disable, prepared by Jack Morello.",
  robots: { index: false, follow: false },
};

/* Written for the case where the disable was at Business Manager or Page level.
   If it turns out only the ad account was disabled, section 02 reroutes and most
   of this gets much simpler. Confirm the level before acting on any of it. */

const links = [
  {
    k: "Admin profiles",
    v: "The personal Facebook accounts that held admin on the disabled asset. The single strongest link, and the one people always forget.",
  },
  {
    k: "Business verification",
    v: "Legal entity name, registration number, address and the documents submitted. Same entity, same record.",
  },
  {
    k: "Payment instruments",
    v: "Card and bank details, including the billing name and address behind them.",
  },
  {
    k: "Domain",
    v: "The verified domain, and in practice the site itself — what's above the fold gets read.",
  },
  {
    k: "Pixel and datasets",
    v: "A pixel ID carried across to a new business is a direct pointer back to the old one.",
  },
  {
    k: "Page and catalog",
    v: "Reusing the Page, or a catalog feed pointing at the same product URLs.",
  },
  {
    k: "Device and network",
    v: "Weaker on its own, but it corroborates everything above.",
  },
];

const phases = [
  {
    n: "01",
    t: "The free move first — appeal, properly, once",
    items: [
      "Get the three facts before anything else: the exact disable date, the level it hit, and the stated reason in the notification. Everything downstream branches on these, and only an admin on the asset can see them.",
      "The review window after a disable is not open-ended — it has run to roughly 180 days, but treat the notification itself as the authority on the date. Whatever that date is, it is the real deadline on this entire project.",
      "Only an admin can request the manual review. If the admin who held the asset has left the business or lost access to their personal account, solving that is step one and it is not quick.",
      "Submit once, and make it count. Repeated identical appeals through the automated form burn the queue without adding information. One submission with the business registration, the site, and a specific response to the stated reason beats five generic ones.",
      "If the reason cites a policy area, answer that policy area. A generic 'we believe this was a mistake' gets an automated close.",
    ],
  },
  {
    n: "02",
    t: "Establish what actually died — four different problems",
    items: [
      "Ad account only: the mildest case. The Business Manager and Page survive, and creating a new ad account inside the existing BM is a normal, legitimate action. If this turns out to be the level, most of this document doesn't apply.",
      "Page: the commerce and social surface is gone but the business record survives. Ads can technically run from a new Page under the same BM, though a Page disable often signals a content or claims problem that will repeat.",
      "Business Manager: the case this document assumes. The ad accounts, pixel, domain verification and catalog are all inside it and all frozen with it.",
      "Personal profile: the worst version, because it disables the human rather than the business, and it takes every asset that person admins with it.",
      "Whatever the level, find out what is recoverable rather than what is replaceable. The pixel history, the verified domain and the Page are the assets. An ad account is an empty container — it was never the valuable part.",
    ],
  },
  {
    n: "03",
    t: "What not to do while the appeal is open",
    items: [
      "Do not stand up a new Business Manager from the same admin, entity, domain or card and expect it to hold. Meta reads that as circumvention, and the usual outcome is that the new BM is disabled within days and the original appeal is prejudiced. You get one clean attempt here; spending it now is the expensive mistake.",
      "Do not run the catalog through an agency's Business Manager as a workaround. The domain and product URLs still link back, and the failure mode is that you take the agency's BM down with you — which ends the relationship and the access.",
      "Do not buy an aged or rented Business Manager. It is the fastest way to convert a recoverable disable into a permanent one, and it adds a fraud signal to a record that currently only has a policy signal.",
      "Do not move the pixel ID onto anything new. Keep it frozen with the appeal.",
      "Do keep paying attention to the clock. The one thing that is genuinely irreversible is the window closing.",
    ],
  },
  {
    n: "04",
    t: "The second gate nobody checks — can this catalog run at all?",
    items: [
      "Getting an account back and being able to advertise research-use-only peptides are two separate questions, and the second one is harder. It is worth answering before spending weeks on the first.",
      "Meta's policies on drugs, unsafe substances and prescription-adjacent products are where this catalog sits, and the review is applied to the landing page as much as the ad. The SKO product pages are the thing being judged.",
      "The naming convention that makes SKO compliance-smart elsewhere — SKO-TRZ, GLP-3 RT — helps here too. Molecule-first, third person, no dosing, no outcome claims, RUO language above the fold. That was already the creative standard in the plan; on Meta it becomes the entry requirement.",
      "The realistic ceiling may be brand and informational advertising rather than direct product sale on the restricted SKUs. That is still worth having — but it changes the business case, so price the work against it rather than against a ROAS number.",
      "Verify the current policy text before quoting it to anyone. Enforcement in this category moves, and a confident answer from six months ago is a liability.",
    ],
  },
  {
    n: "05",
    t: "If there is a genuinely clean build — the order to do it in",
    items: [
      "Business verification before anything else. Real legal entity, matching documents, matching address. An unverified business hits limits immediately and looks provisional to review.",
      "Domain verification by DNS TXT record, not by meta tag. It is more durable and it survives a site rebuild.",
      "One pixel. One dataset. There is already a server-side tagging endpoint on the domain — establish what it does before building alongside it, same as in the tracking runbook.",
      "Conversions API from the order pipeline, with event_id stamped on both the browser and server event so they deduplicate. This is the same work the TikTok fix needs, which is the argument for doing it once, properly, for both.",
      "Payment in the entity's name, not a personal card, with a backup instrument on file. The processor redundancy point from the plan applies here too.",
      "Two-factor on every admin, and as few admins as the work actually requires. Every additional admin is another linked profile and another way to lose the asset.",
      "Naming convention set on day one: objective, audience, geo, creative variant. Retrofitting it after launch never happens.",
      "Warm up rather than launch. One campaign, one clean objective, small budget, no scaling until it has cleared review and cleared CAC. In a restricted vertical the first two weeks are a compliance test, not a performance test.",
      "Compliance pass on every creative before upload, ad and landing page reviewed as one unit. Review upstream, not after rejection — that is the practice that kept the crypto accounts live.",
    ],
  },
  {
    n: "06",
    t: "Sequencing — this was days 61–90 for a reason",
    items: [
      "The 90-day plan puts Meta last deliberately: instrument, protect, then systematize creator, then add a paid layer onto a funnel that has already proven it converts. Starting with the Meta rebuild inverts that and puts the slowest, least controllable item first.",
      "The appeal costs nothing and runs in the background. Start it now, then go back to the work that isn't waiting on someone else's review queue.",
      "Google on brand and competitor terms is the paid channel with the lowest policy friction, and there is already a conversion tag on the site. If the goal is paid traffic this quarter, that is the faster route.",
      "Creator remains the engine. Nothing about the Meta situation changes that, and it is still the cheapest lift available.",
    ],
  },
];

const asks = [
  {
    q: "The disable notification itself — a screenshot is enough",
    why: "Date, level and stated reason. Three facts, and they determine everything above.",
  },
  {
    q: "Who held admin, and do they still have their personal account?",
    why: "Only an admin can request review. If that person is gone, this becomes a different problem.",
  },
  {
    q: "Was business verification ever completed, and under what legal entity?",
    why: "Decides whether there's a verified record to appeal against or nothing on file.",
  },
  {
    q: "Is the Page still up?",
    why: "Tells you whether this hit the business record or the content surface.",
  },
  {
    q: "The pixel ID, and whether it is still firing on the site",
    why: "A pixel on a disabled BM sitting live on the site is worth knowing about now.",
  },
  {
    q: "Has anyone already tried to create a replacement?",
    why: "If a second BM was already spun up, the situation is further along than the notification suggests.",
  },
];

export default function MetaPage() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/sko" className={styles.navBack}>
          ← plan
        </Link>
        <span className={styles.navTitle}>Meta account</span>
        <span className={styles.navNote}>working doc</span>
      </nav>

      <main className={styles.main}>
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>Getting back on Meta</h1>
          <p className={styles.heroLede}>
            &ldquo;Make a new ad account&rdquo; is the wrong unit of work when a
            Business Manager or Page was disabled. The ad account is an empty
            container. The thing that has to be rebuilt is a business record that
            can survive review — and the first move is free, so it should happen
            before anything gets created.
          </p>
          <div className={styles.byline}>
            <span>
              Prepared by <strong>Jack Morello</strong>
            </span>
            <span>August 2026</span>
            <span>
              <a href="https://jackmorello.com">jackmorello.com</a>
            </span>
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>00</span>
            <h2 className={styles.sectionTitle}>What a fresh account gets matched against</h2>
          </div>
          <p className={styles.body}>
            A new Business Manager built from the same business is not read as a
            new business. Meta matches on the signals below, and a match on any
            two or three of them is generally enough to link the new asset to the
            disabled one and take it down with it. This is worth understanding
            before creating anything, because the attempt itself carries a cost.
          </p>
          <div className={styles.findings}>
            {links.map((l) => (
              <div key={l.k} className={styles.finding}>
                <span className={styles.findingKey}>{l.k}</span>
                <span className={styles.findingVal}>{l.v}</span>
              </div>
            ))}
          </div>
        </section>

        {phases.map((p) => (
          <section key={p.n} className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNum}>{p.n}</span>
              <h2 className={styles.sectionTitle}>{p.t}</h2>
            </div>
            <ul className={styles.list}>
              {p.items.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionNum}>—</span>
            <h2 className={styles.sectionTitle}>What I need to make this specific</h2>
          </div>
          <div className={styles.asks}>
            {asks.map((a) => (
              <div key={a.q} className={styles.ask}>
                <span className={styles.askQ}>{a.q}</span>
                <span className={styles.askWhy}>{a.why}</span>
              </div>
            ))}
          </div>
          <p className={styles.pull}>
            A share of these accounts never come back. The honest promise is a
            properly built appeal and a clean rebuild if it fails — not
            reinstatement.
          </p>
        </section>

        <footer className={styles.footer}>
          <span>
            Prepared for SKO Compounds, August 2026. Steps 01 and 02 cost nothing
            and run in the background — start them this week, because the review
            window is the one deadline here that can&rsquo;t be recovered.
          </span>
          <span>
            <a href="https://jackmorello.com">jackmorello.com</a>
          </span>
        </footer>
      </main>
    </div>
  );
}
