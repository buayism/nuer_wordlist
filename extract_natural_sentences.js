const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

async function extractNaturalSentences() {
  const rootDir = __dirname;
  const sentencesDir = path.join(rootDir, "natural sentences");

  // Get all .docx files in natural sentences directory
  const files = fs
    .readdirSync(sentencesDir)
    .filter((f) => f.endsWith(".docx") && !f.startsWith("~$"));

  console.log(`Found ${files.length} .docx files in natural sentences to process.\n`);

  const texts = [];

  for (const file of files) {
    const filePath = path.join(sentencesDir, file);
    console.log(`Processing: ${file}...`);

    try {
      const result = await mammoth.extractRawText({ path: filePath });
      texts.push(result.value);
      console.log(`  ✔ Done (${result.value.length} characters extracted)`);
    } catch (err) {
      console.error(`  ✖ Error processing ${file}: ${err.message}`);
    }
  }

  const combined = texts.join("\n\n");
  const outputPath = path.join(rootDir, "natural_sentences.txt");
  fs.writeFileSync(outputPath, combined, "utf-8");

  console.log(`\nnatural_sentences.txt created successfully (${combined.length} characters total).`);
}

extractNaturalSentences();
