// ballast.la mailing list. Sign-ups from ballast.la and jackmorello.com land in Netlify Blobs
// (store "gtm", key "subscribers"), next to the leads. The repo is public, so no emails live here.
// POST {email, source, company?} subscribes (company is a honeypot and must stay empty).
// GET with x-admin-key returns the list for export to an email tool.
import { getStore } from "@netlify/blobs";
import { timingSafeEqual, createHash } from "node:crypto";

const ORIGINS = new Set(["https://ballast.la", "https://www.ballast.la", "https://jackmorello.com", "https://www.jackmorello.com"]);
const same = (a, b) => timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
const cors = (req) => {
  const o = req.headers.get("origin") || "";
  return ORIGINS.has(o) ? { "access-control-allow-origin": o, "vary": "origin", "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type" } : {};
};
const json = (req, body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", "x-robots-tag": "noindex", ...cors(req) } });
const EMAIL = /^[^\s@<>()"',;:]{1,64}@[A-Za-z0-9.-]{1,180}\.[A-Za-z]{2,24}$/;

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
  const store = getStore({ name: "gtm", consistency: "strong" });

  if (req.method === "GET") {
    const pw = process.env.ADMIN_PASSWORD || "";
    if (!pw) return json(req, { error: "ADMIN_PASSWORD is not set in Netlify" }, 503);
    if (!same(req.headers.get("x-admin-key") || "", pw)) return json(req, { error: "unauthorized" }, 401);
    const subs = (await store.get("subscribers", { type: "json" })) || {};
    return json(req, { count: Object.keys(subs).length, subscribers: subs });
  }
  if (req.method !== "POST") return json(req, { error: "method" }, 405);

  let b = {};
  const type = req.headers.get("content-type") || "";
  try {
    if (type.includes("application/json")) b = await req.json();
    else b = Object.fromEntries(await req.formData());
  } catch { return json(req, { error: "bad request" }, 400); }

  if (b.company) return json(req, { ok: true });   // honeypot: bots fill every field
  const email = String(b.email || "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) return json(req, { error: "Please enter a valid email." }, 400);
  const source = String(b.source || "ballast.la").slice(0, 60);

  const subs = (await store.get("subscribers", { type: "json" })) || {};
  if (!subs[email]) {
    subs[email] = { at: new Date().toISOString(), source };
    await store.setJSON("subscribers", subs);
  }
  return json(req, { ok: true });
};

export const config = { path: "/api/subscribe" };
