// "About you" tags are matched against each scheme's wording (name, audience and
// eligibility) to rank results and suggest relevant schemes. This is a relevance
// hint only, never an eligibility decision.
const TAG_PATTERNS = {
  "Renting": /\brent(ing|al|ers?)?\b|\btenan/i,
  "Own my home": /homeowner|owner-occupi|owners? of|property owners?|own(s|ing)? (a|the|their) home/i,
  "Over 66": /\b6[56]\+|aged 6[56]|age 6[56]|\b70\+|over-70|older people|pension age/i,
  "Medical card": /medical card/i,
  "On social welfare": /welfare|social[- ]protection|qualifying payment|DSP payment/i,
  "Living alone": /living alone|lives alone|live alone/i,
  "Have children": /\bchild|famil|parent/i,
  "Low income": /low[- ]income|limited means|means\b|income (limit|threshold|band|ceiling)/i,
  "Have a disability": /disab/i,
  "Long-term illness": /illness|qualifying condition|listed condition|care needs/i,
  "Carer for someone": /\bcarers?\b|caring/i,
  "Wheelchair user": /mobility|accessible|wheelchair/i,
  "Hearing or sight loss": /hearing|sight|visual/i,
  "Unemployed": /jobseek|unemploy/i,
  "Self-employed": /self-employed/i,
  "Part-time work": /part-time|low family income|employees with/i,
  "Retired": /pension|retire/i,
  "Student": /student|course|SUSI/i,
  "Receive State Pension": /pension/i,
  "Old or poorly insulated home": /insulat|energy upgrade|heat-loss|pre-20\d\d|windows/i,
  "Oil or solid fuel heating": /heating system|heat pump/i,
  "Need home adaptations": /adaptation|mobility works|essential repairs|rails/i,
  "Social housing tenant": /social[- ]housing/i,
  "Behind on rent or bills": /exceptional|essential need|unable to meet/i,
  "Lone parent": /lone parent|one-parent/i,
  "Child with additional needs": /domiciliary|children? (under \d+ )?with (severe )?disab/i,
  "Pregnant or new baby": /maternity|newborn|\bbaby\b|birth/i,
  "Widowed": /widow/i,
  "Adult children at home": /adult child/i,
};

export function tagsFor(scheme) {
  const text = [scheme.name, scheme.audience, scheme.eligibility].join(" ");
  return Object.entries(TAG_PATTERNS)
    .filter(([, re]) => re.test(text))
    .map(([tag]) => tag);
}
