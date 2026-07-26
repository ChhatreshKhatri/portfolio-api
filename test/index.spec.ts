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
		const data = await response.json() as { intro: string };
		expect(data.intro).toBe("Hi! I'm Chhatresh Khatri");
	});

	it('responds with about data (integration style)', async () => {
		const response = await SELF.fetch('https://example.com/about');
		const data = await response.json() as { content: { title: string } };
		expect(data.content.title).toBe("Professional Summary");
	});
});
