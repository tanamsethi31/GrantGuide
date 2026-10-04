import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, ExternalLink, FileText, Mic } from "lucide-react";
import AirbnbHeader from "@/components/layout/AirbnbHeader";
import VoiceInterview from "@/components/apply/VoiceInterview";
import VoiceFieldButton from "@/components/apply/VoiceFieldButton";
import { DOCUMENTS, INCOME_OPTIONS, isHomeWorks, parseEmail, questionsFor } from "@/lib/applyQuestions";
import { grantById } from "@/data/grants";
import { COUNTIES } from "@/lib/counties";
import { formatEur, typeLabel } from "@/lib/grantDisplay";

// GrantGuide preparing an application, by conversation or by form (with a
// "Use voice" button on each text field). Nothing is sent anywhere: the person
// checks, signs and sends it themselves (docs/ARCHITECTURE.md, "never silently submits").

const field = "w-full rounded-xl border border-[#b0b0b0] px-4 py-3 text-base bg-white outline-none focus:border-[#222222]";
const label = "block text-sm font-semibold";

function Section({ title, children }) {
  return (
    <section className="py-8 border-t border-[#ebebeb] first:border-0 first:pt-0">
      <h2 className="text-xl font-semibold mb-5">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

/** Labelled text input or textarea with a "Use voice" button that dictates into it. */
function TextField({ id, title, value, onChange, onVoice, setStatus, multiline, hint, ...rest }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <label htmlFor={id} className={label}>{title}</label>
        <VoiceFieldButton label={title} onText={onVoice} onStatus={setStatus} />
      </div>
      <Tag id={id} className={`${field} ${multiline ? "resize-none" : ""}`} value={value} onChange={onChange} rows={multiline ? 3 : undefined} {...rest} />
      {hint && <p className="mt-2 text-sm text-[#717171]">{hint}</p>}
    </div>
  );
}

// A fresh form for each scheme and each entry link (e.g. ?mode=chat vs ?mode=form).
export default function ApplyPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  return <Apply key={`${id}?${params}`} />;
}

