---
title: "Coding open-ended responses with natural language processing and language models"
date: "2026-07-10"
description: "When saving costs and time coincides with a gain in effectiveness. How we use natural language processing (NLP) techniques and language models to code open-ended responses with a focus on the research question."
tags: ["python", "nlp", "ia"]
lang: "en"
postId: "codificador-preguntas-abiertas"
cover: "/img/cover-codificador.svg"
draft: false
---

<div style="margin-bottom:2.5rem;border-radius:12px;overflow:hidden;background:#0c0f0c;">
  <img src="/img/cover-codificador.svg" alt="Open-ended survey coder" style="width:100%;display:block;height:auto;" />
</div>

In market research, open-ended questions are a double-edged sword: they capture a richness and specificity that's desirable, but quantifying them is always a challenge because of the ambiguity, semantic variety, and spelling errors they carry. At Moiguer we built our own in-house solution to this age-old problem in opinion surveys, developing our own software to code open-ended responses.

To turn free text into data there's a process called **coding**. Someone reads all the responses, groups the ones that say the same thing, assigns a number to each group, and replaces the text with that number in the database. "Hellmanns", "Jelman", and "hellmans" all end up under a single code, the one for Hellmann's.

It's tedious, repetitive work, prone to consistency errors. When you're dealing with thousands of responses to multiple questions, across several projects running in parallel, it's also expensive and inefficient. That was the starting point.

The goal was to increase efficiency (of resources and time) without losing effectiveness (I mean the fidelity of the final result) and, if possible, to increase it.

---

## Two problems, not one

Every open-ended question falls into one of two situations, and each demands a different logic.

**When a codebook already exists.** In longitudinal studies, panels, or multi-wave projects, the categories were defined in an earlier round. There's a file (the codebook) with a list of numeric keys and their corresponding values. The task is *imputation*: take each new response and map it to the right key. The core challenge is spelling variability: "Cocca-cola", "coca cola", and "CocaCola" all refer to the same key.

**When no codebook exists.** In new studies, or questions that have never been asked, the categories have to be *coded* from scratch. The analyst doesn't know in advance what they'll find — they might have a hunch, but if they try to predefine the codebook they risk introducing their own bias over what respondents actually said. First you have to discover what categories emerge from the data, then assign each response to one, and finally produce a reusable codebook for the next waves.

Both flows share infrastructure but solve different things. The distinction matters: imputation follows a pattern that already exists, while coding manufactures one.

<svg viewBox="0 0 600 270" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:1.5rem auto;font-family:monospace;">
  <defs><marker id="d1" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="currentColor" opacity="0.7"/></marker></defs>
  <rect x="215" y="6" width="170" height="36" rx="8" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-opacity="0.5"/>
  <text x="300" y="24" text-anchor="middle" font-size="11" fill="currentColor" font-weight="bold">Load project</text>
  <text x="300" y="37" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">and pick questions</text>
  <line x1="300" y1="42" x2="300" y2="58" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#d1)"/>
  <polygon points="300,60 375,92 300,124 225,92" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.55"/>
  <text x="300" y="90" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">is there a</text>
  <text x="300" y="103" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">codebook?</text>
  <path d="M225,92 L150,92 L150,142" fill="none" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#d1)"/>
  <text x="185" y="84" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">yes</text>
  <rect x="65" y="144" width="170" height="44" rx="8" fill="currentColor" fill-opacity="0.09" stroke="currentColor" stroke-opacity="0.65"/>
  <text x="150" y="163" text-anchor="middle" font-size="11" fill="currentColor" font-weight="bold">Imputation</text>
  <text x="150" y="178" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">use the codes that already exist</text>
  <path d="M375,92 L450,92 L450,142" fill="none" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#d1)"/>
  <text x="415" y="84" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">no</text>
  <rect x="365" y="144" width="170" height="44" rx="8" fill="currentColor" fill-opacity="0.09" stroke="currentColor" stroke-opacity="0.65"/>
  <text x="450" y="163" text-anchor="middle" font-size="11" fill="currentColor" font-weight="bold">Coding</text>
  <text x="450" y="178" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">build the codes from scratch</text>
  <path d="M150,188 L150,224 L290,224" fill="none" stroke="currentColor" stroke-opacity="0.4" marker-end="url(#d1)"/>
  <path d="M450,188 L450,224 L310,224" fill="none" stroke="currentColor" stroke-opacity="0.4" marker-end="url(#d1)"/>
  <rect x="215" y="228" width="170" height="36" rx="8" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-opacity="0.5"/>
  <text x="300" y="246" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="bold">Coded dataset</text>
  <text x="300" y="259" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">and a codebook ready for the next wave</text>
