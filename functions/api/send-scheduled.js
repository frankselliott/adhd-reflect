// ADHD Reflect. Send scheduled practice emails
// Hit daily via cron: /api/send-scheduled?key=ADMIN_KEY

import { sendBatch, sendEmail, signUnsub, normalizeEmail } from './_lib/email.js';
import { dripEmailHtml } from './_lib/emails.js';

// Simple sanity check. One invalid address must not stall the whole drip,
// because Resend's batch endpoint is atomic (all-or-nothing per call).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMAILS = {
  reactor: [
    {
      subject: "You yelled. Now what.",
      text: `If you are reading this, you probably yelled today. Or yesterday. Or you are saving this email for when you inevitably do.

The reactor pattern means your emotional response arrives before your thinking brain gets a vote. Heat, volume, speed. Then the shame. You know this sequence.

This week, do not try to fix it. Just notice the body signal that arrives before the yelling starts. Tight chest. Clenched jaw. Shoulders at your ears. That signal is your three-second warning system. You do not need to use it yet. Just learn what it feels like.

If you want to understand what is actually happening in your nervous system during those moments:
https://adhdreflect.com/guides/g01

ADHD Reflect`
    },
    {
      subject: "One exhale. That is the whole trick.",
      text: `You noticed the signal. The heat, the clench, the surge. Good.

Now add one thing before you speak: breathe out. Not a meditation. Not a breathing exercise. One exhale through your mouth. That is it.

One exhale activates your parasympathetic nervous system. It buys you about two seconds. Two seconds is not enough to become calm. It is enough to choose a slightly different volume.

If you exhale and still yell, congratulations, you are a human being with ADHD. The practice is the exhale. The perfection is not required.

More on what happens when two nervous systems collide in the same room:
https://adhdreflect.com/guides/g04

ADHD Reflect`
    },
    {
      subject: "The twenty-second repair",
      text: `You reacted. It was too big. The guilt is doing laps.

Here is the whole repair: walk to them within thirty minutes and say, "I was too loud. That was more than you deserved. I am sorry."

That is it. No speech. No self-flagellation. No promise you will never do it again, because you probably will and they know it.

The return to normal is the repair. Your child does not need a perfect parent. They need a parent who comes back.

If repair after rupture is something you want to go deeper on:
https://adhdreflect.com/guides/g11

We also have a full module on repair, what it actually is, why ADHD parents skip it, and what a two-sentence repair sounds like in a real household. It is part of Both of You, our self-guided program for ADHD parents raising ADHD kids. Worth a look if the repair piece keeps eluding you:
https://adhdreflect.com/grow

ADHD Reflect`
    },
    {
      subject: "You will still yell. You will get faster.",
      text: `Four weeks in. Here is the honest version: the reactor pattern is not going away. Your nervous system is wired this way.

What changes is speed. The gap between the reaction and the repair gets shorter. The number of times you catch yourself before the peak goes up. Progress looks like yelling three sentences instead of ten. Repairing in ten minutes instead of three hours.

That is real progress. It just does not look like the calm-parent-influencer version of progress.

If these four emails have been useful and you want to go further, not a subscription, not a course with twenty hours of video, just twenty short text modules you can read on your phone, Both of You is built specifically for Reactor parents and the four other patterns that come with ADHD. One payment, no time pressure, no streaks:
https://adhdreflect.com/grow

And if you want to talk to someone who actually gets ADHD families:
https://adhdreflect.com/resources

Keep going. You are doing harder work than most people will ever understand.

ADHD Reflect`
    },
  ],

  juggler: [
    {
      subject: "You forgot something today. It is fine.",
      text: `You forgot something. Or you are about to. The permission slip, the appointment, the lunch, the thing you swore you would not forget this time.

The juggler pattern means you are carrying more than your working memory can hold, and the balls drop at the worst possible moments. Not because you do not care. Because your brain's holding capacity has a hard limit and your life exceeds it daily.

This week, try this: at the end of today, write down everything you tracked, managed, or worried about. The list will be longer than you think. That is your invisible load. Nobody else sees it.

If you want to understand why your working memory keeps betraying you:
https://adhdreflect.com/guides/g02

ADHD Reflect`
    },
    {
      subject: "One thing before the chaos",
      text: `Every morning, fourteen things compete for your attention. Your ADHD brain treats them all as equally urgent, which means none of them win.

Try this: before the day starts, pick one thing. Not the most urgent. The most important. Write it on your hand if you need to. Do it first.

If you do the one thing and everything else falls apart, that is still a better day than doing fourteen things badly and the important one not at all.

The urgent things will scream regardless. The important things just quietly disappear when you are not looking.

Why time feels different for ADHD brains and what to do about it:
https://adhdreflect.com/guides/g06

ADHD Reflect`
    },
    {
      subject: "Drop something on purpose",
      text: `The juggler's secret: the skill is not carrying more. It is choosing what to put down.

This week, deliberately drop one thing. The packed lunch that could be canteen twice a week. The activity nobody enjoys. The household standard only you hold.

Drop it. Watch what happens. Usually nothing. The thing you were gripping was not load-bearing. It just felt like it was.

Your family needs you functional more than they need you thorough. Those two things are in competition and functional wins.

If the invisible load is something you want to work through more systematically, we have two modules on it in Both of You, one on why the morning keeps collapsing, one on what a routine actually looks like when it is built for an ADHD brain rather than against it:
https://adhdreflect.com/grow

ADHD Reflect`
    },
    {
      subject: "Systems, not willpower",
      text: `The juggler pattern does not improve with effort. It improves with infrastructure.

Every task you move from your memory to a system is one less thing your working memory has to hold. A shared calendar. A default Monday dinner. An alarm for the medication. A checklist on the back of the door.

These are not crutches. They are plumbing. Nobody carries water when pipes exist.

Build one system this week. The smallest one. Keep it simple. Complicated systems do not survive ADHD. Simple ones do.

If these four emails have landed and you want a structured way through the rest of it, morning routines, partner dynamics, the school calls, what to do when your child melts down and you have nothing left, Both of You covers all of it. Twenty short modules, no video, works on a phone:
https://adhdreflect.com/grow

For specific professional support:
https://adhdreflect.com/resources

You are managing more than most people can see. That is not nothing.

ADHD Reflect`
    },
  ],

  looper: [
    {
      subject: "Same fight, different Tuesday",
      text: `You had the argument again. The same one. About the screen time, or the homework, or the shoes by the door. You both said the same things you said last time. It ended the same way.

The looper pattern means you get stuck in cycles. Same trigger, same reaction, same exhausted reset. Then repeat.

This week, just map one loop. Write it down: "It started with X. I did Y. We ended up at Z." You do not need to fix it. Just see it. You cannot exit a loop you have not noticed.

If the argument loop is one of your regulars:
https://adhdreflect.com/guides/g20

ADHD Reflect`
    },
    {
      subject: "Change your half",
      text: `You have been trying to break the loop by fixing the trigger. If they would just stop doing the thing, you would not have to do your thing.

Problem: you do not control the trigger. You control your response.

This week, when the loop starts, change one thing about your half. If you usually raise your voice, lower it. If you usually lecture, stop at one sentence. If you usually follow them, stay where you are.

The loop needs both parts. When yours changes, the loop cannot complete the same way. It might not break. But it will wobble. That wobble is progress.

Understanding the two-nervous-system dynamic underneath the loop:
https://adhdreflect.com/guides/g04

ADHD Reflect`
    },
    {
      subject: "What the fight is actually about",
      text: `The loop ran again. But this time you saw it. That counts, even if it does not feel like it.

After the loop finishes, not during, after, try: "I noticed we keep landing in the same place. What is actually going on underneath this?"

The argument about screen time is usually about control. The argument about homework is usually about adequacy. The argument about bedtime is usually about depletion. The surface issue runs the loop. The fuel is underneath.

We have a module specifically for loopers on how to stop without feeling like you lost, including what to do with the discomfort of leaving something unresolved on purpose. It is in Both of You if you want to go further with this:
https://adhdreflect.com/grow

If your partner is part of the loop, this might also be useful:
https://adhdreflect.com/guides/g12

ADHD Reflect`
    },
    {
      subject: "The loop is the teacher",
      text: `Four weeks. Some loops will not stop. Some exist because ADHD creates the same conditions every day.

But you are catching the loop earlier. Exiting sooner. Recovering faster. That is the progress. Not the absence of the loop. The speed of the recognition.

You noticed on round two instead of round five. You stopped before the damage point. You named it before it became an action. That is harder than it sounds and you are doing it.

If you want to keep going with this work, the repair after the loop, the partner dynamic, the school version of the same conversation, Both of You has twenty modules that go deeper on all of it. No video, no live sessions, reads like a conversation rather than a textbook:
https://adhdreflect.com/grow

If you and your partner are stuck in a loop together and need a professional in the room:
https://adhdreflect.com/resources

ADHD Reflect`
    },
  ],

  spiraller: [
    {
      subject: "It started with a forgotten lunchbox",
      text: `A forgotten lunchbox became "I am failing them." A bad morning became "they will never cope." A meltdown became "what if this is who they are forever."

The spiraller pattern means one thought leads to the next, each darker than the last, until you are somewhere far worse than where the evidence supports.

This week, just notice the distance. When you catch yourself spiralling, write down where it started and where it took you. "Started: forgotten lunch. Ended: they will never hold a job." That gap is the spiral. Seeing it is the first step to shortening it.

Understanding the shame spiral and why your brain does this:
https://adhdreflect.com/guides/g03

ADHD Reflect`
    },
    {
      subject: "Fact or fear?",
      text: `The spiral feels like logic. Each step follows the last. But the spiral is not reasoning. It is anxiety in a logic costume.

Next time you notice the spiral, ask one question: "Is this a fact or a fear?"

"They had a bad morning." Fact. "They will never manage independently." Fear wearing a prediction suit.

You do not need to argue with the fear. Just label it. "That is the spiral talking." The label does not make it disappear. It makes you the observer instead of the passenger.

Why rejection sensitivity makes the spiral spin faster:
https://adhdreflect.com/guides/g05

ADHD Reflect`
    },
    {
      subject: "Your brain has a selective memory",
      text: `The spiral remembers every failure and forgets every success. It is working with a biased evidence file.

This week, build a counter-file. Three things that went okay today. Not great. Okay. "Got to school on time." "Nobody cried at dinner." "They read for ten minutes."

The spiral will tell you these do not count. They count. Write them somewhere visible. When the spiral starts, read the list. Not to feel better. To see the whole picture instead of just the dark corner.

The hardest part of the spiraller pattern is that the shame consumes the energy that should go into repair. We have a module specifically on getting from the spiral to the actual repair, what it looks like, why simpler is better, and why the repair is for them not for your guilt. It is in Both of You:
https://adhdreflect.com/grow

ADHD Reflect`
    },
    {
      subject: "You are not your worst thought",
      text: `The spirals will keep coming. ADHD rejection sensitivity means your brain reaches the worst case faster than other brains. That is wiring, not weakness.

But you are catching the spiral earlier. It reaches less depth before you notice. Recovery is faster. You spiralled to "this is hard" instead of "this is hopeless." That is progress.

Your brain will keep offering you the catastrophic version. You are learning to read it as a draft, not a final document.

If these four emails have helped and you want a more structured way through it, the spiral, the repair, what to do after the hard moment, Both of You goes deeper on all of it. Twenty short modules written specifically for parents where both the adult and the child have ADHD:
https://adhdreflect.com/grow

For professional support from people who understand ADHD brains that spiral:
https://adhdreflect.com/resources

You are doing this. Imperfectly. Which is the only way it gets done.

ADHD Reflect`
    },
  ],

  escaper: [
    {
      subject: "You are reading this from the bathroom, aren't you",
      text: `You are hiding. Maybe in the bathroom. Maybe behind your phone. Maybe you are physically present but mentally three suburbs away.

The escaper pattern means when demand exceeds capacity, your brain's first move is to leave. Not always physically. Sometimes you go quiet, check out, scroll, or suddenly become very interested in something that is not the hard thing.

This is not laziness. It is your nervous system choosing the lowest-demand option. Your brain is protecting you. Unfortunately, it is also leaving your family without you in the room.

This week, just notice the escape. Do not stop it. Notice it. "That is the escape." That is the whole practice.

Understanding what your nervous system is doing when it checks out:
https://adhdreflect.com/guides/g01

ADHD Reflect`
    },
    {
      subject: "Five minutes, then come back",
      text: `You escaped. You noticed. Good.

Now try the return. Not preventing the escape. The coming back part.

When you catch yourself in the escape, the scroll, the shutdown, the bathroom, give yourself five minutes. Deliberately. "I am taking five minutes." Then come back. Put the phone down. Walk into the room. Say: "I am back."

Five minutes of deliberate absence is different from an hour of unconscious checkout. Same behaviour. Different awareness. Different impact.

The practice is not the escape. It is the return.

If burnout is driving the escapes:
https://adhdreflect.com/guides/g15

ADHD Reflect`
    },
    {
      subject: "Name what you are running from",
      text: `The escape is always from something. A conversation you do not want. A feeling you cannot face. A task too big to start. A conflict you do not want to enter.

This week, before you escape, name it. "I am avoiding the bedtime conversation." "I am avoiding the guilt." "I am avoiding the fight about homework."

Naming the thing does not stop the escape. It makes the escape a choice instead of a reflex. "I am choosing to avoid this" is different from "I am scrolling." Same phone in your hand. Different level of honesty.

We have two modules for escaper parents in Both of You, one on why you leave even when you stay, one on what the small return actually looks like when you have nothing left to give. Worth reading if the coming-back part is where you keep getting stuck:
https://adhdreflect.com/grow

If you are escaping because you are completely depleted:
https://adhdreflect.com/guides/g15

ADHD Reflect`
    },
    {
      subject: "Present is a practice, not a personality",
      text: `The escape impulse will not go away. When capacity is low, your brain will always prefer the door. That is wiring, not character.

But the returns are getting faster. The escapes are getting shorter. You are naming what you avoid instead of pretending you are not avoiding it.

You still reached for the phone, but five minutes instead of thirty. You still checked out, but you came back before the damage was done. You still avoided the conversation, but you had it the same day.

The escape is not the failure. The failure to return is. And you are returning.

If these four emails have been useful and you want more structure, the partner dynamic, what your child experiences when you check out, how to build the return as a habit, Both of You covers all of it in twenty short modules. No video, no live sessions, works on a phone in fragments:
https://adhdreflect.com/grow

For real support from people who understand ADHD avoidance without judging it:
https://adhdreflect.com/resources

You are here. You are reading this. You came back. That is the practice.

ADHD Reflect`
    },
  ],
};

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const cronKey = url.searchParams.get('key');
  if (!env.ADMIN_KEY || cronKey !== env.ADMIN_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }
  if (!env.RESEND_API_KEY || !env.SEARCH_LOGS) {
    return new Response('Not configured', { status: 500 });
  }

  const now = new Date();
  let sent = 0, skipped = 0, errors = 0, total = 0;

  // Collect everyone due this run, then send them via Resend's batch endpoint.
  // Paginate with the cursor (same pattern as backfill-contacts.js) so the run
  // does not silently stop at the first page. Cap at 20 pages so a runaway
  // cannot blow the Workers time limit.
  const due = [];
  const MAX_PAGES = 20;
  let cursor, pages = 0, capped = false;
  do {
  const list = await env.SEARCH_LOGS.list({ prefix: 'email:', cursor });
  pages++;
  total += list.keys.length;
  for (const key of list.keys) {
    const raw = await env.SEARCH_LOGS.get(key.name);
    if (!raw) continue;
    const schedule = JSON.parse(raw);
    if (new Date(schedule.nextEmailDate) > now) { skipped++; continue; }
    if (schedule.emailsSent >= 4) { skipped++; continue; }
    // Skip malformed addresses so a bad KV row cannot poison the batch.
    if (!EMAIL_RE.test(String(schedule.email || '').trim())) {
      console.warn('send-scheduled: skipping invalid address', key.name);
      skipped++;
      continue;
    }
    // Honour unsubscribes. KV is the source of truth.
    if (await env.SEARCH_LOGS.get('unsub:' + normalizeEmail(schedule.email))) { skipped++; continue; }
    const patternEmails = EMAILS[schedule.pattern];
    if (!patternEmails || !patternEmails[schedule.emailsSent]) { skipped++; continue; }
    const emailToSend = patternEmails[schedule.emailsSent];

    // Marketing send: needs a signed unsubscribe path in the header and body.
    const token = await signUnsub(env, schedule.email);
    const q = 'e=' + encodeURIComponent(schedule.email) + '&t=' + token;
    const unsubPage = 'https://adhdreflect.com/unsubscribe?' + q;
    const unsubApi = 'https://adhdreflect.com/api/unsubscribe?' + q;

    due.push({
      keyName: key.name,
      schedule,
      message: {
        to: schedule.email,
        subject: emailToSend.subject,
        text: emailToSend.text + '\n\nUnsubscribe any time: ' + unsubPage,
        html: dripEmailHtml({ text: emailToSend.text, subject: emailToSend.subject, unsubUrl: unsubPage }),
        tags: [{ name: 'type', value: 'drip' }],
        // Per-recipient, per-drip-step key so a cron retry cannot double-send.
        idempotencyKey: 'drip-' + schedule.email + '-' + schedule.emailsSent,
        headers: {
          'List-Unsubscribe': '<' + unsubApi + '>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      },
    });
  }
  cursor = list.list_complete ? undefined : list.cursor;
  if (cursor && pages >= MAX_PAGES) { capped = true; break; }
  } while (cursor);
  if (capped) console.warn('send-scheduled: hit ' + MAX_PAGES + '-page ceiling; more subscribers remain unprocessed this run');

  // Advance one recipient in KV after a successful send.
  const advance = async (d) => {
    d.schedule.emailsSent += 1;
    d.schedule.nextEmailDate = new Date(now.getTime() + 7*24*60*60*1000).toISOString();
    d.schedule.lastSent = now.toISOString();
    await env.SEARCH_LOGS.put(d.keyName, JSON.stringify(d.schedule), { expirationTtl: 60*60*24*60 });
    sent++;
  };

  // Send in groups of 100 (Resend's batch limit). Because batch is atomic, a
  // failed group is retried as individual sends so the valid recipients still
  // get through. Each message keeps its per-recipient idempotency key, so the
  // fallback cannot double-send what the batch may have already delivered.
  const GROUP = 100;
  for (let i = 0; i < due.length; i += GROUP) {
    const group = due.slice(i, i + GROUP);
    const result = await sendBatch(env, group.map((d) => d.message));
    const ok = result.chunks.length > 0 && result.chunks.every((c) => c.ok);
    if (ok) {
      for (const d of group) await advance(d);
    } else {
      for (const d of group) {
        const r = await sendEmail(env, d.message);
        if (r.ok) await advance(d);
        else errors++;
      }
    }
  }

  return new Response(JSON.stringify({ sent, skipped, errors, total, capped }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
