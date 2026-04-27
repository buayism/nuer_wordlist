const fs = require("fs");
const path = require("path");
const readline = require("readline");

// List of negative words that should keep the / prefix
const NEGATIVE_WORDS = new Set([
  "/ciɛ", "/ci̱", "/ca", "/caa", "/ken", "/kän", "/ka̱n", "/kui̱ci̱",
  "/ci̱kɛ", "/kui̱c", "/käni̱", "/keni̱", "/ciɛɛ", "/cu", "/cua",
  "/cuaa", "/cua̱", "/cua̱a̱", "/känɛ", "/ka̱nɛ", "/kenɛ", "/cuarɛ", "/cuä"
]);

async function buildWordlist() {
  const inputPath = path.join(__dirname, "natural_sentences.txt");
  const outputPath = path.join(__dirname, "natural_sentences_wordlist.tsv");

  const fileStream = fs.createReadStream(inputPath, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const wordMap = new Map();
  let lineCount = 0;

  for await (const rawLine of rl) {
    lineCount++;

    if (lineCount % 1000 === 0) {
      console.log(`Processing line ${lineCount}...`);
    }

    // 1. Unicode NFC normalization
    let line = rawLine.normalize("NFC");

    // 2. Lowercase
    line = line.toLowerCase();

    // 3. Remove apostrophes (' and ')
    line = line.replace(/['']/g, "");

    // 4. Remove hyphens (-, –, —)
    line = line.replace(/[-–—]/g, "");

    // 5. Remove all numbers
    line = line.replace(/\d/g, "");

    // 6. Remove any non-letter characters except Unicode letters, combining marks, and /
    line = line.replace(/[^\p{L}\p{M}\/\s]/gu, " ");

    // 7. Tokenize: match words that optionally start with / followed by letters/combining marks
    const tokens = line.match(/\/?[\p{L}\p{M}]+/gu);

    if (tokens) {
      for (const token of tokens) {
        // If token has / prefix
        if (token.startsWith("/")) {
          // Only keep / if it's a negative word, otherwise strip it
          if (NEGATIVE_WORDS.has(token)) {
            wordMap.set(token, (wordMap.get(token) || 0) + 1);
          } else {
            const stripped = token.slice(1);
            if (stripped) {
              wordMap.set(stripped, (wordMap.get(stripped) || 0) + 1);
            }
          }
        } else {
          wordMap.set(token, (wordMap.get(token) || 0) + 1);
        }
      }
    }
  }

  console.log(`\nFinished processing ${lineCount} lines.`);
  console.log(`Total unique words: ${wordMap.size}`);

  // Sort by frequency descending
  const sorted = [...wordMap.entries()].sort((a, b) => b[1] - a[1]);

  // Write TSV
  const tsvLines = sorted.map(([word, count]) => `${word}\t${count}`);
  fs.writeFileSync(outputPath, tsvLines.join("\n"), "utf-8");

  console.log(`natural_sentences_wordlist.tsv created successfully (${sorted.length} entries).`);
}

buildWordlist();
