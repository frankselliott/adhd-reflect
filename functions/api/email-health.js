// ADHD Reflect — email/config health check.
// GET only, ADMIN_KEY auth: /api/email-health?key=ADMIN_KEY
// Reports which env vars and bindings are PRESENT on this deployment, never
// their values, so a production binding can be confirmed in one request.
export async function onRequestGet({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
  }

  // Presence only. Never echo a value.
  const present = (v) => !!v;

  const body = {
    env: {
      RESEND_API_KEY: present(env.RESEND_API_KEY),
      UNSUB_SECRET: present(env.UNSUB_SECRET),
      RESEND_SEGMENT_ID: present(env.RESEND_SEGMENT_ID),
      ANTHROPIC_API_KEY: present(env.ANTHROPIC_API_KEY),
      ADMIN_KEY: present(env.ADMIN_KEY),
    },
    bindings: {
      SEARCH_LOGS: present(env.SEARCH_LOGS),
      GROW_DATA: present(env.GROW_DATA),
    },
    // Cloudflare Pages exposes these on the deployment; null if not available.
    commit: env.CF_PAGES_COMMIT_SHA || null,
    branch: env.CF_PAGES_BRANCH || null,
  };

  return new Response(JSON.stringify(body, null, 2), { status: 200, headers });
}
