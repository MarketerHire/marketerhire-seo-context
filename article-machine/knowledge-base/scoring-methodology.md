# Keyword Scoring Methodology

## Overview

The Article Machine uses a weighted composite score to rank keyword opportunities. Each keyword is scored 0-100 across 5 dimensions, then combined with weights.

## Formula

```
Composite = (Business_Value × 0.30) + (Opportunity × 0.25) +
            (Difficulty_Inv × 0.20) + (Relevance × 0.15) + (Content_Gap × 0.10)
```

## Dimensions

### 1. Business Value (30% weight)

Measures how well a keyword aligns with business objectives. Highest-weighted because content that doesn't serve business goals wastes resources regardless of SEO potential.

**Scoring signals:**
- Search intent type (transactional > commercial > informational)
- CPC (higher CPC = higher commercial value)
- Match to question bank (questions.json)
- Match to persona pain points

### 2. Opportunity (25% weight)

Measures how winnable the keyword is in the current SERP landscape. A high-value keyword with no realistic chance of ranking is a poor investment.

**Scoring signals:**
- Competitor domain authority in top 3
- Content age and quality in top 3
- Presence/absence of AI Overview
- PAA question alignment

### 3. Difficulty Inverse (20% weight)

Simple inverse of keyword difficulty: `100 - KD`. Rewards lower-difficulty keywords that are easier to rank for.

**Fallback when no KD data:**
- Long-tail (4+ words): assume KD 20
- Mid-tail (2-3 words): assume KD 40
- Head term (1 word): assume KD 70

### 4. Relevance (15% weight)

How closely the keyword matches the brand's existing context and expertise. Relevant keywords produce better content because the brand can speak with authority.

**Scoring signals:**
- Present in questions.json
- Matches topic tags
- Aligns with company profile problems/solutions
- Matches persona pain points
- Penalized if already covered in content inventory

### 5. Content Gap (10% weight)

Whether this keyword represents uncovered territory. Lower weight because new content is good, but not as important as business value and winnability.

**Scoring signals:**
- No existing content on topic
- Existing content is stale (>12 months)
- Competitors rank but we don't
- Topic appears in pSEO opportunities

## Weight Rationale

The weights prioritize practical business outcomes over theoretical SEO potential:
- Business Value + Opportunity = 55% → "Will this keyword drive results AND can we actually win?"
- Difficulty = 20% → "How hard is the climb?"
- Relevance + Gap = 25% → "Does this fit our brand and fill a need?"

## Adjusting Weights

For different content strategies, adjust weights in `output/{brand}/machine-config.json`:

| Strategy | BV | Opp | Diff | Rel | Gap |
|----------|-----|------|------|------|------|
| Default (balanced) | 0.30 | 0.25 | 0.20 | 0.15 | 0.10 |
| Quick wins (new site) | 0.15 | 0.25 | 0.35 | 0.10 | 0.15 |
| Revenue-focused | 0.40 | 0.20 | 0.15 | 0.15 | 0.10 |
| Thought leadership | 0.20 | 0.15 | 0.15 | 0.30 | 0.20 |
