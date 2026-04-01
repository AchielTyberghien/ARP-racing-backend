# ARP Backend

Express API for the ARP Racing portfolio website.

## What this project is

This service provides:

- Carousel image metadata for the homepage.
- Library event listings and per-event image metadata.
- Contact form forwarding to an external webhook (n8n).

It is designed to run behind Nginx and be consumed by the Angular frontend.

## How it works

### Request flow

1. Frontend calls `/api/*`.
2. Nginx proxies to this backend (`backend:3000`).
3. Express routes fetch file data from ImageKit.
4. API returns normalized JSON for the frontend UI.

### Main endpoints

- `GET /api/carousel`
  - Reads `/Arp Racing/Carousel/` from ImageKit.
  - Returns `{ success, pictures: [{ name, description }] }`.

- `GET /api/library`
  - Reads `/Arp Racing/library/` from ImageKit.
  - Sorts by `customMetadata.DateCreated`.
  - Builds one thumbnail image per top-level event folder.

- `GET /api/library/:id`
  - Reads `/Arp Racing/library/:id/` from ImageKit.
  - Returns event image list with `{ name, description }`.

- `POST /api/contact`
  - Validates `name`, `email`, and `message`.
  - Forwards payload to `CONTACT_WEBHOOK_URL`.

## Security and middleware

- `helmet` for security headers (CSP enabled).
- `cors` restricted to `FRONTEND_URL`.
- Global rate limiting plus stricter `/api` limiter.
- `trust proxy` enabled for reverse proxy deployment.

## Environment variables

Required variables:

- `PORT` (optional, defaults to `3000`)
- `IMAGEKIT_PRIVATE_KEY`
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_BASE` (ImageKit files endpoint)
- `FRONTEND_URL`
- `CORS_ORIGIN`
- `CONTACT_WEBHOOK_URL`

## Local development

```bash
npm install
node index.js
```

Server runs on `http://localhost:3000` by default.

## Docker

Build and run directly:

```bash
docker build -t arp-backend .
docker run --env-file .env -p 3000:3000 arp-backend
```

Or run via the root `docker-compose.yml`.
