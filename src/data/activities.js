// ADHD Reflect — Activity Mappings
// Which activities match which cards

// Activity types: breathing, grounding, scale, perspective, repair, room-reset, name-pattern
export const CARD_ACTIVITIES = {
  // Moment cards
  m01: ['room-reset', 'breathing', 'scale'],         // Morning battle
  m02: ['breathing', 'perspective', 'room-reset'],     // Homework
  m03: ['breathing', 'grounding', 'scale'],            // After-school collision
  m04: ['breathing', 'room-reset', 'scale'],           // Bedtime
  m05: ['breathing', 'grounding', 'scale'],            // Car journey
  m06: ['breathing', 'grounding', 'perspective'],      // Public meltdown
  m07: ['breathing', 'room-reset', 'name-pattern'],    // Meltdown triggers yours
  m08: ['breathing', 'room-reset', 'name-pattern'],    // Escalation won't stop
  m09: ['scale', 'perspective', 'breathing'],           // Loses it over tiny
  m10: ['room-reset', 'perspective', 'breathing'],      // Won't follow instructions
  m11: ['scale', 'perspective', 'grounding'],           // Hyperfocused won't stop
  m12: ['room-reset', 'breathing', 'scale'],            // Sibling conflict
  m13: ['room-reset', 'breathing', 'grounding'],        // Physical with sibling
  m14: ['grounding', 'perspective', 'scale'],           // Fine at school
  m15: ['repair', 'breathing', 'perspective'],          // Said the damaging thing
  m16: ['breathing', 'name-pattern', 'perspective'],    // Lectured
  m17: ['perspective', 'name-pattern', 'breathing'],    // Too hard for something you do
  m18: ['perspective', 'scale', 'grounding'],           // Keep losing things
  m19: ['scale', 'perspective', 'grounding'],           // Can't handle losing
  m20: ['grounding', 'name-pattern', 'repair'],         // Phone checked out

  // Parent cards
  p01: ['perspective', 'repair', 'breathing'],          // Shame spiral
  p02: ['name-pattern', 'perspective', 'repair'],       // Repeating parents
  p03: ['perspective', 'scale', 'repair'],              // Overcorrecting
  p04: ['breathing', 'perspective', 'repair'],          // Contradicting partner
  p05: ['name-pattern', 'perspective', 'scale'],        // Caving boundary
  p06: ['breathing', 'repair', 'perspective'],          // Snapping partner
  p07: ['breathing', 'perspective', 'repair'],          // Temper at teacher
  p08: ['name-pattern', 'perspective', 'grounding'],    // Dragging old
  p09: ['scale', 'perspective', 'repair'],              // Day's frustration
  p10: ['grounding', 'breathing', 'repair'],            // Shutdown
  p11: ['repair', 'grounding', 'breathing'],            // Leaving
  p12: ['name-pattern', 'grounding', 'perspective'],    // Pretending didn't see
  p13: ['name-pattern', 'scale', 'perspective'],        // Letting go
  p14: ['perspective', 'repair', 'scale'],              // Forgot mattered
  p15: ['perspective', 'grounding', 'scale'],           // Lost paperwork
  p16: ['name-pattern', 'grounding', 'repair'],         // Distracted helping
  p17: ['repair', 'perspective', 'scale'],              // Cancelled promised
  p18: ['grounding', 'scale', 'perspective'],           // Medication timing
  p19: ['perspective', 'repair', 'breathing'],          // Oversharing
  p20: ['name-pattern', 'perspective', 'scale'],        // Kid's ADHD as cover
  p21: ['breathing', 'room-reset', 'grounding'],        // Freezing both kids

  // Kid cards
  k01: ['perspective', 'scale', 'grounding'],           // Losing things
  k02: ['perspective', 'scale', 'grounding'],           // Forgetting things
  k03: ['breathing', 'room-reset', 'grounding'],        // Sensory meltdowns
  k04: ['perspective', 'scale', 'breathing'],            // Won't eat
  k05: ['perspective', 'scale', 'breathing'],            // Can't sit still
  k06: ['room-reset', 'breathing', 'scale'],             // Impulsive physical
  k07: ['perspective', 'repair', 'scale'],               // Failure sensitivity
  k08: ['perspective', 'grounding', 'breathing'],        // School refusal
  k09: ['perspective', 'repair', 'breathing'],           // Wrong thing wrong time
  k10: ['perspective', 'scale', 'name-pattern'],         // Lying
  // ─── 50 NEW CARDS ───
  m22: ['breathing', 'scale', 'grounding'],
  m23: ['breathing', 'perspective', 'scale'],
  m24: ['room-reset', 'breathing', 'perspective'],
  m25: ['breathing', 'grounding', 'scale'],
  m26: ['breathing', 'grounding', 'perspective'],
  m27: ['breathing', 'grounding', 'scale'],
  m28: ['room-reset', 'perspective', 'grounding'],
  m29: ['breathing', 'perspective', 'room-reset'],
  m30: ['breathing', 'perspective', 'room-reset'],
  m31: ['perspective', 'breathing', 'scale'],
  m32: ['breathing', 'grounding', 'perspective'],
  m33: ['breathing', 'room-reset', 'grounding'],
  m34: ['breathing', 'perspective', 'grounding'],
  m35: ['perspective', 'grounding', 'breathing'],
  m36: ['perspective', 'breathing', 'repair'],
  m37: ['breathing', 'grounding', 'scale'],
  m38: ['breathing', 'grounding', 'perspective'],
  m39: ['breathing', 'perspective', 'scale'],
  m40: ['perspective', 'breathing', 'repair'],
  m41: ['room-reset', 'breathing', 'perspective'],
  m42: ['breathing', 'grounding', 'perspective'],
  m43: ['breathing', 'grounding', 'room-reset'],
  m44: ['room-reset', 'breathing', 'scale'],
  m45: ['breathing', 'perspective', 'grounding'],
  m46: ['breathing', 'perspective', 'scale'],
  p23: ['perspective', 'breathing', 'grounding'],
  p24: ['perspective', 'breathing', 'name-pattern'],
  p25: ['grounding', 'perspective', 'breathing'],
  p26: ['perspective', 'grounding', 'breathing'],
  p27: ['breathing', 'perspective', 'name-pattern'],
  p28: ['perspective', 'breathing', 'grounding'],
  p29: ['perspective', 'scale', 'breathing'],
  p30: ['breathing', 'grounding', 'room-reset'],
  p31: ['perspective', 'repair', 'scale'],
  p32: ['perspective', 'name-pattern', 'breathing'],
  p33: ['breathing', 'perspective', 'grounding'],
  p34: ['perspective', 'scale', 'breathing'],
  p35: ['breathing', 'grounding', 'perspective'],
  p36: ['breathing', 'perspective', 'grounding'],
  p37: ['perspective', 'grounding', 'breathing'],
  p38: ['perspective', 'scale', 'breathing'],
  p39: ['perspective', 'grounding', 'breathing'],
  p40: ['perspective', 'breathing', 'repair'],
  p41: ['perspective', 'breathing', 'grounding'],
  p42: ['perspective', 'breathing', 'name-pattern'],
  k12: ['perspective', 'scale', 'breathing'],
  k13: ['breathing', 'grounding', 'perspective'],
  k14: ['perspective', 'grounding', 'breathing'],
  k15: ['perspective', 'grounding', 'breathing'],
  k16: ['perspective', 'breathing', 'grounding'],
  // ─── Previously missing cards ───
  m21: ['breathing', 'grounding', 'scale'],
  p22: ['name-pattern', 'breathing', 'perspective'],
  k11: ['perspective', 'grounding', 'breathing'],

  // ─── 15 NEW KID CARDS ───
  k17: ['perspective', 'breathing', 'grounding'],
  k18: ['breathing', 'perspective', 'scale'],
  k19: ['grounding', 'breathing', 'perspective'],
  k20: ['room-reset', 'grounding', 'perspective'],
  k21: ['grounding', 'perspective', 'scale'],
  k22: ['perspective', 'grounding', 'breathing'],
  k23: ['perspective', 'repair', 'breathing'],
  k24: ['perspective', 'scale', 'breathing'],
  k25: ['breathing', 'grounding', 'perspective'],
  k26: ['repair', 'perspective', 'breathing'],
  k27: ['breathing', 'grounding', 'scale'],
  k28: ['breathing', 'grounding', 'room-reset'],
  k29: ['room-reset', 'breathing', 'perspective'],
  k30: ['breathing', 'grounding', 'perspective'],
  k31: ['breathing', 'grounding', 'perspective'],

  // ─── 9 NEW PARENT CARDS ───
  p43: ['scale', 'perspective', 'breathing'],
  p44: ['perspective', 'name-pattern', 'breathing'],
  p45: ['repair', 'perspective', 'breathing'],
  p46: ['room-reset', 'perspective', 'grounding'],
  p47: ['perspective', 'scale', 'breathing'],
  p48: ['name-pattern', 'grounding', 'breathing'],
  p49: ['breathing', 'name-pattern', 'grounding'],
  p50: ['perspective', 'name-pattern', 'scale'],
  p51: ['breathing', 'perspective', 'grounding'],
};

