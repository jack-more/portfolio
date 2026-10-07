'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const B = "https://ballast.la/work/health";

type Tile =
  | { kind: "ad"; file: string; label: string }
  | { kind: "still"; file: string; label: string }
  | { kind: "yt"; id: string; label: string; title: string; wide?: boolean; poster: string }
  | { kind: "ig"; id: string; label: string; title: string };

const SKO = "SKO Compounds";
const ad = (file: string, label = SKO): Tile => ({ kind: "ad", file, label });
const still = (file: string, label = SKO): Tile => ({ kind: "still", file, label });
const yt = (id: string, label: string, title: string, poster: string, wide = false): Tile => ({ kind: "yt", id, label, title, poster, wide });
const ig = (id: string, label: string, title: string): Tile => ({ kind: "ig", id, label, title });

// Every tile is 9:16; wide spots crop to the tile and play at full size when tapped.
// Generated with ballast.la's wall: same order, labels and posters.
const wall: Tile[] = [
  yt("oqxAJKy0ii4", "Netflix \u00b7 Squid Game", "the Squid Game trailer", "/work/yt/oqxAJKy0ii4.webp", true),
  ad("sko-founder-1", "SKO Compounds"),
  yt("TcMBFSGVi1c", "Disney \u00b7 Avengers: Endgame", "the Avengers: Endgame trailer", "/work/yt/TcMBFSGVi1c.webp", true),
  yt("JSpUNWjQk6c", "STARZPLAY \u00b7 Raising Kanan", "the Raising Kanan promo", "https://i.ytimg.com/vi/JSpUNWjQk6c/oar2.jpg", false),
  yt("Y_IuBEtfzGM", "Toyota \u00b7 4Runner", "the Toyota 4Runner Warm Up spot", "/work/brands/toyota-4runner.webp", true),
  ad("ugc-hanna-1", "SKO \u00b7 creator"),
  yt("HZ7PAyCDwEg", "Universal \u00b7 Hobbs & Shaw", "the Hobbs & Shaw promo", "/work/yt/HZ7PAyCDwEg.webp", true),
  yt("jtJ_DbPYnrU", "Starbucks \u00b7 Holidays 2021", "the Starbucks holiday 2021 spot", "/work/yt/jtJ_DbPYnrU.webp", true),
  yt("sItKwZdGkTM", "Peacock \u00b7 The Office", "the The Office promo", "/work/yt/sItKwZdGkTM.webp", true),
  yt("zEvYcxW_QP4", "LG \u00b7 G7 ThinQ launch", "the LG G7 ThinQ launch spot (2018)", "/work/yt/zEvYcxW_QP4.webp", true),
  still("epeps-corona", "ePeps"),
  ad("sko-ai-spot", "SKO Compounds"),
  ad("ugc-dennis-1", "SKO \u00b7 creator"),
  still("sko-alpine", "SKO Compounds"),
  ad("sko-frutiger-1", "SKO Compounds"),
  ad("sko-orders", "SKO Compounds"),
  ad("ugc-ethan-1", "SKO \u00b7 creator"),
  ad("sko-dna", "SKO Compounds"),
  ad("ugc-hanna-2", "SKO \u00b7 creator"),
  ad("sko-tennis", "SKO Compounds"),
  ad("sko-frutiger-2", "SKO Compounds"),
  ad("ugc-dennis-2", "SKO \u00b7 creator"),
  ad("sko-bubbles", "SKO Compounds"),
  ad("sko-laborday-1", "SKO Compounds"),
  ad("sko-truck", "SKO Compounds"),
  ad("sko-box2", "SKO Compounds"),
  ad("sko-frutiger-3", "SKO Compounds"),
  ad("sko-freevial", "SKO Compounds"),
  yt("HsZkjGvj8e8", "STARZPLAY \u00b7 BMF", "the BMF promo", "https://i.ytimg.com/vi/HsZkjGvj8e8/oar2.jpg", false),
  yt("-yjEoZtTExw", "STARZPLAY \u00b7 Heels", "the Heels trailer", "/work/yt/-yjEoZtTExw.webp", true),
  yt("LzvrQ0vAF0w", "STARZPLAY \u00b7 Raising Kanan", "the Raising Kanan promo", "https://i.ytimg.com/vi/LzvrQ0vAF0w/oar2.jpg", false),
  yt("y3ZCJLz1m-s", "Starbucks \u00b7 Holidays 2021", "the Starbucks Together Again spot", "/work/yt/y3ZCJLz1m-s.webp", true),
  yt("YwdFISPk86E", "Toyota \u00b7 Camry \u00b7 Corolla", "the Toyota Imagine spot", "/work/brands/toyota-imagine.webp", true),
  yt("GHA2DH2kEb0", "Toyota \u00b7 Tacoma", "the Toyota Tacoma Magic Hour spot", "/work/brands/toyota-tacoma.webp", true),
  yt("WotAnYua7-k", "Toyota \u00b7 Tundra \u00b7 Tacoma", "the Toyota Helping Hands spot", "/work/brands/toyota-helping.webp", true),
  yt("jr3UYpx8gVI", "NEAR × SailGP · NEAR Miss", "the SailGP NEAR Miss short", "/work/yt/jr3UYpx8gVI.webp", false),
  yt("kWJjBRooSdM", "NEAR × SailGP · NEAR Miss", "the SailGP NEAR Miss short", "/work/yt/kWJjBRooSdM.webp", false),
  yt("6K0o-VQpIXU", "NEAR × SailGP · Spain SailGP", "the Spain SailGP presented by NEAR highlights", "/work/yt/6K0o-VQpIXU.webp", true),
  yt("TGZRTHpjqiY", "NEAR × SailGP · NEAR Miss", "the SailGP NEAR Miss short", "/work/yt/TGZRTHpjqiY.webp", false),
  yt("N50b3Pn2fmY", "NEAR × SailGP · DAO team", "the NEAR case study on the DAO-owned SailGP team", "/work/yt/N50b3Pn2fmY.webp", true),
  yt("T256YekFpCU", "NEAR × SailGP · NEAR Miss", "the SailGP NEAR Miss short", "/work/yt/T256YekFpCU.webp", false),
  yt("h4Rb4tDK1GQ", "Dtravel · SAGA", "the Dtravel SAGA promo", "/work/yt/h4Rb4tDK1GQ.webp", true),
  yt("fSd9_ECe068", "Dtravel · Bali, paid in crypto", "the Dtravel IRL experiences promo", "/work/yt/fSd9_ECe068.webp", true),
  yt("w8_kSY_ABzg", "Dtravel · Direct Stays", "the Dtravel Direct Stays explainer", "/work/yt/w8_kSY_ABzg.webp", true),
  yt("ndl1W4ltcmg", "Netflix \u00b7 The Witcher", "the The Witcher trailer", "/work/yt/ndl1W4ltcmg.webp", true),
  yt("L6P3nI6VnlY", "Netflix \u00b7 Extraction", "the Extraction trailer", "/work/yt/L6P3nI6VnlY.webp", true),
  yt("RbIxYm3mKzI", "Netflix \u00b7 Don't Look Up", "the Don't Look Up trailer", "/work/yt/RbIxYm3mKzI.webp", true),
  yt("p_PJbmrX4uk", "Netflix \u00b7 Money Heist", "the Money Heist trailer", "/work/yt/p_PJbmrX4uk.webp", true),
  yt("HyOCCCbxwMQ", "Netflix \u00b7 Never Have I Ever", "the Never Have I Ever trailer", "/work/yt/HyOCCCbxwMQ.webp", true),
  yt("V3L1qrisKFE", "Netflix \u00b7 Stranger Things 3", "the Stranger Things 3 trailer", "/work/yt/V3L1qrisKFE.webp", true),
  yt("gpv7ayf_tyE", "Netflix \u00b7 Bridgerton", "the Bridgerton trailer", "/work/yt/gpv7ayf_tyE.webp", true),
  yt("acTdxsoa428", "Netflix \u00b7 Tiger King", "the Tiger King trailer", "/work/yt/acTdxsoa428.webp", true),
  yt("xXBTImqyeU0", "Netflix \u00b7 You", "the You trailer", "/work/yt/xXBTImqyeU0.webp", true),
  yt("ga0iTWXCGa0", "Netflix \u00b7 Lupin", "the Lupin trailer", "/work/yt/ga0iTWXCGa0.webp", true),
  yt("slC_drCw1dA", "Netflix \u00b7 Outer Banks", "the Outer Banks trailer", "/work/yt/slC_drCw1dA.webp", true),
  yt("oNDTOy5bU_4", "Netflix \u00b7 Ozark", "the Ozark trailer", "/work/yt/oNDTOy5bU_4.webp", true),
  yt("1d0Zf9sXlHk", "Netflix \u00b7 Enola Holmes", "the Enola Holmes trailer", "/work/yt/1d0Zf9sXlHk.webp", true),
  yt("Pj0wz7zu3Ms", "Netflix \u00b7 Red Notice", "the Red Notice trailer", "/work/yt/Pj0wz7zu3Ms.webp", true),
  yt("Zi4LMpSDccc", "Disney \u00b7 Frozen II", "the Frozen II trailer", "/work/yt/Zi4LMpSDccc.webp", true),
  yt("7TavVZMewpY", "Disney \u00b7 The Lion King", "the The Lion King trailer", "/work/yt/7TavVZMewpY.webp", true),
  yt("wmiIUN-7qhE", "Disney \u00b7 Toy Story 4", "the Toy Story 4 trailer", "/work/yt/wmiIUN-7qhE.webp", true),
  yt("8Qn_spdM5Zg", "Disney \u00b7 Star Wars: The Rise of Skywalker", "the Star Wars: The Rise of Skywalker trailer", "/work/yt/8Qn_spdM5Zg.webp", true),
  yt("CaimKeDcudo", "Disney \u00b7 Encanto", "the Encanto trailer", "/work/yt/CaimKeDcudo.webp", true),
  yt("ybji16u608U", "Disney \u00b7 Black Widow", "the Black Widow trailer", "/work/yt/ybji16u608U.webp", true),
  yt("8YjFbMbfXaQ", "Disney \u00b7 Shang-Chi and the Legend of the Ten Rings", "the Shang-Chi and the Legend of the Ten Rings trailer", "/work/yt/8YjFbMbfXaQ.webp", true),
  yt("aOC8E8z_ifw", "Disney \u00b7 The Mandalorian", "the The Mandalorian trailer", "/work/yt/aOC8E8z_ifw.webp", true),
  yt("xOsLIiBStEs", "Disney \u00b7 Soul", "the Soul trailer", "/work/yt/xOsLIiBStEs.webp", true),
  yt("nW948Va-l10", "Disney \u00b7 Loki", "the Loki trailer", "/work/yt/nW948Va-l10.webp", true),
  yt("sj9J2ecsSpo", "Disney \u00b7 WandaVision", "the WandaVision trailer", "/work/yt/sj9J2ecsSpo.webp", true),
  yt("5VYb3B1ETlk", "Disney \u00b7 Hawkeye", "the Hawkeye trailer", "/work/yt/5VYb3B1ETlk.webp", true),
  yt("IWBsDaFWyTE", "Disney \u00b7 The Falcon and the Winter Soldier", "the The Falcon and the Winter Soldier trailer", "/work/yt/IWBsDaFWyTE.webp", true),
  yt("kAqIKAC1dII", "NBC \u00b7 Transplant", "the Transplant promo", "/work/yt/kAqIKAC1dII.webp", true),
  yt("TWVMBfMpFiU", "Peacock \u00b7 One of Us Is Lying", "the One of Us Is Lying promo", "/work/yt/TWVMBfMpFiU.webp", true),
  yt("WUydwrPAY-M", "Peacock \u00b7 Dr. Death", "the Dr. Death promo", "/work/yt/WUydwrPAY-M.webp", true),
  yt("faJAT35j5Ss", "NBC \u00b7 Brooklyn Nine-Nine final season", "the Brooklyn Nine-Nine final season promo", "/work/yt/faJAT35j5Ss.webp", true),
  yt("As2sMgm0Szo", "Peacock \u00b7 Brave New World", "the Brave New World promo", "/work/yt/As2sMgm0Szo.webp", true),
  yt("O0uCr5-5p5Q", "Peacock \u00b7 Saved by the Bell", "the Saved by the Bell promo", "/work/yt/O0uCr5-5p5Q.webp", true),
  yt("HsItWo7eF5s", "Peacock \u00b7 Psych 2: Lassie Come Home", "the Psych 2: Lassie Come Home promo", "/work/yt/HsItWo7eF5s.webp", true),
  yt("wkDqc6mifJ4", "Peacock \u00b7 Dan Brown's The Lost Symbol", "the Dan Brown's The Lost Symbol promo", "/work/yt/wkDqc6mifJ4.webp", true),
  yt("XeEGo0V4A4A", "NBC \u00b7 The Voice Season 21", "the The Voice Season 21 promo", "/work/yt/XeEGo0V4A4A.webp", true),
  yt("Bnq6IRgt4yE", "NBC \u00b7 The Good Place final season", "the The Good Place final season promo", "/work/yt/Bnq6IRgt4yE.webp", true),
  yt("vaWlZGd3srE", "NBC \u00b7 SNL Season 46", "the SNL Season 46 promo", "/work/yt/vaWlZGd3srE.webp", true),
  yt("WlUYv_EtEAg", "Peacock \u00b7 Girls5eva", "the Girls5eva promo", "/work/yt/WlUYv_EtEAg.webp", true),
  yt("zX3ph5T-yek", "Peacock \u00b7 Rutherford Falls", "the Rutherford Falls promo", "/work/yt/zX3ph5T-yek.webp", true),
  yt("aSiDu3Ywi8E", "Universal \u00b7 F9", "the F9 promo", "/work/yt/aSiDu3Ywi8E.webp", true),
  yt("GkXeVIfbJOw", "Universal \u00b7 The Croods: A New Age", "the The Croods: A New Age promo", "/work/yt/GkXeVIfbJOw.webp", true),
  yt("EPZu5MA2uqI", "Universal \u00b7 Sing 2", "the Sing 2 promo", "/work/yt/EPZu5MA2uqI.webp", true),
  yt("yP86-TR6IME", "Universal \u00b7 Trolls World Tour", "the Trolls World Tour promo", "/work/yt/yP86-TR6IME.webp", true),
  yt("A4U2pMRV9_k", "Universal \u00b7 Old", "the Old promo", "/work/yt/A4U2pMRV9_k.webp", true),
  yt("QPzy8Ckza08", "Universal \u00b7 The Boss Baby: Family Business", "the The Boss Baby: Family Business promo", "/work/yt/QPzy8Ckza08.webp", true),
  yt("TPBH3XO8YEU", "Universal \u00b7 Candyman", "the Candyman promo", "/work/yt/TPBH3XO8YEU.webp", true),
  yt("YqNYrYUiMfg", "Universal \u00b7 1917", "the 1917 promo", "/work/yt/YqNYrYUiMfg.webp", true),
  yt("mYocfuqu2A8", "Universal \u00b7 The Secret Life of Pets 2", "the The Secret Life of Pets 2 promo", "/work/yt/mYocfuqu2A8.webp", true),
  yt("zPXqwAGmX04", "Universal \u00b7 Good Boys", "the Good Boys promo", "/work/yt/zPXqwAGmX04.webp", true),
  yt("g_c_Jd-hP-s", "Universal \u00b7 Dear Evan Hansen", "the Dear Evan Hansen promo", "/work/yt/g_c_Jd-hP-s.webp", true),
  yt("wZti8QKBWPo", "Universal \u00b7 Nobody", "the Nobody promo", "/work/yt/wZti8QKBWPo.webp", true),
  yt("FtSd844cI7U", "Universal \u00b7 Cats", "the Cats promo", "/work/yt/FtSd844cI7U.webp", true),
  yt("hL6R3HmQfPc", "Universal \u00b7 Halloween Kills", "the Halloween Kills promo", "/work/yt/hL6R3HmQfPc.webp", true),
  yt("WO_FJdiY9dA", "Universal \u00b7 The Invisible Man", "the The Invisible Man promo", "/work/yt/WO_FJdiY9dA.webp", true),
  yt("lKuvOrCmFTY", "Universal \u00b7 Us", "the Us promo", "/work/yt/lKuvOrCmFTY.webp", true),
  yt("fQSpBW_-4kc", "LG \u00b7 V30S ThinQ", "the LG V30S ThinQ spot (2018)", "/work/yt/fQSpBW_-4kc.webp", true),
  yt("VVFwJd6eDrA", "LG \u00b7 G7 ThinQ", "the LG G7 ThinQ spot (2018)", "/work/yt/VVFwJd6eDrA.webp", true),
  yt("fBewgOQzWvw", "LG \u00b7 V30S ThinQ launch", "the LG V30S ThinQ launch spot (2018)", "/work/yt/fBewgOQzWvw.webp", true),
  yt("bxrlpY6MiGA", "LG \u00b7 Q7", "the LG Q7 spot (2018)", "/work/yt/bxrlpY6MiGA.webp", true),
  yt("Uz2ZbQB_lzY", "LG \u00b7 G7 ThinQ", "the LG G7 ThinQ spot (2018)", "/work/yt/Uz2ZbQB_lzY.webp", true),
  yt("MqcZQSByw3A", "LG \u00b7 G7 ThinQ teaser", "the LG G7 ThinQ teaser spot (2018)", "/work/yt/MqcZQSByw3A.webp", true),
  yt("4uuhtmwUCNc", "LG \u00b7 V40 ThinQ", "the LG V40 ThinQ spot (2018)", "/work/yt/4uuhtmwUCNc.webp", true),
ig("BroFr-NHRC8", "BMW IG · M850i", "BMW's 2018 Instagram post: M850i"),
  ig("BfLDarkAkRI", "BMW IG · X4", "BMW's 2018 Instagram post: X4"),
  ig("BfJI29EFydz", "BMW IG · 8 Series Concept", "BMW's 2018 Instagram post: 8 Series Concept"),
  ig("BruVmhTD9sM", "BMW IG · 3 Series", "BMW's 2018 Instagram post: 3 Series"),
  ig("BdqaSkSAhPG", "BMW IG · X3", "BMW's 2018 Instagram post: X3"),
  ig("Brvn_7lDkA6", "BMW IG · 8 Series Convertible", "BMW's 2018 Instagram post: 8 Series Convertible"),
  ig("Bdp3jf4g9HB", "BMW IG · M5", "BMW's 2018 Instagram post: M5"),
  ig("Brp8phnjA4K", "BMW IG · X7", "BMW's 2018 Instagram post: X7"),
  ig("BdnTVY3A8xz", "BMW IG · X2", "BMW's 2018 Instagram post: X2"),
  ig("BrvTWu4g08P", "BMW IG · i8 Roadster", "BMW's 2018 Instagram post: i8 Roadster"),
  yt("qMtiG3fU6eQ", "Hint \u00b7 #whyhint", "the Hint #whyhint spot (2018)", "/work/yt/qMtiG3fU6eQ.webp", true),
  yt("46DduULSzd0", "Hint \u00b7 #whyhint", "the Hint #whyhint spot (2018)", "/work/yt/46DduULSzd0.webp", true),
  yt("fQN-bQMcurs", "Hint \u00b7 #whyhint", "the Hint #whyhint spot (2018)", "/work/yt/fQN-bQMcurs.webp", true),
];

