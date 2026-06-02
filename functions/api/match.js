// ADHD Reflect — AI Router
// Cloudflare Pages Function
// Matches parent input to the right card via Claude Haiku

const CARD_LIST = `
MOMENT CARDS:
m01: The morning getting ready battle
m02: The homework explosion
m03: The after-school collision — their decompression meets your mask drop
m04: The bedtime battle
m05: The car journey meltdown
m06: The public meltdown
m07: When their meltdown triggers yours
m08: When the escalation won't stop and neither of you can
m09: When they lose it over something tiny
m10: When they won't follow instructions or seem to be ignoring you
m11: When they're hyperfocused and won't stop
m12: When sibling conflict explodes
m13: When they get physical with their sibling
m14: Fine at school, falling apart at home
m15: When you said the thing that caused real damage
m16: When you lectured instead of stopping
m17: When you were too hard on your kid for something you do yourself
m18: When they keep losing or forgetting things
m19: When they can't handle losing
m20: When you checked your phone and they acted out to get you back
m22: The 5pm crash when the meds wear off
m23: They're hungry and feral now the meds are gone
m24: We're going to be late again and they're moving in slow motion
m25: Turning off the video game turned into a war
m26: They bolted in the parking lot and my heart stopped
m27: They climbed something dangerous before I could blink
m28: The whole day fell apart the second the routine changed
m29: The meltdown started over food being wrong
m30: Getting dressed became a screaming match over a sock seam
m31: Bath, shower, or teeth-brushing is a nightly fight
m32: They asked the same question fifteen times and I snapped
m33: The noise and constant talking maxed me out
m34: I'm trying to help with homework but I can't focus either
m35: They're convinced everyone hates them after one comment
m36: I corrected them gently and they completely shut down
m37: Leaving anywhere fun turns into a meltdown
m38: They're wired at 10pm and physically cannot fall asleep
m39: They lied straight to my face about something small
m40: They took something that wasn't theirs
m41: Getting out the door for the fun thing fell apart too
m42: They're melting down because they're overtired but won't admit it
m43: We're travelling and they've completely unravelled
m44: They won't stop touching their sibling and it's about to blow
m45: They're hyper and loud in public and people are staring
m46: I can't tell if this is the meds or just a bad day

PARENT-ONLY CARDS:
p01: The shame spiral after losing it
p02: Repeating your own parents' behaviour
p03: Overcorrecting with affection right after losing it
p04: Contradicting your partner in front of the kids
p05: Caving on a boundary your partner just set
p06: Snapping at your partner when it was really about your kid
p07: Losing your temper at a teacher or another parent
p08: Dragging something old into a new moment
p09: Taking the day's frustration out on your kid
p10: Shutting down and going cold
p11: Leaving when you should have stayed
p12: Pretending you didn't see what happened
p13: Letting something go you knew you shouldn't
p14: Forgetting something that genuinely mattered to your kid
p15: Losing the paperwork, the date, the appointment
p16: Starting to help and getting distracted before you finished
p17: Cancelling something you'd promised because you got overwhelmed
p18: Medication timing making home worse than work
p19: Oversharing your own problems with your child
p20: Using your kid's ADHD as cover for your own
p21: Freezing when both kids needed you at the same time
p23: I couldn't fill their prescription and tomorrow is an unmedicated day
p24: I forgot to reorder the meds in time
p25: I think I have ADHD too and it's hitting me hard
p26: Grieving the childhood I'd have had if someone had noticed
p27: A relative said it's just bad parenting
p28: I defended my kid to a relative and now there's tension
p29: I'm secretly relieved when they're at school and I hate myself for it
p30: I'm completely touched out and can't be needed for one more second
p31: I gave my other kid less because this one needed everything
p32: I keep comparing them to other kids and hating myself for it
p33: I'm scared about who they'll become
p34: I let them have too much screen time again because I had nothing left
p35: I'm exhausted from being the family's executive function
p36: I dread every school email and call
p37: I compared my parenting to the calm parent online
p38: I bribed them just to get through the moment
p39: I'm lonely and isolated in this
p40: My partner and I parent completely differently and it's splitting us
p41: I'm resentful of how much harder my life is
p42: I missed an important deadline or form for them
p43: I lost it over something tiny because the whole day had stacked up
p44: I became so controlling that I made everything worse
p45: I know I should apologise but I can't make myself do it
p46: The house is out of control and I can see the mess but can't start
p47: Am I helping my child or letting them get away with it
p48: I created chaos when things were finally calm
p49: I caught my child's mood and matched their anger instead of calming them
p50: I built a perfect system and abandoned it after three days
p51: I can't make basic parenting decisions anymore

KID-ONLY CARDS:
k01: Losing things constantly
k02: Forgetting things constantly
k03: Sensory meltdowns — food, clothes, noise, touch
k04: Won't eat most things
k05: Can't sit still at dinner
k06: Impulsive physical behaviour — running, climbing, roughhousing
k07: Falling apart over perceived failure or criticism
k08: School refusal or school anxiety
k09: Saying the wrong thing at the wrong moment
k10: Lying
k12: They won't eat on the medication and it scares me
k13: They can't fall asleep no matter what we try
k14: They have no friends and aren't getting invited
k15: They take everything personally and feel rejected constantly
k16: They blurt things out and interrupt constantly
m47: They screamed I hate you and slammed the door
m48: The playdate went wrong and the other parent saw everything
m49: The birthday party was too much and they fell apart
m50: They refused to take their medication this morning
m51: They destroyed something in anger and now everyone is in shock
m52: They exploded because I said no
m53: The school called again and I am dreading the conversation
m54: They are spiralling about something unfair and cannot let it go
m55: They came home from school and emotionally dumped everything on me
m56: The waiting room meltdown at the doctor or dentist
p52: The IEP or accommodation meeting left me feeling dismissed
p53: Both of us have ADHD and the house is in freefall
p54: I found out they have been bullied and I do not know what to do
p55: The school told me my child bullied someone
p56: Report card day and I am bracing for the worst
p57: Someone questioned whether my child really has ADHD
p58: I think there is something else going on underneath the ADHD
k32: They asked why they are different from other kids
k33: They fixate on what is unfair and cannot move past it
k34: They are anxious about tomorrow and cannot switch it off
k35: They keep saying they are bored and expecting me to fix it
k36: They were rough with the pet and did not mean to hurt it
k37: They said they have no homework when they do
k38: They copy bad behaviour from other kids then cannot stop
k39: They will not do any chores or responsibilities without a fight
k40: Consequences do not work and I do not know what else to do
k41: Rewards do not work either and now I feel out of options
k42: They say sorry and then do the same thing again
k43: They know the rule but still cannot follow it in the moment
m57: Every consequence turns into an argument or explosion
p59: I cannot tell if I am being too soft or too harsh
p60: People keep telling me to be firmer and I want to scream
m58: Taking things away just makes them angrier
k44: They waited too long to go to the toilet and now everything is a crisis
k45: I found hidden dirty underwear and I do not know how to react
k46: They will not wipe properly and I am trying not to shame them
p61: I am so tired of poop
k47: They smell bad but will not shower or use deodorant
k48: Puberty has started and hygiene is suddenly a daily fight
k49: They are old enough to do basic hygiene but still need me
p62: I resent my child and I hate that I feel that
p63: I do not like being around my child right now
p64: I am always waiting for the next explosion
p65: I am scared of my child during violent outbursts
p66: They hurt me during a meltdown and I cannot just move on
p67: They said something cruel and I cannot stop replaying it
p68: I feel numb instead of loving
p69: One bad morning from them ruins my whole day
p70: I am sick of being told to look after myself when I have nothing left
p71: My other child is getting the leftovers of me
m59: My other child is starting to hate their ADHD sibling
m60: They ruined their sibling\'s special moment again
m61: The whole family had to leave because one child could not cope
p72: We avoid normal family outings because of one child\'s triggers
p73: I protected the sibling and now I feel like I rejected my ADHD child
p74: I feel guilty when I enjoy time with my easier child
m62: My partner yells and the meltdown gets worse
p75: My partner thinks I am too soft
p76: My partner blames me for our child\'s behaviour
m63: We fight about whether this is ADHD or bad behaviour
m64: One of us stays calm and the other one escalates
p77: My partner checks out and leaves me to handle the hard parts
p78: We cannot talk about parenting without both getting defensive
k50: Other kids do not like them and I can see why
k51: They are too much for other children
k52: They boss other kids around and then feel rejected
k53: They cannot tell when the game has stopped being fun
k54: They keep annoying people after being asked to stop
k55: They are rude to adults and I feel humiliated
k56: They always need the last word
k57: They take over every conversation
k58: They are older now and the anger is bigger
k59: They want to be treated older but cannot manage basic things
k60: They refuse supports because they feel babyish
p79: Every routine still needs me to remember the routine
k17: They know what to do but they can't start
k18: Every request feels like an attack to them
k19: They hear me but they don't move
k20: They create chaos when they're bored
k21: They don't notice hunger, tiredness, or needing the toilet until it's a crisis
k22: Multi-step tasks fall apart before they finish
k23: They say they're stupid or bad
k24: They give up the second something gets hard
k25: They need constant reassurance and it never seems enough
k26: They calm down and then feel awful about what they did
k27: They can't stop one thing and start the next
k28: Busy places are too much and they shut down or explode
k29: They keep provoking their sibling even though they know it ends badly
k30: Their body is always moving and they can't make it stop
k31: Bedtime makes them more awake, not less
`.trim();

