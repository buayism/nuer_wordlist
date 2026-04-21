const fs = require("fs");
const path = require("path");
const readline = require("readline");

async function buildWordlist() {
  const inputPath = path.join(__dirname, "books.txt");
  const outputPath = path.join(__dirname, "book_wordlist.tsv");

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

    // 6. Handle `/` — keep only when it's a valid prefix (before a Unicode letter or combining mark)
    //    Remove any `/` that does not precede a valid letter.
    //    We do this by replacing invalid `/` with a space first.
    line = line.replace(/\/(?![\p{L}\p{M}])/gu, " ");

    // 7. Remove any non-letter characters except Unicode letters, combining marks, and valid `/`
    //    Replace removed characters with spaces.
    line = line.replace(/[^\p{L}\p{M}\/\s]/gu, " ");

    // 8. Tokenize: match words that optionally start with `/` followed by letters/combining marks
    const tokens = line.match(/(?:\/)?[\p{L}\p{M}]+/gu);

    if (tokens) {
      for (const token of tokens) {
        wordMap.set(token, (wordMap.get(token) || 0) + 1);
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

  console.log(`book_wordlist.tsv created successfully (${sorted.length} entries).`);
}

buildWordlist();
