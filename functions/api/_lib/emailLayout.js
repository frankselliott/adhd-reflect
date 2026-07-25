// ADHD Reflect email layout.
// Table-based, inline CSS, no web fonts, no SVG. Renders in Gmail, Outlook,
// Apple Mail, and mobile clients without a stylesheet.
//
// Two shells:
//   layout()      full brand frame. Purchase, recovery, free access, welcome.
//   layoutPlain() minimal frame. The drip only. Mark plus footer, nothing else.
//
// Fonts: email clients strip @font-face, so Fraunces and Lexend will not load.
// We use the same fallbacks the site already declares:
//   --serif: 'Fraunces', Georgia, serif   -> Georgia
//   --sans:  'Lexend', system-ui, ...     -> Helvetica Neue / Arial

const C = {
  cloud: '#F7F5F0',
  mist: '#EDEFEE',
  blue: '#4A6FA5',
  blueDeep: '#3A5A8C',
  sage: '#A8C3A0',
  eucalyptus: '#7FA88E',
  slate: '#1F2A37',
  pewter: '#56606E',
  lavender: '#9B8BB4',
  border: 'rgba(31,42,55,0.08)',
};

import { SENDER, SITE_DISPLAY, NOT_MEDICAL, footerUnsubPrompt, footerUnsubText, footerTransactionalNote } from './emailCopy.js';

const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

const SITE = 'https://adhdreflect.com';
const MARK = SITE + '/email/mark@2x.png'; // 96x96 png, rendered at 48

// Escape untrusted values before they go anywhere near the HTML.
export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function head(preheader) {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
</head>
<body style="margin:0;padding:0;background-color:${C.mist};">
<div style="display:none;font-size:1px;color:${C.mist};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(preheader)}</div>`;
}

// The mark plus wordmark. Alt text carries the brand if images are blocked,
// which is the default in Outlook and for a good share of Gmail users.
function brandbar(align) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr>
    <td style="padding-right:10px;" valign="middle">
      <img src="${MARK}" width="36" height="36" alt="ADHD Reflect" border="0" style="display:block;width:36px;height:36px;">
    </td>
    <td valign="middle" style="font-family:${SANS};">
      <div style="font-size:10px;letter-spacing:0.24em;color:${C.pewter};text-transform:lowercase;line-height:1.2;">adhd</div>
      <div style="font-family:${SERIF};font-size:22px;color:${C.slate};line-height:1.2;">Reflect</div>
    </td>
  </tr>
</table>`;
}

function footer({ unsubUrl, transactional }) {
  const unsub = unsubUrl
    ? `<p style="margin:0 0 10px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.pewter};">
         ${footerUnsubPrompt} <a href="${esc(unsubUrl)}" style="color:${C.pewter};text-decoration:underline;">${footerUnsubText}</a>.
       </p>`
    : '';
  const note = transactional
    ? `<p style="margin:0 0 10px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.pewter};">
         ${footerTransactionalNote}
       </p>`
    : '';
  return `<tr>
  <td style="padding:28px 32px 32px;border-top:1px solid ${C.border};">
    ${unsub}
    ${note}
    <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.pewter};">
      <a href="${SITE}" style="color:${C.pewter};text-decoration:none;">${SITE_DISPLAY}</a><br>
      ${NOT_MEDICAL}
    </p>
  </td>
</tr>`;
}

/**
 * Full brand frame.
 * opts: { title, preheader, body, unsubUrl, transactional }
 * `body` is trusted HTML built by the caller. Escape anything user-supplied
 * with esc() before passing it in.
 */
export function layout({ title, preheader, body, unsubUrl, transactional }) {
  return `${head(preheader || '')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.mist}" style="background-color:${C.mist};">
<tr><td align="center" style="padding:32px 16px;">

  <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background-color:${C.cloud};border-radius:16px;">

    <tr><td align="center" style="padding:32px 32px 8px;">${brandbar()}</td></tr>

    ${title ? `<tr><td style="padding:16px 32px 0;">
      <h1 style="margin:0;font-family:${SERIF};font-size:28px;font-weight:normal;line-height:1.25;color:${C.slate};">${esc(title)}</h1>
    </td></tr>` : ''}

    <tr><td style="padding:20px 32px 8px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.slate};">
      ${body}
    </td></tr>

    ${footer({ unsubUrl, transactional })}

  </table>

</td></tr>
</table>
</body></html>`;
}

/**
 * Minimal frame for the drip. No card, no headline, no colour blocks.
 * The copy carries it. `body` is paragraphs only.
 */
export function layoutPlain({ preheader, body, unsubUrl }) {
  return `${head(preheader || '')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.cloud}" style="background-color:${C.cloud};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:520px;">

    <tr><td style="padding:0 8px 24px;">
      <img src="${MARK}" width="28" height="28" alt="ADHD Reflect" border="0" style="display:block;width:28px;height:28px;">
    </td></tr>

    <tr><td style="padding:0 8px;font-family:${SANS};font-size:16px;line-height:1.7;color:${C.slate};">
      ${body}
    </td></tr>

    <tr><td style="padding:32px 8px 0;">
      <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.pewter};">
        ${SENDER} · <a href="${SITE}" style="color:${C.pewter};text-decoration:none;">${SITE_DISPLAY}</a><br>
        ${unsubUrl ? `<a href="${esc(unsubUrl)}" style="color:${C.pewter};text-decoration:underline;">${footerUnsubText}</a><br>` : ''}
        ${NOT_MEDICAL}
      </p>
    </td></tr>

  </table>
</td></tr>
</table>
</body></html>`;
}

/** Paragraph helper so callers stop hand-writing inline styles. */
export function p(html) {
  return `<p style="margin:0 0 16px;">${html}</p>`;
}

/** Bulletproof button. Renders as a real box in Outlook, not a bare link. */
export function button(label, href) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;">
  <tr>
    <td bgcolor="${C.blue}" style="background-color:${C.blue};border-radius:10px;">
      <a href="${esc(href)}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:16px;color:#FFFFFF;text-decoration:none;border-radius:10px;">${esc(label)}</a>
    </td>
  </tr>
</table>`;
}

/** Quiet callout for secondary information. Sage left rule, no heavy box. */
export function note(html) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 20px;">
  <tr>
    <td style="border-left:3px solid ${C.sage};padding:2px 0 2px 14px;font-family:${SANS};font-size:14px;line-height:1.6;color:${C.pewter};">
      ${html}
    </td>
  </tr>
</table>`;
}

/** Small uppercase label, the mono role from the site, in a websafe face. */
export function label(text) {
  return `<div style="font-family:${SANS};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${C.blue};margin:0 0 12px;">${esc(text)}</div>`;
}

export const COLORS = C;