const SYSTEM_PROMPT = `You are a routing assistant for ADHD Reflect, a resource for ADHD parents raising ADHD kids.

Your ONLY job is to match a parent's description of what just happened at home to one of the pre-written cards listed below. You do NOT generate advice. You do NOT counsel. You route.

CARDS:
${CARD_LIST}

CRISIS DETECTION:
Before matching, check if the input describes:
- Intent to harm self or child
- Active abuse
- Suicidal ideation
- Immediate danger

If you detect any of these, respond ONLY with:
{"crisis": true, "message": "This sounds like it needs more than a card right now."}

MATCHING RULES:
1. ALWAYS return at least one match. Every parenting struggle connects to something in this list.
2. Match to 1-3 cards that best fit the description
3. The primary match should be the single best card
4. Think broadly: if someone describes feeling guilty, that could be shame spiral (p01). If they mention their partner, check partner cards (p04-p07). If they describe forgetting, check executive function cards (p14-p17). If they describe their child's behaviour, check kid cards (k01-k10).
5. When the description is vague or general, match to the most common patterns: m07 (meltdown triggers yours), p01 (shame spiral), m08 (escalation), m10 (won't follow instructions)
6. Only return unmatched if the input is completely unrelated to parenting (e.g. asking about the weather)
7. If the parent describes something emotional but nonspecific ("I feel terrible", "bad day"), match to the emotional cards: p01 (shame), p09 (frustration on kid), p10 (shutdown)

RESPONSE FORMAT (JSON only, no other text):
{
  "crisis": false,
  "matches": [
    {"id": "m01", "title": "The morning getting ready battle", "reason": "One sentence explaining the match"}
  ]
}

If the input is completely unrelated to parenting or ADHD:
{
  "crisis": false,
  "matches": [],
  "unmatched": true,
  "suggestion": "Brief note on why this didn't match"
}

This should almost never happen. If someone is on this site typing something, they're almost certainly describing a parenting moment. Find the closest match.

Respond ONLY with valid JSON. No preamble, no explanation, no markdown.`;

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json();
    const userInput = body.text?.trim();

    if (!userInput || userInput.length < 3) {
      return new Response(JSON.stringify({ error: 'Please describe what happened.' }), { status: 400, headers });
    }

    if (userInput.length > 1000) {
      return new Response(JSON.stringify({ error: 'Please keep it shorter.' }), { status: 400, headers });
    }

    // Cache lookup
    const cacheKey = 'cache:' + userInput.toLowerCase().trim().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').slice(0, 150);
    if (env.SEARCH_LOGS) {
      try {
        const cached = await env.SEARCH_LOGS.get(cacheKey);
        if (cached) {
          env.SEARCH_LOGS.put('search:' + Date.now() + ':' + Math.random().toString(36).slice(2,6), JSON.stringify({ query: userInput.slice(0,200), timestamp: new Date().toISOString(), matched: true, cached: true, topMatch: JSON.parse(cached).matches?.[0]?.id || null, topMatchTitle: JSON.parse(cached).matches?.[0]?.title || null }), { expirationTtl: 7776000 });
          return new Response(cached, { status: 200, headers });
        }
      } catch(e) {}
    }

    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Service not configured.' }), { status: 500, headers });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: userInput }
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Claude API error:', err);
      return new Response(JSON.stringify({ error: 'Matching service temporarily unavailable.' }), { status: 502, headers });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Parse JSON response from Claude
    let result;
    try {
      result = JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('Failed to parse Claude response:', text);
      return new Response(JSON.stringify({ error: 'Could not process the match.' }), { status: 500, headers });
    }

    // Cache + log
    if (env.SEARCH_LOGS) {
      try {
        if (!result.crisis && result.matches?.length > 0) env.SEARCH_LOGS.put(cacheKey, JSON.stringify(result), { expirationTtl: 2592000 });
        env.SEARCH_LOGS.put('search:' + Date.now() + ':' + Math.random().toString(36).slice(2,6), JSON.stringify({ query: userInput.slice(0,200), timestamp: new Date().toISOString(), matched: !result.crisis && result.matches?.length > 0, crisis: result.crisis || false, cached: false, topMatch: result.matches?.[0]?.id || null, topMatchTitle: result.matches?.[0]?.title || null }), { expirationTtl: 7776000 });
      } catch(e) {}
    }

    return new Response(JSON.stringify(result), { status: 200, headers });

  } catch (e) {
    console.error('Router error:', e);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), { status: 500, headers });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

