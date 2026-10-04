import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, Mic, Volume2, VolumeX } from "lucide-react";
import Waveform from "@/components/voice/Waveform";
import { QUESTIONS, applyAnswer, nextQuestion, yesNo } from "@/lib/applyQuestions";
import { canListen, canSpeak, listenOnce, speak, stopSpeaking } from "@/lib/speech";

/**
 * Asks the application questions one at a time, out loud, and fills the form
 * from spoken (or typed / tapped) answers. Each question is a "turn"; answers
 * that arrive for an old turn are ignored so speech, typing and taps can't
 * double-answer.
 */
export default function VoiceInterview({ form, setForm, onDone, onSkip }) {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(() => nextQuestion(form, 0));
  const [status, setStatus] = useState("idle"); // idle | speaking | listening
  const [interim, setInterim] = useState("");
  const [voiceOn, setVoiceOn] = useState(canSpeak());
  const [micBlocked, setMicBlocked] = useState(!canListen());
  const [options, setOptions] = useState([]);
  const [typed, setTyped] = useState("");

  const formRef = useRef(form);
  const stepRef = useRef(step);
  const modeRef = useRef("ask"); // "confirm" when checking a pre-filled answer
  const turn = useRef(0);
  const answered = useRef(false);
  const listenRef = useRef(null);
  const voiceRef = useRef(voiceOn);
  const micBlockedRef = useRef(micBlocked);
  const alive = useRef(true);
  const scrollRef = useRef(null);

  formRef.current = form;
  voiceRef.current = voiceOn;

  const push = (from, text) => setMessages((m) => [...m, { id: `${m.length}-${from}`, from, text }]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, interim]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      listenRef.current?.stop();
      stopSpeaking();
    };
  }, []);

  async function say(text) {
    push("bot", text);
    if (voiceRef.current && canSpeak()) {
      setStatus("speaking");
      await speak(text);
      if (alive.current) setStatus("idle");
    }
  }

  async function listen(t) {
    if (micBlockedRef.current) return;
    setStatus("listening");
    setInterim("");
    let text = "";
    try {
      const l = listenOnce({ onInterim: setInterim });
      listenRef.current = l;
      text = await l.promise;
    } catch {
      // Permission denied, no microphone or no speech service: switch to typing for the rest.
      micBlockedRef.current = true;
      setMicBlocked(true);
      if (!alive.current) return;
      setStatus("idle");
      setInterim("");
      if (t === turn.current && !answered.current) push("bot", "I can't use the microphone, so please type your answer below.");
      return;
    }
    listenRef.current = null;
    if (!alive.current) return;
    setStatus("idle");
    setInterim("");
    if (t !== turn.current || answered.current) return;
    if (!text) {
      push("bot", "I didn't hear anything. Tap the microphone to try again, or type your answer.");
      return;
    }
    answer(text);
  }

  async function ask(text, opts) {
    const t = ++turn.current;
    answered.current = false;
    setOptions(opts || []);
    await say(text);
    if (alive.current && t === turn.current && !answered.current) listen(t);
  }

  function askStep(i) {
    const q = QUESTIONS[i];
    const confirming = Boolean(q.confirm && formRef.current[q.key]);
    modeRef.current = confirming ? "confirm" : "ask";
    ask(confirming ? q.confirm(formRef.current) : q.ask(formRef.current), confirming ? ["Yes", "No"] : q.options);
  }

  async function finish() {
    setOptions([]);
    const first = (formRef.current.name || "").split(" ")[0];
    await say(`Thanks${first ? `, ${first}` : ""}. I've filled in your form. Please check your answers below, then tick the box to confirm.`);
    if (alive.current) onDone();
  }

  function advance() {
    const i = nextQuestion(formRef.current, stepRef.current + 1);
    if (i === -1) finish();
    else {
      stepRef.current = i;
      setStep(i);
    }
  }

  function respond(text) {
    const q = QUESTIONS[stepRef.current];
    if (modeRef.current === "confirm") {
      const y = yesNo(text);
      if (y === true) return advance();
      if (y === false) {
        modeRef.current = "ask";
        return ask(q.ask(formRef.current), q.options);
      }
      return ask("Sorry, is that right? Yes or no.", ["Yes", "No"]);
    }
    const r = q.parse(text, formRef.current);
    if (r.retry) return ask(r.retry, q.options);
    const next = applyAnswer(formRef.current, q.key, r.value, r.extra);
    formRef.current = next;
    setForm(next);
    advance();
  }

  function answer(text) {
    const clean = String(text).trim();
    if (!clean || answered.current) return;
    answered.current = true;
    listenRef.current?.stop();
    stopSpeaking();
    setStatus("idle");
    setOptions([]);
    push("me", clean);
    respond(clean);
  }

  // Ask each question when it becomes current (the first on mount).
  useEffect(() => {
    stepRef.current = step;
    if (step === -1) finish();
    else askStep(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const toggleMic = () => {
    if (status === "listening") listenRef.current?.stop();
    else {
      stopSpeaking();
      listen(turn.current);
    }
  };

  const toggleVoice = () => {
    if (voiceOn) stopSpeaking();
    setVoiceOn(!voiceOn);
  };

  const total = QUESTIONS.length;
  const current = step === -1 ? total : Math.min(step + 1, total);

  return (
    <div>
      <div className="rounded-3xl border border-[#dddddd] bg-white shadow-[0_6px_16px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[#ebebeb]">
          <div className="flex-1">
            <p className="text-sm font-semibold">Question {current} of {total}</p>
            <div className="mt-1.5 h-1.5 rounded-full bg-[#f2f2f2] overflow-hidden">
              <div className="h-full bg-[#15803D] transition-all duration-500" style={{ width: `${(current / total) * 100}%` }} />
            </div>
          </div>
          {canSpeak() && (
            <button
              type="button"
              onClick={toggleVoice}
              aria-pressed={voiceOn}
              className="flex items-center gap-1.5 rounded-full border border-[#dddddd] px-3 py-1.5 text-sm hover:bg-[#f7f7f7] transition"
            >
              {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {voiceOn ? "Reading aloud" : "Muted"}
            </button>
          )}
        </div>

        <div ref={scrollRef} className="h-[24rem] overflow-y-auto px-5 py-5 space-y-3" aria-live="polite">
          {messages.map((m) =>
            m.from === "bot" ? (
              <div key={m.id} className="flex items-end gap-2">
                <span className="w-7 h-7 shrink-0 rounded-full bg-[#15803D] flex items-center justify-center" aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                </span>
                <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-[#f7f7f7] px-4 py-2.5 text-base">{m.text}</p>
              </div>
            ) : (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-[#15803D] text-white px-4 py-2.5 text-base">{m.text}</p>
              </div>
            ),
          )}
          {status === "listening" && (
            <div className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-md border-2 border-dashed border-[#15803D] text-[#15803D] px-4 py-2.5 text-base">
                {interim || "…"}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-[#ebebeb] p-4 space-y-3">
          {options.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {options.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => answer(o)}
                  className="rounded-full px-4 py-2 text-sm border border-[#dddddd] bg-white hover:border-[#222222] transition"
                >
                  {o}
                </button>
              ))}
            </div>
          )}
          <p className="flex items-center gap-2 min-h-[1.5rem] text-sm text-[#717171]">
            {status === "listening" && (<><Waveform /> Listening… just speak, it stops when you pause</>)}
            {status === "speaking" && "Speaking…"}
            {status === "idle" && (micBlocked ? "Type your answer below" : "Tap the microphone to answer, or type")}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              answer(typed);
              setTyped("");
            }}
            className="flex items-center gap-2"
          >
            <label htmlFor="typed-answer" className="sr-only">Your answer</label>
            <input
              id="typed-answer"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type your answer"
              className="flex-1 min-w-0 rounded-full border border-[#dddddd] px-4 py-3 text-base outline-none focus:border-[#222222]"
            />
            <button type="submit" aria-label="Send" className="w-12 h-12 shrink-0 rounded-full border border-[#dddddd] flex items-center justify-center hover:bg-[#f7f7f7] transition">
              <ArrowUp className="w-5 h-5" />
            </button>
            {!micBlocked && (
              <button
                type="button"
                onClick={toggleMic}
                aria-label={status === "listening" ? "Stop listening" : "Answer by voice"}
                aria-pressed={status === "listening"}
                className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition ${
                  status === "listening" ? "bg-[#15803D] text-white animate-pulse" : "bg-[#15803D] hover:bg-[#166534] text-white"
                }`}
              >
                <Mic className="w-6 h-6" />
              </button>
            )}
          </form>
        </div>
      </div>
      <button type="button" onClick={onSkip} className="mt-4 text-sm text-[#717171] underline hover:text-[#222222]">
        Fill in the form myself instead
      </button>
    </div>
  );
}
