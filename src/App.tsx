import { useState } from "react";
import TopBar from "./components/TopBar";
import MissionBriefing from "./components/MissionBriefing";
import StageNav, { type StageMeta } from "./components/StageNav";
import HowItWorksModal from "./components/HowItWorksModal";
import Stage0ColdOpen from "./stages/Stage0ColdOpen";
import Stage1GuidedPass from "./stages/Stage1GuidedPass";
import Stage2Claim from "./stages/Stage2Claim";
import Stage3Sandbox from "./stages/Stage3Sandbox";
import Stage4ExplainBack from "./stages/Stage4ExplainBack";
import Stage5Bridge from "./stages/Stage5Bridge";
import Stage6BdhcqCaseStudy from "./stages/Stage6BdhcqCaseStudy";
import Stage7Limitations from "./stages/Stage7Limitations";

const STAGES: StageMeta[] = [
  { key: "cold-open", short: "Cold open" },
  { key: "guided", short: "Guided pass" },
  { key: "claim", short: "The claim" },
  { key: "sandbox", short: "Sandbox" },
  { key: "explain", short: "Explain-back" },
  { key: "bridge", short: "Bridge" },
  { key: "bdhcq", short: "BDH-CQ case study" },
  { key: "limits", short: "Limitations" },
];

export default function App() {
  const [stage, setStage] = useState(0);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const go = (i: number) => setStage(Math.max(0, Math.min(STAGES.length - 1, i)));

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <TopBar onOpenHowItWorks={() => setShowHowItWorks(true)} />
      <MissionBriefing />
      <StageNav stages={STAGES} current={stage} onSelect={go} />

      <main>
        {stage === 0 && <Stage0ColdOpen onNext={() => go(1)} />}
        {stage === 1 && <Stage1GuidedPass onPrev={() => go(0)} onNext={() => go(2)} />}
        {stage === 2 && <Stage2Claim onPrev={() => go(1)} onNext={() => go(3)} />}
        {stage === 3 && (
          <Stage3Sandbox
            puzzleIndex={puzzleIndex}
            setPuzzleIndex={setPuzzleIndex}
            onPrev={() => go(2)}
            onNext={() => go(4)}
          />
        )}
        {stage === 4 && <Stage4ExplainBack onPrev={() => go(3)} onNext={() => go(5)} />}
        {stage === 5 && <Stage5Bridge onPrev={() => go(4)} onNext={() => go(6)} />}
        {stage === 6 && (
          <Stage6BdhcqCaseStudy puzzleIndex={puzzleIndex} onPrev={() => go(5)} onNext={() => go(7)} />
        )}
        {stage === 7 && <Stage7Limitations onPrev={() => go(6)} onRestart={() => go(0)} />}
      </main>

      <footer className="mx-auto mt-10 max-w-6xl px-4 text-center text-[11px] text-slate-400 sm:px-6">
        Plateau — an independent educational artifact. The toy model is not BDH, not BDH-CQ, and not an official
        reproduction of either. BDH-CQ numbers are developer-reported, sourced to arXiv:2608.09888.
      </footer>

      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
    </div>
  );
}