// Pattern names for the name-pattern activity
export const PATTERN_NAMES = {
  m07: { name: 'The Reactor Loop', desc: 'Your nervous system joined theirs. Limbic resonance. You know this one.' },
  m08: { name: 'The Closure Trap', desc: 'Both brains need resolution. The argument format can never provide it.' },
  m16: { name: 'The Lecture Loop', desc: 'You needed them to understand. They stopped hearing after ten seconds.' },
  m17: { name: 'The Mirror', desc: 'You see yourself in what you are criticising. That recognition is the way out.' },
  m20: { name: 'The Withdrawal', desc: 'You checked out because checking back in felt like more than you had.' },
  p01: { name: 'The Shame Spiral', desc: 'Rumination that feels like accountability but consumes the energy you need for repair.' },
  p02: { name: 'The Inheritance', desc: 'Your parents\' scripts firing on autopilot. You caught it. That is the break in the cycle.' },
  p05: { name: 'The Cave', desc: 'Immediate pressure beat the abstract principle. Your brain chose the louder signal.' },
  p08: { name: 'The Archive', desc: 'Old emotional data surfacing uninvited. Your brain pattern-matched across time.' },
  p10: { name: 'The Shutdown', desc: 'Nervous system protection. Disengagement as a survival response, not a choice.' },
  p12: { name: 'The Blind Spot', desc: 'Avoidance disguised as not noticing. Your brain triaged by ignoring.' },
  p13: { name: 'The Let-Go', desc: 'Boundary enforcement costs executive function. You ran out.' },
  p16: { name: 'The Drift', desc: 'Attention followed novelty away from your child. Not a choice. A dopamine redirect.' },
  p20: { name: 'The Cover', desc: 'Your ADHD hiding behind theirs. Both are real. Both need separating.' },
  k10: { name: 'The Escape Route', desc: 'Truth had a consequence that felt overwhelming. The lie was the path of least resistance.' },
  p22: { name: 'The Scroll Trap', desc: 'Your depleted brain chose the lowest-effort dopamine source. The phone is not the problem. The depletion is.' },
};

