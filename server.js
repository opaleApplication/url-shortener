const express = require("express");
const cors = require("cors");
const path = require("path");
const dns = require("dns");

const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Servir les fichiers statiques
app.use("/public", express.static(path.join(__dirname, "public")));

// Page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Stockage des URLs
const idToUrl = new Map(); // short_id -> original_url
const urlToId = new Map(); // original_url -> short_id (pour éviter les doublons)
let nextId = 1;

// Fonction pour valider et normaliser les URLs
function validateAndNormalizeUrl(input) {
  if (typeof input !== "string") return { error: "invalid url" };
  const trimmed = input.trim();
  if (!trimmed) return { error: "invalid url" };

  let u;
  try {
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      u = new URL(`https://${trimmed}`);
    } else {
      u = new URL(trimmed);
    }
  } catch {
    return { error: "invalid url" };
  }

  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { error: "invalid url" };
  }

  return { hostname: u.hostname, normalized: u.href };
}

// POST: Créer une URL raccourcie
app.post("/api/shorturl", (req, res) => {
  const inputUrl = req.body.url;

  const check = validateAndNormalizeUrl(inputUrl);
  if (check.error) return res.json({ error: "invalid url" });

  dns.lookup(check.hostname, (err) => {
    if (err) return res.json({ error: "invalid url" });

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

    console.log(`URL stockée pour l'ID ${id}: ${check.normalized}`);
    console.log(`Contenu de idToUrl:`, [...idToUrl.entries()]);

    return res.json({ original_url: check.normalized, short_url: id });
  });
});

// GET: Rediriger vers l'URL originale
app.get("/api/shorturl/:short_url", (req, res) => {
  const id = Number(req.params.short_url);
  console.log(`Redirection demandée pour l'ID : ${id}`);

  if (!Number.isInteger(id)) {
    console.log(`ID invalide : ${id}`);
    return res.json({ error: "invalid url" });
  }

  const original = idToUrl.get(id);
  if (!original) {
    console.log(`Aucune URL trouvée pour l'ID : ${id}`);
    return res.json({ error: "No short URL found for given input" });
  }

  console.log(`Redirection vers : ${original}`);
  return res.redirect(301, original);
});

// Démarrer le serveur
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
