/**
 * Word-level English→Telugu transliteration via Google Input Tools.
 * Used for coordinator notes when the letter language is Telugu.
 */

type Cache = Map<string, string>;

const cache: Cache = new Map();

function hasTelugu(text: string): boolean {
  return /[\u0C00-\u0C7F]/.test(text);
}

function isLatinWord(word: string): boolean {
  return /^[A-Za-z]+$/.test(word);
}

async function transliterateWord(word: string): Promise<string> {
  const key = word.toLowerCase();
  const hit = cache.get(key);
  if (hit) return hit;

  try {
    const url =
      "https://inputtools.google.com/request?" +
      new URLSearchParams({
        text: word,
        itc: "te-t-i0-und",
        num: "1",
        cp: "0",
        cs: "1",
        ie: "utf-8",
        oe: "utf-8",
        app: "nayisamakhya",
      }).toString();

    const res = await fetch(url);
    if (!res.ok) return word;
    const data: unknown = await res.json();
    // Shape: ["SUCCESS", [[input, [suggestion, ...], ...], ...]]
    if (
      Array.isArray(data) &&
      data[0] === "SUCCESS" &&
      Array.isArray(data[1]) &&
      Array.isArray(data[1][0]) &&
      Array.isArray(data[1][0][1]) &&
      typeof data[1][0][1][0] === "string"
    ) {
      const out = data[1][0][1][0] as string;
      cache.set(key, out);
      return out;
    }
  } catch {
    /* keep original Latin if offline / blocked */
  }
  return word;
}

/** Transliterate completed Latin words; leave Telugu and punctuation untouched. */
export async function transliterateLatinToTelugu(
  text: string,
): Promise<string> {
  if (!text.trim() || hasTelugu(text) && !/[A-Za-z]{2,}/.test(text)) {
    return text;
  }

  const parts = text.split(/(\s+)/);
  const out: string[] = [];

  for (const part of parts) {
    if (/^\s+$/.test(part) || part === "") {
      out.push(part);
      continue;
    }
    // Split trailing punctuation: "ledu." → ["ledu", "."]
    const m = part.match(/^([A-Za-z]+)([^A-Za-z]*)$/);
    if (m && isLatinWord(m[1]) && m[1].length >= 2) {
      const te = await transliterateWord(m[1]);
      out.push(te + m[2]);
    } else {
      out.push(part);
    }
  }

  return out.join("");
}
