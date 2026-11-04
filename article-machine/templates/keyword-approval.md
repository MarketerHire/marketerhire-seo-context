# Keyword Approval — Presentation Template

Present this after Phase 2 completes.

---

```
## Keyword Selection for {client_name}

Analyzed {total_keywords} keywords across {cluster_count} topic clusters.
Selected top {N} by composite score.

| # | Keyword | Score | Volume | KD | CPC | Intent | Type |
|---|---------|-------|--------|----|-----|--------|------|
| 1 | {keyword} | {score}/100 | {vol} | {kd} | ${cpc} | {intent} | {type} |
| 2 | ... | ... | ... | ... | ... | ... | ... |
| ... |

### Score Breakdown

**{keyword_1}** (Score: {score})
- Business Value: {bv}/100 — {rationale}
- Opportunity: {opp}/100 — {rationale}
- Difficulty: {diff}/100 — KD {kd}
- Relevance: {rel}/100 — {rationale}
- Content Gap: {gap}/100 — {rationale}

[Repeat for each keyword]

### Actions

- **approve** — proceed to article generation with these {N} keywords
- **remove N** — remove keyword #N from the list
- **add "{keyword}"** — manually add a specific keyword
- **swap N "{keyword}"** — replace keyword #N with a different one
- **reorder** — change the priority order
- **more** — expand selection to {N+5} keywords
- **less** — reduce selection to {N-2} keywords
- **rerun** — re-run scoring (e.g., after changing weights)
```
