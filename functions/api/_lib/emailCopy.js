// ADHD Reflect. Email copy: the single source of truth for every human-readable
// string we send by email. The sending endpoints and the HTML builders in
// emails.js import from here, so there is no email copy left inline anywhere.
//
// This file holds WORDS, not markup. The layout helpers (layout, layoutPlain,
// p, button, note, label) and the link() helper stay in emails.js and the
// sending files; where an HTML paragraph is built from a helper call, only the
// string argument lives here. Pieces that need a value (patternName, accessUrl,
// unsubUrl, or a rendered link) are exported as functions taking named
// arguments, so nothing is hardcoded.
//
// Reading order, not machine order:
//   1. Shared bits used across several emails.
//   2. Transactional emails (welcome, purchase, recovery).
//   3. The drip, grouped by pattern, in send order 1 to 4.
//
// The drip is text-only by design. Its HTML is rendered from the text by
// dripEmailHtml() in emails.js, and its preheader is its subject. Each drip
// body is kept whole and verbatim so it reads as a complete email.

// ─────────────────────────────────────────────────────────────────────────
// 1. SHARED BITS
// ─────────────────────────────────────────────────────────────────────────

export const SENDER = 'ADHD Reflect';
export const SITE = 'https://adhdreflect.com';
export const SITE_DISPLAY = 'adhdreflect.com';
export const NOT_MEDICAL = 'This is not medical advice.';

// Appended to marketing emails (the welcome and every drip).
export const unsubscribeLine = (unsubUrl) => `Unsubscribe any time: ${unsubUrl}`;

// Footer prose the layout renders on every HTML email. The layout owns the
// markup around these; the words live here. (The brand wordmark lockup is a
// logo and stays in emailLayout.js as markup.)
export const footerUnsubPrompt = 'Too many emails?';
export const footerUnsubText = 'Unsubscribe any time';
export const footerTransactionalNote = 'You are getting this because you bought or requested access. It is not marketing.';

// ─────────────────────────────────────────────────────────────────────────
// 2. TRANSACTIONAL
// ─────────────────────────────────────────────────────────────────────────

// WELCOME. Marketing. Sends immediately when someone finishes the quiz and
// subscribes. HTML via welcomeEmailHtml(); carries a signed unsubscribe path.
export const welcome = {
  key: 'welcome',
  subject: `You're in. First one lands tomorrow.`,
  preheader: `You're in. First one lands tomorrow.`,
  html: {
    title: ({ patternName }) => `Your pattern: ${patternName}`,
    p1: `Tomorrow you'll get the first of four short emails on what that actually looks like in a real house on a bad night. Then one a week for three more weeks. No apps, no streaks, no homework.`,
    p2: `That's the whole thing. Four emails.`,
    p3: ({ link }) => `In between, ${link(SITE, SITE_DISPLAY)} has a free tool for the moment you're in right now. Describe what's happening and it matches you to a card written for it.`,
    note: `Worth saying once: most parenting advice assumes you're the calm one in the room. That falls apart when you've both got ADHD and you're both gone at the same time. That's the gap this is for.`,
  },
  text: ({ patternName, unsubUrl }) => `Your pattern: ${patternName}.

Tomorrow you'll get the first of four short emails on what that actually looks like in a real house on a bad night. Then one a week for three more weeks. No apps, no streaks, no homework.

That's the whole thing. Four emails.

In between, ${SITE_DISPLAY} has a free tool for the moment you're in right now. Describe what's happening and it matches you to a card written for it.

Worth saying once: most parenting advice assumes you're the calm one in the room. That falls apart when you've both got ADHD and you're both gone at the same time. That's the gap this is for.

${SENDER}
${SITE_DISPLAY}

${unsubscribeLine(unsubUrl)}`,
};

