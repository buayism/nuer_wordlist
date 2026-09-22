from collections import defaultdict

# Input files
input_files = [
    "book_wordlist.tsv",
    "bible_wordlist.tsv",
    "natural_sentences_wordlist.tsv"
]

# Store combined frequencies
word_counts = defaultdict(int)

# Read all files
for filename in input_files:
    with open(filename, "r", encoding="utf-8-sig") as f:
        for line in f:
            line = line.strip()

            if not line:
                continue

            parts = line.split("\t")

            if len(parts) < 2:
                continue

            word = parts[0].strip()
            
            # Fix known typos
            corrections = {
                "/cuä": "/cua"
            }
            if word in corrections:
                word = corrections[word]


            try:
                count = int(parts[1].strip())
            except ValueError:
                continue

            word_counts[word] += count

# Sort by frequency (highest first)
sorted_words = sorted(
    word_counts.items(),
    key=lambda x: x[1],
    reverse=True
)

# Write merged file
with open("merged_wordlist.tsv", "w", encoding="utf-8") as f:
    for word, count in sorted_words:
        f.write(f"{word}\t{count}\n")

print(f"Done! Merged {len(word_counts)} unique words into merged_wordlist.tsv")