/* Server-only client for the SKO attribution endpoint.

   The token is a server secret and must never reach the browser — this file
   is imported by a server component only. Do not import it from anything
   marked "use client".

   Env:
     SKO_REPORTS_URL    full function URL, no query string
     SKO_REPORTS_TOKEN  bearer token

   If either is missing, or the call fails, this returns null and the page
   renders dashes. A tracking page that shows a wrong number is worse than
   one that shows no number. */

export type SourceRow = {
  source: string;
  orders: number;
  revenue: number;
  aov: number;
};

export type Attribution = {
  range: { start: string; end: string };
  totals: { orders: number; revenue: number; aov: number };
  by_source: SourceRow[];
  paid_vs_organic: {
    paid: { orders: number; revenue: number; aov: number };
    organic: { orders: number; revenue: number; aov: number };
  };
};

export async function getAttribution(
  start: string,
  end: string,
): Promise<{ data: Attribution | null; error: string | null }> {
  const url = process.env.SKO_REPORTS_URL;
  const token = process.env.SKO_REPORTS_TOKEN;

  if (!url || !token) {
    return { data: null, error: "SKO_REPORTS_URL or SKO_REPORTS_TOKEN not set" };
  }

  try {
    const res = await fetch(`${url}?start=${start}&end=${end}`, {
      headers: { Authorization: `Bearer ${token}` },
      // Always live. Netlify does not run ISR on this site, so caching here
      // would silently freeze the numbers at build time.
      cache: "no-store",
      // Supabase edge functions cold-start; 10s was not enough in practice.
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      return { data: null, error: `Endpoint returned ${res.status}` };
    }

    const data = (await res.json()) as Attribution;
    if (!data?.totals) return { data: null, error: "Unexpected response shape" };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "Fetch failed" };
  }
}

export const usd = (n: number | null | undefined) =>
  n === null || n === undefined
    ? "—"
    : `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export const num = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : n.toLocaleString("en-US");

export const roas = (revenue: number | null, spend: number | null) =>
  revenue === null || spend === null || !spend ? "—" : `${(revenue / spend).toFixed(2)}×`;
