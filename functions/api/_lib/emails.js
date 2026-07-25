// ADHD Reflect email bodies.
// Each builder returns a full HTML document via the shared layout. The endpoints
// and the /dev/email-preview route both import these, so the preview always
// renders exactly what ships. Copy is kept verbatim from the previous inline
// versions; only the frame changed.
import { layout, layoutPlain, p, button, note, label, esc, COLORS } from './emailLayout.js';
import { welcome as C_WELCOME, purchase as C_PURCHASE, recovery as C_RECOVERY } from './emailCopy.js';

const link = (href, text) => `<a href="${href}" style="color:${COLORS.blue};text-decoration:none;">${text}</a>`;

// Welcome (marketing). layout({ unsubUrl }). patternName is a fixed display
// name from our constant; layout() escapes the title regardless. Copy from
// emailCopy.js; link markup stays here and is passed into the copy pieces.
export function welcomeEmailHtml({ patternName, unsubUrl }) {
  const c = C_WELCOME.html;
  const body =
    p(c.p1) +
    p(c.p2) +
    p(c.p3({ link })) +
    note(c.note);
  return layout({
    title: c.title({ patternName }),
    preheader: C_WELCOME.preheader,
    body,
    unsubUrl,
  });
}

// Purchase (transactional). Copy from emailCopy.js.
export function purchaseEmailHtml({ accessUrl }) {
  const c = C_PURCHASE.html;
  const body =
    p(c.p1) +
    button(c.button, accessUrl) +
    label(c.accessLabel) +
    p(c.p2) +
    p(c.p3({ link })) +
    label(c.startLabel) +
    p(c.p4) +
    p(c.p5) +
    p(c.p6({ link })) +
    p(c.p7({ link })) +
    note(c.note);
  return layout({
    title: c.title,
    preheader: C_PURCHASE.preheader,
    body,
    transactional: true,
  });
}

// Recovery (access link). Copy from emailCopy.js.
export function recoveryEmailHtml({ accessUrl }) {
  const c = C_RECOVERY.html;
  const body =
    p(c.p1) +
    button(c.button, accessUrl) +
    p(c.p2) +
    p(c.p3);
  return layout({
    preheader: C_RECOVERY.preheader,
    body,
  });
}

// Drip (marketing). layoutPlain() ONLY: no headline, card or button. The text
// part remains the source of truth; this is a rendered view of it. Split on
// blank lines into paragraphs, join wrapped lines, linkify bare site URLs.
function escStructural(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function linkify(s) {
  return s.replace(/(https?:\/\/)?adhdreflect\.com[^\s<]*/g, (m) => {
    const noScheme = m.replace(/^https?:\/\//, '');
    return `<a href="https://${noScheme}" style="color:${COLORS.blue};">${noScheme}</a>`;
  });
}
export function dripEmailHtml({ text, subject, unsubUrl }) {
  const body = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => p(linkify(escStructural(b.replace(/\s*\n\s*/g, ' ')))))
    .join('');
  return layoutPlain({ preheader: subject, body, unsubUrl });
}
