import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, Mic, Square } from "lucide-react";

const getRecognition = () =>
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

/**
 * Chat-style question box: type or speak what you need, press Enter or the
 * arrow to search. Shift+Enter adds a new line.
 */
export default function AskBox({ query, setQuery, onSearch, placeholder = "Tell us what you need help with…", autoFocus = false }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const areaRef = useRef(null);
  const canSpeak = Boolean(getRecognition());

  // Grow the box with its text, up to about six lines.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [query]);

  useEffect(() => () => recRef.current?.abort?.(), []);

  const toggleMic = () => {
    const SR = getRecognition();
    if (!SR) return;
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = "en-IE";
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setQuery(text);
      onSearch({ q: text });
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  const submit = (e) => {
    e?.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={submit}
      className="w-full rounded-[1.75rem] border border-input bg-white shadow-[0_10px_30px_-12px_rgba(21,128,61,0.35)] focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 transition"
    >
      <label htmlFor="ask" className="sr-only">What do you need help with?</label>
      <textarea
        id="ask"
        ref={areaRef}
        rows={1}
        value={query}
        autoFocus={autoFocus}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) submit(e);
        }}
        placeholder={listening ? "Listening… speak now" : placeholder}
        className="block w-full resize-none bg-transparent px-6 pt-5 pb-2 text-lg sm:text-xl text-foreground placeholder:text-muted-foreground outline-none"
      />
      <div className="flex items-center justify-between gap-3 px-3 pb-3">
        <p className="pl-3 text-sm text-muted-foreground hidden sm:block">
          {canSpeak ? "Type or tap the microphone to speak" : "Type your question and press Enter"}
        </p>
        <div className="flex items-center gap-2 ml-auto">
          {canSpeak && (
            <button
              type="button"
              onClick={toggleMic}
              aria-label={listening ? "Stop listening" : "Speak your question"}
              aria-pressed={listening}
              className={`h-12 rounded-full flex items-center justify-center gap-2 px-4 font-bold border transition ${
                listening
                  ? "bg-accent text-accent-foreground border-accent animate-pulse"
                  : "bg-white text-foreground border-input hover:bg-muted"
              }`}
            >
              {listening ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-5 h-5" />}
              <span>{listening ? "Stop" : "Speak"}</span>
            </button>
          )}
          <button
            type="submit"
            aria-label="Search"
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground flex items-center justify-center transition disabled:opacity-40"
            disabled={listening}
          >
            <ArrowUp className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </form>
  );
}
