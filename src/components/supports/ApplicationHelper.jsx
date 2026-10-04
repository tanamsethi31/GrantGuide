import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Mic, Square } from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  helpWith: "",
};

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export default function ApplicationHelper({ support }) {
  const [form, setForm] = useState(emptyForm);
  const [activeField, setActiveField] = useState("name");
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);
  const recognitionRef = useRef(null);
  const speechSupported = Boolean(getSpeechRecognition());

  useEffect(() => () => recognitionRef.current?.stop(), []);

  function updateField(event) {
    const { name, value } = event.target;
    setActiveField(name);
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startListening(field) {
    const SpeechRecognition = getSpeechRecognition();
    setActiveField(field);
    setComplete(false);

    if (!SpeechRecognition) {
      setMessage("Voice typing is not available in this browser. You can still type your answer.");
      return;
    }

    recognitionRef.current?.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IE";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListening(true);
      setMessage(`Listening for your ${field === "helpWith" ? "message" : field}. Speak clearly, then pause.`);
    };

    recognition.onresult = (event) => {
      const words = event.results[0][0].transcript.trim();
      setForm((current) => ({
        ...current,
        [field]: [current[field], words].filter(Boolean).join(" "),
      }));
      setMessage("Your words have been added. Please check them before continuing.");
    };

    recognition.onerror = () => {
      setMessage("We could not hear that. Please try again or type your answer.");
    };

    recognition.onend = () => setListening(false);
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setMessage("Voice typing stopped.");
  }

  function submit(event) {
    event.preventDefault();
    setComplete(true);
    setMessage("Your application notes are ready. Continue on the official site to submit your application.");
  }

  const fields = [
    { name: "name", label: "Your name", type: "text", autoComplete: "name" },
    { name: "email", label: "Email address", type: "email", autoComplete: "email" },
    { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
  ];

  return (
    <section className="mt-8 border-t border-[#ebebeb] pt-7" aria-labelledby="application-helper-title">
      <div className="rounded-2xl border border-[#d1fae5] bg-[#f0fdf4] p-5 sm:p-6">
        <h2 id="application-helper-title" className="text-xl font-bold text-[#222222]">
          Get ready to apply for {support.name}
        </h2>
        <p className="mt-2 text-base text-[#222222]">
          Fill in this short form before going to the official application. You can type, or use the microphone to say your answer.
        </p>
        <p className="mt-2 text-sm text-[#525252]">
          GrantGuide does not send or save this information. Check any voice-typed text before you continue.
        </p>

        <form className="mt-5 space-y-5" onSubmit={submit}>
          {fields.map((field) => (
            <div key={field.name}>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={`application-${field.name}`} className="text-base font-semibold text-[#222222]">
                  {field.label}
                </label>
                <button
                  type="button"
                  onClick={() => (listening && activeField === field.name ? stopListening() : startListening(field.name))}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#222222] bg-white px-3 py-2 text-sm font-semibold text-[#222222] hover:bg-[#f7f7f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803D]"
                  aria-label={listening && activeField === field.name ? `Stop voice typing for ${field.label}` : `Use voice typing for ${field.label}`}
                  aria-pressed={listening && activeField === field.name}
                >
                  {listening && activeField === field.name ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {listening && activeField === field.name ? "Stop" : "Use voice"}
                </button>
              </div>
              <input
                id={`application-${field.name}`}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                value={form[field.name]}
                onChange={updateField}
                onFocus={() => setActiveField(field.name)}
                className="mt-2 min-h-12 w-full rounded-lg border border-[#717171] bg-white px-3 text-base text-[#222222] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/30"
              />
            </div>
          ))}

          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="application-helpWith" className="text-base font-semibold text-[#222222]">
                What would you like help with?
              </label>
              <button
                type="button"
                onClick={() => (listening && activeField === "helpWith" ? stopListening() : startListening("helpWith"))}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#222222] bg-white px-3 py-2 text-sm font-semibold text-[#222222] hover:bg-[#f7f7f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803D]"
                aria-label={listening && activeField === "helpWith" ? "Stop voice typing for your message" : "Use voice typing for your message"}
                aria-pressed={listening && activeField === "helpWith"}
              >
                {listening && activeField === "helpWith" ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {listening && activeField === "helpWith" ? "Stop" : "Use voice"}
              </button>
            </div>
            <textarea
              id="application-helpWith"
              name="helpWith"
              rows="4"
              value={form.helpWith}
              onChange={updateField}
              onFocus={() => setActiveField("helpWith")}
              className="mt-2 w-full rounded-lg border border-[#717171] bg-white px-3 py-3 text-base text-[#222222] focus:border-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#15803D]/30"
              placeholder="For example: I need help understanding the documents I need."
            />
          </div>

          <p className="text-sm text-[#525252]" aria-live="polite">
            {speechSupported ? message : "Voice typing is not available in this browser. You can still complete this form by typing."}
          </p>

          <button
            type="submit"
            className="min-h-12 rounded-lg bg-[#15803D] px-5 py-3 text-base font-semibold text-white hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803D]"
          >
            Prepare my next step
          </button>
        </form>

        {complete && (
          <div className="mt-5 flex gap-3 rounded-xl bg-white p-4 text-[#222222]" role="status">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#15803D]" />
            <div>
              <p className="font-semibold">You are ready to continue.</p>
              <p className="mt-1 text-sm">Use the official application button below to submit your application securely.</p>
            </div>
          </div>
        )}

        {!speechSupported && (
          <p className="mt-4 text-sm text-[#525252]">
            Voice typing works in many current Chrome, Edge and Safari versions when microphone access is allowed.
          </p>
        )}
      </div>
    </section>
  );
}
