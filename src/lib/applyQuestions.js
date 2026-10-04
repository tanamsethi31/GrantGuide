// The application form as a conversation: each question knows how to ask,
// how to understand a spoken or typed answer, and which form field it fills.
// parse() returns { value, extra? } on success or { retry } with a re-ask.
import { COUNTIES } from "@/lib/counties";

export const DOCUMENTS = [
  "Proof of household income",
  "Proof that you own or live in the home",
  "A quote for the work that's needed",
];

export const INCOME_OPTIONS = ["Under €75,000", "Over €75,000", "Not sure"];

const SMALL = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

/** "88", "eighty-eight", "20k", "twenty thousand" -> number, or null. */
export function parseNumber(text) {
  const t = String(text).toLowerCase().replace(/,/g, "");
  const digits = t.match(/(\d+(?:\.\d+)?)\s*(k\b|thousand|grand)?/);
  if (digits) return Math.round(parseFloat(digits[1]) * (digits[2] ? 1000 : 1));
  let total = 0;
  let current = 0;
  let found = false;
  for (const w of t.split(/[\s-]+/)) {
    if (w in SMALL) {
      current += SMALL[w];
      found = true;
    } else if (w === "hundred") current *= 100;
    else if (w === "thousand" || w === "grand") {
      total += current * 1000;
      current = 0;
    }
  }
  return found ? total + current : null;
}

/** true / false / null (unclear). Negatives win: "I don't own it" is a no. */
export function yesNo(text) {
  const t = ` ${String(text).toLowerCase()} `;
  if (/\b(no|nope|not|don't|dont|do not|haven't|have not|isn't|rent|renting)\b/.test(t)) return false;
  if (/\b(yes|yeah|yep|yup|i do|i have|correct|right|sure|it is|that's it|own|absolutely|definitely)\b/.test(t)) return true;
  return null;
}

export const findCounty = (text) => COUNTIES.find((c) => new RegExp(`\\b${c}\\b`, "i").test(text || "")) || "";

const titleCase = (s) => s.toLowerCase().replace(/(^|[\s'-])\p{L}/gu, (m) => m.toUpperCase());

export function cleanName(text) {
  const t = String(text).trim().replace(/^(my name is|my name's|it's|it is|i'm|i am|this is)\s+/i, "").replace(/[.!?]+$/, "");
  return t.length >= 2 ? titleCase(t) : "";
}

const cleanAddress = (text) =>
  String(text).trim().replace(/^(i live (at|in)|my address is|it's|it is)\s+/i, "").replace(/[.]+$/, "");

const sentence = (text) => {
  const t = String(text).trim();
  return t ? t[0].toUpperCase() + t.slice(1) + (/[.!?]$/.test(t) ? "" : ".") : "";
};

export function parseIncome(text) {
  const t = String(text).toLowerCase();
  if (/not sure|don't know|dont know|no idea|unsure/.test(t)) return { value: "Not sure" };
  const n = parseNumber(t);
  if (n !== null) {
    const amount = n < 1000 ? n * 1000 : n; // "about 20" almost always means 20 thousand
    return { value: amount <= 75000 ? "Under €75,000" : "Over €75,000" };
  }
  if (/under|less|below|lower/.test(t)) return { value: "Under €75,000" };
  if (/over|more|above|higher/.test(t)) return { value: "Over €75,000" };
  return { retry: "Sorry, I didn't catch that. Is it under 75 thousand euro, over, or are you not sure?" };
}

const yesNoParse = (retry) => (t) => {
  const y = yesNo(t);
  return y === null ? { retry } : { value: y };
};

export const QUESTIONS = [
  {
    key: "name",
    ask: () => "Let's start with you. What's your full name?",
    parse: (t) => {
      const v = cleanName(t);
      return v ? { value: v } : { retry: "Sorry, I didn't catch your name. Could you say it again?" };
    },
  },
  {
    key: "age",
    confirm: (f) => `You told us you're ${f.age}. Is that right?`,
    ask: () => "How old are you?",
    parse: (t) => {
      const n = parseNumber(t);
      return n && n > 15 && n < 120 ? { value: String(n) } : { retry: "Sorry, how old are you? Just the number is fine." };
    },
  },
  {
    key: "phone",
    ask: () => "What's the best phone number for you? You can say skip if you'd rather not.",
    options: ["Skip"],
    parse: (t) => {
      if (/skip|rather not|no thanks|don't|dont/i.test(t)) return { value: "" };
      const d = String(t).replace(/[^\d+]/g, "");
      return d.replace("+", "").length >= 7
        ? { value: d }
        : { retry: "Sorry, I didn't get that number. Could you say it again, or say skip?" };
    },
  },
  {
    key: "address",
    ask: () => "What's your home address?",
    parse: (t) => {
      const v = cleanAddress(t);
      if (v.length < 5) return { retry: "Sorry, could you say your address again?" };
      const county = findCounty(v);
      return { value: v, extra: county ? { county } : undefined };
    },
  },
  {
    key: "county",
    skip: (f) => Boolean(f.county),
    ask: () => "Which county is that in?",
    parse: (t) => {
      const c = findCounty(t);
      return c ? { value: c } : { retry: "Sorry, which county? For example, Cork or Galway." };
    },
  },
  {
    key: "owner",
    ask: () => "Do you own your home?",
    options: ["Yes", "No"],
    parse: (t) => {
      const y = yesNo(t);
      return y === null ? { retry: "Sorry, do you own your home? Yes or no is fine." } : { value: y ? "Yes" : "No" };
    },
  },
  {
    key: "need",
    confirm: (f) => `You said: "${f.need}" Is that what needs fixing?`,
    ask: () => "What needs fixing in your home?",
    parse: (t) => (String(t).trim().length > 2 ? { value: sentence(t) } : { retry: "Sorry, could you tell me again what needs fixing?" }),
  },
  {
    key: "income",
    ask: () => "Roughly what's your total household income before tax, per year? Under 75 thousand euro, over 75 thousand, or not sure?",
    options: INCOME_OPTIONS,
    parse: parseIncome,
  },
  {
    key: `doc:${DOCUMENTS[0]}`,
    ask: () => "Nearly done. Do you have proof of your household income?",
    options: ["Yes", "No"],
    parse: yesNoParse("Sorry, do you have proof of your income? Yes or no?"),
  },
  {
    key: `doc:${DOCUMENTS[1]}`,
    ask: () => "Do you have proof that you own or live in the home?",
    options: ["Yes", "No"],
    parse: yesNoParse("Sorry, do you have proof you own or live in the home? Yes or no?"),
  },
  {
    key: `doc:${DOCUMENTS[2]}`,
    ask: () => "And do you have a quote for the work that's needed?",
    options: ["Yes", "No"],
    parse: yesNoParse("Sorry, do you have a quote for the work? Yes or no?"),
  },
];

/** Applies a parsed answer for `key` to the form. Document answers tick or untick. */
export function applyAnswer(form, key, value, extra) {
  if (key.startsWith("doc:")) {
    const doc = key.slice(4);
    const docs = form.docs.filter((d) => d !== doc);
    return { ...form, docs: value ? [...docs, doc] : docs, ...extra };
  }
  return { ...form, [key]: value, ...extra };
}

/** Index of the next question to ask at or after `from`, or -1 when finished. */
export function nextQuestion(form, from) {
  for (let i = from; i < QUESTIONS.length; i++) {
    if (!QUESTIONS[i].skip?.(form)) return i;
  }
  return -1;
}
