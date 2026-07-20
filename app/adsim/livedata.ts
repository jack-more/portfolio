/* Server-side fetch of the one benchmark source that updates monthly:
   Lebesgue's Facebook CPM-by-country page. Parsed from their published
   list; the page's own metadata carries the freshest revision, which we
   overlay. Falls back to the baked snapshot in benchmarks.ts on any
   failure. Revalidated daily. */

export interface LiveCountry {
  label: string;
  value: number;
}

export interface LiveCountryData {
  rows: LiveCountry[];
  modified: string | null; // page's dateModified, YYYY-MM-DD
}

const SOURCE_URL = "https://lebesgue.io/facebook-ads/facebook-cpm-by-country";

export async function fetchLiveCountryCpms(): Promise<LiveCountryData | null> {
  try {
    const res = await fetch(SOURCE_URL, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; Adsim/1.0; +https://jackmorello.com/adsim)",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const map = new Map<string, number>();
    const liRe = /<li>([A-Za-z][A-Za-z .()&-]+?):\s*\$([0-9]+(?:\.[0-9]+)?)<\/li>/g;
    let m: RegExpExecArray | null;
    while ((m = liRe.exec(html))) {
      const v = parseFloat(m[2]);
      if (v >= 0.2 && v <= 200) map.set(m[1].trim(), v);
    }

    // The meta description holds the page's most recently revised figures;
    // overlay them onto the full list where names match.
    const desc = html.match(/<meta name="description" content="([^"]+)"/);
    if (desc) {
      const pairRe = /([A-Z][A-Za-z .]+?)\s*\$([0-9]+(?:\.[0-9]+)?)/g;
      while ((m = pairRe.exec(desc[1]))) {
        const name = m[1].trim();
        const v = parseFloat(m[2]);
        if (map.has(name) && v >= 0.2 && v <= 200) map.set(name, v);
      }
    }

    if (map.size < 10) return null; // parse looks broken — use baked fallback

    const mod = html.match(/"dateModified":"(\d{4}-\d{2}-\d{2})/);
    return {
      rows: [...map.entries()].map(([label, value]) => ({ label, value })),
      modified: mod ? mod[1] : null,
    };
  } catch {
    return null;
  }
}
