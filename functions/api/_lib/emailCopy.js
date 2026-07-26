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
  subject: `Your first email lands tomorrow`,
  preheader: `Four short emails about your pattern.`,
  html: {
    title: ({ patternName }) => `Your pattern: ${patternName}`,
    p1: `Tomorrow I'll send the first of four short emails about how this pattern can show up at home, especially when everyone is tired and your last good nerve has already gone. The other three will arrive weekly after that.`,
    p2: `There's nothing to keep up with. Read them when you can and ignore anything that doesn't fit.`,
    p3: ({ link }) => `If today is already a lot, ${link(SITE, SITE_DISPLAY)} has a free tool for the moment you're in. Tell it what's happening and it'll find something you could try.`,
    note: `A lot of parenting advice starts with “stay calm”. Fair enough. It gets trickier when the parent has ADHD too. ADHD Reflect starts there.`,
  },
  text: ({ patternName, unsubUrl }) => `Your pattern is ${patternName}.

Tomorrow I'll send the first of four short emails about how this pattern can show up at home, especially when everyone is tired and your last good nerve has already gone. The other three will arrive weekly after that.

There's nothing to keep up with. Read them when you can and ignore anything that doesn't fit.

If today is already a lot, ${SITE_DISPLAY} has a free tool for the moment you're in. Tell it what's happening and it'll find something you could try.

A lot of parenting advice starts with “stay calm”. Fair enough. It gets trickier when the parent has ADHD too. ADHD Reflect starts there.

${SENDER}
${SITE_DISPLAY}

${unsubscribeLine(unsubUrl)}`,
};

