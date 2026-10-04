import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const name = String(body.name || '').trim().slice(0, 150);
    const county = String(body.county || '').trim().slice(0, 60);
    const help = String(body.help || '').trim().slice(0, 300);
    if (!name) return Response.json({ error: 'Missing name' }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Give accurate, current details about this Irish support scheme: "${name}". ${help ? 'Summary: ' + help : ''} ${county ? 'The person lives in County ' + county + '.' : ''}
Return:
- amount: the headline value in plain words, e.g. "Up to €6,500" or "€33 per week for 28 weeks" (use "Varies" if truly variable).
- amount_note: one short sentence explaining the amount (e.g. paid yearly, one-off, depends on measure).
- criteria: 3 to 6 short eligibility points in plain English.
- steps: 3 to 6 short steps of the high level application process, in order.
- timeline: how long it typically takes to get a decision or payment, short.
- documents: up to 4 key documents usually needed.
Only state facts you are confident are true for Ireland; if unsure, say "Check the official website for the current amount".`,
      add_context_from_internet: true,
      model: 'gemini_3_8_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          amount: { type: 'string' },
          amount_note: { type: 'string' },
          criteria: { type: 'array', items: { type: 'string' } },
          steps: { type: 'array', items: { type: 'string' } },
          timeline: { type: 'string' },
          documents: { type: 'array', items: { type: 'string' } }
        },
        required: ['amount', 'criteria', 'steps']
      }
    });

    return Response.json({ details: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}