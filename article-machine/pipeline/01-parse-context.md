# Stage 1: Parse Context Document

## Purpose
Extract and structure the keyword research context document into a standardized `parsed-context.md` format that all downstream stages consume.

## Input Detection

Detect format by file extension:
- `.numbers` → Apple Numbers (zip archive containing IWA files)
- `.csv` → CSV with section headers
- `.md` → Markdown (pass through with validation)

## Extraction: .numbers Files

Use Python `numbers-parser` library:

```python
from numbers_parser import Document

doc = Document(file_path)
for sheet in doc.sheets:
    for table in sheet.tables:
        for row in range(table.num_rows):
            vals = []
            for col in range(table.num_cols):
                cell = table.cell(row, col)
                vals.append(str(cell.value) if cell.value is not None else '')
```

Parse the raw output into 4 sections by detecting section headers:
- `SECTION 1: ON-PAGE SEO RECOMMENDATIONS` → On-Page SEO
- `SECTION 2: KEYWORD RESEARCH` → Keywords
- `SECTION 3: ARTICLE OUTLINE` → Outline
- `SECTION 4: H2s WITH PRIMARY + SECONDARY KEYWORDS` → H2 Keyword Map

## Extraction: .csv Files

Read the CSV. Detect sections by rows containing `SECTION N:` in the first column. Parse each section's header row and data rows.

## Extraction: .md Files

Validate the markdown contains all 4 required H2 sections. Pass through as-is.

## Output Format: `parsed-context.md`

```markdown
# Article Context: [Article Title from H1 Tag]

## 1. On-Page SEO Recommendations

| Element | Recommendation |
|---------|---------------|
| H1 Tag | ... |
| Title Tag | ... |
| Meta Description | ... |
| URL Slug | ... |
| Schema Markup Type | ... |
| Schema — Article | ```json ... ``` |

## 2. Keyword Research

| Keyword | Intent | Volume | KD | CPC | Type | Notes |
|---------|--------|--------|----|-----|------|-------|
| ... | ... | ... | ... | ... | Primary Target | ... |
| ... | ... | ... | ... | ... | Secondary | ... |

**Primary targets:** [list keywords where Type = "Primary Target"]
**Conversion keywords:** [list keywords where Type contains "Conversion"]
**Total keyword universe:** [count] keywords

## 3. Article Outline

| Section | Element | Description | Word Count | Keywords |
|---------|---------|-------------|------------|----------|
| - | INTRO | ... | 150-200 | ... |
| 1.0 | H2: ... | ... | 350-400 | ... |
| ... | ... | ... | ... | ... |

**Total target word count:** [from outline]

## 4. H2 Keyword Map

| H2 | Primary Keyword | Secondary Keywords | SEO Notes |
|----|----------------|-------------------|-----------|
| ... | ... | ... | ... |
```

## Validation Checklist

After parsing, verify:
- [ ] Section 1 has at least: H1, Title Tag, Meta Description, URL Slug
- [ ] Section 2 has at least 5 keywords with volume data
- [ ] Section 3 has at least 3 H2 sections with word count targets
- [ ] Section 4 has keyword mapping for each H2 in section 3
- [ ] Total target word count is specified

Flag any missing items as `⚠️ MISSING` in the output.
