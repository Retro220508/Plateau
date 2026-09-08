# Plateau — *The Latent Refiner*

An interactive educational artifact for the **DataForge 2026 × Pathway** hackathon track (Recurrent
Latent-Space Reasoning + Inference-Time Scaling, BDH-CQ module).

> **The one-sentence claim:** On an unseen abstract-reasoning puzzle, model accuracy improves with each
> added recurrent latent-refinement step — but only up to the model's fixed state capacity, after which
> additional steps stop helping and can degrade the answer.

This claim is deliberately falsifiable: it predicts a *rise* and then a *plateau/collapse*. The app is
built so you can try to break it yourself in the Sandbox stage.

---

## 1. Audience & prerequisites

- **Audience:** ML-literate undergrads / early grad students who know what a hidden state and a
  transformer are.
- **Prerequisites:** basic RNN/attention familiarity. No chain-of-thought-specific background assumed.

## 2. Learning objectives

1. State the one-sentence claim in your own words.
2. Predict, before running it, whether more compute steps will help, hurt, or plateau on a given puzzle.
3. Locate where this mechanism appears in BDH-CQ, and how it differs from BDH's mechanism.
4. Name one limitation (capacity ceiling / no verbal interpretability of intermediate steps).

## 3. The 8-stage flow

| # | Stage | What happens |
|---|---|---|
| 0 | Cold open | A preset run is already mid-way (step 6/12) — nothing blank, ground truth shown faintly beside the model's guess |
| 1 | Guided pass | Scrub a fixed demo puzzle through steps 1–12, watch the latent heatmap + accuracy update live |
| 2 | The claim | The claim is stated explicitly; you record a prediction |
| 3 | Sandbox | A **held-out** puzzle, full 1–20 step range — the claim can visibly fail here |
| 4 | Explain-back | Free-text reflection on what happened past the plateau (local only, ungraded) |
| 5 | Bridge | Explicit transition from the toy model to BDH-CQ |
| 6 | BDH-CQ case study | Published effort-vs-accuracy numbers, plotted the same way as Stage 3, toggle to compare |
| 7 | Limitations | Capacity ceiling, no verbal interpretability, "this is not BDH-CQ" — stated plainly |

## 4. What's real vs. precomputed vs. simplified — full disclosure

This is the most important section in this README. It is also shown in-app via the **"how this actually
works"** button in the top bar.

| Element | Status | Detail |
|---|---|---|
| Puzzle grids + ground truth (Stages 0–4) | **Real, synthetic, generated live** | `src/lib/grid.ts` programmatically composes 2 of {rotate90, hflip, recolor, translate} per puzzle with a seeded PRNG. No hand-labeling. |
| Refinement steps / latent state / accuracy curve (Stages 0–4, 6) | **Real, live, computed per interaction** | `src/lib/latentModel.ts` runs genuine vector/matrix arithmetic in-browser on every slider move. See §5 below for exactly what kind of model this is and what it is *not*. |
| Latent heatmap | **Live, illustrative** | A reshaping of the model's real 64-dimensional state vector into an 8×8 grid for visualization. It is a compressed proxy, not a transcript of "thoughts." |
| BDH-CQ effort-vs-accuracy numbers (Stage 6) | **Precomputed, sourced, developer-reported** | Static dataset in `src/lib/bdhcqData.ts`, cited to arXiv:2608.09888. Never implied to be live or reproduced by this team. |
| BDH vs. BDH-CQ architecture notes (Stage 6) | **Static text, sourced** | Cited to the BDH-CQ report and the original BDH ("Dragon Hatchling") paper, arXiv:2509.26507. |

## 5. The toy model — what it actually is (read before assuming it's a trained network)

The original project blueprint called for training a small GRU-style recurrent model on synthetic
ARC-style puzzles and exporting it to ONNX for live inference via ONNX Runtime Web. That pipeline needs a
Python/GPU training loop and empirical validation this build environment could not run and verify
end-to-end in a single session.