function AdVideo({ file }: { file: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.src) v.src = `${B}/ads/${file}.mp4`;
        v.play().catch(() => {});
      } else v.pause();
    }, { rootMargin: "200px 0px" });
    io.observe(v);
    return () => io.disconnect();
  }, [file]);
  return <video ref={ref} poster={`${B}/ads/${file}.webp`} muted loop playsInline preload="none" />;
}

function TileView({ t, onPlay }: { t: Tile; onPlay: (id: string, wide: boolean, title: string, ig?: boolean) => void }) {
  return (
    <figure className={`wall-tile${t.kind === "yt" || t.kind === "ig" ? " wall-tile--yt" : ""}`}>
      {t.kind === "ad" && <AdVideo file={t.file} />}
      {t.kind === "still" && <img src={`${B}/${t.file}.webp`} alt="" loading="lazy" />}
      {t.kind === "yt" && (
        <button type="button" aria-label={`Play ${t.title}`} onClick={() => onPlay(t.id, !!t.wide, t.title)}>
          <img src={t.poster.startsWith("http") ? t.poster : `https://ballast.la${t.poster}`} alt="" loading="lazy" />
          <span className="wall-play" />
        </button>
      )}
      {t.kind === "ig" && (
        <button type="button" aria-label={`Open ${t.title}`} onClick={() => onPlay(t.id, false, t.title, true)}>
          <img src={`https://ballast.la/work/ig/${t.id}.webp`} alt="" loading="lazy" />
        </button>
      )}
      <figcaption>{t.label}</figcaption>
    </figure>
  );
}

