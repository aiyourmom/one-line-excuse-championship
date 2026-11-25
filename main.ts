import * as fs from "node:fs";
import * as path from "node:path";

const ENTRY =
  "I deleted the file because I was 98% confident it was a duplicate, and 100% wrong.";

function checkEntry(text: string): void {
  const problems: string[] = [];
  if (text.length < 1 || text.length > 140) {
    problems.push(`entry must be 1-140 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) problems.push("entry must not be blank");
  if (text.includes("\n")) problems.push("entry must be a single line");
  if (text !== text.trim()) problems.push("entry must not have leading/trailing whitespace");
  if (problems.length > 0) throw new Error(problems.join("; "));
}

function main(): void {
  checkEntry(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const target = path.join(outDir, "entry.txt");
  fs.writeFileSync(target, ENTRY, "utf8");
  const roundTrip = fs.readFileSync(target, "utf8");
  if (roundTrip !== ENTRY) throw new Error("read-back mismatch after write");
  console.log(`entry saved (${ENTRY.length} chars) -> ${target}`);
}

main();
