// ADHD Reflect. Shared ADMIN_KEY check for the cron and admin endpoints.
//
// ADMIN_KEY is entered by hand into the Cloudflare Pages dashboard, and a
// pasted value very often carries a trailing newline or space that is
// impossible to see there. A strict === comparison then rejects a key that
// looks identical to the one the operator typed, which is indistinguishable
// from a wrong password and is a genuinely horrible thing to debug. Both sides
// are trimmed here so invisible whitespace cannot lock anyone out. Leading or
// trailing spaces are never meaningful in a key, so this only ever widens a
// match that was intended.

export function normalizeKey(v) {
  return String(v == null ? '' : v).trim();
}

// Is ADMIN_KEY configured on this deployment at all? A whitespace-only value
// counts as missing: it cannot be typed into a URL, so treating it as set
// would just produce unexplainable 401s.
export function adminKeyConfigured(env) {
  return normalizeKey(env && env.ADMIN_KEY).length > 0;
}

// True when the caller supplied a key matching ADMIN_KEY on this deployment.
// Compared in constant time over the normalised strings so the endpoint does
// not leak the key through response timing. Returns false when either side is
// empty, so this single call also covers the "not configured" case.
export function adminKeyMatches(env, supplied) {
  const expected = normalizeKey(env && env.ADMIN_KEY);
  const got = normalizeKey(supplied);
  if (!expected || !got) return false;
  if (expected.length !== got.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ got.charCodeAt(i);
  }
  return diff === 0;
}

// Non-sensitive diagnostics for a failed match. `suppliedLength` is what the
// caller already sent, so it reveals nothing; `lengthMatches` is a single bit
// that makes a stray-whitespace or wrong-value mismatch obvious without ever
// disclosing the key itself.
export function keyMismatchInfo(env, supplied) {
  const expected = normalizeKey(env && env.ADMIN_KEY);
  const got = normalizeKey(supplied);
  return { suppliedLength: got.length, lengthMatches: expected.length === got.length };
}
