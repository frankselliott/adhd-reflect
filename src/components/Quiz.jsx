import { useState, useRef, useEffect } from 'react';

import { CARDS } from '../data/cards.js';
import { TYPE_TO_GUIDES } from '../data/mappings.js';
import { TOPIC_GUIDES } from '../data/topicGuides.js';
import { PATTERN_ICONS, PATTERN_COLORS } from './PatternIcons.jsx';

/* ═══════════════════════════════════════════
   ADHD Reflect: Parenting Pattern Quiz
   Source: Quiz Production Design doc
   ═══════════════════════════════════════════ */

const QUESTIONS = [
  { id: 1, pattern: 'reactor', text: "When my child keeps repeating a demand or ignores a clear instruction, I feel my body react before my brain has decided anything: a flash of heat, a sharpening of my voice, a sudden urge for it to stop." },
  { id: 2, pattern: 'reactor', text: "Noise, mess, multiple people talking, or too many things happening at once can flip a switch in me. Suddenly I need the whole environment to go quiet before I can do anything." },
  { id: 3, pattern: 'reactor', text: "When I've been patient for a stretch and then snap, it feels like I went from calm to fully reactive with nothing in between. No warning, no runway, just the reaction." },
  { id: 4, pattern: 'juggler', text: "I forget things that genuinely matter to my child, like signed forms, promised plans and appointments. Not because I don't care, but because they fall out of my working memory before I can act on them." },
  { id: 5, pattern: 'juggler', text: "I build new systems or routines when old ones collapse, then the new ones collapse too. I'm always in the process of rebuilding, not maintaining." },
  { id: 6, pattern: 'looper', text: "When my child pushes back or refuses to accept what I've said, I feel pulled to explain, justify or prove my point, even when I can see it's making things worse." },
  { id: 7, pattern: 'looper', text: "I can find myself in a back-and-forth with a dysregulated child, still reasoning, still correcting, still trying to make them understand, when part of me knows they can't actually hear me right now." },
  { id: 8, pattern: 'spiraller', text: "After a hard moment with my child, I replay it in detail for a long time afterward. Exactly what I said, how their face looked, what it means about the kind of parent I am." },
  { id: 9, pattern: 'spiraller', text: "After I lose it, I find the guilt about what happened harder to manage than figuring out what to do next. The shame takes up more space than the repair." },
  { id: 10, pattern: 'escaper', text: "When things get too big at home, with too much noise, too many demands or too much conflict, I go quiet, drift to my phone, or emotionally leave the room even when I'm still physically there." },
  { id: 11, pattern: 'escaper', text: "After a hard family moment I sometimes avoid coming back in. Not because I don't want to reconnect, but because getting back into the situation feels like it requires more than I have." },
  { id: 12, pattern: 'partner', text: "My parenting is harder when I feel judged, misunderstood, or unsupported by my partner or co-parent in how I handle my child." },
];

const SCALE = [
  { label: 'Never', value: 0 },
  { label: 'Rarely', value: 1 },
  { label: 'Sometimes', value: 2 },
  { label: 'Often', value: 3 },
  { label: 'Very often', value: 4 },
];

const PATTERNS = {
  reactor: { name: 'The Overloaded Reactor', max: 12, questions: [1,2,3] },
  juggler: { name: 'The Chaos Juggler', max: 8, questions: [4,5] },
  looper: { name: 'The Argument Looper', max: 8, questions: [6,7] },
  spiraller: { name: 'The Shame Spiraller', max: 8, questions: [8,9] },
  escaper: { name: 'The Shutdown Escaper', max: 8, questions: [10,11] },
};

