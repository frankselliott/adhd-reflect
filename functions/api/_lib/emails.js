// ADHD Reflect email bodies.
// Each builder returns a full HTML document via the shared layout. The endpoints
// and the /dev/email-preview route both import these, so the preview always
// renders exactly what ships. Copy is kept verbatim from the previous inline
// versions; only the frame changed.
import { layout, layoutPlain, p, button, note, label, esc, COLORS } from './emailLayout.js';

const SITE = 'https://adhdreflect.com';
const link = (href, text) => `<a href="${href}" style="color:${COLORS.blue};text-decoration:none;">${text}</a>`;

// Welcome (marketing). layout({ unsubUrl }). patternName is a fixed display
// name from our constant; layout() escapes the title regardless.
export function welcomeEmailHtml({ patternName, unsubUrl }) {
  const body =
    p("Tomorrow you'll get the first of four short emails on what that actually looks like in a real house on a bad night. Then one a week for three more weeks. No apps, no streaks, no homework.") +
    p("That's the whole thing. Four emails.") +
    p(`In between, ${link(SITE, 'adhdreflect.com')} has a free tool for the moment you're in right now. Describe what's happening and it matches you to a card written for it.`) +
    note("Worth saying once: most parenting advice assumes you're the calm one in the room. That falls apart when you've both got ADHD and you're both gone at the same time. That's the gap this is for.");
  return layout({
    title: `Your pattern: ${patternName}`,
    preheader: "You're in. First one lands tomorrow.",
    body,
    unsubUrl,
  });
}

// Purchase (transactional). Full copy from the previous inline email.
export function purchaseEmailHtml({ accessUrl }) {
  const body =
    p('Both of You is ready when you are. No rush. No schedule.') +
    button('Open Both of You', accessUrl) +
    label('Your access link') +
    p(`This email is your key. <strong>Bookmark it</strong>, it's how you get back in on any device. No password. No account.`) +
    p(`Lost it later? Go to ${link(SITE + '/grow', 'adhdreflect.com/grow')} and use "Recover access."`) +
    label('Where to start') +
    p("The course begins in Module 1, but if you've already taken the pattern quiz, your first modules are waiting for you based on your result.") +
    p("Each module takes 10–18 minutes. You don't need to sit down. You don't need to be in a good headspace. You just need a few minutes and a phone.") +
    p(`Between modules, ${link(SITE, 'adhdreflect.com')} has a search tool for the hard moment you're in right now, describe what's happening and it matches you to a card. Free, no login.`) +
    p(`If you're at the point where you want to talk to someone, ${link('https://go.online-therapy.com/aff_c?offer_id=2&amp;aff_id=6176', 'online-therapy.com')} offers CBT-based therapy from $40/week with a 20% first-month discount using code <strong>THERAPY20</strong>. We use this link because we think it's genuinely useful, we also earn a small commission if you sign up.`) +
    note('Both of You is structured practical content, not a clinical intervention.');
  return layout({
    title: "You're in.",
    preheader: 'Both of You is ready when you are. No rush. No schedule.',
    body,
    transactional: true,
  });
}

// Recovery (access link). Full copy from the previous inline email.
export function recoveryEmailHtml({ accessUrl }) {
  const body =
    p("Here's your access link for Both of You.") +
    button('Open Both of You', accessUrl) +
    p("This link works on any device. Bookmark it or save this email — it's how you get in.") +
    p('No password needed. Just the link.');
  return layout({
    preheader: "Here's your access link for Both of You.",
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
