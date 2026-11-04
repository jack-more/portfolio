// ballast.la/admin backend: the lead database, behind ADMIN_PASSWORD (set in Netlify, never in this repo).
// Leads live in Netlify Blobs (store "gtm", key "leads"), not in the repo, which is public.
import { getStore } from "@netlify/blobs";
import { timingSafeEqual, createHash } from "node:crypto";

const same = (a, b) => timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", "x-robots-tag": "noindex" } });

export default async (req) => {
  const pw = process.env.ADMIN_PASSWORD || "";
  if (!pw) return json({ error: "ADMIN_PASSWORD is not set in Netlify" }, 503);
  if (!same(req.headers.get("x-admin-key") || "", pw)) return json({ error: "unauthorized" }, 401);
  const store = getStore({ name: "gtm", consistency: "strong" });
  const leads = (await store.get("leads", { type: "json" })) || {};
  if (req.method === "GET") return json({ leads });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  let b; try { b = await req.json(); } catch { return json({ error: "bad json" }, 400); }
  if (b.op === "upsert" && typeof b.id === "string" && b.id.length < 120 && b.patch && typeof b.patch === "object") {
    leads[b.id] = { ...(leads[b.id] || {}), ...b.patch };
  } else if (b.op === "delete" && typeof b.id === "string") {
    delete leads[b.id];
  } else if (b.op === "import" && b.leads && typeof b.leads === "object") {
    for (const [id, l] of Object.entries(b.leads)) if (!leads[id]) leads[id] = l;   // adds new leads, never overwrites
  } else return json({ error: "bad op" }, 400);
  await store.setJSON("leads", leads);
  return json({ ok: true, count: Object.keys(leads).length });
};

export const config = { path: "/api/leads" };
