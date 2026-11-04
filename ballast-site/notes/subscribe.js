document.querySelectorAll("form[data-sub]").forEach((f) => {
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = f.querySelector(".msg"), btn = f.querySelector("button");
    btn.disabled = true;
    try {
      const r = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: f.email.value, company: f.company.value, source: f.dataset.sub }) });
      const d = await r.json().catch(() => ({}));
      msg.textContent = r.ok ? "You're in. First note lands this week." : (d.error || "Something went wrong. Try again.");
      if (r.ok) f.reset();
    } catch { msg.textContent = "Something went wrong. Try again."; }
    btn.disabled = false;
  });
});
