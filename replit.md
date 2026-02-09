# URL Shortener Microservice

## Overview
A simple URL shortener microservice built with Node.js and Express. Users can submit a URL via a form or API, receive a shortened numeric ID, and use that ID to redirect to the original URL.

## Project Architecture
- **Runtime**: Node.js 20
- **Framework**: Express 4
- **Entry Point**: `server.js`
- **Frontend**: Static HTML served from `views/index.html` with CSS from `public/style.css`
- **Storage**: In-memory Maps (no database)

## Key Files
- `server.js` - Main server with API routes and static file serving
- `views/index.html` - Homepage with URL submission form
- `public/style.css` - Styles

## API Endpoints
- `POST /api/shorturl` - Submit a URL to shorten (body: `{ url: "https://..." }`)
- `GET /api/shorturl/:id` - Redirect to the original URL by short ID

## Configuration
- Server binds to `0.0.0.0:5000`
- Port configurable via `PORT` environment variable
