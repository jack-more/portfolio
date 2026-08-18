# SKO paid ads — session handoff

State at 2026-08-17. Complements `HANDOFF.md` (tracking infrastructure); this one
covers the ads reporting + creative system. Facts only.

---

## 1. What exists now

| Thing | Where |
|---|---|
| Weekly paid report | `app/SKOads_august/` → jackmorello.com/SKOads_august |
| Creative testing system | `app/SKOtests/` → jackmorello.com/SKOtests |
| Live scorecard (refreshed) | `app/SKOtracking/` → jackmorello.com/SKOtracking |
| Test-pipeline refresh script | `scripts/build-sko-tests.py` |
| Creative thumbnails (13) | `public/skoads/*.jpg` |
| Lovable tickets (written) | `app/sko/LOVABLE-UTM-TICKET.md` · `LOVABLE-GTM-TICKET.md` |
| Chopping-block doc | Google Doc, private, in Jack's Drive |

All pages `robots: noindex`. Shared design language lives in `app/sko/page.module.css`;
report-specific CSS in `app/SKOads_august/page.module.css` (SKOtests imports it).

---

## 2. The economics — final, after three corrections

**61% of every order is cost.** Processing 17 · COGS 10 · fulfillment 10 ·
shipping 4 · labor 20. Contribution = **39%**.

AOV **$218**, and it is **post-discount** — what the card was charged. Today's
margin already absorbs the codes.

| | % of AOV | $ | ROAS |
|---|---|---|---|
| CAC breakeven | 39% | $85 | 2.56× |
| CAC for 10% margin | 29% | $63 | 3.4× |
| CAC target | 22.5% | $49 | 4.4× → **~16% margin** |

8–10% net is a **floor you are already above** at target CAC, not a stretch goal.

Board-copyable waterfall is section 05 of /SKOtests.

**Corrections that got us here — do not reintroduce:**
- The −$10 / −$20 lines on the whiteboard were **results of the subtraction, not
  costs**. Treating them as costs gave a false 75% stack / 25% contribution.
- Shipping is 4%, not 8%.
- Discount is not a separate cost line — it is already inside the $218.

---

## 3. Numbers — TikTok, Aug 9–17 (platform-reported)

$9,028.61 spend · 154 purchases · $33,548.94 · **3.72×** · $58.63 CPA

| Ad | Spend | Purch | ROAS | Bid |
|---|---|---|---|---|
| summer30 2 | $4,980.52 | 66 | 3.11× | $50 cap |
| ETHAN UGC | $1,819.29 | 36 | 4.84× | $50 cap |
| ETHAN UGC 2 | $1,479.66 | 30 | 3.63× | $50 cap |
| LAST CHANCE SUMMER 30 | $749.14 | 22 | 5.21× | $50 cap |

**UGC (all Ethan content):** $3,978.15 spend · 81 purchases · $16,698.84 · 4.20× ·
~312K impressions · 8 videos (2 proven originals + 6 new).

**Meta, Aug 1–17:** $677.58 · 476 link clicks · **6 tracked purchases** (all TheBOX,
$5.74 CPA, 100% men 25–34). Pixel `1023230300704427` live since midweek.

**Own order table, Aug 11–17 (the floor):** TikTok 29 orders / $4,430 · Meta 5 orders
/ $876. The 5× gap vs platform numbers is the capture bug plus in-app click-ID loss.

---

## 4. Findings that drive next week

**Dilution tax.** Same Ethan video: 6.68× in a small rotation, 5.23× in its own ad,
3.19× buried in a ~90-creative pool. ~2–3 points of ROAS lost to crowding. 35–46% of
pool spend went to creatives that never sold.

**Low CTR ≠ bad.** EYE_GIANT runs ~0.74% CTR so the algorithm starves it, but 7.91×
cross-pool on $506 and a **$267 AOV** — highest profit per order in the account.
PUREST is the same shape on Meta. Fix is a dedicated ad group; the bandit optimizes
on clicks, which it can measure instantly, not on sales.