const RESULTS = {
  reactor: {
    validating: "You don't lose it because you're angry. You lose it because your nervous system runs out of runway before your parenting brain can catch up.",
    familiar: [
      "You ask calmly, once, twice, three times. Then something snaps and you're at full volume before you know it happened",
      "You feel flooded: a wave of heat, tightness, or intensity that arrives before you've decided to react",
      "Noise, mess, multiple demands, or a child who won't stop. Any of these can compress your window to almost nothing",
      "Afterward, you feel the gap between who you were two minutes ago and who you just were, and it's genuinely disorienting",
      "You can hold it together for weeks and then fall apart over something small, and that inconsistency confuses the people around you",
    ],
    happening: "Your brain processes incoming demands and sensory information faster than it processes the signal to pause. When load builds through noise, time pressure, refusal or accumulated stress, your nervous system moves into a mode that prioritises stopping the stimulus over anything else. The reaction isn't the problem. The missing runway is.\n\nADHD brains have shorter windows between trigger and reaction than neurotypical brains, not because of character or anger, but because the regulatory mechanism that creates the pause is neurologically less reliable. You're not going from 0 to 100 because you're impatient. You're going from 0 to 100 because the buffer between them is smaller.",
    child: "They experience the volume and intensity before they understand the reason. If your child also has ADHD, their own dysregulated brain may register your tone as a threat and escalate rather than comply. The opposite of what you needed. They're not being defiant. Their nervous system is responding to yours.\n\nThe hard truth is that two reactive nervous systems in the same room will almost always amplify each other. This isn't anyone's fault. It is, however, something you can design around.",
    partner: "They see the reaction. They don't see the thirty minutes of accumulated load that preceded it. They may read your snap as disproportionate, unpredictable or aggressive, because from their vantage point everything was fine and then suddenly it wasn't.\n\nWhat they missed: the noise that had been too loud for twenty minutes. The transition that didn't happen cleanly. The instruction repeated four times. The thing at work that hadn't resolved. They see the match. They don't see what was already burning.",
    partnerPressure: "You're also managing the awareness that how you react will be assessed. That meta-monitoring is itself an additional cognitive load, which makes the reaction more likely, not less.",
    practice: "This week, don't try to become a calmer person. Try one thing: lower the input before you correct the behaviour.\n\nBefore you say anything in response to the behaviour, remove one source of load from the environment. Turn something off. Move into a quieter room. Create five seconds of physical space. Use fewer words than you think you need.\n\nYou're not trying to be calm. You're trying to reduce what your nervous system is processing before you add more to it.",
    script: "\"I need one second.\" Then one change to the environment. Then, and only then, address the behaviour.",
    cards: [
      "When their meltdown triggers yours",
      "When you said the thing that caused real damage",
      "The after-school collision, where their decompression meets your mask drop",
    ],
  },
  juggler: {
    validating: "You're not failing because you need more discipline. You're failing because parenting has more hidden steps than any executive function system was designed to carry.",
    familiar: [
      "The signed form that lived in your bag for a week and then you found it after the deadline",
      "The birthday party you forgot to RSVP to until the day before",
      "The consequence you set on Monday that you genuinely couldn't remember by Wednesday",
      "The new system (the whiteboard, the app, the shared calendar) that worked for eleven days before it collapsed",
      "Promising something to your child and then feeling the weight of their disappointment when you didn't follow through, not because you didn't care, but because you lost it",
    ],
    happening: "Parenting has an enormous invisible overhead. There are dates, commitments, routines, consequences, relationship debts, logistics and transitions to track, and most of them don't exist in a visible system. They live in working memory. ADHD working memory is not built for this.\n\nThe collapse isn't a character flaw. It's a structural mismatch between what parenting requires and what the ADHD executive function system reliably provides. You're not rebuilding systems because you're lazy. You're rebuilding them because you need external structures to hold what a neurotypical brain might hold internally. Keeping those structures maintained is itself a task that requires working memory.",
    child: "Inconsistency is confusing for any child. For an ADHD child, who already struggles to predict their own reactions, a parent whose rules and follow-through vary can make the environment feel less safe than it needs to feel. This isn't about trust in the relationship. They know you love them. It's about whether the environment is predictable enough for them to regulate inside it.\n\nThe goal isn't perfect consistency. It's enough consistency that your child has a reliable enough map of what to expect.",
    partner: "They may experience your forgotten commitments as not caring, or your pattern of starting-and-not-finishing as unreliability. They probably pick up the tracking they can see has been dropped, like the forms, the appointments and the follow-through on consequences, and this creates an invisible load imbalance they may be quietly resentful about.\n\nWhat they missed: how much cognitive effort you're expending just to stay at the surface. The tracking you are doing. The attempts to build systems that they may not have noticed because they only see the collapses. The shame that follows each one.",
    partnerPressure: "You're also acutely aware that the gaps get noticed and assessed, which adds a monitoring layer on top of the already overloaded system.",
    practice: "Don't build a new system this week. Instead, make one existing thing visible.\n\nPick the one parenting commitment most likely to fall through the cracks in the next seven days. Write it somewhere you will actually see it. Not on your phone, not in a document, but physically visible in the space where you'll need it. One thing. Externally anchored. That's it.\n\nThe goal is not a functional family logistics system. The goal is to prove to yourself that one external anchor works. You build from that.",
    script: "\"I missed that. I'm going to write it down right now so it doesn't happen again.\" Not self-punishment. Not a promise that might not hold. One concrete action, immediately.",
    cards: [
      "Forgetting something that genuinely mattered to your kid",
      "Losing the paperwork, the date, the appointment",
      "Cancelling something you'd promised because you got overwhelmed",
    ],
  },
  looper: {
    validating: "Your brain wants logic, fairness and resolution. Your child's brain, especially during dysregulation, can't receive any of that right now. The argument is real. The timing is wrong.",
    familiar: [
      "You find yourself explaining the same thing a third time, aware that it's not working, unable to stop",
      "You feel a strong pull toward making your child understand the reason for a rule or consequence, not just comply with it",
      "When they push back, your instinct is to engage: to counter their argument, to address the unfairness they're claiming, to correct the factual error in what they said",
      "You end up in extended negotiations over things that shouldn't be negotiable",
      "Afterward, you can see exactly where it went off the rails and why it didn't need to, but in the moment getting out of the loop felt impossible",
    ],
    happening: "ADHD brains often have a strong justice sensitivity and a need for cognitive closure, the sense that a thing has been properly resolved. When your child challenges a decision, your brain doesn't just hear a child being difficult; it hears an unresolved problem that requires a response. The impulsivity that drives the engagement is neurological, not a choice.\n\nThe additional layer: your child almost certainly has the same drive. An ADHD child arguing back isn't being strategic. They're also experiencing an unresolved problem that needs closure. Two people with ADHD who both need closure, arguing, will not find it together. The loop runs because both nervous systems are seeking a resolution that the format of the argument cannot produce.",
    child: "When they're dysregulated, their brain can process tone and volume but not complex reasoning. The words of your explanation don't land as information. They land as more input, more intensity, more of what they need to push back against. The longer the argument runs, the further they get from the regulated state in which they could actually hear you.\n\nThey're not winning on purpose. They're doing what their nervous system does when it's overwhelmed and receiving pressure.",
    partner: "They may see you escalating a situation that seemed manageable, getting drawn into a debate with a seven-year-old about the fairness of screen time limits. From outside, it can look like you're refusing to use your authority. Or that you're over-explaining in a way that undermines the boundary.\n\nWhat they missed: the pull. The neurological imperative to engage. The fact that walking away from an unresolved argument with your ADHD brain feels almost physically uncomfortable, similar to leaving a sentence half-finished. This isn't stubbornness. It's how your brain is wired.",
    partnerPressure: "Being observed in an argument loop may increase the pressure to resolve it, either by winning it or by capitulating. Both responses reward the wrong behaviour and extend the loop.",
    practice: "Learn and use one stop-script. Not a full explanation. Not a consequence announcement. One sentence that ends your involvement and holds the boundary.\n\nSay it once. Then physically move. Leave the room, turn back to something else, pick up a glass of water. The movement is part of the practice. Your nervous system will interpret physical disengagement as a signal to stop seeking closure.\n\nThe lesson that would have taken the argument twenty minutes to fail to deliver? Wait. Deliver it twelve hours later, when both of you are regulated. It will land in two minutes.",
    script: "\"We're not talking about this right now.\" Or: \"I've said what I needed to say. I'm done talking about it.\" Or: \"My answer isn't changing. We're done.\"",
    cards: [
      "When they won't follow instructions or seem to be ignoring you",
      "When you lectured instead of stopping",
      "When the escalation won't stop and neither of you can",
    ],
  },
  spiraller: {
    validating: "Your biggest problem after a hard moment is probably not the moment itself. It's the spiral that starts after it. The one that consumes the energy you needed to make the repair.",
    familiar: [
      "You lose it, and then you spend the next two hours replaying exactly what you said and what their face did",
      "\"What kind of parent does that\" is a thought you have often",
      "You apologise, sometimes excessively, in a way that asks your child to reassure you rather than the other way around",
      "You make an extra-warm gesture right after a blow-up, not just to reconnect, but because you need to see in their face that you haven't broken something permanent",
      "You find it harder to approach repair not because you don't want to repair, but because the thought of it re-opens the shame",
    ],
    happening: "ADHD is linked to heightened rejection sensitivity and a longer emotional hangover after distressing events, where emotions take longer to return to baseline than they do for neurotypical adults. The shame spiral isn't self-indulgence. It's your nervous system staying activated long after the triggering event has passed.\n\nThe spiral serves a function: at some level, the rumination feels like accountability. As though if you think about it for long enough and feel bad enough about it, you'll have paid for it and it won't happen again. But that's not how behaviour change works. The energy going into the spiral is energy not going into the repair, and it's the repair that actually changes the relationship.",
    child: "They experience the blow-up, then the tense silence while you're inside the spiral, then possibly your over-reach for warmth or reassurance. What they're less likely to experience is a clean, simple repair: a brief, direct acknowledgment and a small act of reconnection. The shame makes it hard to approach the moment simply.\n\nChildren are not fragile. They can repair from hard moments when the repair is consistent. What they find harder is the unpredictability of the cycle: intensity, then withdrawal, then over-warmth, then the next intensity. The spiral makes that cycle less visible to you and harder to break.",
    partner: "They see the blow-up. They may also see what looks like moving on too quickly, or excessive apology, or warmth that seems disproportionate to what just happened. They may not understand why, three days later, you're still quietly subdued about a moment that from their view has been addressed.\n\nWhat they missed: the private inventory. The way you've been running through it in the background. The amount of cognitive space the spiral is occupying. They may have thought you were fine because you functioned. You made dinner, answered work emails, put the kids to bed. But you were running with a significant background load.",
    partnerPressure: "Their reaction to the blow-up, whether they intervened, went quiet, or commented, may itself have become part of what you're replaying. That's worth noticing. You may be managing guilt about the incident and a separate wound about their response to it.",
    practice: "Learn a two-sentence repair. Not a speech. Not an apology that needs their response. Two sentences, delivered when both of you are calm.\n\nThe format: One sentence that names what happened. One sentence that names what you're going to try.\n\nThen stop. Don't wait for absolution. Don't ask if they're okay with it. Don't explain further. Two sentences and a normal interaction immediately after. Sit with them, get them a snack, help with something. The repair is in the return to normal, not in the speech.\n\nThe spiral wants you to do more. The repair needs less than you think.",
    script: "\"I yelled this morning and I shouldn't have. I'm going to work on pausing before I get to that point.\"",
    cards: [
      "The shame spiral after losing it",
      "Overcorrecting with affection right after losing it",
      "When you said the thing that caused real damage",
    ],
  },
  escaper: {
    validating: "Your system isn't failing. It's protecting you. The work isn't to make yourself endlessly available. It's to learn how to come back in a way that's small enough to actually happen.",
    familiar: [
      "When the house gets too loud, too demanding, or too conflicted, you find yourself somewhere else in your head, on your phone, thinking about something else, doing something peripheral, while the situation continues around you",
      "You don't decide to check out. You notice, afterward, that you did",
      "After a hard moment you may avoid re-entering. Not because you don't love your child, but because getting back in feels like it requires something you don't currently have",
      "You can feel your child needing you and simultaneously feel completely unable to move toward them",
      "The guilt about the shutdown compounds the exhaustion that caused it",
    ],
    happening: "When sensory and emotional load exceeds a threshold, the ADHD nervous system sometimes defaults to reduction of engagement rather than escalation. It's the opposite of the Overloaded Reactor pattern, but driven by the same core mechanism: the regulatory system is overwhelmed. Withdrawal is a form of self-protection.\n\nThe phone isn't the cause of the pattern. It's what you reach for because it provides a specific kind of low-demand input (predictable, controlled, exit-able) that your nervous system finds more manageable than the unpredictable demands of a family environment mid-crisis.\n\nThe shutdown prevents escalation in the short term. What it doesn't do is provide connection, repair, or any of the co-regulation your child may need from you in that moment.",
    child: "Your child, especially if they also have ADHD, has a nervous system that is highly attuned to parental availability. When you're physically present but emotionally gone, they feel the absence. Some children will escalate to try to bring you back. Others will go quiet in a way that looks cooperative but is closer to shutdown themselves.\n\nIf your child keeps acting out specifically when you're on your phone or visibly disengaged, this is likely what's happening: their nervous system is trying to restore connection through the only mechanism available to them.",
    partner: "They see you on your phone while the situation continues. They see you leave the room when they expected you to stay. From their view, you're opting out, choosing not to engage at a moment when you're clearly needed.\n\nWhat they missed: the state you were already in before the moment they observed. The fact that you were trying to prevent an escalation by reducing your own input, not opting out of responsibility. The difference between \"not caring\" and \"temporarily out of capacity.\"",
    partnerPressure: "You may be carrying an additional cost: the awareness that your shutdown was seen and is being silently assessed. This assessment becomes its own reason to avoid re-entry, because coming back also means acknowledging what happened.",
    practice: "Learn one re-entry ritual. Not a full return to engagement. A signal, to yourself and to your child, that you're coming back.\n\nOptions: sit near them without speaking, for thirty seconds. Or a low-demand offer: \"Do you want some water?\" A small, easy thing that re-establishes contact without requiring emotional availability you don't yet have. Or name the transition: \"I needed a minute. I'm back.\"\n\nThe re-entry ritual doesn't resolve the situation. It bridges the gap between shutdown and re-engagement, which is the hardest step.",
    script: "\"I needed a minute. I'm back.\" Or: \"Do you want some water?\"",
    cards: [
      "When you checked your phone and they acted out to get you back",
      "Shutting down and going cold",
      "Leaving when you should have stayed",
    ],
  },
};

