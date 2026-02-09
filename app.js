// app.js (teleport-only)

const state = {
  games: [],
};

const els = {
  btnRoll: () => document.getElementById("btn-roll"),
  status: () => document.getElementById("status"),
  year: () => document.getElementById("year"),
};

function setStatus(msg, show = true) {
  const el = els.status();
  if (!el) return;
  el.textContent = msg || "";
  el.classList.toggle("hidden", !show || !msg);
}

function normalizeGames(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((g) => g && typeof g === "object")
    .map((g) => ({
      title: String(g.title ?? "").trim(),
      url: String(g.url ?? "").trim(),
      weight: Number.isFinite(Number(g.weight)) ? Number(g.weight) : 1,
    }))
    .filter((g) => g.title && g.url);
}

function pickWeighted(list) {
  const items = list.map((g) => ({ g, w: Math.max(0.05, Number(g.weight ?? 1)) }));
  const total = items.reduce((s, x) => s + x.w, 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= it.w;
    if (r <= 0) return it.g;
  }
  return items[items.length - 1]?.g ?? null;
}

async function init() {
  // year
  const yearEl = els.year();
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // file:// guard
  if (location.protocol === "file:") {
    setStatus("Run via a local server (ex: python3 -m http.server 8000).");
    return;
  }

  // load games
  try {
    const res = await fetch("./games.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    state.games = normalizeGames(raw);
  } catch {
    setStatus("Failed to load games.json. Try opening /games.json to confirm.");
    return;
  }

  if (!state.games.length) {
    setStatus('games.json loaded, but no valid games found. Need { "title", "url" }.');
    return;
  }

  // click handler: open in NEW TAB, keep this page
  const rollBtn = els.btnRoll();
  if (rollBtn) {
    rollBtn.addEventListener("click", () => {
      setStatus(""); // clear

      const game = pickWeighted(state.games);
      if (!game) {
        setStatus("Couldn’t pick a game. Check games.json.");
        return;
      }

      // Must be called inside click to avoid popup blocking
      const win = window.open(game.url, "_blank", "noopener,noreferrer");

      if (!win) {
        // Popup blocked
        setStatus("Popup blocked — allow popups for localhost to open the game.");
      }
    });
  }
}

init();
