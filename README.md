# URL Shortener Microservice

## Francais

### Description
Microservice de raccourcissement d'URL cree pour le projet freeCodeCamp "URL Shortener Microservice".

### Fonctionnalites
- Validation d'URL (http/https) avec verification DNS.
- Creation d'un identifiant court.
- Redirection vers l'URL originale.
- Stockage en memoire (reinitialise a chaque redemarrage).

### Stack
- Node.js
- Express
- DNS (module core)
- CORS

### Demarrage rapide
```bash
npm install
npm start
```

Variable d'environnement optionnelle:
- `PORT` (par defaut 3000)

Mode dev:
```bash
npm run dev
```

### API
POST `/api/shorturl`
- Body `url` (form-data ou JSON)
- Reponse:
```json
{ "original_url": "https://example.com", "short_url": 1 }
```

GET `/api/shorturl/:short_url`
- Redirige (302) vers `original_url`

### Exemples
```bash
curl -s -X POST -d "url=https://example.com" http://localhost:3000/api/shorturl
curl -I http://localhost:3000/api/shorturl/1
```

```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' \
  http://localhost:3000/api/shorturl
```

### Liens
- Demo: https://url-shortener-60kx.onrender.com
- Code source: https://github.com/opaleApplication/url-shortener

---

## English

### Description
URL shortener microservice built for the freeCodeCamp "URL Shortener Microservice" project.

### Features
- URL validation (http/https) with DNS lookup.
- Short id generation.
- Redirect to the original URL.
- In-memory storage (resets on restart).

### Stack
- Node.js
- Express
- DNS (core module)
- CORS

### Quick start
```bash
npm install
npm start
```

Optional environment variable:
- `PORT` (default 3000)

Dev mode:
```bash
npm run dev
```

### API
POST `/api/shorturl`
- Body `url` (form-data or JSON)
- Response:
```json
{ "original_url": "https://example.com", "short_url": 1 }
```

GET `/api/shorturl/:short_url`
- Redirects (302) to `original_url`

### Examples
```bash
curl -s -X POST -d "url=https://example.com" http://localhost:3000/api/shorturl
curl -I http://localhost:3000/api/shorturl/1
```

```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' \
  http://localhost:3000/api/shorturl
```

### Links
- Demo: https://url-shortener-60kx.onrender.com
- Source code: https://github.com/opaleApplication/url-shortener
