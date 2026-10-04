# GrantGuide architecture

## Purpose

GrantGuide helps people in Ireland discover housing grants and support schemes, understand what is known and unknown about their situation, and prepare applications without losing control of their data.

The system must distinguish:

- **confirmed**: supported by a user-confirmed answer or verified evidence;
- **missing**: required information has not been supplied;
- **needs_confirmation**: a possible match exists, but the source or extracted value needs human review;
- **not_met**: available information conflicts with a scheme requirement;
- **prepared**: an application pack or form draft exists;
- **submitted**: a verified acknowledgement exists from the authority or applicant.

GrantGuide never promises eligibility, invents answers, signs declarations, or silently submits an application.

## Current state (October 2026)

The app is a frontend only. Base44 has been removed entirely (SDK client, Vite plugin, entities, functions, and the login pages), and no replacement backend has been chosen yet.

- Scheme data is a small sample in `src/data/grants.js`: names, one-line summaries, and checked official links, with no amounts or eligibility rules.
- Search and profile matching run in the browser (`src/lib/searchGrants.js`) by keyword and "about you" tags. This is a placeholder for the deterministic, server-side matcher described below, not a version of it.
- Saved schemes and profile answers are kept in the browser's local storage. There are no accounts.

Everything below describes the target design. Where it names a backend, it means whichever backend the team chooses.

## System boundaries

### Frontend

The Vite/React app owns navigation, questionnaire and conversation UI, document upload UI, checklist presentation, field review, and explicit approval controls. It calls the backend through a single API client module (to be added under `src/api/`), never directly from components.

### Backend (not yet chosen)

The backend provides persistence with per-user access control, and server-side functions that are the only place where source retrieval, matching, extraction, and application preparation run.

### External systems

- Official scheme pages and application forms are the source of truth.
- Document processing and LLM providers are replaceable adapters; raw provider calls must not be embedded in React components.
- Browser automation (for example Steel) is an optional execution adapter. It must expose activity and require explicit approval before a supported submission.

## Core domain model

1. **SupportScheme** — canonical scheme metadata, authority, geography, application route, and lifecycle.
2. **SchemeRequirement** — a versioned, source-backed rule with requirement type, question key, evidence expectation, and human-readable explanation.
3. **SourceSnapshot** — URL, title, retrieved timestamp, content hash, and excerpt used to explain a result.
4. **UserProfile** — reusable, user-confirmed facts about a person or household. Store provenance and confirmation timestamps for sensitive facts.
5. **SupportMatch** — an evaluation result for one profile and scheme. Store per-requirement statuses and source references; do not reduce it to an eligibility percentage.
6. **EvidenceDocument** — encrypted/private document metadata, extraction status, and retention/deletion state. Store extracted facts separately from the original file.
7. **ApplicationCase** — a user-owned case for a selected scheme and local authority. Tracks readiness, missing evidence, clarification questions, and lifecycle.
8. **ApplicationField** — a supported form field with value, provenance, confidence, review status, and whether applicant confirmation is required.
9. **SubmissionRecord** — prepared/submitted status, channel, acknowledgement reference, timestamps, and immutable event history.
10. **ConsentAuditEvent** — append-only record of document access, fact reuse, field approval, browser actions, and deletion requests.

All user-owned records use row-level access control tied to the authenticated user. Shared scheme/source records are read-only to end users.

## Function boundaries

- `findSupports`: accept a minimal profile/questionnaire, retrieve active schemes, and return candidate schemes plus missing high-value questions.
- `matchSupports`: evaluate a profile against versioned requirements and return per-requirement statuses with source citations.
- `supportDetails`: return a scheme, its requirements, sources, and application route.
- `buildReadiness`: create or refresh an ApplicationCase checklist from a selected scheme and confirmed profile.
- `extractEvidence`: process an explicitly uploaded document, return proposed facts with provenance, and never write facts as confirmed without user review.
- `prepareApplication`: map confirmed facts and approved evidence to supported ApplicationFields; reject unresolved required fields.
- `submitApplication`: optional adapter boundary. Requires an explicit approval token, records browser activity, and creates a SubmissionRecord only after a verified acknowledgement.
- `deleteUserData`: revoke document access and remove user-owned evidence/profile data according to retention policy.

Functions should validate input/output with a shared schema layer and return stable error codes suitable for the frontend.

## Matching semantics

A requirement is evaluated independently. The result is one of:

`met`, `not_met`, `missing`, `needs_confirmation`, or `not_applicable`.

A scheme-level result is a summary of those states, not a legal or financial determination. Every non-trivial conclusion should include:

- requirement identifier;
- current status;
- explanation in plain language;
- facts used;
- source snapshot identifiers;
- next action, if unresolved.

## First vertical slice

Build in this order:

1. Choose the backend, then model SupportScheme, SchemeRequirement, SourceSnapshot, UserProfile, and SupportMatch.
2. Seed a small, manually verified set of Irish housing schemes and source URLs (replacing `src/data/grants.js`).
3. Implement `findSupports` and `matchSupports` with deterministic requirement evaluation.
4. Connect the existing Search page to the functions and render status explanations/citations, replacing the in-browser placeholder search.
5. Add ApplicationCase and build the personalised readiness checklist.
6. Add EvidenceDocument and extraction review; only then add supported form preparation.
7. Treat browser automation and submission as a later adapter behind explicit approval and audit events.

## Privacy and safety rules

- Minimise collection: ask only for facts needed by a selected requirement.
- Never log document contents, extracted personal data, access tokens, or full application payloads.
- Encrypt or use provider-private storage for uploaded documents; support deletion.
- Keep source snapshots and requirement versions so explanations remain auditable.
- Preserve the distinction between user-confirmed, machine-extracted, and source-derived facts.
- Require explicit confirmation before reusing a fact in an application and explicit approval before any submission.
- A missing integration or unsupported application route must produce a draft pack and clear remaining steps, not a simulated submission.

## Collaboration contract

Frontend code should depend on function contracts rather than storage internals, through the single API client module. New integrations belong under server-side adapters and must be configured through environment variables, never committed secrets.