// PURCHASE. Transactional. Sends from the Stripe webhook after a completed
// checkout, to the buyer. HTML via purchaseEmailHtml().
export const purchase = {
  key: 'purchase',
  subject: `You're in. Both of You`,
  preheader: `Both of You is ready when you are. No rush. No schedule.`,
  html: {
    title: `You're in.`,
    p1: `Both of You is ready when you are. No rush. No schedule.`,
    button: `Open Both of You`,
    accessLabel: `Your access link`,
    p2: `This email is your key. <strong>Bookmark it</strong>, it's how you get back in on any device. No password. No account.`,
    p3: ({ link }) => `Lost it later? Go to ${link(SITE + '/grow', SITE_DISPLAY + '/grow')} and use "Recover access."`,
    startLabel: `Where to start`,
    p4: `The course begins in Module 1, but if you've already taken the pattern quiz, your first modules are waiting for you based on your result.`,
    p5: `Each module takes 10–18 minutes. You don't need to sit down. You don't need to be in a good headspace. You just need a few minutes and a phone.`,
    p6: ({ link }) => `Between modules, ${link(SITE, SITE_DISPLAY)} has a search tool for the hard moment you're in right now, describe what's happening and it matches you to a card. Free, no login.`,
    p7: ({ link }) => `If you're at the point where you want to talk to someone, ${link('https://go.online-therapy.com/aff_c?offer_id=2&amp;aff_id=6176', 'online-therapy.com')} offers CBT-based therapy from $40/week with a 20% first-month discount using code <strong>THERAPY20</strong>. We use this link because we think it's genuinely useful, we also earn a small commission if you sign up.`,
    note: `Both of You is structured practical content, not a clinical intervention.`,
  },
  text: ({ accessUrl }) => `You're in.\n\nBoth of You is ready when you are.\n\nOpen it here:\n${accessUrl}\n\nThis link works on any device. Bookmark this email, it's how you get back in. No password needed.\n\nLost the link? Go to ${SITE_DISPLAY}/grow and use "Recover access."\n\n---\n\nWhere to start: Module 1 is the beginning. If you've taken the pattern quiz, your first modules are waiting based on your result. Each module is 10-18 minutes on a phone.\n\nBetween modules: ${SITE_DISPLAY} has a free search tool for hard moments, describe what's happening and it matches you to a card.\n\nNeed to talk to someone? online-therapy.com offers CBT-based therapy from $40/week. Use code THERAPY20 for 20% off your first month. (We earn a small commission if you sign up.)\n\n---\n\n${SENDER} · ${SITE_DISPLAY}\n${NOT_MEDICAL}`,
};

// RECOVERY. Transactional. Sends when a buyer asks for their access link again
// on the grow page, to that buyer. HTML via recoveryEmailHtml().
export const recovery = {
  key: 'recovery',
  subject: `Your Both of You access link`,
  preheader: `Here's your access link for Both of You.`,
  html: {
    p1: `Here's your access link for Both of You.`,
    button: `Open Both of You`,
    p2: `This link works on any device. Bookmark it or save this email — it's how you get in.`,
    p3: `No password needed. Just the link.`,
  },
  text: ({ accessUrl }) => `Your Both of You access link: ${accessUrl}\n\nBookmark this link — it works on any device. No password needed.`,
};

// ─────────────────────────────────────────────────────────────────────────
// 3. DRIP. Marketing. Five patterns, four emails each, sent one per week over
// the four weeks after the welcome. send-scheduled.js picks EMAILS[pattern]
// [emailsSent]. Text-only: the HTML is rendered from the text, the preheader is
// the subject, and the unsubscribe line is appended at send time.
// ─────────────────────────────────────────────────────────────────────────