function Apply() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const grant = grantById(id);
  const homeWorks = isHomeWorks(id);
  const questions = useMemo(() => questionsFor(id), [id]);

  const told = params.get("need") === "heating" ? "My heating has stopped working." : "";
  const [form, setForm] = useState({
    name: "",
    age: params.get("age") || "",
    email: "",
    phone: "",
    county: "",
    address: "",
    owner: "",
    need: homeWorks ? told : "",
    helpWith: homeWorks ? "" : told,
    income: "",
    docs: [],
    confirm: false,
  });
  const [done, setDone] = useState(false);
  // intro: choose voice or form; chat: spoken questions; form: fill in / check answers
  const [mode, setMode] = useState(["chat", "form"].includes(params.get("mode")) ? params.get("mode") : "intro");
  const [fromChat, setFromChat] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  // Dictated words are added to what's already there (Tanam's behaviour); email is cleaned up.
  const dictate = (k) => (text) =>
    setForm((f) => ({ ...f, [k]: k === "email" ? parseEmail(text) || text : [f[k], text].filter(Boolean).join(" ") }));
  const toggleDoc = (d) => setForm((f) => ({ ...f, docs: f.docs.includes(d) ? f.docs.filter((x) => x !== d) : [...f.docs, d] }));
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate("/"));

  if (!grant) {
    return (
      <div className="min-h-screen bg-white font-body text-[#222222]">
        <AirbnbHeader />
        <main className="max-w-2xl mx-auto px-5 py-24 text-center">
          <h1 className="text-2xl font-semibold">We couldn't find that support</h1>
          <Link to="/" className="inline-block mt-6 underline">Back to search</Link>
        </main>
      </div>
    );
  }

  const ready = form.name.trim() && form.county && form.confirm;
  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sendTo = homeWorks
    ? ["Send it to your council", `Applications go to the council for Co. ${form.county}.`]
    : ["Send it in", `Apply through ${grant.administrator}.`];

  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader />
      <main className="max-w-2xl mx-auto px-5 sm:px-10 py-10 pb-24">
        <button type="button" onClick={goBack} className="inline-flex items-center gap-1.5 text-sm text-[#717171] hover:text-[#222222] underline">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mt-6 rounded-3xl bg-[#14532D] text-white p-6">
          <p className="text-sm text-white/80">Applying for</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">{grant.name}</h1>
          <p className="mt-3 text-3xl font-bold text-[#86EFAC]">
            {grant.amountEur != null ? `Up to ${formatEur(grant.amountEur)}` : typeLabel(grant.benefitType)}
          </p>
          <p className="mt-2 text-sm text-white/75">Run by {grant.administrator}</p>
        </div>

        {done ? (
          <div className="mt-10 text-center">
            <span className="mx-auto w-16 h-16 rounded-full bg-[#F0FDF4] text-[#15803D] flex items-center justify-center">
              <Check className="w-8 h-8" strokeWidth={3} />
            </span>
            <h2 className="mt-5 text-3xl font-bold">Your application is ready</h2>
            <p className="mt-2 text-[#717171]">
              {form.name.split(" ")[0]}, we've filled in everything we could. Nothing has been sent yet.
            </p>

            <ol className="mt-8 text-left rounded-3xl border border-[#dddddd] divide-y divide-[#ebebeb]">
              {[
                ["Check it", "Read through your answers and fix anything that's wrong."],
                ["Sign it", "Only you can sign and send it. We never submit without you."],
                sendTo,
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4 p-5">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-[#15803D] text-white text-sm font-semibold flex items-center justify-center">{i + 1}</span>
                  <span>
                    <span className="block font-semibold">{t}</span>
                    <span className="block text-[#717171]">{d}</span>
                  </span>
                </li>
              ))}
            </ol>

            {grant.website && (
              <a
                href={grant.website}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white font-semibold px-6 py-3.5 transition"
              >
                <ExternalLink className="w-4 h-4" /> Go to the official application
              </a>
            )}
            <p className="mt-6 text-sm text-[#717171]">This is a preview of how GrantGuide will help you apply.</p>
          </div>
        ) : mode === "intro" ? (
          <div className="mt-10 rounded-3xl border border-[#dddddd] shadow-[0_6px_16px_rgba(0,0,0,0.08)] p-6 sm:p-8 text-center">
            <span className="mx-auto w-16 h-16 rounded-full bg-[#F0FDF4] text-[#15803D] flex items-center justify-center">
              <Mic className="w-7 h-7" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold">Answer out loud</h2>
            <p className="mt-2 text-[#717171]">
              I'll ask you each question and fill in the form for you. You can talk, type or tap an answer.
            </p>
            <button
              type="button"
              onClick={() => setMode("chat")}
              className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-lg font-semibold px-8 py-4 transition"
            >
              <Mic className="w-5 h-5" /> Start talking
            </button>
            <button type="button" onClick={() => setMode("form")} className="block mx-auto mt-4 text-sm text-[#717171] underline hover:text-[#222222]">
              Fill in the form myself instead
            </button>
          </div>
        ) : mode === "chat" ? (
          <div className="mt-10">
            <VoiceInterview
              questions={questions}
              form={form}
              setForm={setForm}
              onDone={() => {
                setFromChat(true);
                setMode("form");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onSkip={() => setMode("form")}
            />
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10">
            {fromChat ? (
              <div className="mb-8 rounded-2xl bg-[#F0FDF4] p-5">
                <p className="text-lg font-semibold">Check your answers</p>
                <p className="text-[#717171] mt-1">Filled in from our conversation. Change anything that's wrong, then tick the box at the bottom.</p>
              </div>
            ) : (
              <p className="mb-8 text-[#717171]">
                Type your answers, or press "Use voice" to say them.{" "}
                <button type="button" onClick={() => setMode("chat")} className="underline text-[#222222]">Or talk it through instead</button>.
              </p>
            )}

            <Section title="About you">
              <TextField id="name" title="Full name" value={form.name} onChange={set("name")} onVoice={dictate("name")} setStatus={setVoiceStatus} autoComplete="name" />
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="age" className={`${label} mb-2`}>Age</label>
                  <input id="age" inputMode="numeric" className={field} value={form.age} onChange={set("age")} />
                </div>
                <TextField id="phone" title="Phone" value={form.phone} onChange={set("phone")} onVoice={dictate("phone")} setStatus={setVoiceStatus} type="tel" autoComplete="tel" />
              </div>
              <TextField id="email" title="Email address" value={form.email} onChange={set("email")} onVoice={dictate("email")} setStatus={setVoiceStatus} type="email" autoComplete="email" />
            </Section>

            <Section title={homeWorks ? "Your home" : "Where you live"}>
              <TextField id="address" title="Address" value={form.address} onChange={set("address")} onVoice={dictate("address")} setStatus={setVoiceStatus} autoComplete="street-address" />
              <div>
                <label htmlFor="county" className={`${label} mb-2`}>County</label>
                <select id="county" className={field} value={form.county} onChange={set("county")}>
                  <option value="">Select a county</option>
                  {COUNTIES.map((c) => <option key={c} value={c}>{`Co. ${c}`}</option>)}
                </select>
              </div>
              {homeWorks && (
                <>
                  <fieldset>
                    <legend className={`${label} mb-2`}>Do you own the home?</legend>
                    <div className="flex gap-3">
                      {["Yes", "No"].map((o) => (
                        <label key={o} className={`flex-1 cursor-pointer rounded-xl border px-4 py-3 text-center transition ${form.owner === o ? "border-[#222222] bg-[#f7f7f7] font-semibold" : "border-[#b0b0b0]"}`}>
                          <input type="radio" name="owner" value={o} checked={form.owner === o} onChange={set("owner")} className="sr-only" />
                          {o}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <TextField
                    id="need" title="What needs fixing?" multiline value={form.need} onChange={set("need")} onVoice={dictate("need")} setStatus={setVoiceStatus}
                    hint={form.need && told ? "Filled in from what you told us. You can change it." : undefined}
                  />
                </>
              )}
            </Section>

            {!homeWorks && (
              <Section title="What you need">
                <TextField
                  id="helpWith" title="What would you like help with?" multiline value={form.helpWith} onChange={set("helpWith")} onVoice={dictate("helpWith")} setStatus={setVoiceStatus}
                  placeholder="For example: I need help understanding the documents I need."
                />
              </Section>
            )}

            {homeWorks && (
              <>
                <Section title="Household income">
                  <div>
                    <label htmlFor="income" className={`${label} mb-2`}>Total household income before tax, per year</label>
                    <select id="income" className={field} value={form.income} onChange={set("income")}>
                      <option value="">Choose one</option>
                      {INCOME_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <p className="mt-2 text-sm text-[#717171]">The grant amount depends on household income.</p>
                  </div>
                </Section>

                <Section title="Documents you may be asked for">
                  <ul className="space-y-3">
                    {DOCUMENTS.map((d) => (
                      <li key={d}>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={form.docs.includes(d)} onChange={() => toggleDoc(d)} className="w-5 h-5 accent-[#15803D]" />
                          <FileText className="w-5 h-5 text-[#717171]" aria-hidden="true" />
                          <span>{d}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-[#717171]">Tick the ones you have. You can add the rest later.</p>
                </Section>
              </>
            )}

            <p className="text-sm text-[#717171] min-h-[1.25rem]" aria-live="polite">{voiceStatus}</p>

            <section className="pt-8 border-t border-[#ebebeb]">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.confirm} onChange={set("confirm")} className="mt-1 w-5 h-5 accent-[#15803D]" />
                <span>I confirm these details are correct to the best of my knowledge.</span>
              </label>
              <button
                type="submit"
                disabled={!ready}
                className="mt-6 w-full rounded-lg bg-[#15803D] hover:bg-[#166534] disabled:bg-[#b0b0b0] disabled:cursor-not-allowed text-white text-lg font-semibold px-6 py-4 transition"
              >
                Prepare my application
              </button>
              {!ready && (
                <p className="mt-3 text-sm text-[#717171] text-center">Add your name and county, and tick the box above to continue.</p>
              )}
              <p className="mt-4 text-sm text-[#717171] text-center">
                GrantGuide does not send or save this information. Check any voice-typed text before you continue.
              </p>
            </section>
          </form>
        )}
      </main>
    </div>
  );
}