</svg>

---

## Multiple projects, multiple responses

The tool wasn't designed for a single study. The initial menu lists every project in a central folder, and each one has its own structure: input data, the codebook, learned variants, and results with their checkpoints. Subprojects are detected automatically, and when files follow a wave pattern the tool asks which wave to process. Each project can also have its own special codes.

No matter how clearly a question is worded, as long as questions keep being answered by people with agency of their own, there will always be room for free interpretation (and let's hope it stays that way), which often means the respondent answers with more than one factor packed into a single response. For example, faced with the question "What do you find most attractive about this product?", a respondent might answer: "I like its packaging and the variety it offers." We designed a logic to capture both dimensions, packaging and variety, distinguishing between the top-of-mind or primary driver and secondary ones.

---

## The imputation flow

When the codebook already exists, it comes in as a read-only input. The goal is a single output: the coded dataset.

<svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:1.5rem auto;font-family:monospace;">
  <defs><marker id="i2" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="currentColor" opacity="0.7"/></marker></defs>
  <rect x="30" y="60" width="120" height="44" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="4 3"/>
  <text x="90" y="80" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.75" font-weight="bold">Codebook</text>
  <text x="90" y="94" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.55">input (read-only)</text>
  <path d="M150,82 L196,82" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="4 3" marker-end="url(#i2)"/>
  <rect x="200" y="6" width="200" height="38" rx="8" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-opacity="0.5"/>
  <text x="300" y="24" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="bold">Unique values + frequencies</text>
  <text x="300" y="37" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">normalized text</text>
  <line x1="300" y1="44" x2="300" y2="56" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i2)"/>
  <rect x="200" y="58" width="200" height="40" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="4 3"/>
  <text x="300" y="76" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="bold">Pre-classify without tokens</text>
  <text x="300" y="90" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">cache, specials, and blanks</text>
  <line x1="300" y1="98" x2="300" y2="110" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i2)"/>
  <rect x="200" y="112" width="200" height="38" rx="8" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-opacity="0.6"/>
  <text x="300" y="130" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="bold">Classify the rest with the LLM</text>
  <text x="300" y="143" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">in batches · tolerant to typos</text>
  <line x1="300" y1="150" x2="300" y2="162" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i2)"/>
  <polygon points="300,164 370,194 300,224 230,194" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.55"/>
  <text x="300" y="198" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="bold">landed in "other"?</text>
  <path d="M370,194 L440,194 L440,131 L400,131" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="4 3" marker-end="url(#i2)"/>
  <text x="386" y="186" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">yes</text>
  <text x="452" y="165" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.6">second pass</text>
  <line x1="300" y1="224" x2="300" y2="238" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i2)"/>
  <text x="310" y="236" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">no</text>
  <rect x="200" y="240" width="200" height="30" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.5"/>
  <text x="300" y="259" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">Analyst review</text>
  <line x1="300" y1="270" x2="300" y2="282" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i2)"/>
  <rect x="205" y="284" width="190" height="24" rx="6" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-opacity="0.75" stroke-width="1.4"/>
  <text x="300" y="300" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">▸ Coded dataset</text>
</svg>

The system handles the cheap part first: already-seen values come from a cache, and special responses (blanks, "don't know", "none") are assigned by natural language processing rules, without calling any LLM. Only the rest goes to a model, which classifies in batches with high tolerance for typos. Whatever landed in "other" gets a stricter second pass before human review.

That work by the model leaves a valuable residue. Every time it maps a new variation ("cocca-cola" to Coca-Cola), the relationship is saved. On the next run those known variations no longer need the model: they're resolved in pre-classification. As iterations go by, the system relies less and less on the LLM.

---

## The coding flow

When there's no codebook, the work is more ambitious and has two outputs: the coded dataset and a new codebook. That codebook is what turns the next wave into an imputation problem.

<svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:1.5rem auto;font-family:monospace;">
  <defs><marker id="i3" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="currentColor" opacity="0.7"/></marker></defs>
  <rect x="195" y="6" width="210" height="40" rx="8" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-opacity="0.6"/>
  <text x="300" y="24" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="bold">Step 1 · Propose categories</text>
  <text x="300" y="38" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">frequencies as signal · names only</text>
  <line x1="300" y1="46" x2="300" y2="58" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i3)"/>
  <polygon points="300,60 368,88 300,116 232,88" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.55"/>
  <text x="300" y="92" text-anchor="middle" font-size="9" fill="currentColor" font-weight="bold">too many?</text>
  <path d="M232,88 L150,88 L150,26 L195,26" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="4 3" marker-end="url(#i3)"/>
  <text x="210" y="80" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">yes</text>
  <text x="138" y="57" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.6" transform="rotate(-90 138 57)">trim the list</text>
  <line x1="300" y1="116" x2="300" y2="128" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i3)"/>
  <text x="310" y="127" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">no</text>
  <rect x="195" y="130" width="210" height="34" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.5"/>
  <text x="300" y="151" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">Analyst adjusts the list</text>
  <line x1="300" y1="164" x2="300" y2="176" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i3)"/>
  <rect x="195" y="178" width="210" height="40" rx="8" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-opacity="0.6"/>
  <text x="300" y="196" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="bold">Step 2 · Assign responses</text>
  <text x="300" y="210" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">fixed list · no new categories</text>
  <line x1="300" y1="218" x2="300" y2="230" stroke="currentColor" stroke-opacity="0.5" marker-end="url(#i3)"/>
  <polygon points="300,232 368,260 300,288 232,260" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.55"/>
  <text x="300" y="256" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="bold">"other" over</text>
  <text x="300" y="268" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="bold">the threshold?</text>
  <path d="M368,260 L434,260 L434,198 L405,198" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="4 3" marker-end="url(#i3)"/>
  <text x="378" y="252" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">yes</text>
  <text x="449" y="228" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.6" transform="rotate(90 449 228)">re-examine</text>
  <line x1="300" y1="288" x2="300" y2="300" stroke="currentColor" stroke-opacity="0.5"/>
  <text x="310" y="299" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="bold">no</text>
  <path d="M300,300 L150,300 L150,312" fill="none" stroke="currentColor" stroke-opacity="0.6" marker-end="url(#i3)"/>
  <rect x="62" y="314" width="176" height="24" rx="6" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-opacity="0.75" stroke-width="1.4"/>
  <text x="150" y="330" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="bold">▸ Coded dataset</text>
  <path d="M300,300 L470,300 L470,312" fill="none" stroke="currentColor" stroke-opacity="0.6" marker-end="url(#i3)"/>
  <rect x="382" y="314" width="176" height="24" rx="6" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-opacity="0.85" stroke-width="1.4"/>
  <rect x="385" y="317" width="170" height="18" rx="4" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
  <text x="470" y="330" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="bold">▸ New codebook</text>
  <path d="M558,326 C586,326 586,20 460,20 L405,20" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="5 4" marker-end="url(#i3)"/>
  <text x="586" y="175" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.7" transform="rotate(90 586 175)">the next wave is now imputation</text>
</svg>

The split into two steps is deliberate. Done all at once, the model tends to create too many overly specific categories or to group inconsistently across batches. By fixing the category list first, the later assignment works over a constant response space and produces coherent classifications. Between one step and the next, the analyst corrects the list: adding, deleting, renaming, or merging categories.

---

## Frequencies as a quality signal

A model, on its own, doesn't always detect well what deserves its own category. Among 500 distinct responses, brand A might appear five times in 5 different spellings. Each one looks like a rare case; together they're a relevant category.

The solution was to pass normalized frequencies along with the values. Before building the request, all the text is normalized (lowercase, no accents, no punctuation), each term's frequency is counted, and the most frequent ones go to the model.

---

## Interactivity isn't a flaw, it's the product

Full automation was never the goal. What we achieved is an effective, efficient tool that eases the analyst's work while guaranteeing higher-quality grouping.

Before classifying, they can edit the proposed categories. After classifying, they can review each category and move misassigned values. Before saving, they see the full distribution with frequencies and percentages. The model removes the mechanical work; the analyst brings the judgment.

This project reflects how data science, software development, and market research intersect to close the gap between the voice of users and the insights brands need. If you've faced the same challenge in text processing, I'd like to hear which approaches worked for you.