import React, { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { canListen, listenOnce } from "@/lib/speech";

/**
 * "Use voice" button for a single form field (from Tanam's guided form):
 * dictate into the field, and the words are added to whatever is there.
 * Hidden where the browser can't do speech recognition.
 */
export default function VoiceFieldButton({ label, onText, onStatus }) {
  const [listening, setListening] = useState(false);
  const ref = useRef(null);

  useEffect(() => () => ref.current?.stop(), []);

  if (!canListen()) return null;

  const start = async () => {
    setListening(true);
    onStatus?.(`Listening for your ${label.toLowerCase()}. Speak clearly, then pause.`);
    try {
      const l = listenOnce();
      ref.current = l;
      const text = await l.promise;
      if (text) {
        onText(text);
        onStatus?.("Your words have been added. Please check them before continuing.");
      } else {
        onStatus?.("We could not hear that. Please try again or type your answer.");
      }
    } catch {
      onStatus?.("Voice typing isn't available right now. You can still type your answer.");
    } finally {
      ref.current = null;
      setListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => (listening ? ref.current?.stop() : start())}
      aria-label={listening ? `Stop voice typing for ${label}` : `Use voice typing for ${label}`}
      aria-pressed={listening}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
        listening ? "border-[#15803D] bg-[#15803D] text-white" : "border-[#222222] bg-white text-[#222222] hover:bg-[#f7f7f7]"
      }`}
    >
      {listening ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
      {listening ? "Stop" : "Use voice"}
    </button>
  );
}
