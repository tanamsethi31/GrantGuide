import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const county = String(body.county || '').trim().slice(0, 60);
    const who = Array.isArray(body.who) ? body.who.slice(0, 30).map((w) => String(w).slice(0, 40)) : [];

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `A person in Ireland wants to know which council and state entitlements, grants and schemes they may be owed.
County: ${county || 'not given'}.
Their circumstances: ${who.length ? who.join(', ') : 'not given'}.
Return two lists of REAL, current Irish schemes (e.g. SEAI grants, Fuel Allowance, Household Benefits Package, Housing Assistance Payment, Rent Tax Credit, Free Travel Pass, Medical Card, GP Visit Card, Housing Adaptation Grant, Warmer Homes, local county council schemes):
- likely: 3 to 5 schemes this person most probably qualifies for based on their circumstances.
- possible: 3 to 5 other schemes worth checking that they may qualify for depending on further details.
For each give: name, category (Energy, Housing, Elderly or Other), one short plain-English sentence on how it helps, reason (one short sentence on why it fits them), phone if known, official website URL. No duplicates between the lists.`,
      add_context_from_internet: true,
      model: 'gemini_3_8_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          likely: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, category: { type: 'string' }, help: { type: 'string' }, reason: { type: 'string' }, phone: { type: 'string' }, website: { type: 'string' } }, required: ['name', 'help'] } },
          possible: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, category: { type: 'string' }, help: { type: 'string' }, reason: { type: 'string' }, phone: { type: 'string' }, website: { type: 'string' } }, required: ['name', 'help'] } }
        },
        required: ['likely', 'possible']
      }
    });

    return Response.json({ likely: (result.likely || []).slice(0, 5), possible: (result.possible || []).slice(0, 5) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}