**ETHAN UGC 2 is new content, not re-cuts.** Two new videos work (5.93×, 3.44×). The
four with edited-in background + floating logo ran ~1.0×. Treatment failed, creator
didn't. Jack's call: throttle the logo/bg versions, don't kill.

**Age split (TikTok, 65% classified):** 18–24 best at 4.73× / $50 CPA on 10% of spend.
45–54 worst at 1.30× / $179 CPA on **24% of spend**. Action: target 18–44.

**Statistical floor.** At $58.63 CPA, a creative needs **$135 of spend** before a
zero-purchase result is 90% trustworthy ($94 → 80%). An average creative shows zero
30% of the time at $70 spend, 51% at $40. Kill lists below that threshold are budget
allocation, not performance verdicts.

**Codes are burned into creatives** — SUMMER30 on AI-4, SKO20 on HighCostBau. Going
full-price on paid needs re-cuts, not a checkout toggle.

---

## 5. Do not quote

- **The 11 Meta pixel purchases are site-wide capture at ~10%**, not Meta-attributed
  sales. Meta's own attribution credited 0 for that window (6 tracked in the newer
  export). Putting them in an ad-attributed column is checkable in Ads Manager in
  ten seconds.
- **RedTrack's 18,012% / 43× ROI** — all site revenue ÷ only the spend its
  integrations pulled. Its formula: match a click ID, else bucket as `[D] ` +
  referrer domain. That is why 97% lands in "unattributed."
- **"97% of revenue has no ad behind it"** — wrong, was corrected. RedTrack's Direct
  bucket absorbs ad-driven purchases: `Ethan purchase` showed 921 clicks / 1,134 LP
  views / **1 purchase** against direct traffic converting at 1.24%.
- **TikTok's 154 vs the order table's 29** — both are real, neither is truth. Ranking
  across creatives holds because all are measured identically.

---

## 6. Open

1. **Purchase-event capture fix (Lovable)** — event is gated on a payment-verified
   timestamp and fires on ~10% of orders. Ticket sent: fire on order creation,
   unconditionally, every payment path, server-side if a path skips the confirmation
   page. Acceptance: one full day where pixel purchases ≈ admin orders. **Highest
   priority — every bid decision runs on a 10% sample.**
2. **Meta CAPI token** — blocked. Needs a Meta developer app in business
   `1012564808055835` before a system-user token can be generated; app creation threw
   "Unexpected error" (try incognito, ad blocker off, 2FA on).
3. **BofA card** — payment errors on both Meta campaigns; each stall resets pacing.
4. **TikTok Marketing API token** — reporting scope, needs a developer app (~2–3 day
   approval). CSV export unblocks decisions meanwhile.
5. **UTM ticket** — written, not sent. Captures UTMs into `page_views` and resolves at
   order creation through the existing 30-day `visitor_id` / `lower(email)` lookback.
   That lookback is the thing RedTrack structurally cannot do.
6. **GTM ticket — HOLD.** It instructs removal of all pixel code, and Lovable has since
   built working pixel code. Do not send as-is.
7. **COGS per SKU** — still missing; would turn the margin model from napkin to truth.
8. **Restock Wednesday Aug 19.** Kills earned during the ~25% stock window are
   provisional — retest one cycle after.

---

## 7. Next week's plan (on the report, section 07)

~$4,500–5,500 spend, 80/20 winners/tests. Winners full price at $49–54 caps, ages
18–44. EYE_GIANT gets a dedicated ad group ($350–500). ETHAN UGC 2 weighted to the two
native videos. Commission 2–3 new raw UGC videos — no edited backgrounds, no floating
logos. Goal $17–21K platform-reported, two-phase around Wednesday's restock.

Test-lane sizing math: at 80% winners running 5.5×, blended stays above breakeven even
if tests return zero. Ceiling formula = (winner ROAS − breakeven) ÷ (winner ROAS −
expected test ROAS).

---

## 8. Style

No yapping. Numbers, not prose. Plain English — no metaphors standing in for the
technical fact. Verify before asserting; unverified claims are the problem. When
corrected, fix it and move on without a paragraph about it.
