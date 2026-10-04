import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUp, Check, Mic, RotateCcw } from "lucide-react";
import { grantById } from "@/data/grants";
import Waveform from "@/components/voice/Waveform";
import { formatEur, headline } from "@/lib/grantDisplay";

// A scripted mock-up of the voice flow for the pitch page. Nothing is recorded:
// pressing the mic plays listening -> transcript -> "Looks right?" -> result.

const TRANSCRIPT = "I am 88 and my heating has stopped working";
const WORDS = TRANSCRIPT.split(" ");
const LISTEN_MS = 1000;
const WORD_MS = 140;
const SEARCH_MS = 700;

const HER_GRANT = grantById("IE-HOUSING-OLDER-PEOPLE");
const ALSO_CHECK = ["IE-SEAI-WARMER-HOMES", "IE-DSP-FUEL-ALLOWANCE"].map(grantById).filter(Boolean);

export default function VoiceDemo() {
  const reduce = useReducedMotion();
  // idle -> listening -> transcribing -> confirm -> searching -> result
  const [phase, setPhase] = useState("idle");
  const [shown, setShown] = useState(0);
  const timers = useRef([]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const start = () => {
    clearTimers();
    setShown(0);
    setPhase("listening");
    later(() => setPhase("transcribing"), LISTEN_MS);
  };

  // Write the transcript out word by word, then ask for confirmation.
  useEffect(() => {
    if (phase !== "transcribing") return;
    if (reduce) {
      setShown(WORDS.length);
      setPhase("confirm");
      return;
    }
    if (shown < WORDS.length) {
      later(() => setShown((n) => n + 1), WORD_MS);
    } else {
      later(() => setPhase("confirm"), 400);
    }
  }, [phase, shown, reduce]);

  const confirm = () => {
    setPhase("searching");
    later(() => setPhase("result"), SEARCH_MS);
  };

  const text = WORDS.slice(0, shown).join(" ");
  const listening = phase === "listening";
  const hasText = shown > 0;

  return (
    <div className="rounded-3xl border border-[#dddddd] bg-white shadow-[0_6px_16px_rgba(0,0,0,0.08)] p-5">
      {/* The search bar */}
      <div
        className={`flex items-center gap-3 rounded-2xl border pl-4 pr-2 py-2 min-h-[3.75rem] transition ${
          listening ? "border-[#15803D] bg-[#F0FDF4]" : "border-[#ebebeb] bg-[#f7f7f7]"
        }`}
      >
        <div className="flex-1 min-w-0" aria-live="polite">
          {listening ? (
            <span className="flex items-center gap-3 text-[#15803D] font-semibold">
              <Waveform /> Listening…
            </span>
          ) : hasText || phase === "transcribing" ? (
            <span className="text-base text-[#222222]">
              {text}
              {phase === "transcribing" && <span className="inline-block w-0.5 h-5 bg-[#15803D] align-middle ml-0.5 animate-pulse" />}
            </span>
          ) : (
            <span className="text-base text-[#717171]">Say or type what you need help with</span>
          )}
        </div>

        <button
          type="button"
          onClick={phase === "idle" ? start : undefined}
          disabled={phase !== "idle"}
          aria-label={phase === "idle" ? "Press to speak" : "Microphone"}
          className="relative w-11 h-11 shrink-0 rounded-full flex items-center justify-center"
        >
          {/* Ripples while listening; a soft nudge while waiting to be pressed. */}
          {listening && !reduce && [0, 1].map((i) => (
            <motion.span
              key={i}
              className="absolute inset-0 rounded-full bg-[#15803D]"
              initial={{ scale: 1, opacity: 0.35 }}
              animate={{ scale: 1.9, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
          {phase === "idle" && !reduce && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-[#15803D]"
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          )}
          <span
            className={`relative w-11 h-11 rounded-full flex items-center justify-center border transition ${
              listening
                ? "bg-[#15803D] border-[#15803D] text-white"
                : "bg-white border-[#dddddd] text-[#222222] hover:bg-[#f7f7f7]"
            }`}
          >
            <Mic className="w-5 h-5" />
          </span>
        </button>
        <span className="w-11 h-11 shrink-0 rounded-full bg-[#15803D] text-white flex items-center justify-center" aria-hidden="true">
          <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
        </span>
      </div>

      {phase === "idle" && (
        <p className="mt-3 text-sm text-[#717171] text-center">Tap the microphone to try it</p>
      )}

      <AnimatePresence mode="wait">
        {phase === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 rounded-2xl border border-[#ebebeb] p-4"
          >
            <p className="text-lg font-semibold text-[#222222]">Looks right?</p>
            <p className="text-sm text-[#717171] mt-0.5">We heard: “{TRANSCRIPT}”</p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={confirm}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white font-semibold px-4 py-3 transition"
              >
                <Check className="w-4 h-4" /> Yes, find help
              </button>
              <button
                type="button"
                onClick={start}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#dddddd] text-[#222222] font-semibold px-4 py-3 hover:bg-[#f7f7f7] transition"
              >
                <RotateCcw className="w-4 h-4" /> Say it again
              </button>
            </div>
          </motion.div>
        )}

        {phase === "searching" && (
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 space-y-3"
            aria-live="polite"
          >
            <p className="text-sm text-[#717171]">Finding supports…</p>
            <div className="h-28 rounded-2xl bg-[#f2f2f2] animate-pulse" />
            <div className="h-5 w-2/3 rounded bg-[#f2f2f2] animate-pulse" />
          </motion.div>
        )}

        {phase === "result" && HER_GRANT && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-4"
          >
            <div className="rounded-2xl bg-[#14532D] text-white p-5">
              <p className="text-sm text-white/80">She may be able to get</p>
              <p className="mt-1 text-4xl sm:text-5xl font-bold tracking-tight">
                up to <span className="text-[#86EFAC]">{formatEur(HER_GRANT.amountEur)}</span>
              </p>
              <p className="mt-2 font-semibold">{HER_GRANT.name}</p>
              <p className="mt-1 text-sm text-white/75">
                For essential repairs so older people can stay at home. The amount depends on household income.
              </p>
            </div>
            <p className="mt-5 mb-1 text-sm font-semibold text-[#717171]">Also worth checking</p>
            <ul className="divide-y divide-[#ebebeb]">
              {ALSO_CHECK.map((g) => {
                const h = headline(g);
                return (
                  <li key={g.id} className="flex items-center justify-between gap-4 py-3">
                    <span className="font-semibold text-[#222222]">{g.name.split(" | ")[0]}</span>
                    <span className="shrink-0 text-sm text-[#15803D] font-semibold">
                      {h.value}
                      {g.amountEur != null && h.sub ? ` ${h.sub.split(" ")[0].toLowerCase()}` : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
            <Link
              to={`/apply/${HER_GRANT.id}?age=88&need=heating`}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white font-semibold px-6 py-3.5 transition"
            >
              Apply <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
