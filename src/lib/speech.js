// Thin wrappers over the browser's Web Speech API (speech-to-text in Chrome,
// Edge and Safari; text-to-speech almost everywhere). Callers fall back to
// typing when these aren't available.

const Recognition = () =>
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export const canListen = () => Boolean(Recognition());
export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "en-IE") ||
    voices.find((v) => v.lang === "en-GB") ||
    voices.find((v) => v.lang?.startsWith("en")) ||
    null
  );
}

/** Says `text` aloud. Resolves when finished (or straight away if speech is off). */
export function speak(text) {
  return new Promise((resolve) => {
    if (!canSpeak()) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IE";
    u.rate = 0.95; // a touch slower than default, easier to follow
    const voice = pickVoice();
    if (voice) u.voice = voice;
    const done = () => resolve();
    u.onend = done;
    u.onerror = done;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setTimeout(done, 20000); // some browsers never fire onend
  });
}

export const stopSpeaking = () => canSpeak() && window.speechSynthesis.cancel();

/**
 * Listens for one answer. `onInterim` gets the words as they're heard.
 * Returns { promise, stop }; the promise resolves to the final text ("" if
 * nothing was heard) or rejects with the recognition error code.
 */
export function listenOnce({ onInterim } = {}) {
  const SR = Recognition();
  const rec = new SR();
  rec.lang = "en-IE";
  rec.interimResults = true;
  rec.maxAlternatives = 1;
  let finalText = "";
  const promise = new Promise((resolve, reject) => {
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      onInterim?.((finalText + interim).trim());
    };
    rec.onerror = (e) => (e.error === "no-speech" || e.error === "aborted" ? resolve("") : reject(e.error));
    rec.onend = () => resolve(finalText.trim());
  });
  rec.start();
  return { promise, stop: () => rec.stop() };
}
