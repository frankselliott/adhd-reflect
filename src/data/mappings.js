// ADHD Reflect — Content Mappings
// Which guides relate to which cards, and which guides map to each quiz type

// Card → related guide IDs (first is the primary, rest are related)
export const CARD_TO_GUIDES = {
  // Moment cards
  m01: ['m01', 'm10', 'k03', 'p14'],  // Morning battle → instructions, sensory, forgetting
  m02: ['m02', 'm10', 'k07', 'p16'],  // Homework → instructions, failure sensitivity, distracted
  m03: ['m03', 'm07', 'p10', 'p18'],  // After-school collision → meltdown triggers, shutdown, medication
  m04: ['m04', 'm09', 'k05', 'p13'],  // Bedtime → loses it over tiny, can't sit still, letting go
  m05: ['m05', 'm06', 'k06', 'k03'],  // Car journey → public meltdown, impulsive physical, sensory
  m06: ['m06', 'm07', 'p01', 'm05'],  // Public meltdown → triggers yours, shame spiral, car journey
  m07: ['m07', 'p01', 'p03', 'm08'],  // Meltdown triggers yours → shame, overcorrecting, escalation
  m08: ['m08', 'm07', 'm16', 'p10'],  // Escalation won't stop → triggers, lectured, shutdown
  m09: ['m09', 'm07', 'k07', 'p01'],  // Loses it over tiny → triggers, failure sensitivity, shame
  m10: ['m10', 'm16', 'p08', 'k02'],  // Won't follow instructions → lectured, dragging old, forgetting
  m11: ['m11', 'm10', 'k06', 'p13'],  // Hyperfocused → instructions, impulsive, letting go
  m12: ['m12', 'm13', 'm07', 'p21'],  // Sibling conflict → physical, triggers, freezing
  m13: ['m13', 'm12', 'k06', 'p07'],  // Physical with sibling → sibling conflict, impulsive, temper
  m14: ['m14', 'm03', 'k08', 'k07'],  // Fine at school → after-school, school refusal, failure
  m15: ['m15', 'p01', 'p02', 'p03'],  // Said the damaging thing → shame, repeating parents, overcorrecting
  m16: ['m16', 'm10', 'm08', 'p08'],  // Lectured → instructions, escalation, dragging old
  m17: ['m17', 'p02', 'p01', 'p20'],  // Too hard for something you do → repeating parents, shame, cover
  m18: ['m18', 'k01', 'k02', 'p14'],  // Keep losing things → losing, forgetting, forgot something
  m19: ['m19', 'k07', 'm09', 'k09'],  // Can't handle losing → failure sensitivity, tiny, wrong thing
  m20: ['m20', 'p10', 'p11', 'p12'],  // Phone checked out → shutdown, leaving, pretending

  // Parent-only cards
  p01: ['p01', 'p03', 'm15', 'p02'],  // Shame spiral → overcorrecting, damaging thing, repeating
  p02: ['p02', 'p01', 'm15', 'm17'],  // Repeating parents → shame, damaging, too hard
  p03: ['p03', 'p01', 'm15', 'm07'],  // Overcorrecting → shame, damaging, triggers
  p04: ['p04', 'p05', 'p06', 'p07'],  // Contradicting partner → caving, snapping partner, temper
  p05: ['p05', 'p04', 'p13', 'p06'],  // Caving boundary → contradicting, letting go, snapping
  p06: ['p06', 'p04', 'p09', 'm07'],  // Snapping partner → contradicting, frustration, triggers
  p07: ['p07', 'p06', 'p01', 'k08'],  // Temper at teacher → snapping, shame, school
  p08: ['p08', 'p09', 'm16', 'm17'],  // Dragging old → frustration, lectured, too hard
  p09: ['p09', 'p08', 'm07', 'p01'],  // Day's frustration → dragging, triggers, shame
  p10: ['p10', 'p11', 'p12', 'm20'],  // Shutdown → leaving, pretending, phone
  p11: ['p11', 'p10', 'p12', 'p01'],  // Leaving → shutdown, pretending, shame
  p12: ['p12', 'p10', 'p13', 'p11'],  // Pretending didn't see → shutdown, letting go, leaving
  p13: ['p13', 'p12', 'p05', 'p10'],  // Letting go → pretending, caving, shutdown
  p14: ['p14', 'p15', 'p16', 'p17'],  // Forgot mattered to kid → paperwork, distracted, cancelled
  p15: ['p15', 'p14', 'p16', 'k01'],  // Paperwork lost → forgot, distracted, losing things
  p16: ['p16', 'p14', 'p15', 'p17'],  // Distracted helping → forgot, paperwork, cancelled
  p17: ['p17', 'p14', 'p16', 'p01'],  // Cancelled promised → forgot, distracted, shame
  p18: ['p18', 'm03', 'p09', 'p10'],  // Medication timing → after-school, frustration, shutdown
  p19: ['p19', 'p02', 'p01', 'm15'],  // Oversharing → repeating parents, shame, damaging
  p20: ['p20', 'p19', 'm17', 'p02'],  // Kid's ADHD as cover → oversharing, too hard, repeating
  p21: ['p21', 'm12', 'p10', 'm07'],  // Freezing both kids → sibling, shutdown, triggers

  // Kid-only cards
  k01: ['k01', 'k02', 'm18', 'p15'],  // Losing things → forgetting, keep losing, paperwork
  k02: ['k02', 'k01', 'm18', 'p14'],  // Forgetting things → losing, keep losing, forgot
  k03: ['k03', 'k04', 'k05', 'm09'],  // Sensory meltdowns → won't eat, can't sit, tiny
  k04: ['k04', 'k03', 'k05', 'm04'],  // Won't eat → sensory, can't sit, bedtime
  k05: ['k05', 'k06', 'k03', 'm04'],  // Can't sit still → impulsive, sensory, bedtime
  k06: ['k06', 'k05', 'm13', 'k03'],  // Impulsive physical → can't sit, physical sibling, sensory
  k07: ['k07', 'm19', 'k09', 'k08'],  // Failure sensitivity → can't lose, wrong thing, school
  k08: ['k08', 'k07', 'm14', 'k09'],  // School refusal → failure, fine at school, wrong thing
  k09: ['k09', 'k10', 'k07', 'm19'],  // Wrong thing at wrong time → lying, failure, can't lose
  k10: ['k10', 'k09', 'k07', 'm10'],  // Lying → wrong thing, failure, instructions
};