// PURCHASE. Transactional. Sends from the Stripe webhook after a completed
// checkout, to the buyer. HTML via purchaseEmailHtml().
export const purchase = {
  key: 'purchase',
  subject: `You're in. Both of You`,
  preheader: `Both of You is ready whenever you are.`,
  html: {
    title: `You're in.`,
    p1: `Both of You is ready whenever you are. There's no schedule to fall behind on.`,
    button: `Open Both of You`,
    accessLabel: `Your access link`,
    p2: `This email is your key. <strong>Bookmark it</strong> and you can get back in on any device. No password or account to remember.`,
    p3: ({ link }) => `Lost it later? Go to ${link(SITE + '/grow', SITE_DISPLAY + '/grow')} and use "Recover access."`,
    startLabel: `Where to start`,
    p4: `Module 1 is the proper beginning, but you don't have to be proper about it. If you've taken the pattern quiz, you'll also see a few suggested modules. Start with the one that sounds most like your house this week.`,
    p5: `Most modules take 10–18 minutes, and you can read them in bits. Five interrupted minutes on your phone is completely fine.`,
    p6: ({ link }) => `For the hard moments between modules, ${link(SITE, SITE_DISPLAY)} has a free search tool. Tell it what's happening and it'll find a card for that moment.`,
    p7: ({ link }) => `Some things are easier to untangle with another person. If you want that, ${link('https://go.online-therapy.com/aff_c?offer_id=2&amp;aff_id=6176', 'online-therapy.com')} offers CBT-based online therapy from $40 a week. Code <strong>THERAPY20</strong> takes 20% off the first month. This is an affiliate link, which means I may earn a small commission if you join. It costs you no extra.`,
    note: `Both of You is practical education and reflection, not therapy or medical advice.`,
  },
  text: ({ accessUrl }) => `You're in.

Both of You is ready whenever you are. There's no schedule to fall behind on.

Open it here:
${accessUrl}

This email is your key. Bookmark it and you can get back in on any device. No password or account to remember.

Lost it later? Go to ${SITE_DISPLAY}/grow and use "Recover access."

---

Module 1 is the proper beginning, but you don't have to be proper about it. If you've taken the pattern quiz, you'll also see a few suggested modules. Start with the one that sounds most like your house this week.

Most modules take 10–18 minutes, and you can read them in bits. Five interrupted minutes on your phone is completely fine.

For the hard moments between modules, ${SITE_DISPLAY} has a free search tool. Tell it what's happening and it'll find a card for that moment.

Some things are easier to untangle with another person. If you want that, online-therapy.com offers CBT-based online therapy from $40 a week. Code THERAPY20 takes 20% off the first month. This is an affiliate link, which means I may earn a small commission if you join. It costs you no extra.

---

${SENDER} · ${SITE_DISPLAY}
Both of You is practical education and reflection, not therapy or medical advice.`,
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
    p2: `This link works on any device. Bookmark it or save this email, it's how you get in.`,
    p3: `No password needed. Just the link.`,
  },
  text: ({ accessUrl }) => `Your Both of You access link: ${accessUrl}\n\nBookmark this link, it works on any device. No password needed.`,
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
      subject: `You yelled. What now?`,
      text: `Maybe you yelled today. Maybe everything stayed technically calm, but only just.

With the Reactor pattern, the reaction can be well underway before you've had time to choose it. Your body speeds up, your voice follows, and afterwards you wonder how it got that big.

This week, see if you can spot what your body does first. Maybe your chest tightens, your jaw locks or your shoulders head towards your ears. That may be the earliest warning you get.

You don't need to stop the reaction on command. For now, noticing the first sign is enough.

More on what's happening in those moments:
https://adhdreflect.com/guides/g01

ADHD Reflect`,
    },
    // Reactor, email 2, sends 8 days after signup, to Reactor subscribers
    {
      key: 'reactor-2',
      subject: `Try one breath out`,
      text: `Last week was about spotting the signal: the heat, the clench, the sudden surge.

This week, try one slow breath out before you speak. It doesn't need to become a routine or make you feel wonderfully calm.

In the middle of bedtime, wonderfully calm is a fairly ambitious target. The breath may simply buy you a second, or help your first sentence come out half a notch quieter.

If you remember after you've already reacted, that still tells you where the gap might be next time.

More on what happens when two overloaded nervous systems meet:
https://adhdreflect.com/guides/g04

ADHD Reflect`,
    },
    // Reactor, email 3, sends 15 days after signup, to Reactor subscribers
    {
      key: 'reactor-3',
      subject: `A repair can be this short`,
      text: `You reacted more strongly than you wanted to. Now the guilt has taken over the building.

Try keeping the repair very small:

"I was too loud. I'm sorry. You didn't deserve that."

Then leave some room for whatever they say. You don't need a long explanation or a promise that it will never happen again.

The repair is in going back. The hard moment doesn't get to be the only part of the story.

More on repairing after things go sideways:
https://adhdreflect.com/guides/g11

Both of You also has a full module on repair, including what to say when your mind goes blank. If this is the bit you keep getting stuck on, it's here:
https://adhdreflect.com/grow

ADHD Reflect`,
    },
    // Reactor, email 4, sends 22 days after signup, to Reactor subscribers
    {
      key: 'reactor-4',
      subject: `The change might be small`,
      text: `A month in, you probably haven't become the serene parent from the stock photo. That wasn't the assignment.

Maybe you notice the surge a little earlier. You stop after three sharp sentences instead of ten. You go back in ten minutes instead of spending the evening feeling terrible in another room.

That is real movement, even if the house still gets loud sometimes.

Both of You carries this approach across twenty short modules for ADHD parents raising ADHD-influenced kids. You can work through it on your phone, in whatever order and at whatever pace suits you:
https://adhdreflect.com/grow

And if this feels bigger than something a course can hold, there are options for professional support here:
https://adhdreflect.com/resources

ADHD Reflect`,
    },
  ],

  // ─── Juggler ───
  juggler: [
    // Juggler, email 1, sends 1 day after signup, to Juggler subscribers
    {
      key: 'juggler-1',
      subject: `Of course you forgot something`,
      text: `The permission slip. The appointment. The lunchbox sitting beautifully packed on the kitchen bench.

The Juggler pattern tends to show up when life asks your working memory to hold far more than it comfortably can. Something falls out. Usually the thing you were especially determined not to forget.

Tonight, write down everything you remembered, organised, chased or quietly worried about today. This isn't the start of a new daily habit. It's a one-off stocktake.

The list may explain why the lunchbox didn't make it to school.

More on ADHD and working memory:
https://adhdreflect.com/guides/g02

ADHD Reflect`,
    },
    // Juggler, email 2, sends 8 days after signup, to Juggler subscribers
    {
      key: 'juggler-2',
      subject: `Pick one thing before everyone wakes up`,
      text: `Mornings have a habit of presenting fourteen equally urgent problems before you've finished making coffee.

Tonight, pick the one thing tomorrow really needs. Put it somewhere you'll collide with it: on the kettle, your lock screen or your hand.

It doesn't have to be the biggest job. It might just be "bring the form" or "leave by 8:10".

The rest of the morning may still be chaos. At least the important thing has a fighting chance.

More on why time can be so slippery with ADHD:
https://adhdreflect.com/guides/g06

ADHD Reflect`,
    },
    // Juggler, email 3, sends 15 days after signup, to Juggler subscribers
    {
      key: 'juggler-3',
      subject: `What can you stop carrying?`,
      text: `The answer may not be getting better at juggling. It may be putting one ball down on purpose.

Canteen once a week. Leaving the washing unfolded. Retiring an activity nobody actually likes. Lowering a household standard that somehow became law.

Pick one thing that can be easier. Try the easier version and see whether anything terrible happens.

Both of You has two modules on the invisible load and building routines that can survive an actual ADHD household. If that sounds useful, they're here:
https://adhdreflect.com/grow

ADHD Reflect`,
    },
    // Juggler, email 4, sends 22 days after signup, to Juggler subscribers
    {
      key: 'juggler-4',
      subject: `Your brain doesn't need another job`,
      text: `Anything a system remembers is one less thing you have to.

A shared calendar. The same easy dinner every Monday. Medication beside the coffee. A school checklist stuck to the door at eye level.

Choose one recurring annoyance and give it a home outside your head. Keep the system almost embarrassingly simple. Elaborate systems are lovely for the three days they exist.

Both of You has more on mornings, overload, partner dynamics and the days when your child needs more than you have left. It's twenty short modules designed to be read in bits:
https://adhdreflect.com/grow

If carrying everything has tipped into not coping, these professional support options may be worth a look:
https://adhdreflect.com/resources

ADHD Reflect`,
    },
  ],

  // ─── Looper ───
  looper: [
    // Looper, email 1, sends 1 day after signup, to Looper subscribers
    {
      key: 'looper-1',
      subject: `Same fight, different Tuesday`,
      text: `The argument happened again. Screens, homework, shoes, bedtime. You both knew the script and somehow still had to perform the whole thing.

The Looper pattern is that familiar cycle: same trigger, same reactions, same wrung-out ending.

This week, map one round after it's over:

"It started with ___. I did ___. Then we ended up ___."

No need to solve it yet. You're just getting a look at the route while nobody is driving it.

If arguments are one of your regular loops:
https://adhdreflect.com/guides/g20

ADHD Reflect`,
    },
    // Looper, email 2, sends 8 days after signup, to Looper subscribers
    {
      key: 'looper-2',
      subject: `Make the loop wobble`,
      text: `Most loops come with a tempting solution: if they would stop doing their bit, you wouldn't do yours.

Fair. Also difficult to arrange.

So try changing one small part you control. If you usually give the full lecture, stop after one sentence. If you follow them down the hall, stay put. If your voice goes up, see if you can bring it down one notch.

It may not end the argument. It does make the old script harder to follow exactly.

More on what happens when two nervous systems set each other off:
https://adhdreflect.com/guides/g04

ADHD Reflect`,
    },
    // Looper, email 3, sends 15 days after signup, to Looper subscribers
    {
      key: 'looper-3',
      subject: `Maybe it isn't really about the shoes`,
      text: `Sometimes the thing you're arguing about is the thing. Sometimes it's just where all the other stress happened to land.

Once everyone is properly calm, not the suspicious silence five minutes later, you could try:

"We keep ending up in the same fight. What makes this one so hard?"

They might tell you something you hadn't realised. They might shrug. You're opening a conversation, not performing a parenting technique correctly.

Both of You has a module for Loopers on stopping a circular argument without needing to feel that someone won. It's here if you want it:
https://adhdreflect.com/grow

If the loop is with your partner:
https://adhdreflect.com/guides/g12

ADHD Reflect`,
    },
    // Looper, email 4, sends 22 days after signup, to Looper subscribers
    {
      key: 'looper-4',
      subject: `Catching it on round two`,
      text: `Some family loops keep coming back because the same tired people keep meeting the same hard parts of the day.

Often the change is timing. You notice the loop on round two instead of round five, or stop before saying the really sharp thing. Recovery takes twenty minutes instead of swallowing the whole night.

The loop still happened. It also took less from everyone.

Both of You goes further into repair, partner dynamics and the same old battles around school and home. It's twenty short modules, all text, and there's no timetable:
https://adhdreflect.com/grow

If you and your partner keep getting stuck in the same place, professional support is here too:
https://adhdreflect.com/resources

ADHD Reflect`,
    },
  ],

  // ─── Spiraller ───
  spiraller: [
    // Spiraller, email 1, sends 1 day after signup, to Spiraller subscribers
    {
      key: 'spiraller-1',
      subject: `It started with a lunchbox`,
      text: `A forgotten lunchbox became "I'm failing them." A bad morning became "they'll never cope." One meltdown somehow ended with you mentally visiting their difficult adulthood.

The Spiraller pattern can carry you a very long way from the thing that actually happened.

If you catch one this week, note the start and the destination:

"Started: forgotten lunch. Ended: they'll never manage on their own."

Seeing the distance can make the next thought feel a little less like a fact.

More on ADHD shame spirals:
https://adhdreflect.com/guides/g03

ADHD Reflect`,
    },
    // Spiraller, email 2, sends 8 days after signup, to Spiraller subscribers
    {
      key: 'spiraller-2',
      subject: `Fact, fear or tired prediction?`,
      text: `A spiral can sound convincing because each thought seems to prove the next one.

When you notice it, try sorting the thoughts:

"They had a bad morning." Something that happened.
"They'll never manage independently." A frightened prediction.

You don't have to argue yourself into optimism. "I'm doing the future thing again" may be enough to put a little space around the prediction.

More on rejection sensitivity and why one moment can suddenly feel enormous:
https://adhdreflect.com/guides/g05

ADHD Reflect`,
    },
    // Spiraller, email 3, sends 15 days after signup, to Spiraller subscribers
    {
      key: 'spiraller-3',
      subject: `Keep the boring evidence too`,
      text: `Spirals are excellent record-keepers for everything that went wrong. The ordinary okay bits rarely make the file.

Try collecting three of those today:

"We got to school."
"Dinner was mostly edible."
"They told me something funny in the car."

This isn't forced gratitude, and you don't need to feel better after writing them. You're just keeping a less selective record.

Both of You has a module on getting out of the shame replay and into a simple repair. If that gap is hard for you, it's here:
https://adhdreflect.com/grow

ADHD Reflect`,
    },
    // Spiraller, email 4, sends 22 days after signup, to Spiraller subscribers
    {
      key: 'spiraller-4',
      subject: `When your brain races ahead`,
      text: `Your brain may keep racing from one hard moment to the worst possible ending.

Over time, you may notice the jump sooner. "This is hard" doesn't always make it all the way to "everything is hopeless." Sometimes it does, but you find your way back sooner.

The first thought can feel completely true and still be a frightened prediction.

Both of You goes deeper into spirals, repair and what to do after a hard moment. It's twenty short modules for ADHD parents raising ADHD-influenced kids, built to be picked up and put down:
https://adhdreflect.com/grow

If the thoughts are getting hard to carry on your own, professional support is here:
https://adhdreflect.com/resources

ADHD Reflect`,
    },
  ],

  // ─── Escaper ───
  escaper: [
    // Escaper, email 1, sends 1 day after signup, to Escaper subscribers
    {
      key: 'escaper-1',
      subject: `Reading this in the bathroom?`,
      text: `Maybe you're hiding in the bathroom. Maybe it's behind your phone. Maybe you're in the room, but mentally somewhere near Toowoomba.

The Escaper pattern often shows up when the demands have outrun your capacity. You go quiet, scroll, shut down or develop a sudden need to reorganise something in another room.

It doesn't mean you don't care. It may mean you've run out of room.

This week, see if you notice yourself leaving. You don't have to stop it on command. A quiet "oh, I'm escaping" gives you somewhere to begin.

More on what can happen when an overloaded brain checks out:
https://adhdreflect.com/guides/g01

ADHD Reflect`,
    },
    // Escaper, email 2, sends 8 days after signup, to Escaper subscribers
    {
      key: 'escaper-2',
      subject: `Take five. Then come back.`,
      text: `Trying never to escape is a big job. Practising the return is smaller.

When you notice yourself disappearing into the phone, the bathroom or the shutdown, try saying: "I need five minutes. I'll come back."

Then take the five minutes. Properly. When they're up, put the phone down, walk back in and say, "I'm back."

You may need longer than five. Say that too. The useful bit is making the break visible and making the return real.

If depletion is behind a lot of your escapes:
https://adhdreflect.com/guides/g15

ADHD Reflect`,
    },
    // Escaper, email 3, sends 15 days after signup, to Escaper subscribers
    {
      key: 'escaper-3',
      subject: `What are you getting away from?`,
      text: `The scroll is often getting you away from something: a conversation, a feeling, a task with no obvious first step, the possibility of another fight.

If you can, name the thing:

"I don't want to start bedtime."
"I don't want to feel guilty."
"I can't face the homework argument."

Naming it won't make you keen. It may make the next choice clearer: take a break, ask for help, shrink the task or decide when you'll return to it.

Both of You has two modules for Escapers: one on leaving while you're still physically there, and one on making a small return when you have almost nothing left. They're here:
https://adhdreflect.com/grow

If you're running on empty:
https://adhdreflect.com/guides/g15

ADHD Reflect`,
    },
    // Escaper, email 4, sends 22 days after signup, to Escaper subscribers
    {
      key: 'escaper-4',
      subject: `Coming back is a skill`,
      text: `You may always want the exit when your capacity is low. The useful change isn't never leaving. It's making the exits shorter, clearer and less lonely for everyone else.

You reached for the phone, but put it down sooner. You checked out, then said you needed a break. You avoided the conversation, but came back to it that evening.

The return is the part worth practising.

Both of You covers the partner dynamic, what checking out can feel like for your child, and ways to make returning easier. It's twenty short modules, all text, made to work in fragments:
https://adhdreflect.com/grow

If checking out has become the main way you're getting through, you can find professional support here:
https://adhdreflect.com/resources

ADHD Reflect`,
    },
  ],
};
