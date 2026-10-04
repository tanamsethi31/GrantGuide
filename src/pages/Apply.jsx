import React, { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, ExternalLink, FileText } from "lucide-react";
import AirbnbHeader from "@/components/layout/AirbnbHeader";
import { grantById } from "@/data/grants";
import { COUNTIES } from "@/lib/counties";
import { formatEur, typeLabel } from "@/lib/grantDisplay";

// Mock-up of GrantGuide preparing an application. Nothing is sent anywhere:
// the person reviews and signs, then sends it to the administering body
// themselves (see docs/ARCHITECTURE.md, "never silently submits").

const field = "w-full rounded-xl border border-[#b0b0b0] px-4 py-3 text-base bg-white outline-none focus:border-[#222222]";
const label = "block text-sm font-semibold mb-2";

const DOCUMENTS = [
  "Proof of household income",
  "Proof that you own or live in the home",
  "A quote for the work that's needed",
];

function Section({ title, children }) {
  return (
    <section className="py-8 border-t border-[#ebebeb] first:border-0 first:pt-0">
      <h2 className="text-xl font-semibold mb-5">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default function Apply() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const grant = grantById(id);

  const [form, setForm] = useState({
    name: "",
    age: params.get("age") || "",
    phone: "",
    county: "",
    address: "",
    owner: "",
    need: params.get("need") === "heating" ? "My heating has stopped working." : "",
    income: "",
    docs: [],
    confirm: false,
  });
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const toggleDoc = (d) => setForm((f) => ({ ...f, docs: f.docs.includes(d) ? f.docs.filter((x) => x !== d) : [...f.docs, d] }));

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

  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader />
      <main className="max-w-2xl mx-auto px-5 sm:px-10 py-10 pb-24">
        <Link to="/about" className="inline-flex items-center gap-1.5 text-sm text-[#717171] hover:text-[#222222] underline">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* What she's applying for */}
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
                ["Send it to your council", `Applications go to the council for Co. ${form.county}.`],
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
                <ExternalLink className="w-4 h-4" /> Find your council's form
              </a>
            )}
            <p className="mt-6 text-sm text-[#717171]">This is a preview of how GrantGuide will help you apply.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10">
            <Section title="About you">
              <div>
                <label htmlFor="name" className={label}>Full name</label>
                <input id="name" className={field} value={form.name} onChange={set("name")} autoComplete="name" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="age" className={label}>Age</label>
                  <input id="age" inputMode="numeric" className={field} value={form.age} onChange={set("age")} />
                </div>
                <div>
                  <label htmlFor="phone" className={label}>Phone</label>
                  <input id="phone" type="tel" className={field} value={form.phone} onChange={set("phone")} autoComplete="tel" />
                </div>
              </div>
            </Section>

            <Section title="Your home">
              <div>
                <label htmlFor="address" className={label}>Address</label>
                <input id="address" className={field} value={form.address} onChange={set("address")} autoComplete="street-address" />
              </div>
              <div>
                <label htmlFor="county" className={label}>County</label>
                <select id="county" className={field} value={form.county} onChange={set("county")}>
                  <option value="">Select a county</option>
                  {COUNTIES.map((c) => <option key={c} value={c}>{`Co. ${c}`}</option>)}
                </select>
              </div>
              <fieldset>
                <legend className={label}>Do you own the home?</legend>
                <div className="flex gap-3">
                  {["Yes", "No"].map((o) => (
                    <label key={o} className={`flex-1 cursor-pointer rounded-xl border px-4 py-3 text-center transition ${form.owner === o ? "border-[#222222] bg-[#f7f7f7] font-semibold" : "border-[#b0b0b0]"}`}>
                      <input type="radio" name="owner" value={o} checked={form.owner === o} onChange={set("owner")} className="sr-only" />
                      {o}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="need" className={label}>What needs fixing?</label>
                <textarea id="need" rows={3} className={`${field} resize-none`} value={form.need} onChange={set("need")} />
                {form.need && params.get("need") && (
                  <p className="mt-2 text-sm text-[#717171]">Filled in from what you told us. You can change it.</p>
                )}
              </div>
            </Section>

            <Section title="Household income">
              <div>
                <label htmlFor="income" className={label}>Total household income before tax, per year</label>
                <select id="income" className={field} value={form.income} onChange={set("income")}>
                  <option value="">Choose one</option>
                  <option>Under €75,000</option>
                  <option>Over €75,000</option>
                  <option>Not sure</option>
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
            </section>
          </form>
        )}
      </main>
    </div>
  );
}
