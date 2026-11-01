import dataJson from './data.json';
import homeJson from './home.json';
import aboutJson from './about.json';
import projectsJson from './projects.json';

export default {
	async fetch(req, env, ctx): Promise<Response> {
		try {
			const url = new URL(req.url);

			// Parse and normalize allowed origins
			const allowedOrigins = env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean) ?? [];
			const requestOrigin = req.headers.get('Origin') ?? '';
			const isAllowedOrigin = allowedOrigins.includes('*') || (requestOrigin && allowedOrigins.includes(requestOrigin));

			const baseHeaders: Record<string, string> = {
				'Content-Type': 'application/json',
			};

			if (isAllowedOrigin) {
				baseHeaders['Access-Control-Allow-Origin'] = allowedOrigins.includes('*') ? '*' : requestOrigin;
				baseHeaders['Vary'] = 'Origin';
			}

			// Handle CORS preflight requests
			if (req.method === 'OPTIONS') {
				const preflightHeaders: Record<string, string> = {
					...baseHeaders,
					'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Accept',
					'Access-Control-Max-Age': '86400',
				};
				return new Response(null, { status: 204, headers: preflightHeaders });
			}

			// Only allow GET and HEAD requests
			if (req.method !== 'GET' && req.method !== 'HEAD') {
				return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
					status: 405,
					headers: { ...baseHeaders, 'Cache-Control': 'no-cache', Allow: 'GET, HEAD, OPTIONS' },
				});
			}

			// Helper to create RFC-compliant GET / HEAD responses with caching
			const createResponse = (data: unknown, status = 200) => {
				const headers = { ...baseHeaders };
				if (status === 200) {
					headers['Cache-Control'] = 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400';
				} else {
					headers['Cache-Control'] = 'no-cache';
				}

				return new Response(req.method === 'HEAD' ? null : JSON.stringify(data), {
					status,
					headers,
				});
			};

			// Route matching
			if (url.pathname === '/') {
				return createResponse(dataJson.default ?? { message: 'Portfolio API' });
			}

			if (url.pathname === '/home') {
				return createResponse(homeJson ?? { error: 'Home not found' });
			}

			if (url.pathname === '/about') {
				return createResponse(aboutJson ?? { error: 'About not found' });
			}

			if (url.pathname === '/projects') {
				return createResponse(projectsJson ?? { error: 'Projects not found' });
			}

			// Unknown route -> proper 404
			return createResponse({ error: 'Not Found' }, 404);
		} catch (error) {
			console.error('Error processing request:', error);
			return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	},
} satisfies ExportedHandler<Env>;