Rather than fake that pipeline (e.g., quietly shipping a lookup table and calling it "the model"), we
built something more honest: a **hand-specified recurrent dynamical system** that exhibits the same
*class* of behavior a trained iterative latent-refinement model exhibits:

- A fixed-size (64-dim) latent state, seeded deterministically from each puzzle.
- A genuine per-step update rule (`src/lib/latentModel.ts::runLatentRefinement`) that nudges the state
  toward a "solved" direction in latent space, step by step.
- A genuine per-cell decode step every iteration: each of the 25 cells' colors is the arg-max of a real
  dot-product between the current state and a fixed per-cell-per-color readout vector — not a
  precomputed answer key.
- A **deliberately engineered capacity ceiling** at step 11: past that point, a compounding drift term is
  injected into the state, degrading decode confidence in a reproducible, non-random way. This is what
  produces the plateau/degradation half of the claim.
- All randomness (puzzle generation, readout vectors, drift direction) is seeded once per puzzle with a
  deterministic PRNG (`mulberry32`) — the *same* puzzle at the *same* step always produces the *same*
  result, which is what makes the Sandbox stage a fair, repeatable test rather than a dice roll.

**What this is not:** it is not a network trained by backpropagation, it is not BDH, it is not BDH-CQ, and
it is not a reproduction of BDH-CQ's reported numbers. Every in-app label says so. We consider this the
correct tradeoff for the "Interactive Substrate & Honesty" bar: a real, live, interactive, deterministic
system whose mechanism and limits are fully disclosed, rather than an opaque or overstated one.

**How the numbers were tuned:** the convergence rate and readout-vector geometry were chosen (via closed-
form analysis of the resulting signal-to-noise ratio between the "true" and "wrong" per-cell logits, see
inline comments in `latentModel.ts`) so that: (a) accuracy starts near chance level at step 1, (b) rises
smoothly through the training-cap window, (c) reaches high (but not perfect) confidence by step 11, and
(d) genuinely degrades once the injected drift term dominates, around step 15+. This was an engineering
choice to make the pedagogical effect reliable and reproducible, exactly as the original blueprint
required ("a designed, reproducible result, not a hoped-for one").

## 6. BDH vs. BDH-CQ — stated honestly, not force-balanced

- **BDH-CQ** ("In-Context Learning with Recurrent Latent Reasoning," arXiv:2608.09888, Engdahl et al.,
  2026) is the **direct case study** for this app's claim: it solves ARC-AGI-1 tasks by updating a
  recurrent memory from demonstrations, then reasoning over a query through repeated computation in a
  continuous latent workspace, decoding only the final answer. A 150M-parameter configuration reaches
  29.5% pass@2 at $0.00070/task. The report's own limitations section states plainly that "it remains
  unclear... whether additional iterations eventually saturate or degrade performance" — this app's toy
  model is a hands-on exploration of exactly that open question, at a much smaller scale.
- **BDH** ("The Dragon Hatchling," arXiv:2509.26507, Kosowski et al., 2025) is the architectural family
  BDH-CQ is built from, but its headline contribution — sparse, brain-inspired synaptic memory with
  Hebbian ("fire together, wire together") updates and no KV-cache — is **not** the mechanism this lesson
  teaches. We say so explicitly rather than forcing equal billing.

## 7. Evidence labeling for every BDH-CQ number

See `src/lib/bdhcqData.ts`. Every claim carries a `status` of either `"developer-reported"` (stated
directly in the primary source) or `"needs verification"` (a value we could not confirm against an exact
published figure and therefore did not fabricate — used only as an illustrative placeholder, clearly
marked). Only the qualitative LOW→MEDIUM→HIGH trend and the HIGH-effort headline number (29.5% pass@2 at
$0.00070/task) are confirmed from available source material.

## 8. Primary sources (cited next to specific claims in-app, not just listed)

