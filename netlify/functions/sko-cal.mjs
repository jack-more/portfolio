// SKO marketing calendar API: shared storage for the team calendar at
// jack-more.github.io/sko-calendar. Items live in Netlify Blobs, one key each
// (entry/<id>, campaign/<id>, creator/<id>, payout/<id>), so two people editing different items never
// overwrite each other. Open to anyone with the link (no passcode, by request).
import { getStore } from "@netlify/blobs";

const ORIGINS = ["https://jack-more.github.io", "http://localhost:8123", "http://127.0.0.1:8123"];
const KINDS = ["entry", "campaign", "creator", "payout"];
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

const validId = (id) => typeof id === "string" && /^[a-z0-9-]{6,40}$/i.test(id);
const MAX_CHUNK = 5 * 1024 * 1024; // browsers upload files in 4 MB pieces; functions cap bodies near 6 MB

export default async (req) => {
  const origin = req.headers.get("origin") || "";
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });

  // Content files (videos, images, docs), stored as numbered pieces: files/<asset>/<i>.
  const url = new URL(req.url);
  const fileId = url.searchParams.get("file");
  if (fileId !== null) {
    const i = Number(url.searchParams.get("i"));
    if (!validId(fileId) || !Number.isInteger(i) || i < 0 || i > 4000) return json({ error: "bad_file" }, 400, origin);
    const files = getStore({ name: "sko-cal-files" });
    const key = `files/${fileId}/${i}`;
    if (req.method === "GET") {
      const buf = await files.get(key, { type: "arrayBuffer" });
      if (!buf) return json({ error: "not_found" }, 404, origin);
      return new Response(buf, { status: 200, headers: { "content-type": "application/octet-stream", "cache-control": "private, max-age=31536000, immutable", ...cors(origin) } });
    }
    if (req.method === "POST") {
      const buf = await req.arrayBuffer();
      if (!buf.byteLength || buf.byteLength > MAX_CHUNK) return json({ error: "bad_chunk" }, 413, origin);
      await files.set(key, buf);
      return json({ ok: true, bytes: buf.byteLength }, 200, origin);
    }
    return json({ error: "method" }, 405, origin);
  }

  const store = getStore({ name: "sko-cal", consistency: "strong" });

  if (req.method === "GET") {
    const out = {};
    for (const kind of KINDS) {
      const { blobs } = await store.list({ prefix: kind + "/" });
      const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
      out[kind] = items.filter(Boolean);
    }
    return json({ entries: out.entry, campaigns: out.campaign, creators: out.creator, payouts: out.payout, at: new Date().toISOString() }, 200, origin);
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "bad_json" }, 400, origin);
    }
    const { op, kind } = body || {};
    if (op === "delfile") {
      const n = Number(body.chunks);
      if (!validId(body.id) || !Number.isInteger(n) || n < 1 || n > 4000) return json({ error: "bad_file" }, 400, origin);
      const files = getStore({ name: "sko-cal-files" });
      await Promise.all(Array.from({ length: n }, (_, i) => files.delete(`files/${body.id}/${i}`)));
      return json({ ok: true }, 200, origin);
    }
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