export const DRIP = {

  // ─── Reactor ───
  reactor: [
    // Reactor, email 1, sends 1 day after signup, to Reactor subscribers
    {
      key: 'reactor-1',
      subject: `You yelled. Now what.`,
      text: `If you are reading this, you probably yelled today. Or yesterday. Or you are saving this email for when you inevitably do.

The reactor pattern means your emotional response arrives before your thinking brain gets a vote. Heat, volume, speed. Then the shame. You know this sequence.

This week, do not try to fix it. Just notice the body signal that arrives before the yelling starts. Tight chest. Clenched jaw. Shoulders at your ears. That signal is your three-second warning system. You do not need to use it yet. Just learn what it feels like.

If you want to understand what is actually happening in your nervous system during those moments:
https://adhdreflect.com/guides/g01

ADHD Reflect`,
    },
    // Reactor, email 2, sends 8 days after signup, to Reactor subscribers
    {
      key: 'reactor-2',
      subject: `One exhale. That is the whole trick.`,
      text: `You noticed the signal. The heat, the clench, the surge. Good.

Now add one thing before you speak: breathe out. Not a meditation. Not a breathing exercise. One exhale through your mouth. That is it.

One exhale activates your parasympathetic nervous system. It buys you about two seconds. Two seconds is not enough to become calm. It is enough to choose a slightly different volume.

If you exhale and still yell, congratulations, you are a human being with ADHD. The practice is the exhale. The perfection is not required.

More on what happens when two nervous systems collide in the same room:
https://adhdreflect.com/guides/g04

ADHD Reflect`,
    },
    // Reactor, email 3, sends 15 days after signup, to Reactor subscribers
    {
      key: 'reactor-3',
      subject: `The twenty-second repair`,
      text: `You reacted. It was too big. The guilt is doing laps.

Here is the whole repair: walk to them within thirty minutes and say, "I was too loud. That was more than you deserved. I am sorry."

That is it. No speech. No self-flagellation. No promise you will never do it again, because you probably will and they know it.

The return to normal is the repair. Your child does not need a perfect parent. They need a parent who comes back.

If repair after rupture is something you want to go deeper on:
https://adhdreflect.com/guides/g11

We also have a full module on repair, what it actually is, why ADHD parents skip it, and what a two-sentence repair sounds like in a real household. It is part of Both of You, our self-guided program for ADHD parents raising ADHD kids. Worth a look if the repair piece keeps eluding you:
https://adhdreflect.com/grow

ADHD Reflect`,
    },
    // Reactor, email 4, sends 22 days after signup, to Reactor subscribers
    {
      key: 'reactor-4',
      subject: `You will still yell. You will get faster.`,
      text: `Four weeks in. Here is the honest version: the reactor pattern is not going away. Your nervous system is wired this way.

What changes is speed. The gap between the reaction and the repair gets shorter. The number of times you catch yourself before the peak goes up. Progress looks like yelling three sentences instead of ten. Repairing in ten minutes instead of three hours.

That is real progress. It just does not look like the calm-parent-influencer version of progress.

If these four emails have been useful and you want to go further, not a subscription, not a course with twenty hours of video, just twenty short text modules you can read on your phone, Both of You is built specifically for Reactor parents and the four other patterns that come with ADHD. One payment, no time pressure, no streaks:
https://adhdreflect.com/grow

And if you want to talk to someone who actually gets ADHD families:
https://adhdreflect.com/resources

Keep going. You are doing harder work than most people will ever understand.

ADHD Reflect`,
    },
  ],

  // ─── Juggler ───
  juggler: [
    // Juggler, email 1, sends 1 day after signup, to Juggler subscribers
    {
      key: 'juggler-1',
      subject: `You forgot something today. It is fine.`,
      text: `You forgot something. Or you are about to. The permission slip, the appointment, the lunch, the thing you swore you would not forget this time.

The juggler pattern means you are carrying more than your working memory can hold, and the balls drop at the worst possible moments. Not because you do not care. Because your brain's holding capacity has a hard limit and your life exceeds it daily.

This week, try this: at the end of today, write down everything you tracked, managed, or worried about. The list will be longer than you think. That is your invisible load. Nobody else sees it.

If you want to understand why your working memory keeps betraying you:
https://adhdreflect.com/guides/g02

ADHD Reflect`,
    },
    // Juggler, email 2, sends 8 days after signup, to Juggler subscribers
    {
      key: 'juggler-2',
      subject: `One thing before the chaos`,
      text: `Every morning, fourteen things compete for your attention. Your ADHD brain treats them all as equally urgent, which means none of them win.

Try this: before the day starts, pick one thing. Not the most urgent. The most important. Write it on your hand if you need to. Do it first.

If you do the one thing and everything else falls apart, that is still a better day than doing fourteen things badly and the important one not at all.

The urgent things will scream regardless. The important things just quietly disappear when you are not looking.

Why time feels different for ADHD brains and what to do about it:
https://adhdreflect.com/guides/g06

ADHD Reflect`,
    },
    // Juggler, email 3, sends 15 days after signup, to Juggler subscribers
    {
      key: 'juggler-3',
      subject: `Drop something on purpose`,
      text: `The juggler's secret: the skill is not carrying more. It is choosing what to put down.

This week, deliberately drop one thing. The packed lunch that could be canteen twice a week. The activity nobody enjoys. The household standard only you hold.

Drop it. Watch what happens. Usually nothing. The thing you were gripping was not load-bearing. It just felt like it was.

Your family needs you functional more than they need you thorough. Those two things are in competition and functional wins.

If the invisible load is something you want to work through more systematically, we have two modules on it in Both of You, one on why the morning keeps collapsing, one on what a routine actually looks like when it is built for an ADHD brain rather than against it:
https://adhdreflect.com/grow

ADHD Reflect`,
    },
    // Juggler, email 4, sends 22 days after signup, to Juggler subscribers
    {
      key: 'juggler-4',
      subject: `Systems, not willpower`,
      text: `The juggler pattern does not improve with effort. It improves with infrastructure.

Every task you move from your memory to a system is one less thing your working memory has to hold. A shared calendar. A default Monday dinner. An alarm for the medication. A checklist on the back of the door.

These are not crutches. They are plumbing. Nobody carries water when pipes exist.

Build one system this week. The smallest one. Keep it simple. Complicated systems do not survive ADHD. Simple ones do.

If these four emails have landed and you want a structured way through the rest of it, morning routines, partner dynamics, the school calls, what to do when your child melts down and you have nothing left, Both of You covers all of it. Twenty short modules, no video, works on a phone:
https://adhdreflect.com/grow

For specific professional support:
https://adhdreflect.com/resources

You are managing more than most people can see. That is not nothing.

ADHD Reflect`,
    },
  ],

  // ─── Looper ───
  looper: [
    // Looper, email 1, sends 1 day after signup, to Looper subscribers
    {
      key: 'looper-1',
      subject: `Same fight, different Tuesday`,
      text: `You had the argument again. The same one. About the screen time, or the homework, or the shoes by the door. You both said the same things you said last time. It ended the same way.

The looper pattern means you get stuck in cycles. Same trigger, same reaction, same exhausted reset. Then repeat.

This week, just map one loop. Write it down: "It started with X. I did Y. We ended up at Z." You do not need to fix it. Just see it. You cannot exit a loop you have not noticed.

If the argument loop is one of your regulars:
https://adhdreflect.com/guides/g20

ADHD Reflect`,
    },
    // Looper, email 2, sends 8 days after signup, to Looper subscribers
    {
      key: 'looper-2',
      subject: `Change your half`,
      text: `You have been trying to break the loop by fixing the trigger. If they would just stop doing the thing, you would not have to do your thing.

Problem: you do not control the trigger. You control your response.

This week, when the loop starts, change one thing about your half. If you usually raise your voice, lower it. If you usually lecture, stop at one sentence. If you usually follow them, stay where you are.

The loop needs both parts. When yours changes, the loop cannot complete the same way. It might not break. But it will wobble. That wobble is progress.

Understanding the two-nervous-system dynamic underneath the loop:
https://adhdreflect.com/guides/g04

ADHD Reflect`,
    },
    // Looper, email 3, sends 15 days after signup, to Looper subscribers
    {
      key: 'looper-3',
      subject: `What the fight is actually about`,
      text: `The loop ran again. But this time you saw it. That counts, even if it does not feel like it.

After the loop finishes, not during, after, try: "I noticed we keep landing in the same place. What is actually going on underneath this?"

The argument about screen time is usually about control. The argument about homework is usually about adequacy. The argument about bedtime is usually about depletion. The surface issue runs the loop. The fuel is underneath.

We have a module specifically for loopers on how to stop without feeling like you lost, including what to do with the discomfort of leaving something unresolved on purpose. It is in Both of You if you want to go further with this:
https://adhdreflect.com/grow

If your partner is part of the loop, this might also be useful:
https://adhdreflect.com/guides/g12

ADHD Reflect`,
    },
    // Looper, email 4, sends 22 days after signup, to Looper subscribers
    {
      key: 'looper-4',
      subject: `The loop is the teacher`,
      text: `Four weeks. Some loops will not stop. Some exist because ADHD creates the same conditions every day.

But you are catching the loop earlier. Exiting sooner. Recovering faster. That is the progress. Not the absence of the loop. The speed of the recognition.

You noticed on round two instead of round five. You stopped before the damage point. You named it before it became an action. That is harder than it sounds and you are doing it.

If you want to keep going with this work, the repair after the loop, the partner dynamic, the school version of the same conversation, Both of You has twenty modules that go deeper on all of it. No video, no live sessions, reads like a conversation rather than a textbook:
https://adhdreflect.com/grow

If you and your partner are stuck in a loop together and need a professional in the room:
https://adhdreflect.com/resources

ADHD Reflect`,
    },
  ],

  // ─── Spiraller ───
  spiraller: [
    // Spiraller, email 1, sends 1 day after signup, to Spiraller subscribers
    {
      key: 'spiraller-1',
      subject: `It started with a forgotten lunchbox`,
      text: `A forgotten lunchbox became "I am failing them." A bad morning became "they will never cope." A meltdown became "what if this is who they are forever."

The spiraller pattern means one thought leads to the next, each darker than the last, until you are somewhere far worse than where the evidence supports.

This week, just notice the distance. When you catch yourself spiralling, write down where it started and where it took you. "Started: forgotten lunch. Ended: they will never hold a job." That gap is the spiral. Seeing it is the first step to shortening it.

Understanding the shame spiral and why your brain does this:
https://adhdreflect.com/guides/g03

ADHD Reflect`,
    },
    // Spiraller, email 2, sends 8 days after signup, to Spiraller subscribers
    {
      key: 'spiraller-2',
      subject: `Fact or fear?`,
      text: `The spiral feels like logic. Each step follows the last. But the spiral is not reasoning. It is anxiety in a logic costume.

Next time you notice the spiral, ask one question: "Is this a fact or a fear?"

"They had a bad morning." Fact. "They will never manage independently." Fear wearing a prediction suit.

You do not need to argue with the fear. Just label it. "That is the spiral talking." The label does not make it disappear. It makes you the observer instead of the passenger.

Why rejection sensitivity makes the spiral spin faster:
https://adhdreflect.com/guides/g05

ADHD Reflect`,
    },
    // Spiraller, email 3, sends 15 days after signup, to Spiraller subscribers
    {
      key: 'spiraller-3',
      subject: `Your brain has a selective memory`,
      text: `The spiral remembers every failure and forgets every success. It is working with a biased evidence file.

This week, build a counter-file. Three things that went okay today. Not great. Okay. "Got to school on time." "Nobody cried at dinner." "They read for ten minutes."

The spiral will tell you these do not count. They count. Write them somewhere visible. When the spiral starts, read the list. Not to feel better. To see the whole picture instead of just the dark corner.

The hardest part of the spiraller pattern is that the shame consumes the energy that should go into repair. We have a module specifically on getting from the spiral to the actual repair, what it looks like, why simpler is better, and why the repair is for them not for your guilt. It is in Both of You:
https://adhdreflect.com/grow

ADHD Reflect`,
    },
    // Spiraller, email 4, sends 22 days after signup, to Spiraller subscribers
    {
      key: 'spiraller-4',
      subject: `You are not your worst thought`,
      text: `The spirals will keep coming. ADHD rejection sensitivity means your brain reaches the worst case faster than other brains. That is wiring, not weakness.

But you are catching the spiral earlier. It reaches less depth before you notice. Recovery is faster. You spiralled to "this is hard" instead of "this is hopeless." That is progress.

Your brain will keep offering you the catastrophic version. You are learning to read it as a draft, not a final document.

If these four emails have helped and you want a more structured way through it, the spiral, the repair, what to do after the hard moment, Both of You goes deeper on all of it. Twenty short modules written specifically for parents where both the adult and the child have ADHD:
https://adhdreflect.com/grow

For professional support from people who understand ADHD brains that spiral:
https://adhdreflect.com/resources

You are doing this. Imperfectly. Which is the only way it gets done.

ADHD Reflect`,
    },
  ],

  // ─── Escaper ───
  escaper: [
    // Escaper, email 1, sends 1 day after signup, to Escaper subscribers
    {
      key: 'escaper-1',
      subject: `You are reading this from the bathroom, aren't you`,
      text: `You are hiding. Maybe in the bathroom. Maybe behind your phone. Maybe you are physically present but mentally three suburbs away.

The escaper pattern means when demand exceeds capacity, your brain's first move is to leave. Not always physically. Sometimes you go quiet, check out, scroll, or suddenly become very interested in something that is not the hard thing.

This is not laziness. It is your nervous system choosing the lowest-demand option. Your brain is protecting you. Unfortunately, it is also leaving your family without you in the room.

This week, just notice the escape. Do not stop it. Notice it. "That is the escape." That is the whole practice.

Understanding what your nervous system is doing when it checks out:
https://adhdreflect.com/guides/g01

ADHD Reflect`,
    },
    // Escaper, email 2, sends 8 days after signup, to Escaper subscribers
    {
      key: 'escaper-2',
      subject: `Five minutes, then come back`,
      text: `You escaped. You noticed. Good.

Now try the return. Not preventing the escape. The coming back part.

When you catch yourself in the escape, the scroll, the shutdown, the bathroom, give yourself five minutes. Deliberately. "I am taking five minutes." Then come back. Put the phone down. Walk into the room. Say: "I am back."

Five minutes of deliberate absence is different from an hour of unconscious checkout. Same behaviour. Different awareness. Different impact.

The practice is not the escape. It is the return.

If burnout is driving the escapes:
https://adhdreflect.com/guides/g15

ADHD Reflect`,
    },
    // Escaper, email 3, sends 15 days after signup, to Escaper subscribers
    {
      key: 'escaper-3',
      subject: `Name what you are running from`,
      text: `The escape is always from something. A conversation you do not want. A feeling you cannot face. A task too big to start. A conflict you do not want to enter.

This week, before you escape, name it. "I am avoiding the bedtime conversation." "I am avoiding the guilt." "I am avoiding the fight about homework."

Naming the thing does not stop the escape. It makes the escape a choice instead of a reflex. "I am choosing to avoid this" is different from "I am scrolling." Same phone in your hand. Different level of honesty.

We have two modules for escaper parents in Both of You, one on why you leave even when you stay, one on what the small return actually looks like when you have nothing left to give. Worth reading if the coming-back part is where you keep getting stuck:
https://adhdreflect.com/grow

If you are escaping because you are completely depleted:
https://adhdreflect.com/guides/g15

ADHD Reflect`,
    },
    // Escaper, email 4, sends 22 days after signup, to Escaper subscribers
    {
      key: 'escaper-4',
      subject: `Present is a practice, not a personality`,
      text: `The escape impulse will not go away. When capacity is low, your brain will always prefer the door. That is wiring, not character.

But the returns are getting faster. The escapes are getting shorter. You are naming what you avoid instead of pretending you are not avoiding it.

You still reached for the phone, but five minutes instead of thirty. You still checked out, but you came back before the damage was done. You still avoided the conversation, but you had it the same day.

The escape is not the failure. The failure to return is. And you are returning.

If these four emails have been useful and you want more structure, the partner dynamic, what your child experiences when you check out, how to build the return as a habit, Both of You covers all of it in twenty short modules. No video, no live sessions, works on a phone in fragments:
https://adhdreflect.com/grow

For real support from people who understand ADHD avoidance without judging it:
https://adhdreflect.com/resources

You are here. You are reading this. You came back. That is the practice.

ADHD Reflect`,
    },
  ],
};