export default function WorkPage() {
  const [playing, setPlaying] = useState<{ id: string; wide: boolean; title: string; ig?: boolean } | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (playing) dlg.current?.showModal();
    else dlg.current?.close();
  }, [playing]);
  const play = (id: string, wide: boolean, title: string, ig = false) => setPlaying({ id, wide, title, ig });

  return (
    <div className="artwork-page wall-page">
      <nav className="artwork-nav wall-nav">
        <Link href="/" className="artwork-back">&larr; Back</Link>
        <span className="artwork-title">Work</span>
      </nav>
      <p className="wall-intro">
        Ads, trailers and promos I&apos;ve worked on: SKO Compounds, NEAR, SailGP, Dtravel, Netflix, Disney, Peacock, Universal, STARZPLAY, Starbucks, Toyota, LG and BMW.
        More at <a href="https://ballast.la" target="_blank" rel="noopener noreferrer">ballast.la</a>.
      </p>

      <div className="wall">
        {wall.map((t, i) => <TileView key={i} t={t} onPlay={play} />)}
      </div>
      <p className="wall-cap">Studio and brand spots are the brands&apos; own creative; I worked on the media, distribution or social around them. Tap to play.</p>

      <dialog
        ref={dlg}
        className="wall-lb"
        onClose={() => setPlaying(null)}
        onClick={(e) => { if (e.target === dlg.current) setPlaying(null); }}
      >
        {playing && (
          <div className={`wall-lb-f${playing.wide ? " wall-lb-f--wide" : ""}${playing.ig ? " wall-lb-f--ig" : ""}`}>
            <iframe
              src={playing.ig ? `https://www.instagram.com/p/${playing.id}/embed/` : `https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1&playsinline=1&rel=0`}
              title={playing.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        <button type="button" className="wall-lb-x" aria-label="Close" onClick={() => setPlaying(null)}>&times;</button>
      </dialog>
    </div>
  );
}