// ─── Scoring ───
function calculateResults(answers) {
  const patternScores = {};
  for (const [key, p] of Object.entries(PATTERNS)) {
    const raw = p.questions.reduce((sum, qId) => sum + (answers[qId] || 0), 0);
    patternScores[key] = { raw, pct: Math.round((raw / p.max) * 100) };
  }

  const sorted = Object.entries(patternScores).sort((a, b) => b[1].pct - a[1].pct);
  const primary = sorted[0][0];
  const primaryPct = sorted[0][1].pct;

  let secondary = null;
  const secondaryPct = sorted[1][1].pct;
  if (secondaryPct >= 50) {
    secondary = sorted[1][0];
  }

  // Tie-breaking: within 5 percentage points
  const isTie = Math.abs(primaryPct - secondaryPct) <= 5 && secondaryPct >= 50;

  const partnerPressure = (answers[12] || 0) >= 3;

  return { primary, secondary, isTie, partnerPressure, scores: patternScores };
}

// ─── Styles ───
const styles = {
  container: { maxWidth: 720, margin: '0 auto', padding: '0 24px' },
  intro: { paddingTop: 64, paddingBottom: 48 },
  label: { fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 16 },
  title: { fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, lineHeight: 1.15, color: 'var(--slate)', marginBottom: 16, fontVariationSettings: '"opsz" 48' },
  titleEm: { fontStyle: 'italic', color: 'var(--blue)' },
  body: { fontSize: 17, lineHeight: 1.6, color: 'var(--pewter)', maxWidth: 520, marginBottom: 24 },
  framing: { fontSize: 15, lineHeight: 1.65, color: 'var(--pewter)', background: 'white', borderRadius: 16, border: '1px solid rgba(31,42,55,0.08)', padding: 24, marginBottom: 32 },
  startBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--sans)', fontSize: 17, fontWeight: 600, padding: '14px 28px', borderRadius: 100, border: 'none', cursor: 'pointer', background: 'var(--blue)', color: 'white', minHeight: 48, transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)' },

  // Question
  questionWrap: { paddingTop: 48, paddingBottom: 96 },
  progress: { fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--pewter)', opacity: 0.6, marginBottom: 8 },
  progressBar: { height: 3, background: 'rgba(31,42,55,0.06)', borderRadius: 2, marginBottom: 32, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'var(--blue)', borderRadius: 2, transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)' },
  questionText: { fontFamily: 'var(--serif)', fontSize: 'clamp(19px, 3vw, 24px)', fontWeight: 300, lineHeight: 1.4, color: 'var(--slate)', marginBottom: 32, fontVariationSettings: '"opsz" 30' },
  scaleWrap: { display: 'flex', flexDirection: 'column', gap: 10 },
  scaleBtn: (selected) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 20px', borderRadius: 12,
    border: selected ? '1.5px solid var(--blue)' : '1.5px solid rgba(31,42,55,0.08)',
    background: selected ? 'rgba(74,111,165,0.06)' : 'white',
    cursor: 'pointer', transition: 'all 0.15s ease',
    fontFamily: 'var(--sans)', fontSize: 16, color: selected ? 'var(--blue)' : 'var(--slate)',
    fontWeight: selected ? 500 : 400, minHeight: 48, textAlign: 'left',
  }),
  scaleDot: (selected) => ({
    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
    border: selected ? '6px solid var(--blue)' : '2px solid rgba(31,42,55,0.15)',
    transition: 'all 0.15s ease',
  }),
  navRow: { display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 12 },
  backBtn: { fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--pewter)', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0', minHeight: 44 },
  nextBtn: (disabled) => ({
    fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, padding: '12px 28px', borderRadius: 100,
    border: 'none', cursor: disabled ? 'default' : 'pointer', minHeight: 48,
    background: disabled ? 'rgba(31,42,55,0.08)' : 'var(--blue)',
    color: disabled ? 'var(--pewter)' : 'white',
    transition: 'all 0.2s ease', opacity: disabled ? 0.5 : 1,
  }),

  // Result
  resultWrap: { paddingTop: 48, paddingBottom: 96 },
  resultLabel: { fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--sage-dark, #7FA88E)', marginBottom: 8 },
  resultName: { fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 300, lineHeight: 1.15, color: 'var(--slate)', marginBottom: 16, fontVariationSettings: '"opsz" 48' },
  resultValidating: { fontSize: 18, lineHeight: 1.6, color: 'var(--pewter)', marginBottom: 32, maxWidth: 560 },
  secondaryBox: { background: 'var(--mist, #EDEFEE)', borderRadius: 12, padding: '16px 20px', marginBottom: 32, fontSize: 15, lineHeight: 1.6, color: 'var(--pewter)' },
  sectionTitle: { fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400, lineHeight: 1.3, color: 'var(--slate)', marginTop: 40, marginBottom: 16, fontVariationSettings: '"opsz" 24' },
  familiarList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 },
  familiarItem: { fontSize: 16, lineHeight: 1.6, color: 'var(--pewter)', paddingLeft: 20, borderLeft: '2px solid var(--sage, #A8C3A0)' },
  prose: { fontSize: 16, lineHeight: 1.65, color: 'var(--pewter)', marginBottom: 16, whiteSpace: 'pre-line' },
  scriptBox: { background: 'white', borderRadius: 12, border: '1px solid rgba(31,42,55,0.08)', padding: '16px 20px', fontSize: 16, lineHeight: 1.55, color: 'var(--slate)', fontStyle: 'italic', marginTop: 16, marginBottom: 16 },
  cardList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  cardItem: { fontSize: 15, color: 'var(--blue)', padding: '12px 16px', background: 'rgba(74,111,165,0.05)', borderRadius: 10, cursor: 'pointer' },
  emailBox: { background: 'white', borderRadius: 16, border: '1px solid rgba(31,42,55,0.08)', padding: 24, marginTop: 40 },
  emailTitle: { fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400, marginBottom: 8, color: 'var(--slate)' },
  emailBody: { fontSize: 15, lineHeight: 1.6, color: 'var(--pewter)', marginBottom: 16 },
  emailInput: { width: '100%', fontFamily: 'var(--sans)', fontSize: 15, padding: '12px 16px', border: '1.5px solid rgba(31,42,55,0.08)', borderRadius: 100, background: 'var(--cloud, #F7F5F0)', color: 'var(--slate)', minHeight: 48, outline: 'none', marginBottom: 10, boxSizing: 'border-box' },
  emailBtn: { width: '100%', fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, padding: '14px 28px', borderRadius: 100, border: 'none', cursor: 'pointer', background: 'var(--blue)', color: 'white', minHeight: 48 },
  emailNote: { fontSize: 13, color: 'var(--pewter)', opacity: 0.6, marginTop: 8, textAlign: 'center' },
  disclaimer: { fontSize: 13, lineHeight: 1.55, color: 'var(--pewter)', opacity: 0.6, marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(31,42,55,0.08)' },
};

