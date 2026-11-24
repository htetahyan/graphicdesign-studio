export function cleanAndParseJson(output: any): any {
  const text = Array.isArray(output) ? output.join("") : String(output);

  const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch (e) {
      console.warn("Failed to parse JSON from code block, trying other methods...");
    }
  }

  const balanced = extractFirstJsonObject(text);
  if (balanced) {
    let jsonString = balanced;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn("Initial JSON parse failed, attempting to repair...");
      try {
        jsonString = repairJsonString(jsonString);
        return JSON.parse(jsonString);
      } catch (repairError) {
        console.error(
          "JSON parse failed even after repair. First 200 chars:",
          jsonString.substring(0, 200) + "...",
        );
        throw new Error("Failed to parse Gemini JSON output.");
      }
    }
  }

  const cleanedJson = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanedJson);
  } catch (e) {
    try {
      const repaired = repairJsonString(cleanedJson);
      return JSON.parse(repaired);
    } catch (e2) {
      console.error("Failed to extract valid JSON from Gemini response. Length:", cleanedJson.length);
      throw new Error("Failed to extract valid JSON from Gemini response.");
    }
  }
}

function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") depth--;

    if (depth === 0) {
      return text.slice(start, i + 1);
    }
  }

  return null;
}

function repairJsonString(jsonStr: string): string {
  let repaired = jsonStr;
  repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

  const lines = repaired.split('\n');
  const repairedLines = lines.map((line) => {
    if (line.trim().startsWith('//') || line.trim() === '') return line;

    const quotes = (line.match(/(?<!\\)"/g) || []).length;
    if (quotes % 2 !== 0 && !line.trim().match(/[,}\]]\s*$/)) {
      const lastQuotePos = line.lastIndexOf('"');
      const afterQuote = line.substring(lastQuotePos + 1).trim();
      if (afterQuote && !afterQuote.match(/^[,}\]]/)) {
        return line.trimEnd() + '"';
      }
    }
    return line;
  });

  repaired = repairedLines.join('\n');

  if (!repaired.trim().endsWith('}')) {
    repaired = repaired.trim() + '}';
  }

  return repaired;
}