// Quiz type → recommended guide IDs (ordered by relevance)
export const TYPE_TO_GUIDES = {
  reactor: [
    'm07', // When their meltdown triggers yours
    'm08', // When the escalation won't stop
    'm09', // When they lose it over something tiny
    'm01', // Morning battle
    'm02', // Homework explosion
    'p01', // Shame spiral
    'p09', // Day's frustration on your kid
    'm06', // Public meltdown
    'p03', // Overcorrecting after
    'm03', // After-school collision
  ],
  juggler: [
    'p14', // Forgetting something that mattered
    'p15', // Losing the paperwork
    'p16', // Distracted before finishing
    'p17', // Cancelling something promised
    'm18', // Keep losing things
    'p05', // Caving on boundary
    'p13', // Letting something go
    'k01', // Losing things (kid)
    'k02', // Forgetting things (kid)
    'm01', // Morning battle
  ],
  looper: [
    'm10', // Won't follow instructions
    'm16', // Lectured instead of stopping
    'm08', // Escalation won't stop
    'p08', // Dragging old into new
    'm17', // Too hard for something you do
    'm02', // Homework explosion
    'p04', // Contradicting partner
    'm11', // Hyperfocused won't stop
    'k10', // Lying
    'm19', // Can't handle losing
  ],
  spiraller: [
    'p01', // Shame spiral
    'p02', // Repeating parents' behaviour
    'p03', // Overcorrecting with affection
    'm15', // Said the damaging thing
    'p19', // Oversharing with child
    'p09', // Day's frustration on kid
    'm17', // Too hard for something you do
    'p20', // Kid's ADHD as cover
    'm07', // Meltdown triggers yours
    'p11', // Leaving when should have stayed
  ],
  escaper: [
    'p10', // Shutting down and going cold
    'p11', // Leaving when should have stayed
    'p12', // Pretending didn't see
    'm20', // Phone checked out
    'p13', // Letting something go
    'p18', // Medication timing
    'p10', // Shutdown
    'm03', // After-school collision
    'p01', // Shame spiral
    'p17', // Cancelling promised
  ],
};

