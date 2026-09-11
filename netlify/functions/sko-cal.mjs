// SKO marketing calendar API: shared storage for the team calendar at
// jack-more.github.io/sko-calendar. Items live in Netlify Blobs, one key each
// (entry/<id>, campaign/<id>), so two people editing different items never
// overwrite each other. Every request carries the team passcode; only its
// SHA-256 is kept here.
import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";

const PASS_SHA256 = "2c60f1899a202714db2c79a2e668131947e032b3b92d8be66207bf4711686e23";
const ORIGINS = ["https://jack-more.github.io", "http://localhost:8123", "http://127.0.0.1:8123"];
const KINDS = ["entry", "campaign"];
const MAX_BYTES = 40_000;

const cors = (origin) => ({
  "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0],
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, x-team-pass",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
});

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...cors(origin) },
  });

const passOk = (req) => {
  const pass = req.headers.get("x-team-pass") || "";
  return createHash("sha256").update(pass).digest("hex") === PASS_SHA256;
};

const validId = (id) => typeof id === "string" && /^[a-z0-9-]{6,40}$/i.test(id);

export default async (req) => {
  const origin = req.headers.get("origin") || "";
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (!passOk(req)) return json({ error: "bad_pass" }, 401, origin);

  const store = getStore({ name: "sko-cal", consistency: "strong" });

  if (req.method === "GET") {
    const out = {};
    for (const kind of KINDS) {
      const { blobs } = await store.list({ prefix: kind + "/" });
      const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
      out[kind] = items.filter(Boolean);
    }
    return json({ entries: out.entry, campaigns: out.campaign, at: new Date().toISOString() }, 200, origin);
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "bad_json" }, 400, origin);
    }
    const { op, kind } = body || {};
    if (!KINDS.includes(kind)) return json({ error: "bad_kind" }, 400, origin);

    if (op === "put") {
      const item = body.item;
      if (!item || !validId(item.id)) return json({ error: "bad_item" }, 400, origin);
      const saved = { ...item, updatedAt: new Date().toISOString() };
      if (JSON.stringify(saved).length > MAX_BYTES) return json({ error: "too_big" }, 413, origin);
      await store.setJSON(`${kind}/${item.id}`, saved);
      return json({ ok: true, item: saved }, 200, origin);
    }
    if (op === "del") {
      if (!validId(body.id)) return json({ error: "bad_id" }, 400, origin);
      await store.delete(`${kind}/${body.id}`);
      return json({ ok: true }, 200, origin);
    }
    return json({ error: "bad_op" }, 400, origin);
  }

  return json({ error: "method" }, 405, origin);
};
