Remove AI-writing tells from SEO article drafts while preserving all facts, links, and structure. Ensure every section leads with a direct answer to its heading so AI systems can extract clean snippets.

## Inputs

- Primary source: article draft file (e.g., `draft-v1.md`, `draft-v2.md`, or `draft-optimized.md`)
- Style constraints: `brand-setup/writing-guidelines.md`

## AI Writing Tells to Scan For

Any of these patterns used once might be fine. The problem is when multiple tropes appear together or when a single trope is used repeatedly. Write like a human: varied, imperfect, specific.

### Word Choice

**"Quietly" and Other Magic Adverbs** — Overuse of "quietly" and similar adverbs to convey subtle importance or understated power. AI reaches for these adverbs to make mundane descriptions feel significant. Also includes: "deeply", "fundamentally", "remarkably", "arguably".
- "quietly orchestrating workflows, decisions, and interactions"
- "the one that quietly suffocates everything else"
- "a quiet intelligence behind it"

**"Delve" and Friends** — "Delve" went from an uncommon English word to appearing in a staggering percentage of AI-generated text. Part of a family of overused AI vocabulary including "certainly", "utilize", "leverage" (as a verb), "robust", "streamline", and "harness".
- "Let's delve into the details..."
- "We certainly need to leverage these robust frameworks..."

**"Tapestry" and "Landscape"** — Overuse of ornate or grandiose nouns where simpler words would do. "Tapestry" is used to describe anything interconnected. "Landscape" is used to describe any field or domain. Other offenders: "paradigm", "synergy", "ecosystem", "framework".
- "The rich tapestry of human experience..."
- "Navigating the complex landscape of modern AI..."

**The "Serves As" Dodge** — Replacing simple "is" or "are" with pompous alternatives like "serves as", "stands as", "marks", or "represents". AI avoids basic copulas because its repetition penalty pushes it toward fancier constructions.
- "The building serves as a reminder of the city's heritage."
- "The station marks a pivotal moment in the evolution of regional transit."

### Sentence Structure

**Negative Parallelism** — The "It's not X -- it's Y" pattern, often with an em dash. The single most commonly identified AI writing tell.
- "It's not bold. It's backwards."
- "Half the bugs you chase aren't in your code. They're in your head."

**"Not X. Not Y. Just Z."** — The dramatic countdown pattern.
- "Not a bug. Not a feature. A fundamental design flaw."

**"The X? A Y."** — Self-posed rhetorical questions answered immediately.
- "The result? Devastating."
- "The worst part? Nobody saw it coming."

**Anaphora Abuse** — Repeating the same sentence opening multiple times in quick succession.
- "They assume that users will pay... They assume that developers will build..."

**Tricolon Abuse** — Overuse of the rule-of-three pattern, often extended to four or five.
- "workflows, decisions, and interactions"

**"It's Worth Noting"** — Filler transitions that signal nothing. Also: "Importantly", "Interestingly", "Notably".

**Superficial Analyses** — Tacking a present participle phrase onto the end of a sentence to inject shallow analysis.
- "contributing to the region's rich cultural heritage"
- "underscoring its role as a dynamic hub"

**False Ranges** — Using "from X to Y" constructions where X and Y aren't on any real scale.

### Paragraph Structure

**Short Punchy Fragments** — Excessive use of very short sentences or fragments as standalone paragraphs for manufactured emphasis.

**Listicle in a Trench Coat** — Numbered or labeled points dressed up as continuous prose.

### Tone

**"Here's the Kicker"** — False suspense transitions. Also: "Here's the thing", "Here's where it gets interesting".

**"Think of It As..."** — The patronizing analogy.

**"Imagine a World Where..."** — The classic AI invitation to futurism.

**False Vulnerability** — Simulated self-awareness that reads as performative.

**"The Truth Is Simple"** — Asserting that something is obvious instead of proving it.

**Grandiose Stakes Inflation** — Everything is the most important thing ever.

**"Let's Break This Down"** — The pedagogical voice. Also: "Let's unpack this", "Let's explore", "Let's dive in".

**Vague Attributions** — Attributing claims to unnamed authorities.

**Invented Concept Labels** — AI-invented compound labels that sound analytical without being grounded.

### Formatting

**Em-Dash Addiction** — Compulsive overuse of em dashes. A human writer might use 2-3 per piece; AI will use 20+.

**Bold-First Bullets** — Every bullet point starts with a bolded phrase.

**Unicode Decoration** — Use of unicode arrows, smart quotes, and special characters.

### Composition

**Fractal Summaries** — "What I'm going to tell you; what I'm telling you; what I just told you" at every level.

**The Dead Metaphor** — Beating one metaphor into the ground across the entire piece.

**Historical Analogy Stacking** — Rapid-fire listing of historical companies or tech revolutions.

**One-Point Dilution** — Restating a single argument in 10 different ways.

**Content Duplication** — Repeating sections or paragraphs verbatim.

**The Signposted Conclusion** — "In conclusion", "To sum up", "In summary".

**"Despite Its Challenges..."** — The rigid formula where AI acknowledges problems only to immediately dismiss them.

## Workflow

1. Read the brand's `brand-setup/writing-guidelines.md` so rewrites stay on-voice.
2. Read the article draft and review all user-facing prose:
   - title and meta description
   - intro / hook paragraph
   - every H2 and H3 section body
   - FAQ answers
   - CTA text and closing paragraph
3. **Header-first answer rule:** For every H2/H3 section, confirm the first sentence directly answers the question or promise made by the heading. The reader (and any AI pulling a snippet) should get the core answer immediately — no throat-clearing, no buildup.
   - **Before:** _"## How Much Does a Fractional CMO Cost?"_ → "Pricing varies depending on a number of factors including experience, scope, and geography."
   - **After:** _"## How Much Does a Fractional CMO Cost?"_ → "Most fractional CMOs charge $3,000–$15,000/month depending on scope and seniority."
4. Scan the prose against every tell category listed above.
5. Rewrite only the copy text; preserve:
   - factual claims, numbers, names, dates, and links
   - heading hierarchy and document structure
   - schema-relevant content (FAQ pairs, author info, product mentions)
   - placeholder format if the file still contains placeholders
6. Replace AI-tell phrasing with direct, specific language:
   - prefer concrete verbs over decorative adverbs
   - reduce rhetorical templates and canned transitions
   - vary sentence starts and cadence naturally
7. Keep readability high:
   - short paragraphs (1-3 sentences)
   - avoid dense statistic stacking
   - keep tone human, clear, and confident
8. Run one final scan to ensure:
   - none of the tells above remain (especially repetitive patterns and theatrical framing)
   - every H2/H3 still leads with its answer in the first sentence
9. Save the cleaned result back to the same draft file path.

## Hard constraints

- Do not invent facts or sources.
- Do not remove source links.
- Do not alter heading hierarchy or document structure.
- Do not add emojis or decorative unicode unless already present.
- Do not switch to generic corporate language.
- Do not bury the answer — every H2/H3 must lead with a direct response to its heading.

## Quick rewrite examples

- "Here's the kicker: it's not growth, it's survival." → "The core issue is execution, not top-line growth."
- "Let's break this down." → "What changed is straightforward."
- "The result? Devastating." → "The result was a sharp drop."
- "## What Is a Fractional CMO?" → First sentence: "A fractional CMO is a part-time chief marketing officer hired on contract, typically 10–20 hours per week." (not "In today's competitive landscape, many companies are exploring...")