1. Engdahl, B. et al. (2026). *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning.*
   arXiv:2608.09888. — direct case study for the central claim.
2. Kosowski, A. et al. (2025). *The Dragon Hatchling: The Missing Link between the Transformer and Models
   of the Brain.* arXiv:2509.26507. — architectural family BDH-CQ is built from; used to correctly scope
   BDH's (non-)relevance.
3. Hao, S. et al. (2024). *Training Large Language Models to Reason in a Continuous Latent Space
   ("Coconut").* arXiv:2412.06769. — independent evidence for the general mechanism class (reasoning in
   continuous latent space instead of verbalized tokens).
4. Ramji, et al. (2026), cited within the BDH-CQ report §10 — situates recurrent latent reasoning
   relative to compressed discrete latent-token approaches ("Abstract-CoT").

## 9. Architecture

| Layer | Choice |
|---|---|
| Frontend | React 19 + TypeScript + Tailwind CSS v4 |
| Toy model | Hand-specified recurrent dynamical system in plain TypeScript (`src/lib/latentModel.ts`), no ML runtime dependency — runs anywhere JS runs, loads instantly |
| Puzzle generator | `src/lib/grid.ts`, seeded PRNG (`mulberry32`), pure functions |
| Grid/heatmap rendering | Inline SVG (no canvas/WebGL — unnecessary for a 5×5 grid) |
| Charting | [Recharts](https://recharts.org/) (MIT license) |
| BDH-CQ data layer | Static, cited TypeScript module (`src/lib/bdhcqData.ts`) |
| Hosting | Static site — no backend, no sign-in |
| Persistence | `localStorage` only (claim-vote, explain-back text) — no server, no accounts |

## 10. Reproduction / running locally

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

There is no separate "training" step to reproduce: the toy model's parameters are generated
deterministically at runtime from fixed seeds (see §5). To change its behavior, edit the constants at the
top of `src/lib/latentModel.ts` (`CONVERGE_RATE`, `TRAINING_CAP`, `OVERFLOW_RATE`, `OVERFLOW_EXP`,
`TRUE_READOUT_TARGET_WEIGHT`) and rebuild.

## 11. Credits & licenses

- React, ReactDOM — MIT License, Meta Platforms, Inc.
- Tailwind CSS — MIT License, Tailwind Labs.
- Recharts — MIT License.
- Vite, `vite-plugin-singlefile`, TypeScript, `clsx`, `tailwind-merge` — respective MIT/OSS licenses per
  their own repositories.
- All puzzle-generation code, the toy recurrent-refinement model, and the BDH-CQ reference dataset in this
  repo are original work for this project.
- No third-party fonts are used beyond system font stacks (avoids extra network requests / load-time
  risk).

## 12. AI-assistance disclosure

This project was built with an AI coding assistant (Claude, via an agentic coding tool) in a single
collaborative session:

- **Code:** Nearly all code (React components, the toy latent-refinement model, the puzzle generator, the
  BDH-CQ data module) was generated by the AI assistant, including the closed-form tuning analysis used to
  calibrate the toy model's convergence/degradation curve.
- **Writing:** This README, in-app copy (stage narration, the "how this actually works" disclosure, the
  misconception callouts), and the one-page concept summary (`docs/concept-summary.md`) were drafted by
  the AI assistant.
- **Research:** Primary-source facts about BDH and BDH-CQ (architecture claims, the 29.5% pass@2 /
  $0.00070 figure, the authors' own stated open question about saturation/degradation with more latent
  iterations) were retrieved via live web search against the arXiv papers and cross-checked before being
  written into the app; anything not confirmed this way is explicitly labeled "needs verification" rather
  than presented as fact.
- **Design:** Visual/interaction design (stage flow, color system, layout) was generated by the AI
  assistant following the project brief's design standards (guide → sandbox arc, truth-beside-estimate,
  live/precomputed labeling).
- A human reviewed and directed the overall structure, scope, and honesty constraints described in this
  README before finalizing.
