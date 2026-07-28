import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Notes ahead of our call — Baron Davis × Incubella",
  description:
    "A short note from Jack Morello ahead of a call with Baron Davis.",
  robots: { index: false, follow: false },
};

/* Slides are fixed 16:9 sheets that size themselves off their own width via
   container queries, so this page is resolution-independent and prints one
   sheet per landscape page. Class names carrying "--" need bracket access
   under CSS modules, hence cx(). */
const cx = (...names: string[]) =>
  names.map((n) => (styles as Record<string, string>)[n]).filter(Boolean).join(" ");

const LOGO = (cls: string) => (
  <svg className={cls} viewBox="0 0 229 53" role="img" aria-label="Incubella">
    <use href="#inc-lockup" />
  </svg>
);

export default function BaronNotes() {
  return (
    <main className={styles.page}>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
                <symbol id="inc-mark" viewBox="0 0 16.1 31.8">
          <g fill="currentColor"><path d="M 16.064 5.56 L 16.064 12.399 C 15.774 12.499 15.523 12.687 15.346 12.938 C 15.106 13.276 15.019 13.699 15.105 14.105 L 9.291 17.527 C 9.116 17.242 8.848 17.025 8.533 16.914 C 8.506 16.903 8.479 16.893 8.451 16.887 L 8.451 10.197 C 8.757 10.109 9.026 9.923 9.216 9.668 C 9.407 9.411 9.51 9.1 9.509 8.779 C 9.509 8.669 9.497 8.558 9.473 8.45 L 15.132 5.119 C 15.378 5.375 15.71 5.532 16.064 5.56 Z M 7.61 10.198 L 7.61 16.887 L 7.582 16.895 C 7.243 17.001 6.955 17.225 6.769 17.527 L 0.963 14.105 C 0.981 14.003 0.991 13.901 0.991 13.798 C 0.991 13.49 0.896 13.189 0.718 12.937 C 0.541 12.687 0.29 12.498 0 12.399 L 0 5.56 C 0.354 5.532 0.685 5.375 0.932 5.119 L 6.587 8.45 C 6.563 8.558 6.552 8.669 6.552 8.779 C 6.551 9.1 6.654 9.411 6.846 9.668 C 7.036 9.923 7.304 10.109 7.61 10.198 Z M 16.064 15.44 L 16.064 26.668 C 15.774 26.767 15.523 26.956 15.345 27.206 C 15.106 27.545 15.019 27.967 15.105 28.373 L 9.291 31.797 C 9.101 31.485 8.801 31.256 8.451 31.155 L 8.451 19.721 C 8.752 19.63 9.015 19.445 9.202 19.192 C 9.39 18.939 9.493 18.633 9.495 18.317 L 15.128 14.999 C 15.376 15.256 15.709 15.412 16.064 15.44 Z M 7.61 19.721 L 7.61 31.155 C 7.26 31.256 6.96 31.485 6.769 31.797 L 0.963 28.373 C 0.981 28.272 0.991 28.169 0.991 28.067 C 0.992 27.759 0.896 27.458 0.718 27.206 C 0.541 26.956 0.29 26.767 0 26.668 L 0 15.44 C 0.354 15.411 0.685 15.255 0.932 14.999 L 6.566 18.321 C 6.57 18.635 6.673 18.941 6.861 19.194 C 7.048 19.445 7.311 19.63 7.61 19.721 Z M 14.855 3.432 L 8.99 0.011 C 8.521 0.429 7.838 0.497 7.296 0.18 C 7.208 0.129 7.125 0.068 7.049 0 L 1.21 3.37 C 1.381 3.694 1.425 4.07 1.334 4.425 L 7.074 7.769 C 7.539 7.311 8.254 7.222 8.818 7.553 C 8.913 7.608 9.001 7.674 9.082 7.749 L 14.767 4.466 C 14.671 4.122 14.702 3.755 14.855 3.432 Z"/></g>
        </symbol>
        <symbol id="inc-lockup" viewBox="0 0 229 53">
          <g fill="currentColor"><g transform="translate(22.224 10.648)"><path d="M 16.064 5.56 L 16.064 12.399 C 15.774 12.499 15.523 12.687 15.346 12.938 C 15.106 13.276 15.019 13.699 15.105 14.105 L 9.291 17.527 C 9.116 17.242 8.848 17.025 8.533 16.914 C 8.506 16.903 8.479 16.893 8.451 16.887 L 8.451 10.197 C 8.757 10.109 9.026 9.923 9.216 9.668 C 9.407 9.411 9.51 9.1 9.509 8.779 C 9.509 8.669 9.497 8.558 9.473 8.45 L 15.132 5.119 C 15.378 5.375 15.71 5.532 16.064 5.56 Z M 7.61 10.198 L 7.61 16.887 L 7.582 16.895 C 7.243 17.001 6.955 17.225 6.769 17.527 L 0.963 14.105 C 0.981 14.003 0.991 13.901 0.991 13.798 C 0.991 13.49 0.896 13.189 0.718 12.937 C 0.541 12.687 0.29 12.498 0 12.399 L 0 5.56 C 0.354 5.532 0.685 5.375 0.932 5.119 L 6.587 8.45 C 6.563 8.558 6.552 8.669 6.552 8.779 C 6.551 9.1 6.654 9.411 6.846 9.668 C 7.036 9.923 7.304 10.109 7.61 10.198 Z M 16.064 15.44 L 16.064 26.668 C 15.774 26.767 15.523 26.956 15.345 27.206 C 15.106 27.545 15.019 27.967 15.105 28.373 L 9.291 31.797 C 9.101 31.485 8.801 31.256 8.451 31.155 L 8.451 19.721 C 8.752 19.63 9.015 19.445 9.202 19.192 C 9.39 18.939 9.493 18.633 9.495 18.317 L 15.128 14.999 C 15.376 15.256 15.709 15.412 16.064 15.44 Z M 7.61 19.721 L 7.61 31.155 C 7.26 31.256 6.96 31.485 6.769 31.797 L 0.963 28.373 C 0.981 28.272 0.991 28.169 0.991 28.067 C 0.992 27.759 0.896 27.458 0.718 27.206 C 0.541 26.956 0.29 26.767 0 26.668 L 0 15.44 C 0.354 15.411 0.685 15.255 0.932 14.999 L 6.566 18.321 C 6.57 18.635 6.673 18.941 6.861 19.194 C 7.048 19.445 7.311 19.63 7.61 19.721 Z M 14.855 3.432 L 8.99 0.011 C 8.521 0.429 7.838 0.497 7.296 0.18 C 7.208 0.129 7.125 0.068 7.049 0 L 1.21 3.37 C 1.381 3.694 1.425 4.07 1.334 4.425 L 7.074 7.769 C 7.539 7.311 8.254 7.222 8.818 7.553 C 8.913 7.608 9.001 7.674 9.082 7.749 L 14.767 4.466 C 14.671 4.122 14.702 3.755 14.855 3.432 Z"/></g><path d="M 54.757 17.529 L 54.757 13.492 L 57.443 13.492 L 57.443 17.529 Z M 50.728 39.058 L 50.728 36.367 L 54.757 36.367 L 54.757 22.911 L 50.728 22.911 L 50.728 20.22 L 57.443 20.22 L 57.443 36.367 L 61.472 36.367 L 61.472 39.058 Z M 65.498 39.058 L 65.498 20.22 L 68.184 20.22 L 68.184 22.911 L 69.527 22.911 L 69.527 24.257 L 68.184 24.257 L 68.184 39.058 Z M 77.585 39.058 L 77.585 24.257 L 76.242 24.257 L 76.242 22.911 L 69.527 22.911 L 69.527 21.565 L 70.87 21.565 L 70.87 20.22 L 77.585 20.22 L 77.585 21.565 L 78.928 21.565 L 78.928 22.911 L 80.272 22.911 L 80.272 39.058 Z M 85.655 36.367 L 85.655 33.676 L 84.312 33.676 L 84.312 25.602 L 85.655 25.602 L 85.655 22.911 L 86.998 22.911 L 86.998 21.565 L 88.341 21.565 L 88.341 20.22 L 96.399 20.22 L 96.399 21.565 L 97.743 21.565 L 97.743 22.911 L 99.086 22.911 L 99.086 24.257 L 100.429 24.257 L 100.429 26.948 L 97.743 26.948 L 97.743 25.602 L 96.399 25.602 L 96.399 24.257 L 95.056 24.257 L 95.056 22.911 L 89.684 22.911 L 89.684 24.257 L 88.341 24.257 L 88.341 25.602 L 86.998 25.602 L 86.998 33.676 L 88.341 33.676 L 88.341 35.021 L 89.684 35.021 L 89.684 36.367 L 95.056 36.367 L 95.056 35.021 L 96.399 35.021 L 96.399 33.676 L 97.743 33.676 L 97.743 32.33 L 100.429 32.33 L 100.429 35.021 L 99.086 35.021 L 99.086 36.367 L 97.743 36.367 L 97.743 37.712 L 96.399 37.712 L 96.399 39.058 L 88.341 39.058 L 88.341 37.712 L 86.998 37.712 L 86.998 36.367 Z M 104.466 36.367 L 104.466 20.22 L 107.152 20.22 L 107.152 35.021 L 108.495 35.021 L 108.495 36.367 L 113.867 36.367 L 113.867 37.712 L 112.524 37.712 L 112.524 39.058 L 107.152 39.058 L 107.152 37.712 L 105.809 37.712 L 105.809 36.367 Z M 115.211 39.058 L 115.211 36.367 L 113.867 36.367 L 113.867 35.021 L 115.211 35.021 L 115.211 20.22 L 117.897 20.22 L 117.897 39.058 Z M 123.277 39.058 L 123.277 13.492 L 125.963 13.492 L 125.963 22.911 L 127.306 22.911 L 127.306 25.602 L 125.963 25.602 L 125.963 33.676 L 127.306 33.676 L 127.306 36.367 L 125.963 36.367 L 125.963 39.058 Z M 127.306 37.712 L 127.306 36.367 L 134.022 36.367 L 134.022 35.021 L 135.365 35.021 L 135.365 33.676 L 136.708 33.676 L 136.708 25.602 L 135.365 25.602 L 135.365 24.257 L 134.022 24.257 L 134.022 22.911 L 127.306 22.911 L 127.306 21.565 L 128.649 21.565 L 128.649 20.22 L 135.365 20.22 L 135.365 21.565 L 136.708 21.565 L 136.708 22.911 L 138.051 22.911 L 138.051 25.602 L 139.394 25.602 L 139.394 33.676 L 138.051 33.676 L 138.051 36.367 L 136.708 36.367 L 136.708 37.712 L 135.365 37.712 L 135.365 39.058 L 128.649 39.058 L 128.649 37.712 Z M 144.777 25.602 L 144.777 28.293 L 155.522 28.293 L 155.522 25.602 L 154.179 25.602 L 154.179 24.257 L 152.836 24.257 L 152.836 22.911 L 147.463 22.911 L 147.463 24.257 L 146.12 24.257 L 146.12 25.602 Z M 143.434 36.367 L 143.434 33.676 L 142.091 33.676 L 142.091 25.602 L 143.434 25.602 L 143.434 22.911 L 144.777 22.911 L 144.777 21.565 L 146.12 21.565 L 146.12 20.22 L 154.179 20.22 L 154.179 21.565 L 155.522 21.565 L 155.522 22.911 L 156.865 22.911 L 156.865 25.602 L 158.208 25.602 L 158.208 30.984 L 144.777 30.984 L 144.777 33.676 L 146.12 33.676 L 146.12 35.021 L 147.463 35.021 L 147.463 36.367 L 154.179 36.367 L 154.179 35.021 L 155.522 35.021 L 155.522 33.676 L 158.208 33.676 L 158.208 36.367 L 156.865 36.367 L 156.865 37.712 L 154.179 37.712 L 154.179 39.058 L 146.12 39.058 L 146.12 37.712 L 144.777 37.712 L 144.777 36.367 Z M 160.903 39.058 L 160.903 36.367 L 164.932 36.367 L 164.932 16.183 L 160.903 16.183 L 160.903 13.492 L 164.932 13.492 L 164.932 14.838 L 166.275 14.838 L 166.275 16.183 L 167.618 16.183 L 167.618 36.367 L 171.647 36.367 L 171.647 39.058 Z M 174.329 39.058 L 174.329 36.367 L 178.358 36.367 L 178.358 16.183 L 174.329 16.183 L 174.329 13.492 L 178.358 13.492 L 178.358 14.838 L 179.701 14.838 L 179.701 16.183 L 181.044 16.183 L 181.044 36.367 L 185.073 36.367 L 185.073 39.058 Z M 189.099 36.367 L 189.099 30.984 L 190.442 30.984 L 190.442 29.639 L 193.128 29.639 L 193.128 28.293 L 199.844 28.293 L 199.844 26.948 L 201.187 26.948 L 201.187 24.257 L 199.844 24.257 L 199.844 22.911 L 193.128 22.911 L 193.128 24.257 L 191.785 24.257 L 191.785 25.602 L 189.099 25.602 L 189.099 22.911 L 190.442 22.911 L 190.442 21.565 L 193.128 21.565 L 193.128 20.22 L 199.844 20.22 L 199.844 21.565 L 202.53 21.565 L 202.53 24.257 L 203.873 24.257 L 203.873 36.367 L 205.216 36.367 L 205.216 39.058 L 202.53 39.058 L 202.53 37.712 L 201.187 37.712 L 201.187 36.367 L 199.844 36.367 L 199.844 35.021 L 201.187 35.021 L 201.187 29.639 L 199.844 29.639 L 199.844 30.984 L 193.128 30.984 L 193.128 32.33 L 191.785 32.33 L 191.785 36.367 L 199.844 36.367 L 199.844 37.712 L 198.5 37.712 L 198.5 39.058 L 191.785 39.058 L 191.785 37.712 L 190.442 37.712 L 190.442 36.367 Z"/></g>
        </symbol>
      </svg>

      <div className={styles.deck}>
        {/* ---------------- 00 cover ---------------- */}
        <section className={cx("slide", "slide--field")}>
          <div className={cx("body", "cover")}>
            <div className={styles.rail} style={{ padding: 0 }}>
              {LOGO(cx("logo", "logo--cover"))}
              <span className={styles.spacer} />
              <span>00</span>
            </div>
            <div className={styles.stack}>
              <div className={styles.eyebrow}>For Baron — following up</div>
              <h1 style={{ fontSize: "9cqw", maxWidth: "13ch" }}>Notes ahead of our call</h1>
            </div>
            <div className={styles.meta}>
              <div className={cx("stack", "stack--sm")}>
                <span className={styles.k}>From</span>
                <span className={styles.v}>Jack Morello</span>
              </div>
              <div className={cx("stack", "stack--sm")}>
                <span className={styles.k}>Date</span>
                <span className={styles.v}>07.28.2026</span>
              </div>
            </div>
          </div>
          <div className={cx("rail", "rail--bot")}>
            <span>incubella.co</span>
            <span className={styles.spacer} />
            <span>For intended viewers only · © 2026</span>
          </div>
        </section>

        {/* ---------------- 01 how we got here ---------------- */}
        <section className={styles.slide}>
          <div className={cx("rail", "rail--top")}>
            {LOGO(cx("logo", "logo--rail"))}
            <span>01 · How we got here</span>
            <span className={styles.spacer} />
            <span>07.28.2026</span>
          </div>
          <div className={styles.body}>
            <div className={styles.eyebrow}>01 — How we got here</div>
            <div className={cx("cols", "cols--asym")} style={{ marginTop: ".2cqw", alignItems: "start" }}>
              <div className={cx("stack", "stack--lg")}>
                <h2 style={{ fontSize: "4.6cqw", maxWidth: "15ch" }}>Lisbon, NYC… the metaverse, maybe?</h2>
                <p className={styles.lede}>
                  In Lisbon you had me guessing which player each of your characters was. I got a few
                  of them. We ran into each other again in New York this year and picked it straight
                  back up.
                </p>
                <p className={styles.lede} style={{ color: "var(--mute)" }}>
                  NBA Street Vol. 3 is still the digital property I associate with you. What that
                  looks like built today is what I keep turning over.
                </p>
              </div>
              <div className={styles.fieldset} style={{ paddingTop: "1cqw" }}>
                <span className={cx("fs-label")}>Who you&rsquo;d get</span>
                <div className={styles.who}>
                  <span className={styles.n}>Jack Morello</span>
                  <span className={styles.d}>GTM. Scaling start-ups and Fortune 500 companies.</span>
                </div>
                <div className={styles.who}>
                  <span className={styles.n}>Bilal Dhouib</span>
                  <span className={styles.d}>Founding growth at Bud (YC W25). Acquired by Figma.</span>
                </div>
                <div className={styles.who}>
                  <span className={styles.n}>Chris Pennino</span>
                  <span className={styles.d}>
                    Chief of R&amp;D at build_cities. Software for coordinating how cities get built.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("rail", "rail--bot")}>
            <span>For intended viewers only</span>
            <span className={styles.spacer} />
            <span className={styles.pg}>01</span>
          </div>
        </section>

        {/* ---------------- 02 the questions ---------------- */}
        <section className={styles.slide}>
          <div className={cx("rail", "rail--top")}>
            {LOGO(cx("logo", "logo--rail"))}
            <span>02 · To fill in together</span>
            <span className={styles.spacer} />
            <span>07.28.2026</span>
          </div>
          <div className={cx("body", "body--dense")}>
            <h2 style={{ fontSize: "3.6cqw" }}>Strategic pathfinding questions</h2>
            <div className={cx("wsheet", "wsheet--2")} style={{ marginTop: ".2cqw" }}>
              <div className={styles.fieldset}>
                <span className={cx("fs-label")}>Primary — the idea</span>
                {[
                  ["01", "Where does it stand?"],
                  ["02", "Who\u2019s attached?"],
                  ["03", "What\u2019s kept it from moving?"],
                ].map(([i, q]) => (
                  <div className={styles.qline} key={i}>
                    <span className={styles.q}>
                      <i>{i}</i>
                      {q}
                    </span>
                    <div className={styles.blank} />
                  </div>
                ))}
              </div>
              <div className={styles.fieldset}>
                <span className={cx("fs-label", "fs-label--sub")}>Secondary — site &amp; funnel</span>
                {[
                  ["04", "What comes in now?"],
                  ["05", "What do you want more of?"],
                  ["06", "What do you never want to see again?"],
                ].map(([i, q]) => (
                  <div className={styles.qline} key={i}>
                    <span className={styles.q}>
                      <i>{i}</i>
                      {q}
                    </span>
                    <div className={styles.blank} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.fieldset}>
              <span className={cx("fs-label")}>If we only did one thing first</span>
              <div className={cx("qline", "qline--wide")}>
                <div className={styles.blank} />
              </div>
            </div>
            <div className={styles.idea}>
              <span className={cx("idea-label")}>One idea</span>
              <p>
                What if each character became a real online home for that player, feeding their
                appearances and bookings in the real world?
              </p>
            </div>
          </div>
          <div className={cx("rail", "rail--bot")}>
            <span>Jack Morello · incubella.co</span>
            <span className={styles.spacer} />
            <span className={styles.pg}>02</span>
          </div>
        </section>

        {/* ---------------- 03 how we'd start ---------------- */}
        <section className={cx("slide", "slide--field")}>
          <div className={cx("rail", "rail--top")}>
            {LOGO(cx("logo", "logo--rail"))}
            <span>03 · How we&rsquo;d start</span>
            <span className={styles.spacer} />
            <span>07.28.2026</span>
          </div>
          <div className={styles.body}>
            <div className={styles.eyebrow}>03 — How we&rsquo;d start</div>
            <h2 style={{ fontSize: "4.4cqw" }}>Small, and in order</h2>
            <div className={cx("cols", "cols--3")} style={{ marginTop: "3.4cqw" }}>
              <div className={styles.step}>
                <span className={styles.sn}>01</span>
                <h3>Talk</h3>
                <p>Half an hour, whenever suits you.</p>
              </div>
              <div className={styles.step}>
                <span className={styles.sn}>02</span>
                <h3>A short plan</h3>
                <p>What to build, in what order. Yours either way.</p>
              </div>
              <div className={cx("step", "step--accent")}>
                <span className={styles.sn}>03</span>
                <h3>Build it</h3>
                <p>The part I&rsquo;m here for.</p>
              </div>
            </div>
          </div>
          <div className={cx("rail", "rail--bot")}>
            <span>Jack Morello · incubella.co</span>
            <span className={styles.spacer} />
            <span className={styles.pg}>03</span>
          </div>
        </section>
      </div>
    </main>
  );
}
