# Stage 5: Quality Gate (25-Point Scorecard)

## Purpose
Score the optimized article across 25 criteria. Determine if it's ready to publish, needs minor fixes, or needs re-optimization.

## Inputs
- `draft-optimized.md` from Stage 4
- `schema.json` from Stage 4
- `brief.md` from Stage 2

## Scoring Rules

For each criterion: **PASS** (1 point) or **FAIL** (0 points) with a one-line explanation. For any FAIL, state the specific fix required.

---

### Content & Structure (6 points)

| # | Criterion | How to Check |
|---|-----------|-------------|
| 1 | Primary question answered in first 100 words | Read opening — does it directly answer the primary query from the brief? |
| 2 | Every H2/H3 has a 40-60 word answer block | Check each heading's first paragraph. Count words. Must be 40-60 and self-contained. |
| 3 | Each section is modular and self-contained (75-300 words) | Read each H2 in isolation. Does it make sense without context? Is it within word range? |
| 4 | FAQ section with 5+ concise Q&As | Count FAQ questions. Verify each answer is 40-60 words and self-contained. |
| 5 | Tables for comparisons, lists for steps/options | Check: are any comparisons written as paragraphs? Are any processes not numbered? |
| 6 | Meets target word count from brief | Count total words. Compare to brief's target. Within 10% tolerance. |

### SEO (6 points)

| # | Criterion | How to Check |
|---|-----------|-------------|
| 7 | Title tag present, <60 chars, includes primary keyword | Check YAML frontmatter `title`. Count chars. Verify keyword present. |
| 8 | Meta description present, <155 chars | Check YAML frontmatter `meta_description`. Count chars. |
| 9 | Heading hierarchy correct (H1→H2→H3, no skips) | Verify: one H1, H2s follow, H3s under H2s. No H1→H3 jumps. |
| 10 | 3+ internal links with natural anchor text, ALL verified live | Count internal links. Verify anchor text is descriptive. **Every URL must match brand-setup/client-config.json or be verified via web search. No guessed/fabricated URLs.** |
| 11 | Alt text on all images | Check all image references have alt attributes. |
| 12 | Clean, keyword-informed URL slug | Check YAML frontmatter `url_slug`. Lowercase, hyphens, keyword present. |

### AEO (4 points)

| # | Criterion | How to Check |
|---|-----------|-------------|
| 13 | First paragraph works as standalone snippet | Could this paragraph be extracted by Google/Perplexity as a complete answer? |
| 14 | Question-format headings match real search phrasing | Compare headings to keywords in the brief. Do they match how people actually search? |
| 15 | FAQ answers are 40-60 words, self-contained | Check each FAQ answer. No "as mentioned above." Within word count. |
| 16 | Best snippet candidate paragraph identified and refined | Is there a clear "best answer" paragraph that would win a featured snippet? |

### GEO (5 points)

| # | Criterion | How to Check |
|---|-----------|-------------|
| 17 | Key claims include specific data with named sources | Check factual claims. Do they cite "[Source Name]" or "[Study/Report]"? |
| 18 | Entity names consistent and precise throughout | Search for key entities. Are they named the same way every time? |
| 19 | Author byline and credentials visible | Is the author named with their title/credentials in or near the content? |
| 20 | "Last Updated" date present | Check YAML frontmatter for `date_modified`. |
| 21 | Content depth matches or exceeds AI-cited competitors | Compare section depth to what the brief specifies. Any thin sections? |

### Schema (4 points)

| # | Criterion | How to Check |
|---|-----------|-------------|
| 22 | Article/BlogPosting schema valid and complete | Check `schema.json` — has headline, author, publisher, dates, mainEntityOfPage? |
| 23 | FAQPage schema wraps all FAQ pairs | Count FAQ Qs in article vs. in schema. All present? |
| 24 | BreadcrumbList present | Check `schema.json` for BreadcrumbList with at least 2 items. |
| 25 | Person + Organization referenced correctly | Author and publisher entities have name, url, and cross-reference correctly? |

---

## Verdict

| Score | Verdict | Action |
|-------|---------|--------|
| 23-25 | **PASS** | Ready to publish. Move to publication. |
| 20-22 | **NEEDS FIXES** | List specific fixes. User says "fix the issues" → re-run Stage 4 targeting only failures. |
| <20 | **NEEDS RE-OPTIMIZATION** | Article quality too low. Loop back to Stage 4 with full 4-pass re-optimization. |

### Refresh Mode Adjustments

If `existing-article.md` exists in the article output directory (this is a content refresh):

- **PASS** threshold drops to **21+** (instead of 23+) — refreshes intentionally preserve existing content that may not perfectly match all new-article criteria
- **NEEDS FIXES** range becomes **18-20** (instead of 20-22)
- **NEEDS RE-OPTIMIZATION** becomes **<18** (instead of <20)

Add a **Refresh Impact** section to the scorecard output:

```markdown
## Refresh Impact
- Sections kept from original: {N}
- Sections rewritten: {N}
- New sections added: {N}
- Sections removed: {N}
- Estimated content freshness improvement: {assessment}
```

---

## Output Format: `scorecard.md`

```markdown
# Quality Scorecard: [Article Title]

**Date:** [today]
**Score:** X/25
**Verdict:** [PASS / NEEDS FIXES / NEEDS RE-OPTIMIZATION]

## Content & Structure (X/6)
1. ✅ Primary question answered in first 100 words
2. ✅ Answer blocks present on all H2/H3s
3. ❌ Section modularity — Section 3 references "as we discussed above" → Rewrite opening of Section 3 to be self-contained
4. ✅ FAQ section has 5 Q&As
5. ✅ Structured formats used correctly
6. ✅ Word count: 2,050 (target: 1,850-2,150)

## SEO (X/6)
7. ✅ Title tag: "How AI Is Changing SEO & PPC in 2026 | MarketerHire" (56 chars)
...

## AEO (X/4)
...

## GEO (X/5)
...

## Schema (X/4)
...

## Fixes Required
[Only if verdict is NEEDS FIXES]
1. [Specific fix with location and instruction]
2. [Specific fix with location and instruction]
```

## Output Path
`output/{article_slug}/scorecard.md`
