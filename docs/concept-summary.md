# Concept Summary: Recurrent Latent-Space Reasoning as Inference-Time Compute

*One-page concept summary for Plateau — The Latent Refiner (DataForge 2026, Pathway track). ~800 words.
Export this file to PDF for submission (e.g., via a Markdown-to-PDF tool or your editor's print-to-PDF).*

## 1. The design pressure

Chain-of-thought scales test-time compute by generating more tokens: a model "thinks longer" by writing
more words, which a decoder must project through a discrete vocabulary, emit autoregressively, and
re-consume before continuing. This is expensive, slow, and bound to whatever the model can put into words.
Recurrent latent-space reasoning proposes a different lever: instead of growing the *output* (more
tokens), grow the number of times a model *iterates its own hidden state* before producing an answer.
Compute scales in a continuous workspace that is never decoded into language until the very end.

## 2. The mechanism, concretely

The technical shift is: a fixed-size recurrent state is repeatedly read and updated — `S_t =
U(S_{t-1}, input)` — for some number of steps, and only the final state is decoded. Nothing about this
requires a growing KV-cache or a token budget; the "more compute" knob is purely how many times the update
function runs. This is architecturally distinct from (a) standard verbal chain-of-thought, which spends
compute by emitting and re-reading tokens, and (b) compressed/discrete latent-token schemes (e.g.,
Abstract-CoT-style approaches), which still serialize and externally decode a short sequence of learned
symbols rather than iterating a single continuous state.

## 3. Representative systems, compared

- **BDH-CQ** (Engdahl et al., 2026, arXiv:2608.09888) is this summary's primary case study. It combines
  in-context learning with recurrent latent reasoning: task demonstrations update a recurrent memory at
  inference time (no parameter updates), and a query is then solved through iterative computation in a
  high-dimensional latent workspace. On the public ARC-AGI-1 evaluation set, a 150M-parameter
  configuration reaches 29.5% pass@2 at a computed cost of $0.00070/task — a new point on the
  cost-accuracy Pareto frontier, not the highest absolute accuracy on the benchmark.
- **Coconut** (Hao et al., 2024, arXiv:2412.06769) independently demonstrates that a model can be trained
  to reason in continuous latent space rather than verbalizing every step, supporting the same broad
  mechanism class from a different research group.
- **BDH** ("Dragon Hatchling," Kosowski et al., 2025, arXiv:2509.26507) is architecturally related to
  BDH-CQ but contributes a different idea: working memory during inference lives on sparse, Hebbian-style
  synaptic state rather than in a single iteratively-refined latent vector. It is included here for
  contrast, not as a second example of the taught mechanism.

Compared on accuracy, inference cost, and observability: BDH-CQ trades peak accuracy for a large
cost-efficiency win and adds a controllable effort dial; Coconut demonstrates the latent-reasoning
mechanism can be trained directly with gradient descent; BDH demonstrates a *different* way state can
persist across inference (synaptic, local, Hebbian) with an explicit interpretability goal that recurrent
latent reasoning does not share — its states are not designed to be monosemantic or human-readable.

## 4. Where the advantage holds, and where it doesn't

BDH-CQ's own reported results (Figure 7, Table 5) show pass@2 rising monotonically from low to medium to
high latent-reasoning effort — direct evidence that iterating the latent state functions as a genuine,
controllable test-time compute budget, not just a fixed overhead. But the same report's authors are
explicit about what remains unknown: "it remains unclear how performance, error types, latency, and
stability vary with the number of latent iterations, and whether additional iterations eventually saturate
or degrade performance." That is precisely the open question this project's interactive toy model
explores hands-on, at a scale small enough to run in a browser: with a state of fixed size, pushing
iteration count past whatever range the state was tuned for stops helping, and can actively make an
already-correct answer worse, because there is nowhere left for the extra computation to usefully go.

## 5. Evidence labeling

The 29.5% pass@2 / $0.00070-per-task figure, and the qualitative LOW→MEDIUM→HIGH monotonic trend, are
stated directly in the BDH-CQ report and are treated here as developer-reported, not independently
reproduced by this project. Exact LOW/MEDIUM numeric values were not confirmed from available source
material and are therefore never presented as fact — only the qualitative trend and the HIGH-effort
headline number are cited as confirmed.

## 6. BDH vs. BDH-CQ, stated plainly

BDH-CQ is the direct case study for the claim taught here. BDH is architecturally related — BDH-CQ is
built from BDH-family components — but BDH's own core contribution (sparse Hebbian synaptic memory,
explicit interpretability) is not the mechanism being taught. Rather than force both papers into equal
billing, this project states outright that BDH has no direct role in the specific claim under discussion.

## 7. Continue learning

Primary sources: arXiv:2608.09888 (BDH-CQ), arXiv:2509.26507 (BDH), arXiv:2412.06769 (Coconut). To build
intuition rather than just read about it, use this project's own sandbox: generate an unseen puzzle,
scrub the latent-refinement step count from 1 to 20, and watch accuracy rise, plateau, and — past the
model's engineered capacity ceiling — fall.
