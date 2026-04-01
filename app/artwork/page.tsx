import Link from "next/link";

const pieces = [
  {
    id: "roma-ct",
    title: "Roma CT",
    note: "beautiful things happening",
    dimensions: '36" \u00d7 48"',
    status: "Sold",
  },
  {
    id: "gdp-plus10",
    title: "GDP +10",
    note: "flags become paintings when nobody salutes",
    dimensions: '36" \u00d7 36"',
    status: "Available",
  },
  {
    id: "plane-post",
    title: "Plane Post",
    note: "posts from the plane. cloud floats free while we stay gridlocked",
    dimensions: '36" \u00d7 24"',
    status: "Available",
  },
  {
    id: "breer",
    title: "Breer",
    note: "longing",
    dimensions: '60" \u00d7 40"',
    status: "Sold",
  },
  {
    id: "oceanic-plate",
    title: "Oceanic Plate",
    note: "brotherhood reveals itself in yellow pools. what was i thinking?",
    dimensions: '36" \u00d7 24"',
    status: "Available",
  },
];

export default function ArtworkPage() {
  return (
    <div className="artwork-page">
      <nav className="artwork-nav">
        <Link href="/" className="artwork-back">&larr; Back</Link>
        <span className="artwork-title">Artwork</span>
      </nav>

      <div className="artwork-grid">
        {pieces.map((p) => (
          <div key={p.id} id={p.id} className="artwork-card">
            <div className="artwork-placeholder">
              <span className="artwork-placeholder-title">{p.title}</span>
            </div>
            <div className="artwork-info">
              <h2 className="artwork-name">{p.title}</h2>
              <p className="artwork-note">{p.note}</p>
              <div className="artwork-meta">
                <span>{p.dimensions}</span>
                <span className={`artwork-status ${p.status === "Available" ? "artwork-available" : "artwork-sold"}`}>
                  {p.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="artwork-footer">
        <p>
          Inquiries: <a href="mailto:jaidanmorello@gmail.com">jaidanmorello@gmail.com</a>
        </p>
      </footer>
    </div>
  );
}
