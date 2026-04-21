const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

async function extractBooks() {
  const rootDir = __dirname;

  // Get all .docx files in root directory, excluding temp files (~$)
  const files = fs
    .readdirSync(rootDir)
    .filter((f) => f.endsWith(".docx") && !f.startsWith("~$"));

  console.log(`Found ${files.length} .docx files to process.\n`);

  const texts = [];

  for (const file of files) {
    const filePath = path.join(rootDir, file);
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
  const outputPath = path.join(rootDir, "books.txt");
  fs.writeFileSync(outputPath, combined, "utf-8");

  console.log(`\nbooks.txt created successfully (${combined.length} characters total).`);
}

extractBooks();
