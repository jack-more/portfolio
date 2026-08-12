# SKO tracking — session handoff

State as of 2026-08-12. Read this instead of replaying the conversation.

## Pages

- `/SKOtracking` — live scorecard. Numbers only, no prose. Spend is hand-entered in
  `app/SKOtracking/data.json`; revenue/orders pull live.
- `/sko/tracking` — measurement map. Diagram + 3 windows + floor/ceiling.
- Both read `app/SKOtracking/attribution.ts` → Supabase function.
- Env (set in Netlify, and `.env.local` locally): `SKO_REPORTS_URL`, `SKO_REPORTS_TOKEN`.
- Workbook: `python3 scripts/build-tracking-xlsx.py` → `public/sko-tracking.xlsx`.

## The one thing to understand

`attribution_source` holds **one** value per order, set by a ladder that stops at the
first match:

1. body click IDs — `fbclid` → `ttclid` → `oai_oppref`
2. `tt_attr` cookie
3. 30-day `page_views` lookback (visitor_id or lower(email))
4. user-agent fallback (TikTok/Meta in-app)
5. creator `?ref=` or coupon → `affiliate`
6. default → `organic`

Click IDs beat creator codes. Creators still get paid — commission lives in separate
affiliate tables, not this column.

## Numbers (30 days to Aug 12)

| | Floor | Ceiling |
|---|---|---|
| Creators + Lives | $451,549 · 1,921 orders | $474,463 · 2,272 |
| Organic | $261,219 · 1,606 | same |
| TikTok | $10,000 · 62 | **pending** — need 30d platform report |
| Meta | $1,606 · 11 | same ($0 spent — organic social `fbclid`) |
| OpenAI | $0 | $0 — launched Aug 11 |

Month total: 3,951 orders · $745,856.

## Do not quote

- **paid vs organic split** — tests "has a click ID". RedTrack assigns one to every
  visitor by design, so it read 1,934 paid orders when 73 came from paid sources.
- **TikTok 6.91×** — computed as Cost × TikTok's own reported ROAS. Never reads an order.
- **"$260K of creator revenue is really TikTok"** — that figure counted TikTok *or*
  RedTrack click IDs. Only 2,947 landings carried a `ttclid` in 30 days; 1,107 orders
  from those would be 37.6% conversion. The current 62 orders is 2.1%, which is normal.

## Open

1. Lovable: publish `oai_oppref` capture — works in preview, not in the production
   bundle. Without it OpenAI records as organic.
2. Lovable: split those 1,107 into real `ttclid` vs RedTrack-only.
3. Lovable: 30 days of TikTok platform-reported conversions/revenue, to set the ceiling.
4. Meta: 8 ads still in draft. Duplicates lost their Facebook Page, which caused the
   "media not accessible" and preview errors. Set Page + IG on each before publishing.
5. Decided against: IP+UA fingerprint rung. It would outrank creator codes and carrier
   NAT makes it unreliable on mobile.

## Corrections made (don't reintroduce)

- Ethan Levi and Andersen Pate **do** run TikTok Lives, from their own accounts, not the
  company channel.
- RedTrack is working as designed. The bug is downstream queries treating its ID as a
  paid signal.
- The order table is a deterministic **floor**, not a reconciling truth. It undercounts
  click-ID channels because click IDs die in in-app browsers; codes survive because the
  customer types them.
