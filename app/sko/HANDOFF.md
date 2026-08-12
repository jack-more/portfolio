# SKO tracking — handoff

State at 2026-08-12. Everything a fresh session needs. Facts only.

---

## 1. Who / what

SKO Compounds — research peptides, skocompounds.com. Jack runs paid media.
Revenue is ~$746K/30d, of which **creators are 64%** and paid ads are ~1%.

Site is built in **Lovable** (React SPA + Supabase edge functions). Jack relays
messages to Lovable; they ship the code. This repo (jackmorello.com) only hosts
the reporting pages.

---

## 2. Accounts and IDs

| Thing | Value |
|---|---|
| Meta ad account | `880814205101777` |
| Meta pixel (live + in ad set) | `2122473828697675` (`SKO_META_Pixel1`) |
| Meta pixel (old, on site until Aug 11) | `2089922941789319` |
| TikTok ads account | `7626816929861943312` ("SKO Compounds0409") |
| TikTok pixel | `D81ARJ3C77UARUNPHJ30` |
| OpenAI ad account | `adacct_6a7242764be08195a3f74bfb86ad9168` |
| OpenAI pixel | `BrQxf597ohJxBq4Pa2D3CC` |
| Google Ads / GTM / GA4 | `AW-18196526516` · `GTM-TMG5WDJQ` · `G-NCP357ED6F` |
| Taboola | account `2085408` (12 ads, $0 spent) |
| RedTrack | app.redtrack.io — hayden@skocompounds.com |

Admin dashboards (Jack is logged in, browser tools can reach them):
`skocompounds.com/admin/` → `tiktok-ads`, `affiliate-commissions`, `sko-lives`,
`orders`, `ceo-metrics`, `coupons`, `codes-used`, `live20`, `affiliates`.

---

## 3. This repo

```
app/SKOtracking/          live scorecard — numbers + chart only, no prose
  page.tsx                summary tiles, channel table, chart
  data.json               SINGLE SOURCE for spend + channel meta (hand-entered)
  data.ts                 typed view over data.json
  attribution.ts          server-only fetch of the Supabase endpoint
  SourceChart.tsx         client component, Revenue/Spend/Orders toggle
app/sko/tracking/         measurement map — diagram, 3 windows, floor/ceiling
scripts/build-tracking-xlsx.py   regenerates public/sko-tracking.xlsx
```

Env (Netlify **and** `.env.local`):
`SKO_REPORTS_URL=https://yslsdssntwwcpxlaudfo.supabase.co/functions/v1/reports-attribution`
`SKO_REPORTS_TOKEN` — bearer token, in Netlify site settings.

Endpoint: `GET ?start=YYYY-MM-DD&end=YYYY-MM-DD`, returns `totals`, `by_source[]`,
`paid_vs_organic`. Revenue = post-discount merchandise, excludes shipping/tax/
refunded/test.

Gotchas: Netlify runs **no ISR** here — pages use `force-dynamic`, never cache.
xlsx script needs openpyxl; a venv exists in the session scratchpad. Spend is
**not** in the endpoint — it is hand-read from each ad dashboard into `data.json`.

---

## 4. The attribution ladder (create-order)

`attribution_source` holds **one** value, first match wins:

1. body click IDs — `fbclid` → `ttclid` → `oai_oppref`
2. first-party `tt_attr` cookie
3. 30-day `page_views` lookback (`visitor_id` OR `lower(email)`), newest 50
4. user-agent fallback (TikTok/Meta in-app browser)
5. creator `?ref=` link or coupon in `affiliate_coupon_links` → `affiliate`
6. default → `organic`

Click IDs beat creator codes. **Creators still get paid** — commission lives in
separate affiliate tables, not this column. Confirmed: of 62 tiktok-attributed
orders in 30d, only 1 had a creator commission.

`oai_oppref` is stored as localStorage key `sko_oai_oppref` (`{v,ts}`, 30d TTL),
same convention as `sko_ttclid`.

---

## 5. Numbers, 30 days to Aug 12

| Channel | Floor | Ceiling |
|---|---|---|
| Creators + Lives | $451,549 · 1,921 orders | $474,463 · 2,272 |
| Organic | $261,219 · 1,606 | same |
| TikTok | $10,000 · 62 | **pending** — need 30d platform report |
| Meta | $1,606 · 11 | same ($0 spent; organic-social `fbclid`) |
| OpenAI | $0 | $0 (launched Aug 11) |

