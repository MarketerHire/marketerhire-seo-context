# Stage 3: Draft Article

## Purpose
Write a complete first draft following the brief, optimized for SEO/AEO/GEO from the start, with humanization built in.

## Inputs
- `brief.md` from Stage 2
- `brand-setup/client-config.json` (for tone, voice)

## Refresh Mode (Conditional)

If the brief contains a **Section 0: Refresh Strategy**, this is a content refresh:

1. Read the existing article from `existing-article.md`
2. For sections marked **KEEP**: preserve the core content, apply light edits for voice consistency and updated data
3. For sections marked **REWRITE**: write from scratch following the brief, ignoring existing content
4. For sections marked **ADD**: write new sections following the brief
5. For sections marked **REMOVE**: omit from the draft entirely
6. All drafting rules below (AI-tell removal, AEO formatting, voice rules) apply identically to both new and refreshed content

---

## Drafting Rules

Follow these three rule sets simultaneously. They're complementary, not conflicting.

---

### Rule Set 1: Playbook Structure Rules

**Opening (first 100 words):**
Answer the primary question directly. No preamble, no "In today's..." opener. First paragraph must work as a standalone featured snippet or AI Overview answer.

**Each H2/H3 section:**
- Open with a 40-60 word answer block — direct, self-contained answer to what the heading promises
- Expand with context, evidence, examples
- Paragraphs: 1-3 sentences max
- Each section: 75-300 words, independently extractable (the "Taco Bell Test" — could this section be ripped out and still make sense on its own?)
- Weave in secondary keywords from the brief naturally — never force them

**FAQ section:**
- Questions from the brief (PAA + outline)
- Each answer: 40-60 words, completely self-contained
- No "as mentioned above" or references to other sections

**Format rules:**
- Tables for comparisons (features, tools, options side-by-side)
- Numbered lists for processes (step 1, step 2...)
- Bullet lists for options, features, or non-sequential items
- Cite specific data with named sources — not "studies show" but "[Source Name] found that..."

---

### Rule Set 2: Human Voice Rules (from seo-content skill)

**The First Paragraph Rule:**
Answer the search query in the first 2-3 sentences. Don't make them scroll.

**The "So What?" Chain:**
For every point, chase the "so what?" until you hit something the reader cares about. Write from the bottom of the chain.

**Specificity over generality:**
- Weak: "This saves time." → Strong: "This cut email outreach from 4 hours to 15 minutes per day."
- Weak: "Many marketers struggle." → Strong: "73% of marketers publish less than once per week."

**AI-Ism Kill List — NEVER use these words:**
delve, dive into, dig into, comprehensive, robust, cutting-edge, utilize, leverage (as verb), crucial, vital, essential, unlock, unleash, supercharge, game-changer, revolutionary, landscape, navigate, streamline, tapestry, multifaceted, myriad, foster, facilitate, enhance, realm, paradigm, synergy, embark, journey (for processes), plethora, bevy, nuanced, intricate, seamless

**AI-Ism Kill List — NEVER use these phrases:**
- "In today's fast-paced world/digital age/landscape..."
- "It's important to note that..."
- "When it comes to..."
- "In order to..." (just say "to")
- "Whether you're a... or a..."
- "Let's dive in / Let's explore"
- "Without further ado"
- "At the end of the day"
- "It goes without saying"
- "In conclusion"
- "This comprehensive guide will..."
- "Are you looking for..." / "Look no further"

**Structure-level AI tells to AVOID:**
- Everything in threes (vary your groupings)
- Perfect parallelism in every bullet (vary structure)
- Hedge stacking ("While X, it's important to consider Y, but also Z")
- Fake objectivity ("Some experts say... others believe..." — take a position)
- Summary sandwich (intro summarizes, body covers, conclusion summarizes again)
- Empty transitions ("Now that we've covered X, let's move on to Y")

**Voice injection — DO include:**
- Opinions with reasoning (the author/brand should have takes)
- Specific examples from real work, real data, real outcomes
- Admission of limitations ("This won't work for everyone. If you're in [context], different rules apply.")
- Uncertainty where honest ("Best guess: [reason]. But we've seen it work across X sites.")
- Varied sentence rhythm: short punch. Then longer explanatory sentences. Fragments for emphasis. Questions followed by answers.

**Detection checklist (verify before finishing draft):**
- [ ] No AI words from kill list
- [ ] No AI phrases from kill list
- [ ] Not everything grouped in threes
- [ ] At least one direct opinion stated
- [ ] At least one specific number from real data
- [ ] At least one limitation or caveat acknowledged
- [ ] Sentence lengths vary (some <5 words, some >20)
- [ ] Would you say this out loud to a smart colleague?

---

### Rule Set 3: AEO Page Rules

1. **Answer First** — First sentence answers the primary question. No throat-clearing.
2. **Go Deeper** — After the answer, 2-3 paragraphs expand with context, nuance, evidence.
3. **Original Data** — Include stats, case studies, proprietary insights. Named sources only.
4. **FAQ Section** — 3+ questions as H3 headings. Self-contained answers.
5. **Structure** — Bullets, tables, explicit headers. AI systems extract structured content more reliably.
6. **Standalone Sections** — Every H2 makes sense in isolation. No "as mentioned above."
7. **Product/Brand Integration** — Weave the client's product/service naturally. Not a sales pitch — context where the brand is genuinely relevant.

---

### Tone

Use the tone from `client-config.json → site_context.tone`. Apply it throughout.

Default if not specified: authoritative but accessible. Declarative language for facts. Conversational for explanations. No filler.

---

### Internal Links

Insert internal links per the brief's linking plan. Use natural anchor text — never "click here" or naked URLs.

**CRITICAL:** Only use URLs that exist in `client-config.json` under `internal_links.pillar_pages` or `internal_links.existing_blog_posts`. Do NOT guess or invent URLs — if you need a link that isn't in the config, run a web search (`site:{domain} [topic]`) to find the real URL first. Broken links damage SEO and credibility.

---

### What NOT to Include in the Draft

- Meta title (added in Stage 4)
- Meta description (added in Stage 4)
- Schema markup (generated in Stage 4)
- YAML frontmatter (added in Stage 4)

Output pure article content as markdown.

## Output

Write the complete draft to: `output/{article_slug}/draft-v1.md`
