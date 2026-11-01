# Portfolio API

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-API-F38020.svg?logo=cloudflareworkers&logoColor=white)](https://workers.cloudflare.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-729B1B.svg?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Wrangler](https://img.shields.io/badge/Wrangler-CLI-F38020.svg?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/workers/wrangler/)

Cloudflare Workers serverless JSON API serving dynamic content to the Astro portfolio frontend.

- **Frontend Repository**: [astro-portfolio](https://github.com/ChhatreshKhatri/astro-portfolio)
- **Frontend Service**: `src/services/api.ts`
- **Environment Variable**: `PUBLIC_API_URL`

---

## ⚡ Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET`, `HEAD` | API root health check and status payload |
| `/home` | `GET`, `HEAD` | Intro, typewriter roles, statistics, selected work, enterprise credibility, and capabilities |
| `/about` | `GET`, `HEAD` | Biography, work experience, decoupled honors & recognition, education credentials, and tech stack |
| `/projects` | `GET`, `HEAD` | Comprehensive projects catalog, architectural highlights, badges, and demo/repo links |

All endpoints support `HEAD` requests (RFC-compliant empty body with edge caching headers) and `OPTIONS` preflight requests for CORS.

---

## 🛠️ Tech Stack

- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/) (Edge Serverless)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Dev CLI**: [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- **Testing**: [Vitest](https://vitest.dev/) (Cloudflare Workers pool)

---

## 📁 Project Structure

```text
src/
  index.ts         # Worker fetch handler, routing, CORS & cache headers
  data.json        # Default root payload
  home.json        # Homepage dynamic data
  about.json       # About page data (Experience, Awards, Education, Skills)
  projects.json    # Showcase projects catalog
test/
  index.spec.ts    # Comprehensive Vitest unit & integration test suite
wrangler.jsonc     # Cloudflare Worker configuration & bindings
```

---

## 🚀 Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Run the Worker locally

```bash
npm run dev
```

Or using Wrangler directly:

```bash
npx wrangler dev
```

### 3. Run test suite

```bash
npm test
```

Executes 7 unit and integration tests verifying all routes, 404 handling, 405 method guards, CORS preflight headers, and RFC-compliant HEAD responses.

---

## 🌐 CORS Configuration

The Worker inspects the incoming `Origin` against `ALLOWED_ORIGINS` (comma-separated):

```env
ALLOWED_ORIGINS=https://www.chhatreshkhatri.com,http://localhost:4321
```

For local testing with Wrangler, configure this in your `.dev.vars` file.

---

## 🚢 Deployment

Deploy to Cloudflare edge network:

```bash
npm run deploy
```

Regenerate Cloudflare Worker type bindings:

```bash
npm run cf-typegen
```

---

## 🔗 Frontend Integration

In the [astro-portfolio](https://github.com/ChhatreshKhatri/astro-portfolio) frontend:

1. Configure `PUBLIC_API_URL` in `.env`:
   ```env
   PUBLIC_API_URL=http://127.0.0.1:8787
   ```
2. The frontend fetches data server-side via `src/services/api.ts` with zero client-side layout shifts and automatic edge caching.

---

## 📚 Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Workers Limits & Quotas](https://developers.cloudflare.com/workers/platform/limits/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
