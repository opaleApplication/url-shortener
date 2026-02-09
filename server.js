const express = require("express");
const cors = require("cors");
const path = require("path");
const dns = require("dns");

const app = express();

// Middlewares (IMPORTANT pour FCC)
app.use(cors());
app.use(express.urlencoded({ extended: false })); // body parsing (form)
app.use(express.json()); // body parsing (json)

app.use("/public", express.static(path.join(__dirname, "public")));

// Page d'accueil (optionnelle mais utile)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Stockage en mémoire (suffisant pour FCC)
const idToUrl = new Map(); // short_id -> original_url
const urlToId = new Map(); // original_url -> short_id (dédup)
let nextId = 1;

// Helper validation + dns.lookup
function validateAndNormalizeUrl(input) {
  if (typeof input !== "string") return { error: "invalid url" };
  const trimmed = input.trim();
  if (!trimmed) return { error: "invalid url" };

  let u;
  try {
    u = new URL(trimmed);
  } catch {
    return { error: "invalid url" };
  }

  // Format attendu par FCC: http://... ou https://...
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { error: "invalid url" };
  }

  // Conserver l'URL d'origine pour matcher les tests FCC
  return { hostname: u.hostname, normalized: trimmed };
}

// POST: /api/shorturl
app.post("/api/shorturl", (req, res) => {
  const inputUrl = req.body.url;

  const check = validateAndNormalizeUrl(inputUrl);
  if (check.error) return res.json({ error: "invalid url" });

  // Vérifier que le domaine existe
  dns.lookup(check.hostname, (err) => {
    if (err) return res.json({ error: "invalid url" });

    // Dédup: même URL -> même id (pas obligatoire, mais stable)
    if (urlToId.has(check.normalized)) {
      const existingId = urlToId.get(check.normalized);
      return res.json({
        original_url: check.normalized,
        short_url: existingId,
      });
    }

    const id = nextId++;
    idToUrl.set(id, check.normalized);
    urlToId.set(check.normalized, id);

    return res.json({ original_url: check.normalized, short_url: id });
  });
});

// GET: /api/shorturl/:short_url -> redirect
app.get("/api/shorturl/:short_url", (req, res) => {
  const id = Number(req.params.short_url);

  if (!Number.isInteger(id)) {
    return res.json({ error: "invalid url" });
  }

  const original = idToUrl.get(id);
  if (!original) {
    // FCC ne teste pas forcément ce cas, mais c'est propre
    return res.json({ error: "No short URL found for given input" });
  }

  return res.redirect(original);
});

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
