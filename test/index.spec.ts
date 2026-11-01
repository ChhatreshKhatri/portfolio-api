import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Portfolio API worker', () => {
	it('responds with home data (unit style)', async () => {
		const request = new IncomingRequest('http://example.com/home');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
		const data = (await response.json()) as { intro: string };
		expect(data.intro).toBe("Hi! I'm Chhatresh Khatri");
	});

	it('responds with about data (integration style)', async () => {
		const response = await SELF.fetch('https://example.com/about');
		expect(response.status).toBe(200);
		const data = (await response.json()) as { content: { title: string } };
		expect(data.content.title).toBe('Professional Summary');
	});

	it('responds with projects data', async () => {
		const response = await SELF.fetch('https://example.com/projects');
		expect(response.status).toBe(200);
		const data = (await response.json()) as { projects: unknown[] };
		expect(Array.isArray(data.projects)).toBe(true);
		expect(data.projects.length).toBeGreaterThan(0);
	});

	it('returns 404 for unknown route', async () => {
		const response = await SELF.fetch('https://example.com/unknown-endpoint');
		expect(response.status).toBe(404);
		const data = (await response.json()) as { error: string };
		expect(data.error).toBe('Not Found');
	});

	it('returns 405 for non-GET/HEAD methods', async () => {
		const response = await SELF.fetch('https://example.com/home', {
			method: 'POST',
			body: JSON.stringify({ test: true }),
		});
		expect(response.status).toBe(405);
		const data = (await response.json()) as { error: string };
		expect(data.error).toBe('Method Not Allowed');
	});

	it('returns 204 for OPTIONS preflight request', async () => {
		const response = await SELF.fetch('https://example.com/home', {
			method: 'OPTIONS',
		});
		expect(response.status).toBe(204);
		expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
	});

	it('returns RFC-compliant HEAD response with empty body and edge cache headers', async () => {
		const response = await SELF.fetch('https://example.com/home', {
			method: 'HEAD',
		});
		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('application/json');
		expect(response.headers.get('Cache-Control')).toContain('s-maxage=3600');
		const bodyText = await response.text();
		expect(bodyText).toBe('');
	});
});
