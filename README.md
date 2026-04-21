# Nuer Wordlist Generator

A tool for extracting and building a frequency-based wordlist from Nuer-language `.docx` documents. The resulting wordlist is intended for use as a **lexical model** for the [Keyman](https://keyman.com/) Nuer keyboard, enabling **predictive text** suggestions while typing.

## Purpose

This project processes a collection of Nuer texts (books) stored as `.docx` files and produces a tab-separated wordlist (`book_wordlist.tsv`) sorted by word frequency. This wordlist can then be used to build a Keyman lexical model that powers predictive text and autocorrect for the Nuer language.

## Source Texts

The wordlist is derived from six Nuer-language books:

| File | Description |
|------|-------------|
| `Kuën kä Nɛy ti̱ Naath.docx` | Kuën kä Nɛy ti̱ Naath |
| `Luëk kɛnɛ Comni̱ Teekä.docx` | Luëk kɛnɛ Comni̱ Teekä |
| `Nyegaath.docx` | Nyegaath |
| `ciɛŋ nuäri.docx` | ciɛŋ nuäri |
| `pual cari.docx` | pual cari |
| `ruec, booth, kuar.docx` | ruec, booth, kuar |

## How It Works

The pipeline has two steps:

### 1. Extract text from `.docx` files

```bash
node extract_books.js
```

- Reads all `.docx` files in the project directory (excluding temporary `~$` files)
- Extracts raw text using the [mammoth](https://www.npmjs.com/package/mammoth) library
- Combines all text into a single `books.txt` file

### 2. Build the frequency wordlist

```bash
node build_wordlist.js
```

- Reads `books.txt` and tokenizes the text
- Applies the following normalization:
  - Unicode NFC normalization
  - Lowercasing
  - Removal of apostrophes (`'` and `'`)
  - Removal of hyphens (`-`, `–`, `—`)
  - Removal of numbers
  - Handling of `/` prefix (kept only before valid Unicode letters)
  - Removal of non-letter characters
- Counts word frequencies
- Outputs `book_wordlist.tsv` sorted by frequency (descending)

## Output

**`book_wordlist.tsv`** — A tab-separated file with two columns:

| Column | Description |
|--------|-------------|
| `word` | The Nuer word (NFC-normalized, lowercase) |
| `count` | The number of occurrences in the source texts |

Example:

```
kɛ	2974
ɛ	1919
mi̱	1864
ɣöö	1389
kä	1353
```

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)

### Installation

```bash
npm install
```

### Usage

Run both steps in order:

```bash
node extract_books.js
node build_wordlist.js
```

The final wordlist will be available at `book_wordlist.tsv`.

## Using with Keyman Lexical Models

The generated `book_wordlist.tsv` can be used as a source wordlist for building a Keyman lexical model. See the [Keyman Developer documentation](https://help.keyman.com/developer/) for instructions on creating a lexical model from a wordlist TSV file.

## License

ISC
