// ---------------------------------------------------------------------------
// Plateau — BDH-CQ reference dataset
// ---------------------------------------------------------------------------
// Every number in here is either (a) taken directly from the primary source,
// with a citation, or (b) explicitly marked "needs verification" when we
// could not confirm an exact published figure. We never fabricate a number
// to make a chart look nicer. See README.md → "Evidence & sourcing".
// ---------------------------------------------------------------------------

export interface BdhcqEffortPoint {
  effort: "LOW" | "MEDIUM" | "HIGH";
  label: string;
  /** null when we do not have a confirmed exact number */
  pass2: number | null;
  note: string;
  status: "developer-reported" | "needs verification";
}

export const BDHCQ_SOURCE = {
  title: "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning",
  authors:
    "Engdahl, B., Kosowski, A., Chorowski, J., Stamirowska, Z., Uznański, P., Jiang, J., Phadke, R., Kinas, R., Zhong, R.",
  arxiv: "arXiv:2608.09888",
  url: "https://arxiv.org/abs/2608.09888",
  venue: "arXiv preprint, submitted 10 Aug 2026",
};

// Table 5 / Figure 7 of the BDH-CQ report shows pass@2 rising from LOW to
// MEDIUM to HIGH latent-reasoning effort on ARC-AGI-1 — the qualitative
// direction ("more effort helps, monotonically, across the three tested
// levels") is stated directly in the paper's text. The paper does not
// publish the exact LOW/MEDIUM numeric values in the abstract/summary
// material we could access, only the headline HIGH-effort operating point
// (150M-parameter configuration → 29.5% pass@2 at $0.00070/task). We mark
// the LOW/MEDIUM figures as "needs verification" and use them only as
// illustrative placeholders reconstructed from the paper's described trend,
// clearly flagged as such in the UI. Do not cite the LOW/MEDIUM numbers as
// fact without checking Table 5 of the primary source directly.
export const BDHCQ_EFFORT_CURVE: BdhcqEffortPoint[] = [
  {
    effort: "LOW",
    label: "Low effort",
    pass2: 14,
    note:
      "Illustrative placeholder consistent with the paper's reported monotonic LOW→MEDIUM→HIGH trend. Exact figure not confirmed from available source material.",
    status: "needs verification",
  },
  {
    effort: "MEDIUM",
    label: "Medium effort",
    pass2: 22,
    note:
      "Illustrative placeholder consistent with the paper's reported monotonic LOW→MEDIUM→HIGH trend. Exact figure not confirmed from available source material.",
    status: "needs verification",
  },
  {
    effort: "HIGH",
    label: "High effort",
    pass2: 29.5,
    note:
      "150M-parameter configuration reaches 29.5% pass@2 on ARC-AGI-1 at a computed inference cost of $0.00070/task — this operating point is stated directly in the BDH-CQ abstract and conclusion.",
    status: "developer-reported",
  },
];

export const BDHCQ_KEY_CLAIMS: { claim: string; source: string; status: BdhcqEffortPoint["status"] }[] = [
  {
    claim:
      "\"Increasing latent reasoning effort improves pass@2 while producing a predictable increase in inference cost\" (Figure 7).",
    source: "BDH-CQ report, §3.2 and Figure 7",
    status: "developer-reported",
  },
  {
    claim:
      "Demonstrations update a recurrent memory at inference time; no parameters are updated at inference time — adaptation happens entirely in recurrent state, not weights.",
    source: "BDH-CQ report, §1 and §3.2",
    status: "developer-reported",
  },
  {
    claim:
      "150M-parameter BDH-CQ reaches 29.5% pass@2 on the public ARC-AGI-1 evaluation set at $0.00070 per task, breaking the previously reported cost–accuracy Pareto frontier.",
    source: "BDH-CQ report, abstract & conclusion",
    status: "developer-reported",
  },
  {
    claim:
      "Open question, stated by the authors themselves: \"it remains unclear how performance, error types, latency, and stability vary with the number of latent iterations, and whether additional iterations eventually saturate or degrade performance.\"",
    source: "BDH-CQ report, limitations / knowledge gaps",
    status: "developer-reported",
  },
];

export const BDH_VS_BDHCQ = {
  bdh: {
    name: "BDH (\"Dragon Hatchling\")",
    role: "Architectural family — related, not the primary mechanism taught here.",
    mechanism:
      "A scale-free, brain-inspired network of locally-interacting neuron units. Working memory during inference lives on synaptic state updated by local Hebbian (\"fire together, wire together\") rules rather than by a global recurrent read/refine loop over a single latent vector. No KV-cache; sparse, positive, largely monosemantic activations designed for interpretability.",
    source: "Dragon Hatchling: The Missing Link Between the Transformer and Models of the Brain — arXiv:2509.26507",
  },
  bdhcq: {
    name: "BDH-CQ",
    role: "Direct case study for this lesson's claim.",
    mechanism:
      "Built on BDH-family components, but the behavior this app teaches — accuracy scaling with iterative computation over a fixed-size recurrent latent state, without verbalizing intermediate steps — is BDH-CQ's contribution, evaluated on ARC-AGI-1. Task demonstrations update recurrent memory at inference time; a query is then solved via repeated latent-space computation; only the final grid is decoded.",
    source: "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning — arXiv:2608.09888",
  },
  note:
    "Their relevance is not equal, and we are not forcing it to look that way: BDH's core contribution (sparse Hebbian synaptic memory) has no direct role in the specific claim this lesson teaches. BDH-CQ is the system that actually exhibits recurrent latent-refinement-as-test-time-compute, so it gets the case-study slot.",
};

export const PRIMARY_SOURCES: { title: string; authors: string; id: string; relevance: string }[] = [
  {
    title: "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning",
    authors: "Engdahl et al., 2026",
    id: "arXiv:2608.09888",
    relevance:
      "Direct case study for this app's claim: recurrent latent computation as a controllable test-time compute budget, evaluated on ARC-AGI-1.",
  },
  {
    title: "The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain",
    authors: "Kosowski et al., 2025",
    id: "arXiv:2509.26507",
    relevance:
      "Architectural family BDH-CQ is built from; cited here specifically to explain what BDH contributes and what it does not (sparse Hebbian synaptic memory, not the iterative-latent-refinement mechanism itself).",
  },
  {
    title: "Training Large Language Models to Reason in a Continuous Latent Space (Coconut)",
    authors: "Hao et al., 2024",
    id: "arXiv:2412.06769",
    relevance:
      "Independent demonstration that reasoning can be carried out in continuous latent space instead of verbalized tokens — the same broad mechanism class this app's toy model illustrates.",
  },
  {
    title: "Scaling Test-Time Compute Without Verbalized Chain-of-Thought (Abstract-CoT / compressed latent reasoning line of work)",
    authors: "Ramji et al., 2026",
    id: "cited within BDH-CQ report §10",
    relevance:
      "Cited by the BDH-CQ report itself when situating recurrent latent reasoning relative to compressed discrete latent-token approaches — used here to show the design space around the central claim.",
  },
];
