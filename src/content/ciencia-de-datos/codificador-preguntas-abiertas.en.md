---
title: "Open-ended survey coder with LLM"
date: "2025-06-04"
description: "How I built a Python tool that uses GPT-4o to solve one of the most tedious problems in quantitative research: turning free-text responses into analyzable data."
tags: ["Python", "LLM", "NLP", "market research", "data science"]
lang: "en"
postId: "codificador-preguntas-abiertas"
cover: "/img/cover-codificador.svg"
draft: false
---

<div style="margin-bottom:2.5rem;border-radius:12px;overflow:hidden;background:#0c0f0c;">
  <img src="/img/banner-codificador.svg" alt="Open-ended survey coder" style="width:100%;display:block;height:auto;" />
</div>

In quantitative research, open-ended questions are the uncomfortable ingredient. Everything else in the survey produces numbers directly: 1-to-10 scales, multiple choice, net promoter scores. But open-ended questions produce free text, and free text doesn't fit into a regression or a crosstab.

To convert them into data, there's a process called **coding**: someone reads all the responses, groups the ones that say the same thing, assigns a number to each group, and replaces the text with that number in the database. "Hellmanns", "the yellow lid one", and "hellmans (sic)" all become code 5, which corresponds to Hellmann's.

It's tedious, repetitive, and prone to consistency errors. When you're dealing with thousands of responses to multiple questions across several parallel projects, it's also expensive. I automated it.

---

## The problem in all its complexity

Before writing a single line of code, I had to understand the problem properly. There are two fundamentally different situations:

**When a codebook already exists.** In longitudinal studies, panels, or multi-wave projects, someone already defined the categories in a previous round. There's an Excel file — the codebook, or LDC — with a list of numeric keys and their canonical values. The task here is *imputation*: take each new response and map it to the right key. The main challenge is orthographic variability. "Cocca-cola", "coca cola", "CocaCola", and "the black one" are all key 7.

**When no codebook exists.** In new studies or questions that have never been asked before, the categories need to be invented from scratch. The analyst doesn't know in advance what they'll find. First discover what categories emerge from the data, then assign each response to one, then generate a reusable codebook for future waves.

Both flows share infrastructure but have completely different logic.

---

## A problem nobody talks about: the multi-value response

There's a third problem that doesn't appear in coding textbooks but shows up constantly in real data.

Imagine a question: *"What qualities should a good football player have?"* One respondent answers: *"Speed, technique, and grit"*. Another: *"Attitude and commitment to the team"*.

The first mentioned three things. The second mentioned two. But in the data file, both responses occupy a single cell. If we code that cell as a unit, we lose mentions. In a brand image or product attribute study, those lost mentions can change the results.

The solution is **ad-hoc expansion**: detect when a response contains multiple real mentions, split them, and distribute them into additional columns. The original column (`Q23`) keeps the first mention (top of mind), and new columns are created (`Q23adhoc2`, `Q23adhoc3`, etc.) for the rest. Detection can't rely on regex alone — the final decision goes to the LLM.

---

## The architecture

<svg viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:1.5rem auto;">
  <rect width="600" height="120" fill="none"/>
  <rect x="150" y="4" width="300" height="38" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
  <text x="300" y="18" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor" opacity="0.9" font-weight="bold">main.py</text>
  <text x="300" y="32" text-anchor="middle" font-family="monospace" font-size="9" fill="currentColor" opacity="0.55">Select project → Load → Question menu</text>
  <line x1="220" y1="42" x2="160" y2="68" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <line x1="380" y1="42" x2="440" y2="68" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <rect x="60" y="68" width="200" height="34" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
  <text x="160" y="82" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor" opacity="0.8" font-weight="bold">IMPUTATION</text>
  <text x="160" y="95" text-anchor="middle" font-family="monospace" font-size="8.5" fill="currentColor" opacity="0.5">Codebook exists → assign keys</text>
  <rect x="340" y="68" width="200" height="34" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
  <text x="440" y="82" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor" opacity="0.8" font-weight="bold">CODIFICATION</text>
  <text x="440" y="95" text-anchor="middle" font-family="monospace" font-size="8.5" fill="currentColor" opacity="0.5">No codebook → create categories</text>
</svg>

---

## Multi-project and per-project configuration

The tool wasn't designed for a single study. Each project has its own directory structure with `data/`, `LDC/`, `REINFORCEMENTS/`, and `outputs/`. Subprojects are detected automatically. If files follow the pattern `PROJECT1.xlsx`, `PROJECT2.xlsx`, it also asks for the wave number. Each project can have its own special codes configured in a central JSON.

---

## The imputation flow

