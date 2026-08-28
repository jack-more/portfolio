# Ballast — handoff

Live at **https://ballast.la**. Source in `ballast-site/`, deployed by Netlify from
`main` on push. Repo `jack-more/portfolio`.

---

## 1. What Ballast is selling

A productised **two-week sprint at $16,000**, sold with scarcity (**fully booked**,
waitlist). Differentiated on **buying intent rather than channels**, and on **designing
the incentive layer** — the thing most shops never touch.

The business model is Primary's (primary.studio), transposed from brand sprints to
performance and GTM. Read their `/pricing` page before touching the sell: flat fee vs
agency table, deliverables list, slot scarcity in the nav. That page is the blueprint.

---

## 2. Numbers — verified, use verbatim

| Figure | Detail |
|---|---|
| **$2M+/month** | Peak spend, on Starbucks and Toyota |
| **4× ROAS** | Blended, held at that scale |
| **11 categories / 15 accounts** | Across Ballast and prior agencies |

**The spend figure has been undersold twice** — first as $150k (that is crypto-only),
then as $500k. Both times Jack corrected it. Lead with $2M+. Do not reach for a smaller
number because it feels safer.

Where the 4× held, and why the trio matters — it is the range argument as much as the
performance one:
- **Toyota** — African American and Asian American segments
- **Starbucks** — Pacific Northwest
- **Starzplay** — international

Crypto vertical only (Dtravel + NEAR): $150k/mo peak, **5.8× peak** ROAS. A peak, not
sustained. Credible framing is that he stayed live and compliant where most operators got
shut off — a token launch carries an organic wave he did not create.

---

## 3. Hard rules

**Never name Baron Davis.** He is a prospect being signed, not a client. He was on the
live site once; it was removed. Do not reinstate.

**Never dismember the mark.** The lockup is the wordmark *and* its orange ellipse
together. An earlier version stripped the ellipse and blew it up as the page background —
wrong twice over: the mark stopped being the mark, and the ground became a copy of the
thing standing in front of it. `wordmark.png` (ellipse removed) exists for cobalt/dark
grounds only and is currently unused.

**Orange lives in gradients, not as a flat field.** The hero and sprint grounds are four
radial blooms at different centres over a diagonal base. A concentric radial is a
bullseye and reads as a copy of the logo.

**Do not explain the joke.** The recurring failure across this whole build: writing the
thing, then writing why the thing was clever. If a line explains the line above it, cut
it. Seventeen such edits were made in one pass and the page got better every time.

**Show client work, not our own mark on invented objects.** A brand-world module
(Ballast's logo on a carton, cup, banner, fascia sign) was built and removed — it proves
nothing on a services site and reads like a design studio. The images still exist in
`ballast-site/world/` and `brandkit-ballast/out/` and are fine for a deck.

---

## 4. Page order

1. **Hero** — mesh ground, whole lockup, "We buy intent. The rest buy channels.", three
   outcome chips, two CTAs
2. **The Record** — 4× / $2M+ / 11 / 15, then where the 4× held, then eleven categories
   with a one-line insight each, then client marks
3. **The Sprint** — $16,000, fully booked, week 1 / week 2, eight deliverables
4. **Ballast vs. an agency** — six-row comparison
5. **Intent Layers** — In-market / Comparing / Latent / Lapsed, with what we run, what it
   is measured on, what it serves
6. **Promotions** — Proof of Memories (NEAR × SailGP) as a full case, SKO platform codes
7. **What It Does** — four services *(weakest panel; strong candidate to cut)*
8. **Serving Suggestion** — six SKO Compounds stills
9. **Warnings** — "Most budget pays for demand it didn't create"
10. **Close** — waitlist CTA
11. **Base** — enquire, barcode, lot code

---

## 5. Brand system

Measured off the logo file, not chosen. Documented at `/brand/` — **that page is now out
of date** and should be rewritten against the current site.

- Oblique **23°** from vertical · lockup **2.37:1** · ellipse **1.46:1** · outline **5.4%**
  of mark height
- Cobalt `#0B5CF6` · Orange `#F76A08` · Amber `#F49313` · Warm rim `#F68F0C` ·
  Ink `#0A0D18` · Paper `#F9FAFE`
- The ground ramp runs amber core → orange at 74% → warms again at the rim. That is why it
  glows. Never a flat orange.
- **Archivo** only — 900 italic display, 800–900 headings, 500 body. **IBM Plex Mono** for
  data and labels. A light serif was tried and is wrong; it descends from a different
  century than the mark.
- Die-cut everything: 2px ink outline, square corners, offset shadow, press on hover.

---

## 6. Open items

- **No testimonial anywhere.** Biggest remaining gap. SKO and Build Cities are both
  full-suite; one email gets it. Primary runs one on the homepage *and* the pricing page.
- **Confirm the 4×** is blended and defensible at the $2M tier — it is now attached to
  three named clients on a public page.
- **`/brand/` contradicts the site** it documents.
- **"What It Does"** restates the Sprint and Intent Layers. Cut it.
- **`public/ballast/directions/`** on the portfolio is the old dark/acid study page, still
  live, unlinked.
- **42 Higgsfield credits** of the 100 cap remain. Apparel with a person wearing it is the
  gap if object photography is ever wanted again.

---

## 7. Gotchas that cost real time

- **`requestAnimationFrame` reports 0fps in every browser tab an agent can drive.** All
  timing observations from screenshots are worthless. Verify animation logic by porting
  the model to Node and checking the trajectory numerically.
- The preview pane **hides between tool calls** and stops rendering. Batch
  `tabs_select` + action + screenshot in a single call.
- Netlify serves cached HTML for a while; Jack has been shown stale versions three times.
  Verify with `curl` and a unique string, not by asking him to look.
- Section comment numbering in `index.html` **drifted out of sync** with the visible
  `<span class="no">` numbers across many renumbering passes. Anchor edits on `id=`, and
  always `assert` before `str.replace` — several silent no-ops shipped broken CSS.
