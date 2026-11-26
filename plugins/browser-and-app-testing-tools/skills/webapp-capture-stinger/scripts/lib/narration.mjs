// Narration timing and text-to-speech formatting for recorded demos.
// Per-cue timings come from the edited timeline, a words-per-minute fit report
// flags overruns, and the Eleven v4 formatter writes one clip text per cue.
// Designed by Legion Code Inc.

// Eleven v4 reads bracketed audio tags. SSML <break> is not supported there.
const AUDIO_TAG = /\[[a-z][a-z ]{0,30}\]/gi;
// The optional group wraps its own lazy scan, so the time attribute is captured wherever it sits.
const SSML_BREAK = /<break\b(?:[^>]*?\btime\s*=\s*["']?([\d.]+)\s*(ms|s)?["']?)?[^>]*\/?>/gi;
const TLDS = "com|io|app|dev|ai|co|net|org|so|sh|xyz|us|uk|ca|de|tech|cloud";
const DOMAIN = new RegExp(`\\b(?:https?:\\/\\/)?((?:[a-z0-9-]+\\.)+)(${TLDS})\\b(\\/[^\\s]*)?`, "gi");

/** Spoken words only: audio tags and markup do not take time to read. */
export function countWords(text) {
  return String(text || "").replace(SSML_BREAK, " ").replace(AUDIO_TAG, " ").replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
}
/** Text for captions: no audio tags, no markup. */
export function captionText(text) {
  return String(text || "").replace(SSML_BREAK, " ").replace(AUDIO_TAG, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Per-cue timings with a fit report. spans come from editedSpans(); each scene's
 * narration is placed at the first span that uses its clip.
 */
export function narrationCues(spans, { wordsPerMinute = 140, leadMs = 300, tailMs = 300 } = {}) {
  const seen = new Set();
  const cues = [];
  for (const span of spans) {
    const scene = span.scene;
    if (!scene?.narration || seen.has(scene.id)) continue;
    seen.add(scene.id);
    const words = countWords(scene.narration);
    const startMs = span.startMs + leadMs;
    const availableMs = Math.max(0, span.durationMs - leadMs - tailMs);
    const neededMs = Math.ceil((words / wordsPerMinute) * 60000);
    const requiredWpm = availableMs ? Math.round(words / (availableMs / 60000)) : Infinity;
    const status = neededMs > availableMs ? "overrun" : neededMs > availableMs * 0.9 ? "tight" : "fits";
    cues.push({ index: cues.length + 1, scene: scene.id, title: scene.title, text: captionText(scene.narration), narration: scene.narration, words, startMs, endMs: startMs + Math.max(availableMs, 500), availableMs, neededMs, requiredWpm, overrunMs: Math.max(0, neededMs - availableMs), status });
  }
  return cues;
}

export function fitReport(cues, { wordsPerMinute = 140 } = {}) {
  const lines = [`# Narration fit at ${wordsPerMinute} words per minute`, "", "| Cue | Scene | Words | Needed s | Available s | Required wpm | Status |", "| --- | --- | --- | --- | --- | --- | --- |"];
  for (const c of cues) lines.push(`| ${c.index} | ${c.scene} | ${c.words} | ${(c.neededMs / 1000).toFixed(1)} | ${(c.availableMs / 1000).toFixed(1)} | ${Number.isFinite(c.requiredWpm) ? c.requiredWpm : "n/a"} | ${c.status === "overrun" ? `OVERRUN by ${(c.overrunMs / 1000).toFixed(1)}s` : c.status} |`);
  const over = cues.filter((c) => c.status === "overrun");
  lines.push("", over.length ? `${over.length} cue(s) overrun. Shorten the narration, add a wait to the scene, or lengthen its segment.` : "Every cue fits its scene.", "");
  return lines.join("\n");
}

/** "app.example.com/docs" -> "app dot example dot com slash docs". */
export function spellDomains(text) {
  return String(text).replace(DOMAIN, (_, host, tld, rest) => {
    const parts = [...host.split(".").filter(Boolean), tld];
    const spoken = parts.join(" dot ");
    const tail = rest && rest !== "/" ? " slash " + rest.replace(/^\//, "").split("/").filter(Boolean).join(" slash ") : "";
    return spoken + tail;
  });
}

/**
 * Format one cue for Eleven v4: bracketed audio tags kept ([pause], [short pause],
 * [warm]), SSML breaks converted to tags, domains spelled out. Returns { text, warnings }.
 */
export function formatElevenV4(text, { style } = {}) {
  const warnings = [];
  let out = String(text || "");
  if (SSML_BREAK.test(out)) warnings.push("SSML <break> is not supported by Eleven v4; converted to [pause] tags");
  SSML_BREAK.lastIndex = 0;
  out = out.replace(SSML_BREAK, (_, n, unit) => {
    const seconds = n ? Number(n) / (unit === "ms" ? 1000 : 1) : 0.5;
    return seconds >= 1.5 ? " [long pause] " : seconds <= 0.4 ? " [short pause] " : " [pause] ";
  });
  if (/<[a-z/][^>]*>/i.test(out)) { warnings.push("other markup removed; Eleven v4 reads tags in square brackets"); out = out.replace(/<[^>]+>/g, " "); }
  const spelled = spellDomains(out);
  if (spelled !== out) warnings.push("domains spelled out for speech");
  out = spelled;
  if (style && !/^\s*\[/.test(out)) out = `[${style}] ${out}`;
  return { text: out.replace(/\s+/g, " ").replace(/\s+([.,!?])/g, "$1").trim(), warnings };
}

/** One clip per cue. Returns files to write and a manifest. */
export function ttsClips(cues, { style, voice = null, model = null } = {}) {
  const files = [];
  const manifest = { format: "eleven-v4", note: "One request per cue. Bracketed audio tags are expressive cues; SSML is unsupported. Confirm the model id and voice in your own ElevenLabs account. The API key comes from your secret manager, never this file.", voice, model, clips: [] };
  for (const c of cues) {
    const { text, warnings } = formatElevenV4(c.narration, { style });
    const base = `${String(c.index).padStart(2, "0")}-${c.scene}`.replace(/[^A-Za-z0-9._-]+/g, "-");
    files.push({ name: `${base}.txt`, text: text + "\n" });
    manifest.clips.push({ cue: c.index, scene: c.scene, textFile: `${base}.txt`, audioFile: `${base}.mp3`, startMs: c.startMs, maxMs: c.availableMs, warnings });
  }
  return { files, manifest };
}
