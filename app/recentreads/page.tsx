import Link from "next/link";

const books = [
  { title: "The Double and The Gambler", author: "Dostoevsky", href: "https://www.goodreads.com/book/show/5698.The_Double_and_The_Gambler" },
  { title: "Debt: The First 5,000 Years", author: "David Graeber", href: "https://www.goodreads.com/book/show/6617037-debt" },
  { title: "Breath", author: "James Nestor", href: "https://www.goodreads.com/book/show/48890486-breath" },
  { title: "The Boy Who Could Change the World", author: "Aaron Swartz", href: "https://www.goodreads.com/en/book/show/23258925-the-boy-who-could-change-the-world" },
  { title: "Harrison Bergeron", author: "Vonnegut", href: "https://www.goodreads.com/book/show/10176119-harrison-bergeron" },
  { title: "Machines Like Me", author: "Ian McEwan", href: "https://www.goodreads.com/book/show/42086795-machines-like-me" },
  { title: "The Road", author: "Cormac McCarthy", href: "https://www.goodreads.com/book/show/6288.The_Road" },
  { title: "Intelligence and Spirit", author: "Reza Negarestani", href: "https://www.goodreads.com/en/book/show/35218850-intelligence-and-spirit" },
  { title: "Fanged Noumena", author: "Nick Land", href: "https://www.goodreads.com/en/book/show/10838202-fanged-noumena" },
];

const articles = [
  { title: "Hitting Streaks Don't Obey Your Rules", source: "SABR", href: "https://sabr.org/journal/article/hitting-streaks-dont-obey-your-rules-evidence-that-hitting-streaks-arent-just-by-products-of-random-variation/" },
  { title: "RE24", source: "FanGraphs", href: "https://library.fangraphs.com/misc/re24/" },
  { title: "Nodal Points Digest #2: LLM Personas", source: "Substack", href: "https://poeticengineering.substack.com/p/nodal-points-digest-2-llm-personas" },
  { title: "The Fluid Mind and the Ever More Magical Future of Interfaces", source: "Substack", href: "https://poeticengineering.substack.com/p/the-fluid-mind-and-the-ever-more-magical-future-of-interfaces" },
];

function Row({ left, right, href }: { left: string; right: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="rr-row">
      <span className="rr-left">{left}</span>
      <span className="rr-dash" />
      <span className="rr-right">{right}</span>
    </a>
  );
}

export default function RecentReadsPage() {
  return (
    <div className="rr-page">
      <nav className="rr-nav">
        <Link href="/" className="rr-back">&larr; Home</Link>
        <h1 className="rr-title">Recent Reads</h1>
      </nav>

      <main className="rr-content">
        <section className="rr-section" id="books">
          <h2 className="rr-heading">Books</h2>
          <p className="rr-subtext">Things I have been reading over the last 8 years.</p>
          <div className="rr-list">
            {books.map((b) => (
              <Row key={b.title} left={b.title} right={b.author} href={b.href} />
            ))}
          </div>
        </section>

        <section className="rr-section" id="articles">
          <h2 className="rr-heading">Articles</h2>
          <p className="rr-subtext">Pieces that stuck with me.</p>
          <div className="rr-list">
            {articles.map((a) => (
              <Row key={a.title} left={a.title} right={a.source} href={a.href} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
