import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, Mic, MapPin } from "lucide-react";
import { COUNTIES } from "@/lib/counties";
import { CATEGORIES } from "@/lib/categories";
import WhoPicker from "@/components/search/WhoPicker";

const getRecognition = () =>
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

const pill = "flex items-center gap-2 rounded-full border border-[#dddddd] bg-white px-4 py-2 text-sm text-[#222222] hover:shadow-md transition";

/**
 * Chat-style search: type or speak what you need, then Enter (Shift+Enter for a
 * new line). Filters sit underneath: topic tabs, where, and who.
 */
export default function ChatSearch({
  query, setQuery, onSearch,
  category, setCategory, location, setLocation, who, setWho,
}) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const areaRef = useRef(null);
  const canSpeak = Boolean(getRecognition());

  // Grow with the text, up to about five lines.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
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
    <div>
      <form
        onSubmit={submit}
        className="max-w-3xl mx-auto flex items-end gap-2 bg-white rounded-3xl border border-[#dddddd] shadow-[0_3px_12px_rgba(0,0,0,0.1)] p-2 pl-6"
      >
        <label htmlFor="ask" className="sr-only">What do you need help with?</label>
        <textarea
          id="ask"
          ref={areaRef}
          rows={1}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) submit(e);
          }}
          placeholder={listening ? "Listening…" : "Say or type what you need help with"}
          className="flex-1 min-w-0 resize-none bg-transparent outline-none py-3 text-base text-[#222222] placeholder:text-[#717171]"
        />
        {canSpeak && (
          <button
            type="button"
            onClick={toggleMic}
            aria-label={listening ? "Stop listening" : "Speak"}
            aria-pressed={listening}
            className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center border transition ${
              listening ? "bg-[#15803D] text-white border-[#15803D] animate-pulse" : "bg-white text-[#222222] border-[#dddddd] hover:bg-[#f7f7f7]"
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
        <button type="submit" aria-label="Search" className="w-12 h-12 shrink-0 rounded-full bg-[#15803D] hover:bg-[#166534] text-white flex items-center justify-center transition">
          <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </form>

      <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2 mt-4">
        <label className={`${pill} cursor-pointer`}>
          <MapPin className="w-4 h-4 text-[#717171]" aria-hidden="true" />
          <span className="font-semibold">Where</span>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="County"
            className="bg-transparent outline-none text-[#717171] cursor-pointer"
          >
            <option value="">All of Ireland</option>
            {COUNTIES.map((c) => (
              <option key={c} value={c}>{`Co. ${c}`}</option>
            ))}
          </select>
        </label>
        <WhoPicker who={who} setWho={setWho} className={pill} />
      </div>

      {/* Centred when it fits, scrolls sideways (from the first tab) when it doesn't. */}
      <nav aria-label="Topic" className="overflow-x-auto mt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-7 w-max mx-auto">
          {CATEGORIES.filter((c) => c.inTabs !== false).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              aria-pressed={category === value}
              className={`flex items-center gap-2 shrink-0 whitespace-nowrap pb-2 pt-2 text-sm border-b-2 transition ${
                category === value ? "border-[#222222] text-[#222222] font-semibold" : "border-transparent text-[#717171] hover:text-[#222222]"
              }`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
