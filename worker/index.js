export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // Redirect www.plateful365.com → plateful365.com
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4)
      return Response.redirect(url.toString(), 301)
    }

    const response = await env.ASSETS.fetch(request)

    // Prevent Cloudflare's edge from caching HTML / service worker / manifest.
    // Hashed asset files (/assets/index-<hash>.js|css) change on every build so
    // they're safe to cache long-term; the root HTML must not be cached or a
    // fresh deploy won't reach users until the zone cache is purged.
    const contentType = response.headers.get('content-type') || ''
    const path = url.pathname
    const isNonCacheable =
      contentType.startsWith('text/html') ||
      path === '/' ||
      path === '/index.html' ||
      path === '/sw.js' ||
      path === '/manifest.webmanifest'

    if (isNonCacheable) {
      const headers = new Headers(response.headers)
      headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
      headers.set('CDN-Cache-Control', 'no-store')
      headers.set('Cloudflare-CDN-Cache-Control', 'no-store')
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    }

    return response
  },
}
