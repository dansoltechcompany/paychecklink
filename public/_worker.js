/**
 * Cloudflare Pages worker (copied from public/ into out/).
 * Host-based redirects in _redirects are ignored; this folds www → apex.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.paychecklink.com") {
      url.hostname = "paychecklink.com";
      url.protocol = "https:";
      return Response.redirect(url.href, 301);
    }
    return env.ASSETS.fetch(request);
  },
};
