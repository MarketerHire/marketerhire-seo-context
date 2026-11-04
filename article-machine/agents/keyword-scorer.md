# Keyword Scorer Agent

## Your Role

You score and rank keywords using a composite formula based on business value, opportunity, difficulty, relevance, and content gaps.

## Inputs

- `output/{brand}/keyword-intel/keyword-universe.json` — enriched keyword list with raw metrics
- Brand context files:
  - `output/{brand}/brand-setup/company-profile.md` — what the company does, problems solved
  - `output/{brand}/brand-setup/audience-personas.md` — target personas with pain points
  - `output/{brand}/brand-setup/questions.json` — question bank with topic tags
  - `output/{brand}/brand-setup/content-inventory.json` — existing content coverage

## Composite Scoring Formula

```
Composite = (Business_Value × 0.30) + (Opportunity × 0.25) +
            (Difficulty_Inv × 0.20) + (Relevance × 0.15) + (Content_Gap × 0.10)
```

Each dimension scores 0-100. Composite is 0-100.

---

### Dimension 1: Business Value (weight 30%)

Score based on search intent + commercial potential + persona alignment.

| Signal | Points |
|--------|--------|
| Transactional intent (buy, hire, pricing, get started) | +40 |
| Commercial investigation (best, vs, compare, review, top) | +30 |
| Informational with product connection (how to, what is — can tie to product) | +20 |
| Pure informational (no natural product tie-in) | +10 |
| CPC > $5 | +20 |
| CPC $2-5 | +15 |
| CPC $1-2 | +10 |
| CPC < $1 or unknown | +5 |
| Keyword matches a question in `output/{brand}/brand-setup/questions.json` | +20 |
| Keyword maps to a persona pain point | +20 |

Cap at 100.

### Dimension 2: Opportunity (weight 25%)

How winnable is the SERP?

| Signal | Points |
|--------|--------|
| Top 3 results are DR < 60 (weak competition) | +30 |
| Top 3 results are mixed DR | +20 |
| Top 3 results are all DR 80+ (strong competition) | +5 |
| Top-ranking content is > 2 years old | +25 |
| Thin content dominates (< 1000 words in top 3) | +25 |
| No AI Overview currently triggered | +10 |
| PAA questions align with our content plan | +10 |

If SERP data unavailable (no DataForSEO), estimate based on keyword difficulty:
- KD < 20: Opportunity = 80
- KD 20-40: Opportunity = 60
- KD 40-60: Opportunity = 40
- KD > 60: Opportunity = 25

### Dimension 3: Difficulty Inverse (weight 20%)

```
Score = 100 - KD
```

If KD unavailable, estimate from keyword characteristics:
- Long-tail (4+ words): assume KD 20 → Score 80
- Mid-tail (2-3 words): assume KD 40 → Score 60
- Head term (1 word): assume KD 70 → Score 30

### Dimension 4: Relevance (weight 15%)

How well does the keyword match the brand context?

| Signal | Points |
|--------|--------|
| Keyword is in `output/{brand}/brand-setup/questions.json` (exact or near match) | +40 |
| Keyword matches a topic tag from `output/{brand}/brand-setup/questions.json` | +20 |
| Keyword matches `output/{brand}/brand-setup/company-profile.md` problem/solution | +20 |
| Keyword matches a persona's pain point | +15 |
| Keyword appears in `output/{brand}/brand-setup/content-inventory.json` (already covered) | -20 |
| Keyword is in a pillar topic cluster | +15 |

### Dimension 5: Content Gap (weight 10%)

| Signal | Points |
|--------|--------|
| No existing content in `output/{brand}/brand-setup/content-inventory.json` for this topic | +50 |
| Existing content is stale (> 12 months old) | +30 |
| Competitors rank but client does not | +20 |
| Topic appears in `output/{brand}/brand-setup/pseo-opportunities.json` | +10 |

---

## Process

1. Load `output/{brand}/keyword-intel/keyword-universe.json`
2. Load all brand context files
3. For each keyword:
   a. Calculate Business Value score
   b. Calculate Opportunity score
   c. Calculate Difficulty Inverse score
   d. Calculate Relevance score
   e. Calculate Content Gap score
   f. Apply weights → composite score
4. Sort descending by composite score
5. Add rank field (1 = highest)
6. Write `output/{brand}/keyword-intel/keyword-scored.json`

## Output Format

Each keyword in `output/{brand}/keyword-intel/keyword-scored.json` gets these additional fields:

```json
{
  "keyword": "content marketing strategy",
  "composite_score": 82,
  "rank": 1,
  "scores": {
    "business_value": 75,
    "opportunity": 85,
    "difficulty_inv": 55,
    "relevance": 90,
    "content_gap": 100
  },
  "score_rationale": "High relevance (matches persona pain point + question bank), strong opportunity (thin competitor content), moderate difficulty (KD 45)"
}
```
