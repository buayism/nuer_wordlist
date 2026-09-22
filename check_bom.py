import sys
sys.stdout.reconfigure(encoding='utf-8')

from collections import Counter

with open('merged_wordlist.tsv', 'r', encoding='utf-8') as f:
    words = []
    for line in f:
        line = line.strip()
        if not line:
            continue
        parts = line.split('\t')
        if len(parts) >= 2:
            words.append((parts[0], parts[1]))

# Find words that contain BOM
print('=== Words with BOM character ===')
for i, (w, count) in enumerate(words, 1):
    if '\ufeff' in w:
        clean = w.replace('\ufeff', '')
        print(f'  Line {i}: "{clean}" (freq={count}) has BOM prefix')

# Find all duplicate entries (same word after BOM removal)
print()
print('=== Duplicate entries (same word after BOM removal) ===')
clean_words = {}
for i, (w, count) in enumerate(words, 1):
    clean = w.replace('\ufeff', '')
    if clean in clean_words:
        orig_line, orig_count = clean_words[clean]
        print(f'  "{clean}" appears at line {orig_line} (freq={orig_count}) AND line {i} (freq={count})')
    else:
        clean_words[clean] = (i, count)

# Also check source files for BOM
print()
print('=== Source file BOM check ===')
for fname in ['book_wordlist.tsv', 'bible_wordlist.tsv', 'natural_sentences_wordlist.tsv']:
    with open(fname, 'rb') as f:
        first = f.read(3)
    print(f'  {fname}: starts with BOM = {first == b"\\xef\\xbb\\xbf"}')
    
    # Check first word in each file
    with open(fname, 'r', encoding='utf-8') as f:
        first_line = f.readline().strip()
        word = first_line.split('\t')[0]
        print(f'    First word: {repr(word)}')
