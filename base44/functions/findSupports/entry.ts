import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const query = String(body.query || '').trim().slice(0, 300);
    const location = String(body.location || '').trim().slice(0, 60);
    const category = String(body.category || '').trim().slice(0, 40);
    const details = String(body.details || '').trim().slice(0, 400);
    if (!query && !location && !category && !details) {
      return Response.json({ error: 'Missing search' }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `A person in Ireland wants to claim local council and state entitlements they may be owed.
Area of need: ${category || 'any'}.
Location: ${location ? 'County ' + location : 'anywhere in Ireland'}.
They said: "${query}".
About them: ${details || 'no extra details'}.
Find up to 6 real, current Irish entitlements, grants, schemes or support services that fit (e.g. SEAI grants, Fuel Allowance, Housing Assistance Payment, Housing Adaptation Grant, Warmer Homes, Citizens Information, Threshold, Age Action, Alone, MABS, local county council services). Put the local county council first if a location was given. For each give: name, category (Energy, Housing, Elderly or Other), one short plain-English sentence on how it helps, a phone number if known, and the official website URL. Only include real services.`,
      add_context_from_internet: true,
      model: 'gemini_3_8_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          supports: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                category: { type: 'string' },
                help: { type: 'string' },
                phone: { type: 'string' },
                website: { type: 'string' }
              },
              required: ['name', 'help']
            }
          }
        },
        required: ['supports']
      }
    });

    return Response.json({ supports: (result.supports || []).slice(0, 6) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}