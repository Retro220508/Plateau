import { useEffect } from "react";

export default function HowItWorksModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-10 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-slate-900">How this actually works — no hidden limits</h2>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
          <div>
            <div className="font-semibold text-slate-800">What's real and live</div>
            <p>
              Every puzzle (input/output grid) is generated programmatically by composing real transformation
              functions (rotation, flip, recolor, translate) — ground truth is computed, never hand-labeled. Every
              slider move triggers a genuine sequence of vector/matrix operations, computed live in your browser,
              from the puzzle content and the requested step count. Nothing is a lookup table of pre-baked answers.
            </p>
          </div>
          <div>
            <div className="font-semibold text-slate-800">What's simplified, and why</div>
            <p>
              The toy model's parameters are <strong>hand-specified, not learned by gradient descent</strong>. A
              full train-and-export-to-ONNX pipeline needs a Python/GPU training loop and empirical validation that
              this build environment could not run and verify end-to-end in one sitting. Rather than fake that
              pipeline, we built a transparent recurrent dynamical system engineered to exhibit the same class of
              behavior a trained iterative latent-refinement model shows: a fixed-size state, real per-step
              decoding, and a genuine, deliberately engineered capacity ceiling (fixed at step 11) that causes real
              plateau/degradation past that point — reproducible every time, not a random dice roll.
            </p>
          </div>
          <div>
            <div className="font-semibold text-slate-800">What's precomputed</div>
            <p>
              The BDH-CQ numbers in Stage 6 come from the BDH-CQ technical report (arXiv:2608.09888), a real
              150M-parameter research system that cannot run in a browser. They are static, sourced, and labeled
              "developer-reported" — never implied to be live or reproduced by this team. Where we could not confirm
              an exact published figure, it's labeled "needs verification" instead of invented.
            </p>
          </div>
          <div>
            <div className="font-semibold text-slate-800">What's never claimed</div>
            <p>
              The toy model is never called "BDH" or "a BDH/BDH-CQ implementation" anywhere in this app. It is an
              independent teaching artifact only.
            </p>
          </div>
          <table className="w-full border-collapse overflow-hidden rounded-lg text-xs">
            <thead>
              <tr className="bg-slate-100 text-left text-slate-500">
                <th className="p-2 font-semibold">Element</th>
                <th className="p-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-2">Puzzle grids + ground truth (Stages 0–4)</td>
                <td className="p-2">Synthetic, generated live, real code</td>
              </tr>
              <tr>
                <td className="p-2">Refinement steps / accuracy curve (Stages 0–4, 6)</td>
                <td className="p-2">Live, computed per interaction, hand-specified dynamics</td>
              </tr>
              <tr>
                <td className="p-2">Latent heatmap</td>
                <td className="p-2">Live, illustrative reshaping of the real 64-d state</td>
              </tr>
              <tr>
                <td className="p-2">BDH-CQ effort-vs-accuracy numbers (Stage 6)</td>
                <td className="p-2">Precomputed, sourced, developer-reported</td>
              </tr>
              <tr>
                <td className="p-2">BDH vs BDH-CQ architecture notes (Stage 6)</td>
                <td className="p-2">Sourced from primary papers, static text</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
