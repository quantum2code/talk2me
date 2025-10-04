import { ErrorDetail, TranscriptSpans } from "shared/src/types";

export function generateSpans(
  transcript: string,
  corrections: ErrorDetail[]
): TranscriptSpans[] {
  let spans: TranscriptSpans[] = [];
  let cursor = 0;

  // We’ll walk through corrections in order of appearance
  for (const correction of corrections) {
    const idx = transcript.indexOf(correction.original, cursor);

    // If not found, just skip this correction
    if (idx === -1) continue;

    // Push clean text before the error
    if (idx > cursor) {
      spans.push({
        text: transcript.slice(cursor, idx),
        isError: false,
        error: null,
      });
    }

    // Push the error span
    spans.push({
      text: correction.original,
      isError: true,
      error: correction,
    });

    // Move cursor forward
    cursor = idx + correction.original.length;
  }

  // Push any leftover text after last correction
  if (cursor < transcript.length) {
    spans.push({
      text: transcript.slice(cursor),
      isError: false,
      error: null,
    });
  }

  return spans;
}
