# Portfolio API

Cloudflare Workers API for portfolio content used by the Astro frontend:

- Frontend repo: https://github.com/ChhatreshKhatri/astro-portfolio
- Frontend service file: `src/services/api.ts`
- Frontend env var: `PUBLIC_API_URL`

This API serves JSON data for:

- `/` (default welcome payload)
- `/home`
- `/about`
- `/projects`

## Tech Stack

- Cloudflare Workers
- TypeScript
- Wrangler
- Vitest (Workers pool)

## Project Structure

```text
src/
  index.ts         # Worker fetch handler + routing + CORS
  data.json        # default payload
  home.json        # home page content
  about.json       # about page content
  projects.json    # projects page content
test/
  index.spec.ts    # test scaffold
wrangler.jsonc     # Worker config
```

## Local Development

### 1) Install dependencies

```bash
npm install
```

### 2) Run the Worker locally

```bash
npm run dev
```

Wrangler command equivalent:

```bash
npx wrangler dev
```

### 3) Run tests

```bash
npm run test
```

## CORS Configuration

The Worker reads `ALLOWED_ORIGINS` from environment variables and only sets `Access-Control-Allow-Origin` when the request `Origin` matches one of the allowed entries.

Example (comma-separated):

```env
ALLOWED_ORIGINS=https://www.chhatreshkhatri.com,http://localhost:4321
```

For local dev, you can define this in a `.dev.vars` file used by Wrangler.

## Deploy

```bash
npm run deploy
```

Wrangler command equivalent:

```bash
npx wrangler deploy
```

If you change bindings in `wrangler.jsonc`, regenerate types:

```bash
npm run cf-typegen
```

## Frontend Integration (Astro)

The frontend repository is checked out locally at:

`d:\Code\Projects\astro-portfolio`

In that repo:

- API calls are centralized in `src/services/api.ts`
- Endpoints consumed are `/home`, `/about`, and `/projects`
- Set `PUBLIC_API_URL` in frontend `.env` to this API base URL

Example frontend `.env`:

```env
PUBLIC_API_URL=http://127.0.0.1:8787
```

## API Quick Check

```
http://127.0.0.1:8787/home
http://127.0.0.1:8787/about
http://127.0.0.1:8787/projects
```

## Notes

- `wrangler.jsonc` currently has `workers_dev: false`; production traffic should use configured routes/custom domain.
- Current test file appears scaffolded from a default template and may not reflect current API responses.
- Cloudflare Workers docs: https://developers.cloudflare.com/workers/
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/