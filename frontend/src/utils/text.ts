import type { data } from "../data";

export const buildResultArr = (
  transcript: string,
  mistakes: typeof data.aiResponse.correctionArr
) => {
  const result = [];
  let remaining = transcript;
  for (const mistake of mistakes) {
    const idx = remaining.indexOf(mistake.incorrectPhrase);
    if (idx !== -1) {
      // Push everything before the mistake as correct
      if (idx > 0) {
        result.push({
          string: remaining.slice(0, idx).trim().split(" "),
          status: "correct",
        });
      } // Push the mistake
      result.push({
        string: mistake.incorrectPhrase.split(" "),
        status: "incorrect",
        correction: mistake.correctedPhrase,
        cause: mistake.error,
      }); // Chop off the handled part
      remaining = remaining.slice(idx + mistake.incorrectPhrase.length).trim();
    }
  } // Push whatever is left as correct
  if (remaining.length > 0) {
    result.push({ string: remaining.split(" "), status: "correct" });
  }
  return result.filter((r) => r.string.length > 0);
};
