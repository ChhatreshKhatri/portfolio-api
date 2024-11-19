export default {
	async fetch(req, env, ctx): Promise<Response> {
		try {
			const data = await import('./data.json').then((m) => m.default);
			const home= await import('./home.json').then((m) => m.default);
			const about = await import('./about.json').then((m) => m.default);
			const projects = await import('./projects.json').then((m) => m.default);

			const url = new URL(req.url);
			console.log('URL path=', url.pathname);

			let resData;
			if (url.pathname === '/') {
				resData = home ?? { error: 'Home not found' };
			} else if (url.pathname === '/about') {
				resData = about ?? { error: 'About not found' };
			} else if (url.pathname === '/projects') {
				resData = projects ?? { error: 'Projects not found' };
			} else {
				resData = data.default ?? { error: 'Default content not found' };
			}
			// List of allowed origins
			const allowedOrigins = [
				'https://chhatreshkhatri.com',
				'https://www.chhatreshkhatri.com',
				'https://api.chhatreshkhatri.com',
				'preview.portfolio-nextjs-6yf.pages.dev'
			];

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
