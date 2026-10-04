import React, { useRef, useState } from "react";
import { Search, Mic } from "lucide-react";
import { COUNTIES } from "@/lib/counties";
import WhoPicker from "@/components/search/WhoPicker";

const seg = "flex-1 min-w-0 px-6 py-3 rounded-full hover:bg-[#ebebeb] transition text-left";
const lab = "block text-xs font-semibold text-[#222222]";

export default function PillSearch({ location, setLocation, query, setQuery, who, setWho, onSearch }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      className="flex flex-col md:flex-row md:items-center bg-white rounded-3xl md:rounded-full border border-[#dddddd] shadow-[0_3px_12px_rgba(0,0,0,0.1)] p-2 max-w-3xl mx-auto"
    >
      <label className={seg}>
        <span className={lab}>Where</span>
        <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-transparent outline-none text-sm text-[#717171] cursor-pointer">
          <option value="">All of Ireland</option>
          {COUNTIES.map((c) => (
            <option key={c} value={c}>{`Co. ${c}`}</option>
          ))}
        </select>
      </label>
      <span className="hidden md:block w-px h-8 bg-[#dddddd]" />
      <label className={seg}>
        <span className={lab}>What</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={listening ? "Listening…" : "Say or type what you need"}
          className="w-full bg-transparent outline-none text-sm text-[#222222] placeholder:text-[#717171]"
        />
      </label>
      <span className="hidden md:block w-px h-8 bg-[#dddddd]" />
      <WhoPicker who={who} setWho={setWho} className={seg} labelClass={lab} />
      <div className="flex items-center justify-end gap-2 p-1">
        <button
          type="button"
          onClick={toggleMic}
          aria-label="Speak"
          className={`w-12 h-12 rounded-full flex items-center justify-center border transition ${
            listening ? "bg-[#FF385C] text-white border-[#FF385C] animate-pulse" : "bg-white text-[#222222] border-[#dddddd] hover:bg-[#f7f7f7]"
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>
        <button type="submit" aria-label="Search" className="w-12 h-12 rounded-full bg-[#FF385C] hover:bg-[#e31c5f] text-white flex items-center justify-center transition">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}