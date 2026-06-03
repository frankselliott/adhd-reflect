// ADHD Reflect — Send scheduled practice emails
// Hit daily via cron: /api/send-scheduled?key=ADMIN_KEY

const EMAILS = {
  reactor: [
    {
      subject: "You yelled. Now what.",
      text: "If you are reading this, you probably yelled today. Or yesterday. Or you are saving this email for when you inevitably do.\n\nThe reactor pattern means your emotional response arrives before your thinking brain gets a vote. Heat, volume, speed. Then the shame. You know this sequence.\n\nThis week, do not try to fix it. Just notice the body signal that arrives before the yelling starts. Tight chest. Clenched jaw. Shoulders at your ears. That signal is your three-second warning system. You do not need to use it yet. Just learn what it feels like.\n\nIf you want to understand what is actually happening in your nervous system during those moments:\nhttps://adhdreflect.com/guides/g01\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "One exhale. That is the whole trick.",
      text: "You noticed the signal. The heat, the clench, the surge. Good.\n\nNow add one thing before you speak: breathe out. Not a meditation. Not a breathing exercise. One exhale through your mouth. That is it.\n\nOne exhale activates your parasympathetic nervous system. It buys you about two seconds. Two seconds is not enough to become calm. It is enough to choose a slightly different volume.\n\nIf you exhale and still yell, congratulations, you are a human being with ADHD. The practice is the exhale. The perfection is not required.\n\nMore on what happens when two nervous systems collide in the same room:\nhttps://adhdreflect.com/guides/g04\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "The twenty-second repair",
      text: "You reacted. It was too big. The guilt is doing laps.\n\nHere is the whole repair: walk to them within thirty minutes and say, \"I was too loud. That was more than you deserved. I am sorry.\"\n\nThat is it. No speech. No self-flagellation. No promise you will never do it again, because you probably will and they know it.\n\nThe return to normal is the repair. Your child does not need a perfect parent. They need a parent who comes back.\n\nIf repair after rupture is something you want to go deeper on:\nhttps://adhdreflect.com/guides/g11\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "You will still yell. You will get faster.",
      text: "Four weeks in. Here is the honest version: the reactor pattern is not going away. Your nervous system is wired this way.\n\nWhat changes is speed. The gap between the reaction and the repair gets shorter. The number of times you catch yourself before the peak goes up. Progress looks like yelling three sentences instead of ten. Repairing in ten minutes instead of three hours.\n\nThat is real progress. It just does not look like the calm-parent-influencer version of progress.\n\nIf you want more support \u2014 not the \"have you tried yoga\" kind, the actually-useful kind \u2014 we have curated resources from people who get it:\nhttps://adhdreflect.com/resources\n\nAnd if you are ready to talk to someone who specialises in ADHD families:\nhttps://adhdreflect.com/resources#therapist-directory\n\nKeep going. You are doing harder work than most people will ever understand.\n\n\u2014 ADHD Reflect"
    },
  ],
  juggler: [
    {
      subject: "You forgot something today. It is fine.",
      text: "You forgot something. Or you are about to. The permission slip, the appointment, the lunch, the thing you swore you would not forget this time.\n\nThe juggler pattern means you are carrying more than your working memory can hold, and the balls drop at the worst possible moments. Not because you do not care. Because your brain's holding capacity has a hard limit and your life exceeds it daily.\n\nThis week, try this: at the end of today, write down everything you tracked, managed, or worried about. The list will be longer than you think. That is your invisible load. Nobody else sees it.\n\nIf you want to understand why your working memory keeps betraying you:\nhttps://adhdreflect.com/guides/g02\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "One thing before the chaos",
      text: "Every morning, fourteen things compete for your attention. Your ADHD brain treats them all as equally urgent, which means none of them win.\n\nTry this: before the day starts, pick one thing. Not the most urgent. The most important. Write it on your hand if you need to. Do it first.\n\nIf you do the one thing and everything else falls apart, that is still a better day than doing fourteen things badly and the important one not at all.\n\nThe urgent things will scream regardless. The important things just quietly disappear when you are not looking.\n\nWhy time feels different for ADHD brains and what to do about it:\nhttps://adhdreflect.com/guides/g06\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "Drop something on purpose",
      text: "The juggler's secret: the skill is not carrying more. It is choosing what to put down.\n\nThis week, deliberately drop one thing. The packed lunch that could be canteen twice a week. The activity nobody enjoys. The household standard only you hold.\n\nDrop it. Watch what happens. Usually nothing. The thing you were gripping was not load-bearing. It just felt like it was.\n\nYour family needs you functional more than they need you thorough. Those two things are in competition and functional wins.\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "Systems, not willpower",
      text: "The juggler pattern does not improve with effort. It improves with infrastructure.\n\nEvery task you move from your memory to a system is one less thing your working memory has to hold. A shared calendar. A default Monday dinner. An alarm for the medication. A checklist on the back of the door.\n\nThese are not crutches. They are plumbing. Nobody carries water when pipes exist.\n\nBuild one system this week. The smallest one. Keep it simple. Complicated systems do not survive ADHD. Simple ones do.\n\nFor more strategies, our full resource library is here:\nhttps://adhdreflect.com/resources\n\nIf you want to work with someone who actually understands the juggler's load:\nhttps://adhdreflect.com/resources#therapist-directory\n\nYou are managing more than most people can see. That is not nothing.\n\n\u2014 ADHD Reflect"
    },
  ],
  looper: [
    {
      subject: "Same fight, different Tuesday",
      text: "You had the argument again. The same one. About the screen time, or the homework, or the shoes by the door. You both said the same things you said last time. It ended the same way.\n\nThe looper pattern means you get stuck in cycles. Same trigger, same reaction, same exhausted reset. Then repeat.\n\nThis week, just map one loop. Write it down: \"It started with X. I did Y. We ended up at Z.\" You do not need to fix it. Just see it. You cannot exit a loop you have not noticed.\n\nIf the argument loop is one of your regulars:\nhttps://adhdreflect.com/guides/g20\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "Change your half",
      text: "You have been trying to break the loop by fixing the trigger. If they would just stop doing the thing, you would not have to do your thing.\n\nProblem: you do not control the trigger. You control your response.\n\nThis week, when the loop starts, change one thing about your half. If you usually raise your voice, lower it. If you usually lecture, stop at one sentence. If you usually follow them, stay where you are.\n\nThe loop needs both parts. When yours changes, the loop cannot complete the same way. It might not break. But it will wobble. That wobble is progress.\n\nUnderstanding the two-nervous-system dynamic underneath the loop:\nhttps://adhdreflect.com/guides/g04\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "What the fight is actually about",
      text: "The loop ran again. But this time you saw it. That counts, even if it does not feel like it.\n\nAfter the loop finishes \u2014 not during, after \u2014 try: \"I noticed we keep landing in the same place. What is actually going on underneath this?\"\n\nThe argument about screen time is usually about control. The argument about homework is usually about adequacy. The argument about bedtime is usually about depletion. The surface issue runs the loop. The fuel is underneath.\n\nIf your partner is part of the loop, this might be useful:\nhttps://adhdreflect.com/guides/g12\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "The loop is the teacher",
      text: "Four weeks. Some loops will not stop. Some exist because ADHD creates the same conditions every day.\n\nBut you are catching the loop earlier. Exiting sooner. Recovering faster. That is the progress. Not the absence of the loop. The speed of the recognition.\n\nYou noticed on round two instead of round five. You stopped before the damage point. You named it before it became an action. That is harder than it sounds and you are doing it.\n\nIf you want more support from people who actually understand this:\nhttps://adhdreflect.com/resources\n\nIf you and your partner are stuck in a loop together and need a referee:\nhttps://adhdreflect.com/resources#therapist-directory\n\n\u2014 ADHD Reflect"
    },
  ],
  spiraller: [
    {
      subject: "It started with a forgotten lunchbox",
      text: "A forgotten lunchbox became \"I am failing them.\" A bad morning became \"they will never cope.\" A meltdown became \"what if this is who they are forever.\"\n\nThe spiraller pattern means one thought leads to the next, each darker than the last, until you are somewhere far worse than where the evidence supports.\n\nThis week, just notice the distance. When you catch yourself spiralling, write down where it started and where it took you. \"Started: forgotten lunch. Ended: they will never hold a job.\" That gap is the spiral. Seeing it is the first step to shortening it.\n\nUnderstanding the shame spiral and why your brain does this:\nhttps://adhdreflect.com/guides/g03\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "Fact or fear?",
      text: "The spiral feels like logic. Each step follows the last. But the spiral is not reasoning. It is anxiety in a logic costume.\n\nNext time you notice the spiral, ask one question: \"Is this a fact or a fear?\"\n\n\"They had a bad morning.\" Fact. \"They will never manage independently.\" Fear wearing a prediction suit.\n\nYou do not need to argue with the fear. Just label it. \"That is the spiral talking.\" The label does not make it disappear. It makes you the observer instead of the passenger.\n\nWhy rejection sensitivity makes the spiral spin faster:\nhttps://adhdreflect.com/guides/g05\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "Your brain has a selective memory",
      text: "The spiral remembers every failure and forgets every success. It is working with a biased evidence file.\n\nThis week, build a counter-file. Three things that went okay today. Not great. Okay. \"Got to school on time.\" \"Nobody cried at dinner.\" \"They read for ten minutes.\"\n\nThe spiral will tell you these do not count. They count. Write them somewhere visible. When the spiral starts, read the list. Not to feel better. To see the whole picture instead of just the dark corner.\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "You are not your worst thought",
      text: "The spirals will keep coming. ADHD rejection sensitivity means your brain reaches the worst case faster than other brains. That is wiring, not weakness.\n\nBut you are catching the spiral earlier. It reaches less depth before you notice. Recovery is faster. You spiralled to \"this is hard\" instead of \"this is hopeless.\" That is progress.\n\nYour brain will keep offering you the catastrophic version. You are learning to read it as a draft, not a final document.\n\nFor support from people who understand ADHD brains that spiral:\nhttps://adhdreflect.com/resources\n\nIf the spiralling is affecting your daily life and you want professional support:\nhttps://adhdreflect.com/resources#therapist-directory\n\nYou are doing this. Imperfectly. Which is the only way it gets done.\n\n\u2014 ADHD Reflect"
    },
  ],
  escaper: [
    {
      subject: "You are reading this from the bathroom, aren't you",
      text: "You are hiding. Maybe in the bathroom. Maybe behind your phone. Maybe you are physically present but mentally three suburbs away.\n\nThe escaper pattern means when demand exceeds capacity, your brain's first move is to leave. Not always physically. Sometimes you go quiet, check out, scroll, or suddenly become very interested in something that is not the hard thing.\n\nThis is not laziness. It is your nervous system choosing the lowest-demand option. Your brain is protecting you. Unfortunately, it is also leaving your family without you in the room.\n\nThis week, just notice the escape. Do not stop it. Notice it. \"That is the escape.\" That is the whole practice.\n\nUnderstanding what your nervous system is doing when it checks out:\nhttps://adhdreflect.com/guides/g01\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "Five minutes, then come back",
      text: "You escaped. You noticed. Good.\n\nNow try the return. Not preventing the escape. The coming back part.\n\nWhen you catch yourself in the escape \u2014 the scroll, the shutdown, the bathroom \u2014 give yourself five minutes. Deliberately. \"I am taking five minutes.\" Then come back. Put the phone down. Walk into the room. Say: \"I am back.\"\n\nFive minutes of deliberate absence is different from an hour of unconscious checkout. Same behaviour. Different awareness. Different impact.\n\nThe practice is not the escape. It is the return.\n\nIf burnout is driving the escapes:\nhttps://adhdreflect.com/guides/g15\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "Name what you are running from",
      text: "The escape is always from something. A conversation you do not want. A feeling you cannot face. A task too big to start. A conflict you do not want to enter.\n\nThis week, before you escape, name it. \"I am avoiding the bedtime conversation.\" \"I am avoiding the guilt.\" \"I am avoiding the fight about homework.\"\n\nNaming the thing does not stop the escape. It makes the escape a choice instead of a reflex. \"I am choosing to avoid this\" is different from \"I am scrolling.\" Same phone in your hand. Different level of honesty.\n\nIf you are escaping because you are completely depleted:\nhttps://adhdreflect.com/guides/g15\n\n\u2014 ADHD Reflect"
    },
    {
      subject: "Present is a practice, not a personality",
      text: "The escape impulse will not go away. When capacity is low, your brain will always prefer the door. That is wiring, not character.\n\nBut the returns are getting faster. The escapes are getting shorter. You are naming what you avoid instead of pretending you are not avoiding it.\n\nYou still reached for the phone, but five minutes instead of thirty. You still checked out, but you came back before the damage was done. You still avoided the conversation, but you had it the same day.\n\nThe escape is not the failure. The failure to return is. And you are returning.\n\nFor more support \u2014 real support, not the useless kind:\nhttps://adhdreflect.com/resources\n\nIf you want to talk to someone who understands ADHD avoidance without judging it:\nhttps://adhdreflect.com/resources#therapist-directory\n\nYou are here. You are reading this. You came back. That is the practice.\n\n\u2014 ADHD Reflect"
    },
  ],
};

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const cronKey = url.searchParams.get('key');
  if (!env.ADMIN_KEY || cronKey !== env.ADMIN_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }
  if (!env.SENDER_API_KEY || !env.SEARCH_LOGS) {
    return new Response('Not configured', { status: 500 });
  }
  const senderHeaders = {
    'Authorization': 'Bearer ' + env.SENDER_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  const list = await env.SEARCH_LOGS.list({ prefix: 'email:', limit: 500 });
  const now = new Date();
  let sent = 0, skipped = 0, errors = 0;

  for (const key of list.keys) {
    const raw = await env.SEARCH_LOGS.get(key.name);
    if (!raw) continue;
    const schedule = JSON.parse(raw);
    if (new Date(schedule.nextEmailDate) > now) { skipped++; continue; }
    if (schedule.emailsSent >= 4) { skipped++; continue; }
    const patternEmails = EMAILS[schedule.pattern];
    if (!patternEmails || !patternEmails[schedule.emailsSent]) { skipped++; continue; }
    const emailToSend = patternEmails[schedule.emailsSent];
    try {
      const sendRes = await fetch('https://api.sender.net/v2/transactional-emails/send', {
        method: 'POST', headers: senderHeaders,
        body: JSON.stringify({
          from: { name: 'ADHD Reflect', email: 'hello@adhdreflect.com' },
          to: [{ email: schedule.email }],
          subject: emailToSend.subject,
          text: emailToSend.text,
        }),
      });
      if (sendRes.ok) {
        schedule.emailsSent += 1;
        schedule.nextEmailDate = new Date(now.getTime() + 7*24*60*60*1000).toISOString();
        schedule.lastSent = now.toISOString();
        await env.SEARCH_LOGS.put(key.name, JSON.stringify(schedule), { expirationTtl: 60*60*24*60 });
        sent++;
      } else { errors++; }
    } catch (e) { errors++; }
  }
  return new Response(JSON.stringify({ sent, skipped, errors, total: list.keys.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
