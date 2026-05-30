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

