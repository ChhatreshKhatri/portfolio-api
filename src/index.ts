import dataJson from './data.json';
import homeJson from './home.json';
import aboutJson from './about.json';
import projectsJson from './projects.json';

export default {
	async fetch(req, env, ctx): Promise<Response> {
		try {
			const url = new URL(req.url);
			// console.log('URL path=', url.pathname);

			let resData;
			if (url.pathname === '/') {
				resData = dataJson.default ?? { error: 'Default content not found' };
			} else if (url.pathname === '/home') {
				resData = homeJson ?? { error: 'Home not found' };
			} else if (url.pathname === '/about') {
				resData = aboutJson ?? { error: 'About not found' };
			} else if (url.pathname === '/projects') {
				resData = projectsJson ?? { error: 'Projects not found' };
			} else {
				resData = dataJson.default ?? { error: 'Default content not found' };
			}
			// Parse allowed origins from environment variable
			const allowedOrigins = env.ALLOWED_ORIGINS?.split(',') ?? [];
			// console.log('Allowed origins:', allowedOrigins);

			// Validate the origin against the allowed origins
			const requestOrigin = req.headers.get('Origin');
			const corsHeader = allowedOrigins.includes(requestOrigin ?? '') ? requestOrigin : '';

			// Headers
			const headers: Record<string, string> = {
				'Content-Type': 'application/json',
			};

			if (corsHeader) {
				headers['Access-Control-Allow-Origin'] = corsHeader;
			}

			return new Response(JSON.stringify(resData), { headers });
		} catch (error) {
			console.error('Error processing request:', error);
			return new Response('Internal Server Error', { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