<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px;display:block;margin:1.5rem auto;font-family:monospace;">
  <rect width="520" height="340" fill="none"/>
  <rect x="60" y="4" width="400" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
  <text x="260" y="22" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">Automatic detection of specials</text>
  <text x="260" y="38" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">"don't know", "none", blanks → assigned without LLM</text>
  <line x1="260" y1="48" x2="260" y2="68" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <polygon points="255,66 265,66 260,74" fill="currentColor" opacity="0.4"/>
  <rect x="60" y="74" width="400" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
  <text x="260" y="92" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">LLM classification in batches of 50</text>
  <text x="260" y="108" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Prompt: full codebook + reinforcements + phonetic examples</text>
  <line x1="260" y1="118" x2="260" y2="138" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <polygon points="255,136 265,136 260,144" fill="currentColor" opacity="0.4"/>
  <polygon points="260,144 340,168 260,192 180,168" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
  <text x="260" y="164" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">Assigned</text>
  <text x="260" y="177" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">to OTHER?</text>
  <line x1="260" y1="192" x2="260" y2="212" stroke="currentColor" stroke-width="1" opacity="0.35" stroke-dasharray="4 3"/>
  <text x="268" y="206" font-size="8" fill="currentColor" opacity="0.5">YES</text>
  <polygon points="255,210 265,210 260,218" fill="currentColor" opacity="0.35"/>
  <rect x="60" y="218" width="400" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
  <text x="260" y="236" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">Second pass (batches of 20)</text>
  <text x="260" y="252" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Reclassifies with real examples from each category</text>
  <line x1="260" y1="262" x2="260" y2="282" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <polygon points="255,280 265,280 260,288" fill="currentColor" opacity="0.4"/>
  <rect x="60" y="288" width="400" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
  <text x="260" y="306" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">Interactive review + save</text>
  <text x="260" y="322" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Analyst approves, edits or moves · accumulates reinforcements</text>
</svg>

**Reinforcements** are an incremental learning mechanism. Every time the LLM maps a new variation ("cocca-cola" → Coca-Cola), that relationship is saved in a JSON file. Over time, the system needs fewer API calls because most variations are already cached.

---

## The codification flow (no codebook)

<svg viewBox="0 0 520 380" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px;display:block;margin:1.5rem auto;font-family:monospace;">
  <rect width="520" height="380" fill="none"/>
  <rect x="60" y="4" width="400" height="56" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
  <text x="260" y="22" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">PHASE 1A — Define categories</text>
  <text x="260" y="37" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">LLM sees all unique values + normalized frequencies</text>
  <text x="260" y="51" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">→ proposes 10-25 names (assigns nothing yet)</text>
  <line x1="260" y1="60" x2="260" y2="80" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <polygon points="255,78 265,78 260,86" fill="currentColor" opacity="0.4"/>
  <rect x="60" y="86" width="400" height="44" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
  <text x="260" y="104" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">Interactive category editing</text>
  <text x="260" y="120" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Analyst adds, deletes, renames or merges</text>
  <line x1="260" y1="130" x2="260" y2="150" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <polygon points="255,148 265,148 260,156" fill="currentColor" opacity="0.4"/>
  <rect x="60" y="156" width="400" height="56" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
  <text x="260" y="174" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">PHASE 2 — Classify values (batches of 50)</text>
  <text x="260" y="189" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">LLM cannot invent new categories</text>
  <text x="260" y="203" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Only assigns to already-defined ones</text>
  <line x1="260" y1="212" x2="260" y2="232" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  <polygon points="255,230 265,230 260,238" fill="currentColor" opacity="0.4"/>
  <polygon points="260,238 340,262 260,286 180,262" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
  <text x="260" y="258" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">Many in</text>
  <text x="260" y="271" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">OTHER? (10+)</text>
  <line x1="260" y1="286" x2="260" y2="306" stroke="currentColor" stroke-width="1" opacity="0.35" stroke-dasharray="4 3"/>
  <text x="268" y="300" font-size="8" fill="currentColor" opacity="0.5">YES</text>
  <polygon points="255,304 265,304 260,312" fill="currentColor" opacity="0.35"/>
  <rect x="60" y="312" width="400" height="56" rx="5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
  <text x="260" y="330" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.85" font-weight="bold">Final review + save LDC Excel</text>
  <text x="260" y="346" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Distribution with frequencies and % per category</text>
  <text x="260" y="360" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.55">Reusable codebook for future waves</text>
</svg>

The two-phase separation is deliberate. If done in a single step, the LLM tends to create too many specific categories or groups inconsistently across batches. By fixing the list first, the second step has a constant response space.

---

## Frequencies as a quality signal

The LLM alone doesn't always detect well what deserves its own category. If there are 500 distinct responses, "ICBC" might appear 5 times with 5 different spellings. Each one looks like a rare case; together they're a relevant category. The solution was passing normalized frequencies alongside the values, and using them in the interactive review where the analyst sees the percentage each category represents.

---

## Resilience: checkpoints

Processing a thousand responses means dozens of API calls. If anything fails midway, the state is saved in a Parquet file after each question, along with a JSON cache of already-classified values. The tool looks for existing checkpoints at startup and asks whether to continue from there.

---

## Interactivity isn't a defect, it's the product

Full automation isn't the goal. The goal is for the analyst to trust the result enough to defend it to the client. Before classifying, they can edit proposed categories. After classifying, they can review each category and move misassigned values. Before saving, they see a complete distribution.

What the LLM does is eliminate mechanical work. What the analyst does is make the decisions that require domain judgment.

---

## Production results

A dataset with 1,500 responses to 4 open-ended questions that previously took 4 to 6 hours now takes 25 to 45 minutes: 15-25 of automatic processing and 10-20 of interactive review. Orthographic variant detection is more robust than human detection for non-obvious typos, and there's no consistency drift across long sessions.

The code is on my GitHub.
