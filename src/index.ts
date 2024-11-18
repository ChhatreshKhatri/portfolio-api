export default {
	async fetch(req, env, ctx): Promise<Response> {
	  const data = await import('./data.json').then((m) => m.default);
  
	  // Allowed domain
	  const allowedDomain = "https://yourdomain.com";
  
	  // Get the Origin or Referer header
	  const origin = req.headers.get("Origin") || req.headers.get("Referer");
  
	  // Check if the request is from the allowed domain
	  if (origin && !origin.startsWith(allowedDomain)) {
		return new Response("Forbidden", { status: 403 });
	  }
  
	  // Parse the URL to get the path
	  const url = new URL(req.url);
	  console.log("URL path=", url.pathname);
  
	  // Route based on the path
	  if (url.pathname === '/projects') {
		return Response.json(data.projects ?? { error: 'Projects not found' });
	  }
  
	  if (url.pathname === '/about') {
		return Response.json(data.about ?? { error: 'About not found' });
	  }
  
	  // Default response
	  const res = data.home ?? data.default;
	  return Response.json(res);
	},
  } satisfies ExportedHandler<Env>;
  