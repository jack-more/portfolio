#!/usr/bin/env python3
"""Refresh app/SKOtests/data.json from a TikTok weekly creative export.

Usage: python3 scripts/build-sko-tests.py "/path/to/Tiktok Ads_WEEKLY....xlsx" [YYYY-MM-DD]
Matches creatives by the prefix of their asset name; updates spend/pur/rev on
existing entries (winners + tests). New creatives in the export are printed so
you can add them to a lane deliberately — nothing enters the pipeline silently.
"""
import json, sys, collections, datetime, warnings
warnings.filterwarnings('ignore')
import openpyxl

xlsx = sys.argv[1]
asof = sys.argv[2] if len(sys.argv) > 2 else datetime.date.today().isoformat()
DATA = 'app/SKOtests/data.json'

wb = openpyxl.load_workbook(xlsx, data_only=True)
ws = wb.active
rows = list(ws.iter_rows(values_only=True)); hdr = list(rows[0]); I = {h: i for i, h in enumerate(hdr)}
def f(v):
    try: return float(v)
    except: return 0.0

agg = collections.defaultdict(lambda: [0.0, 0.0, 0.0])
for r in rows[1:]:
    ad = str(r[I['Ad name']] or '').strip()
    if ad in ('-', ''): continue
    asset = str(r[I['Creative asset name']] or '').strip()
    if asset.endswith('_' + ad): asset = asset[:-len('_' + ad)]
    a = agg[asset]
    a[0] += f(r[I['Spend']]); a[1] += f(r[I['Purchases (website)']]); a[2] += f(r[I['Purchase value (website)']])

data = json.load(open(DATA))
def key(name):
    return name.split('(')[-1].rstrip(')…').strip() if '(' in name else name.split('…')[0].strip()

matched = set()
for bucket in ('winners', 'tests'):
    for item in data[bucket]:
        k = key(item['name'])
        hits = [a for a in agg if k[:12].lower() in a.lower() or a[:12].lower() in k.lower()]
        if hits:
            h = max(hits, key=lambda a: agg[a][0])
            item['spend'], item['pur'], item['rev'] = round(agg[h][0], 2), int(agg[h][1]), round(agg[h][2], 2)
            matched.add(h)

data['asOf'] = asof
json.dump(data, open(DATA, 'w'), indent=2)
print(f'updated {DATA} as of {asof}')
new = sorted(((a, v) for a, v in agg.items() if a not in matched and v[0] > 20), key=lambda x: -x[1][0])
if new:
    print('\nNot in pipeline (spend > $20) — add deliberately if testing:')
    for a, v in new[:20]:
        print(f'  {a[:50]:52} spend {v[0]:8,.2f} pur {v[1]:3.0f} rev {v[2]:9,.2f}')
