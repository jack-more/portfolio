// HOTG player: every piece plays in place, on its own host's embed player. Nothing is copied or hosted here.
// The picture you clicked is already on screen, so it grows straight into the player and the embed loads behind it.
(() => {
  const css = `
.hp{position:fixed;inset:0;z-index:50;display:none}
.hp.on{display:block}
.hp-bg{position:absolute;inset:0;background:rgba(14,12,9,.86);opacity:0;transition:opacity .22s}
.hp.open .hp-bg{opacity:1}
.hp-box{position:absolute;transform-origin:0 0;background:#000 center/cover no-repeat;border-radius:3px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.5)}
.hp-box iframe{position:absolute;inset:0;width:100%;height:100%;border:0;opacity:0;transition:opacity .3s}
.hp-box iframe.in{opacity:1}
.hp-cap{position:absolute;color:#F3ECDC;font-family:"Archivo","Helvetica Neue",Arial,sans-serif;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;opacity:0;transition:opacity .2s .12s}
.hp.open .hp-cap{opacity:1}
.hp-cap b{display:block;font-size:16px;font-weight:600;line-height:1.3}
.hp-cap span{display:block;font-family:"Courier Prime",ui-monospace,Menlo,monospace;font-size:13px;color:#E9B528;margin-top:3px}
.hp-cap nav{display:flex;gap:14px;align-items:center;flex:none;font-family:"Courier Prime",ui-monospace,Menlo,monospace;font-size:13.5px}
.hp-cap a{color:#F3ECDC}
.hp-cap button{background:none;border:1px solid #6E6555;color:#F3ECDC;border-radius:3px;font:inherit;padding:4px 10px;cursor:pointer}
@media (prefers-reduced-motion:reduce){.hp-box,.hp-bg,.hp-cap{transition:none!important}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const HOST = [
    [/youtube\.com\/(?:watch\?v=|shorts\/)([\w-]{11})|youtu\.be\/([\w-]{11})/, m => `https://www.youtube-nocookie.com/embed/${m[1] || m[2]}?autoplay=1&rel=0&start=`, "YouTube", "wide"],
    [/dailymotion\.com\/video\/(\w+)/, m => `https://www.dailymotion.com/embed/video/${m[1]}?autoplay=1&start=`, "Dailymotion", "wide"],
    [/bilibili\.com\/video\/(BV\w+)(?:\?p=(\d+))?/, m => `https://player.bilibili.com/player.html?bvid=${m[1]}&p=${m[2] || 1}&autoplay=1&high_quality=1&t=`, "Bilibili", "wide"],
    [/archive\.org\/details\/([^/?#]+)\/start\/(\d+)\/end\/(\d+)/, m => [`https://archive.org/embed/${m[1]}?end=${m[3]}&start=`, +m[2]], "Internet Archive", "wide"],
    [/archive\.org\/details\/([^/?#]+)/, m => `https://archive.org/embed/${m[1]}?start=`, "Internet Archive", "wide"],
    [/(?:x|twitter)\.com\/\w+\/status\/(\d+)/, m => `https://platform.twitter.com/embed/Tweet.html?dnt=true&theme=dark&id=${m[1]}#`, "X", "post"],
    [/tiktok\.com\/@[\w.]+\/video\/(\d+)/, m => `https://www.tiktok.com/embed/v2/${m[1]}#`, "TikTok", "tall"],
    [/instagram\.com\/(?:p|reel)\/([\w-]+)/, m => `https://www.instagram.com/p/${m[1]}/embed#`, "Instagram", "tall"],
  ];
  // The player src for a link at t seconds, or null when the host has no embed player (then the link opens as usual).
  function embed(url, t = 0){
    for (const [re, make, name, shape] of HOST){
      const m = String(url).match(re); if (!m) continue;
      let src = make(m), base = 0; if (Array.isArray(src)) [src, base] = src;
      return {src: src + Math.max(0, Math.floor(base + t)), name, shape};
    }
    return null;
  }

  let root, box, cap, from = null, back = null;
  function build(){
    root = document.createElement("div"); root.className = "hp"; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true");
    root.innerHTML = `<div class="hp-bg"></div><div class="hp-box"></div><div class="hp-cap"><div><b></b><span></span></div><nav><a target="_blank" rel="noopener"></a><button type="button" aria-label="Close">Close</button></nav></div>`;
    document.body.appendChild(root); box = root.querySelector(".hp-box"); cap = root.querySelector(".hp-cap");
    root.querySelector(".hp-bg").addEventListener("click", close); cap.querySelector("button").addEventListener("click", close);
    addEventListener("keydown", e => { if (e.key === "Escape" && root.classList.contains("on")) close(); });
  }
  function target(shape){
    const vw = innerWidth, vh = innerHeight, room = vh - 150;
    let w, h;
    if (shape === "wide"){ w = Math.min(vw - 32, 1080, room * 16 / 9); h = w * 9 / 16; }
    else if (shape === "tall"){ h = Math.min(room, 760); w = Math.min(vw - 32, h * 9 / 16 + 2); }
    else { w = Math.min(vw - 32, 560); h = Math.min(room, 680); }
    return {x: (vw - w) / 2, y: Math.max(16, (vh - h - 70) / 2), w, h};
  }
  const flip = (el, r, T) => `translate(${r.left - T.x}px,${r.top - T.y}px) scale(${r.width / T.w},${r.height / T.h})`;

  // open({url, t, title, meta, el, poster}): el is the picture that was clicked; poster(w, h) styles the box from it.
  function open({url, t = 0, title = "", meta = "", el = null, poster = null}){
    const e = embed(url, t); if (!e){ window.open(url, "_blank", "noopener"); return; }
    if (!root) build();
    const T = target(e.shape); from = el; back = document.activeElement;
    box.style.cssText = `left:${T.x}px;top:${T.y}px;width:${T.w}px;height:${T.h}px;transition:none;` + (poster ? poster(T.w, T.h) : "");
    Object.assign(cap.style, {left: T.x + "px", top: T.y + T.h + 12 + "px", width: T.w + "px"});
    cap.querySelector("b").textContent = title; cap.querySelector("span").textContent = meta;
    const a = cap.querySelector("a"); a.href = url; a.textContent = `Open on ${e.name} ↗`;
    box.innerHTML = "";
    const r = el && el.getBoundingClientRect();
    box.style.transform = r && r.width ? flip(el, r, T) : "scale(.96)";
    root.classList.add("on"); box.getBoundingClientRect();
    requestAnimationFrame(() => {
      root.classList.add("open");
      box.style.transition = "transform .3s cubic-bezier(.2,.8,.2,1)"; box.style.transform = "none";
      const f = document.createElement("iframe");
      f.src = e.src; f.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture"; f.allowFullscreen = true; f.title = title;
      f.addEventListener("load", () => setTimeout(() => f.classList.add("in"), 250));
      setTimeout(() => box.appendChild(f), 180);
    });
    cap.querySelector("button").focus({preventScroll: true});
  }
  function close(){
    if (!root || !root.classList.contains("on")) return;
    const f = box.querySelector("iframe"); if (f) f.remove();
    const r = from && from.getBoundingClientRect(), T = {x: parseFloat(box.style.left), y: parseFloat(box.style.top), w: parseFloat(box.style.width), h: parseFloat(box.style.height)};
    root.classList.remove("open");
    box.style.transform = r && r.width && r.bottom > 0 && r.top < innerHeight ? flip(from, r, T) : "scale(.96)";
    setTimeout(() => { root.classList.remove("on"); if (back && back.focus) back.focus({preventScroll: true}); }, 300);
  }
  window.HOTGPlayer = {open, close, embed};
})();