Site total 30d: **3,951 orders · $745,856 · AOV $188.78**
1 week (Aug 6–12): 503 orders · $87,626 · 2 weeks: 1,642 · $297,246

Floor = a code typed at checkout, or a click ID that survived. Ceiling = widest
defensible claim.

Creators (Aug 1–12, affiliate ledger): $87,966 confirmed, 377 orders, 24
affiliates, $23,606 owed. Ethan Levi 158 orders/$35,675 · Andersen Pate 82/
$21,358 · Billy Gatt 86/$21,199. Commission rates vary 10–40%.

SKO Lives (company program, flat 10%): $28,277 MTD, 105 orders, **AOV $269.30**,
31.5% new customers. Ethan and Andersen run Lives on their **own** accounts, not
the company channel — so their Live sales land under affiliate.

Spend: TikTok $1,744.72 (Aug 5–11) then $302 on Aug 11 alone · OpenAI $1.94
(started Aug 11) · Meta $0 · Taboola $0 · Google unknown (no access).

---

## 6. Do not quote

- **paid vs organic split** — tests "has a click ID". RedTrack assigns one to
  every visitor by design, so it read 1,934 paid orders when 73 came from paid.
- **TikTok 6.91×** — the admin dashboard computes it as Cost × TikTok's own
  reported ROAS. Never reads an order. Labelled ESTIMATED for that reason.
- **RedTrack 43.53×** — all site revenue ÷ only the ad spend RedTrack sees.
  Not a channel ROAS.
- **"$260K of creator revenue is really TikTok"** — that counted TikTok *or*
  RedTrack click IDs. Only 2,947 landings carried a `ttclid` in 30d; 1,107
  orders would be 37.6% conversion. The 62 attributed is 2.1% — normal.

---

## 7. Open with Lovable

1. **Publish `oai_oppref` capture.** Works in preview; `sko_oai_oppref` is absent
   from the production bundle. Until then OpenAI records as organic. Ad-side
   param is already set: `oai_oppref={oppref}` in the OpenAI ad's landing-page
   query field.
2. **Split the 1,107** commissioned orders with a "TikTok/RedTrack click ID"
   into real `ttclid` vs RedTrack-only.
3. **30 days of TikTok platform-reported conversions + revenue** — sets the
   TikTok ceiling.
4. Confirm creator commission definitely routes from the affiliate tables when a
   click ID wins `attribution_source` (they said "may").

Declined: an IP + user-agent fingerprint rung to bridge TikTok in-app → Safari.
It would sit above the creator-code rung, and carrier NAT makes IP unreliable on
mobile. Revisit only with a measured false-positive rate.

---

## 8. Meta campaign state

`SKO | Sales | Prospecting | Aug 2026` — Sales, **campaign budget $150/day**,
ad set `US · Broad · 20-65 · Purchase` (broad US, 20–65, Advantage+ audience and
placements), **Off**, $0 spent. **8 ads, all in draft**, never submitted to review.

The "won't deliver to 19 placements" / "media not accessible" errors came from
duplicated ads losing their **Facebook Page** assignment. Set Page = Sko
Compounds and IG = skocompound on each before publishing.

Meta pixel has still never recorded a Purchase — one test order settles it.

---

## 9. Corrections — do not reintroduce

- Ethan and Andersen **do** run TikTok Lives, on their own accounts.
- RedTrack works as designed. The fault is downstream queries treating its ID as
  a paid signal.
- The order table is a deterministic **floor**, not reconciling truth. It
  undercounts click-ID channels (click IDs die in in-app browsers) and is
  reliable for code-based channels (customers type codes).
- OpenAI schema: `type` is **required** and must be `contents`; `amount` must be
  an integer in **minor units** (cents). Both were briefly claimed otherwise.
  The real cause of 180 rejections was unsupported fields inside `contents[]`.

---

## 10. Style

Jack wants numbers, not prose. No hedging, no restating, no essays. Verify
before asserting — he has said several times that unverified claims are the
problem. If something can be checked in a dashboard or a query, check it.
