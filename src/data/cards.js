// ADHD Reflect — Card Library Data
// Source: Card Library doc + Additional Cards

export const CARD_TYPES = {
  moment: { label: 'Moment', description: 'Both parent and kid tab', color: '#4A6FA5' },
  parent: { label: 'Parent', description: 'Parent-only behaviours', color: '#9B8BB4' },
  kid: { label: 'Kid', description: 'Kid behaviours you\'re managing', color: '#A8C3A0' },
};

export const CATEGORIES = [
  'morning', 'homework', 'after-school', 'bedtime', 'out-and-about',
  'emotional-escalation', 'instructions', 'hyperfocus', 'siblings',
  'communication', 'losing-forgetting', 'competition', 'attention',
  'shame', 'partner', 'misfires', 'withdrawal', 'executive-function',
  'adhd-specific', 'organisation', 'sensory', 'emotional', 'social',
  'screen-time', 'avoidance', 'school',
];

export const CARDS = [
  // ─── Moment cards (20) ───
  { id: 'm01', type: 'moment', category: 'morning', title: 'The morning getting ready battle' },
  { id: 'm02', type: 'moment', category: 'homework', title: 'The homework explosion' },
  { id: 'm03', type: 'moment', category: 'after-school', title: 'The after-school collision — their decompression meets your mask drop' },
  { id: 'm04', type: 'moment', category: 'bedtime', title: 'The bedtime battle' },
  { id: 'm05', type: 'moment', category: 'out-and-about', title: 'The car journey meltdown' },
  { id: 'm06', type: 'moment', category: 'out-and-about', title: 'The public meltdown' },
  { id: 'm07', type: 'moment', category: 'emotional-escalation', title: 'When their meltdown triggers yours' },
  { id: 'm08', type: 'moment', category: 'emotional-escalation', title: "When the escalation won't stop and neither of you can" },
  { id: 'm09', type: 'moment', category: 'emotional-escalation', title: 'When they lose it over something tiny' },
  { id: 'm10', type: 'moment', category: 'instructions', title: "When they won't follow instructions or seem to be ignoring you" },
  { id: 'm11', type: 'moment', category: 'hyperfocus', title: "When they're hyperfocused and won't stop" },
  { id: 'm12', type: 'moment', category: 'siblings', title: 'When sibling conflict explodes' },
  { id: 'm13', type: 'moment', category: 'siblings', title: 'When they get physical with their sibling' },
  { id: 'm14', type: 'moment', category: 'after-school', title: 'Fine at school, falling apart at home' },
  { id: 'm15', type: 'moment', category: 'communication', title: 'When you said the thing that caused real damage' },
  { id: 'm16', type: 'moment', category: 'communication', title: 'When you lectured instead of stopping' },
  { id: 'm17', type: 'moment', category: 'communication', title: 'When you were too hard on your kid for something you do yourself' },
  { id: 'm18', type: 'moment', category: 'losing-forgetting', title: 'When they keep losing or forgetting things' },
  { id: 'm19', type: 'moment', category: 'competition', title: "When they can't handle losing" },
  { id: 'm20', type: 'moment', category: 'attention', title: 'When you checked your phone and they acted out to get you back' },
  { id: 'm21', type: 'moment', category: 'screen-time', title: 'The screen-time handoff' },

  // ─── Parent-only cards (21) ───
  { id: 'p01', type: 'parent', category: 'shame', title: 'The shame spiral after losing it' },
  { id: 'p02', type: 'parent', category: 'shame', title: "Repeating your own parents' behaviour" },
  { id: 'p03', type: 'parent', category: 'shame', title: 'Overcorrecting with affection right after losing it' },
  { id: 'p04', type: 'parent', category: 'partner', title: 'Contradicting your partner in front of the kids' },
  { id: 'p05', type: 'parent', category: 'partner', title: 'Caving on a boundary your partner just set' },
  { id: 'p06', type: 'parent', category: 'partner', title: 'Snapping at your partner when it was really about your kid' },
  { id: 'p07', type: 'parent', category: 'partner', title: 'Losing your temper at a teacher or another parent' },
  { id: 'p08', type: 'parent', category: 'misfires', title: 'Dragging something old into a new moment' },
  { id: 'p09', type: 'parent', category: 'misfires', title: "Taking the day's frustration out on your kid" },
  { id: 'p10', type: 'parent', category: 'withdrawal', title: 'Shutting down and going cold' },
  { id: 'p11', type: 'parent', category: 'withdrawal', title: 'Leaving when you should have stayed' },
  { id: 'p12', type: 'parent', category: 'withdrawal', title: "Pretending you didn't see what happened" },
  { id: 'p13', type: 'parent', category: 'withdrawal', title: "Letting something go you knew you shouldn't" },
  { id: 'p14', type: 'parent', category: 'executive-function', title: 'Forgetting something that genuinely mattered to your kid' },
  { id: 'p15', type: 'parent', category: 'executive-function', title: 'Losing the paperwork, the date, the appointment' },
  { id: 'p16', type: 'parent', category: 'executive-function', title: 'Starting to help and getting distracted before you finished' },
  { id: 'p17', type: 'parent', category: 'executive-function', title: "Cancelling something you'd promised because you got overwhelmed" },
  { id: 'p18', type: 'parent', category: 'adhd-specific', title: 'Medication timing making home worse than work' },
  { id: 'p19', type: 'parent', category: 'adhd-specific', title: 'Oversharing your own problems with your child' },
  { id: 'p20', type: 'parent', category: 'adhd-specific', title: "Using your kid's ADHD as cover for your own" },
  { id: 'p21', type: 'parent', category: 'adhd-specific', title: 'Freezing when both kids needed you at the same time' },
  { id: 'p22', type: 'parent', category: 'avoidance', title: 'The doom scroll instead of starting bedtime' },

  // ─── Kid-only cards (10) ───
  { id: 'k01', type: 'kid', category: 'organisation', title: 'Losing things constantly' },
  { id: 'k02', type: 'kid', category: 'organisation', title: 'Forgetting things constantly' },
  { id: 'k03', type: 'kid', category: 'sensory', title: 'Sensory meltdowns — food, clothes, noise, touch' },
  { id: 'k04', type: 'kid', category: 'sensory', title: "Won't eat most things" },
  { id: 'k05', type: 'kid', category: 'sensory', title: "Can't sit still at dinner" },
  { id: 'k06', type: 'kid', category: 'sensory', title: 'Impulsive physical behaviour — running, climbing, roughhousing' },
  { id: 'k07', type: 'kid', category: 'emotional', title: 'Falling apart over perceived failure or criticism' },
  { id: 'k08', type: 'kid', category: 'school', title: 'School refusal or school anxiety' },
  { id: 'k09', type: 'kid', category: 'social', title: 'Saying the wrong thing at the wrong moment' },
  { id: 'k10', type: 'kid', category: 'social', title: 'Lying' },
  { id: 'k11', type: 'kid', category: 'emotional', title: 'The friendship fallout they keep having' },
];