// ─── Intro Screen ───
function IntroScreen({ onStart }) {
  return (
    <div style={styles.container}>
      <div style={styles.intro}>
        <p style={styles.label}>Parenting pattern quiz</p>
        <h1 style={styles.title}>
          What's your ADHD<br />parenting <span style={styles.titleEm}>pattern?</span>
        </h1>
        <p style={styles.body}>
          Find out how your ADHD shows up when parenting gets hard, and get one small weekly practice matched to the way your brain actually reacts at home.
        </p>
        <div style={styles.framing}>
          <p style={{ marginBottom: 12 }}>This isn't a diagnostic test and it won't assess your child. It's a reflective quiz designed to help you notice the patterns that show up when ADHD, stress and parenting collide.</p>
          <p style={{ marginBottom: 12 }}>Answer based on your most typical experience over the past month. Not your best week or your worst, but the week that happens most often.</p>
          <p style={{ margin: 0 }}>Twelve questions. Takes about three minutes.</p>
        </div>
        <button style={styles.startBtn} onClick={onStart}>
          Start the quiz
        </button>
      </div>
    </div>
  );
}

// ─── Question Screen ───
function PatternBars({ answers }) {
  const patterns = {
    reactor:   { label: 'reactor',   qs: [1,2,3], max: 12 },
    juggler:   { label: 'juggler',   qs: [4,5], max: 8 },
    looper:    { label: 'looper',    qs: [6,7], max: 8 },
    spiraller: { label: 'spiraller', qs: [8,9], max: 8 },
    escaper:   { label: 'escaper',   qs: [10,11], max: 8 },
  };
  
  const scores = Object.entries(patterns).map(([key, p]) => {
    const raw = p.qs.reduce((sum, qId) => sum + (answers[qId] || 0), 0);
    const answeredCount = p.qs.filter(qId => answers[qId] !== undefined).length;
    return { key, label: p.label, pct: answeredCount > 0 ? Math.round((raw / p.max) * 100) : 0, color: PATTERN_COLORS[key] };
  });

  const anyAnswered = scores.some(s => s.pct > 0);
  if (!anyAnswered) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: '#A09589', marginBottom: 10,
      }}>your pattern so far</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {scores.map(s => (
          <div key={s.key} style={{ flex: 1 }}>
            <div style={{
              height: 4, borderRadius: 2, background: 'rgba(25,23,20,0.06)',
              overflow: 'hidden', marginBottom: 4,
            }}>
              <div style={{
                height: '100%', borderRadius: 2, background: s.color,
                width: s.pct + '%', transition: 'width 0.4s ease',
                opacity: 0.7,
              }} />
            </div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.08em',
              color: s.pct > 30 ? s.color : '#A09589', textAlign: 'center',
            }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionScreen({ question, index, total, answer, onAnswer, onNext, onBack, answers }) {
  return (
    <div style={styles.container}>
      <div style={styles.questionWrap}>
        <p style={styles.progress}>Question {index + 1} of {total}</p>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${((index + 1) / total) * 100}%` }} />
        </div>
        <PatternBars answers={answers} />
        <p style={styles.questionText}>{question.text}</p>
        <div style={styles.scaleWrap}>
          {SCALE.map(s => (
            <button
              key={s.value}
              style={styles.scaleBtn(answer === s.value)}
              onClick={() => onAnswer(question.id, s.value)}
            >
              <span style={styles.scaleDot(answer === s.value)} />
              {s.label}
            </button>
          ))}
        </div>
        <div style={styles.navRow}>
          <button style={styles.backBtn} onClick={onBack}>
            {index === 0 ? '← Back' : '← Previous'}
          </button>
          <button
            style={styles.nextBtn(answer === undefined)}
            onClick={onNext}
            disabled={answer === undefined}
          >
            {index === total - 1 ? 'See my pattern' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Result Screen ───
function ResultScreen({ results }) {
  const { primary, secondary, isTie, partnerPressure } = results;
  const r = RESULTS[primary];
  const patternName = PATTERNS[primary].name;
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div style={styles.container} ref={topRef}>
      <div style={styles.resultWrap}>
        <p style={styles.resultLabel}>Your pattern</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          {(() => {
            const Icon = PATTERN_ICONS[primary];
            return Icon ? <Icon size={56} color={PATTERN_COLORS[primary]} /> : null;
          })()}
          <h1 style={{...styles.resultName, marginBottom: 0}}>{patternName}</h1>
        </div>
        <p style={styles.resultValidating}>{r.validating}</p>

        {/* Secondary + tie + partner pressure */}
        {secondary && (
          <div style={styles.secondaryBox}>
            {isTie ? (
              <p style={{ margin: 0 }}><strong>You're split between two patterns.</strong> Your primary pattern is {patternName}, but {PATTERNS[secondary].name} scored almost equally. This means both dynamics are active for you. Read both result descriptions to see the full picture.</p>
            ) : (
              <p style={{ margin: 0 }}><strong>Your secondary pattern:</strong> {PATTERNS[secondary].name}. This pattern is also active for you, though less dominant than your primary.</p>
            )}
          </div>
        )}
        {partnerPressure && (
          <div style={{ ...styles.secondaryBox, background: 'rgba(232,168,124,0.08)' }}>
            <p style={{ margin: 0 }}><strong>Partner pressure is a factor.</strong> Your answers suggest that feeling judged, misunderstood or unsupported by your partner or co-parent adds a significant layer to how your pattern plays out.</p>
          </div>
        )}

        {/* This might sound familiar */}
        <h2 style={styles.sectionTitle}>This might sound familiar</h2>
        <ul style={styles.familiarList}>
          {r.familiar.map((item, i) => (
            <li key={i} style={styles.familiarItem}>{item}</li>
          ))}
        </ul>

        {/* What's actually happening */}
        <h2 style={styles.sectionTitle}>What's actually happening</h2>
        <p style={styles.prose}>{r.happening}</p>

        {/* How your child experiences it */}
        <h2 style={styles.sectionTitle}>How your child experiences it</h2>
        <p style={styles.prose}>{r.child}</p>

        {/* What your partner often misses */}
        <h2 style={styles.sectionTitle}>What your partner or co-parent often misses</h2>
        <p style={styles.prose}>{r.partner}</p>
        {partnerPressure && <p style={styles.prose}>{r.partnerPressure}</p>}

        {/* Your first practice */}
        <h2 style={styles.sectionTitle}>Your first practice</h2>
        <p style={styles.prose}>{r.practice}</p>
        <div style={styles.scriptBox}>{r.script}</div>

        {/* Guides for your pattern */}
        <h2 style={styles.sectionTitle}>Guides for your pattern</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {(() => {
            const guideIds = TYPE_TO_GUIDES[primary] || [];
            const guidesMap = Object.fromEntries((TOPIC_GUIDES || []).map(g => [g.id, g]));
            return guideIds.slice(0, 6).map(id => {
              const g = guidesMap[id];
              if (!g) return null;
              return (
                <a key={id} href={'/guides/' + id} style={{
                  display: 'block', padding: '14px 18px', borderRadius: 12,
                  background: 'rgba(75,107,78,0.05)',
                  border: '1px solid rgba(75,107,78,0.1)',
                  textDecoration: 'none', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(75,107,78,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(75,107,78,0.05)'}
                >
                  <span style={{
                    fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 16, "wght" 440',
                    fontSize: 16, lineHeight: 1.4, color: '#191714',
                  }}>{g.title}</span>
                </a>
              );
            });
          })()}
        </div>

        {/* Email signup for 4-week practice sequence */}
        <div style={styles.emailBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            {(() => {
              const Icon = PATTERN_ICONS[primary];
              return Icon ? <Icon size={32} color={PATTERN_COLORS[primary]} /> : null;
            })()}
            <h3 style={{...styles.emailTitle, marginBottom: 0}}>Get your {patternName} practice plan</h3>
          </div>
          <p style={styles.emailBody}>Four weeks of small, specific practices matched to the way your ADHD actually shows up at home. One email a week. Each one takes under five minutes. Built for {patternName}s, not generic parents.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: PATTERN_COLORS[primary] }}>week 1</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 14, color: '#6B6358' }}>Noticing the pattern</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: PATTERN_COLORS[primary] }}>week 2</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 14, color: '#6B6358' }}>The first interrupt</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: PATTERN_COLORS[primary] }}>week 3</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 14, color: '#6B6358' }}>The repair practice</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: PATTERN_COLORS[primary] }}>week 4</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 14, color: '#6B6358' }}>Making it stick</span>
            </div>
          </div>
          {/* Replace with ConvertKit or email provider embed */}
          <input style={styles.emailInput} type="email" placeholder="your@email.com" id="quiz-email" />
          <button style={styles.emailBtn} data-signup-btn onClick={async () => {
            const emailEl = document.getElementById('quiz-email');
            const email = emailEl?.value;
            if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
            const btn = document.querySelector('[data-signup-btn]');
            if (btn) { btn.textContent = 'Signing up...'; btn.disabled = true; }
            try {
              const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, pattern: primary }),
              });
              const data = await res.json();
              if (data.success) {
                if (btn) btn.textContent = 'You are in!';
                if (emailEl) emailEl.style.display = 'none';
                try { localStorage.setItem('adhd-reflect-email-signup', JSON.stringify({ email, pattern: primary, timestamp: Date.now() })); } catch(e) {}
              } else {
                if (btn) { btn.textContent = 'Try again'; btn.disabled = false; }
              }
            } catch(e) {
              if (btn) { btn.textContent = 'Try again'; btn.disabled = false; }
            }
          }}>Send me my practice plan</button>
          <p style={styles.emailNote}>Free. Four emails over four weeks. Then one per week if you want it. Unsubscribe anytime.</p>
        </div>

        {/* Disclaimer */}
        <p style={styles.disclaimer}>
          This quiz is a reflective tool, not a clinical assessment. It does not diagnose ADHD, assess your child, or replace professional support. If you or your child are in crisis, please visit our <a href="/legal/safety" style={{ color: 'var(--pewter)' }}>safety page</a> for support options.
        </p>
      </div>
    </div>
  );
}

// ─── Main Quiz Component ───
export default function Quiz() {
  const [screen, setScreen] = useState('intro'); // 'intro' | 'questions' | 'result'
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  function handleAnswer(qId, value) {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }

  function handleNext() {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const r = calculateResults(answers);
      setResults(r);
      setScreen('result');
      // Store for personalized guide suggestions
      try {
        localStorage.setItem('adhd-reflect-quiz-result', JSON.stringify({
          primary: r.primary,
          secondary: r.secondary,
          partnerPressure: r.partnerPressure,
          scores: r.scores,
          timestamp: Date.now(),
        }));
      } catch(e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setScreen('intro');
    }
  }

  if (screen === 'intro') {
    return <IntroScreen onStart={() => { setScreen('questions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />;
  }

  if (screen === 'result' && results) {
    return <ResultScreen results={results} />;
  }

  const q = QUESTIONS[currentQ];
  return (
    <QuestionScreen
      question={q}
      index={currentQ}
      total={QUESTIONS.length}
      answer={answers[q.id]}
      answers={answers}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}

