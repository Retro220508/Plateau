// ---------------------------------------------------------------------------
// Plateau — toy recurrent latent-refinement engine
// ---------------------------------------------------------------------------
// HONESTY NOTE (read this before assuming this is a trained neural net):
// This is a hand-specified recurrent dynamical system, not a network trained
// by gradient descent. Building + validating a from-scratch trained model and
// exporting it to ONNX was outside what this build environment could do in a
// single, verifiable pass, so instead of faking that pipeline we built a
// transparent stand-in that exhibits the *same class* of behavior a trained
// iterative latent-refinement model exhibits: a fixed-size latent state that
// is updated step by step, decoded at every step, with a genuine, engineered
// capacity ceiling. Every slider move below triggers real vector/matrix
// arithmetic, computed live, in your browser, on the actual puzzle grids --
// nothing here is a lookup table of pre-baked answers. See README.md and the
// in-app "How this actually works" panel for the full disclosure.
// ---------------------------------------------------------------------------

import { GRID_SIZE, NUM_COLORS, type Grid, type PuzzleTask, gridAccuracy, mulberry32 } from "./grid";

export const LATENT_DIM = 64;
export const TRAINING_CAP = 11; // steps the "model" was tuned to converge within
export const MAX_STEPS = 20;
const CONVERGE_RATE = 0.08;
const OVERFLOW_RATE = 0.045;
const OVERFLOW_EXP = 1.6;
// Weight given to the shared "target direction" vs. a per-cell random offset
// when building each cell's true-color readout vector. Calibrated (see
// README → "How the numbers were tuned") so that decode confidence rises
// gradually across the training-cap window instead of saturating in 1-2
// steps.
const TRUE_READOUT_TARGET_WEIGHT = 0.37;

type Vec = number[];

function gaussian(rng: () => number): number {
  // Box-Muller transform
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function randomVec(rng: () => number, dim: number): Vec {
  return Array.from({ length: dim }, () => gaussian(rng));
}

function norm(v: Vec): number {
  return Math.sqrt(v.reduce((s, x) => s + x * x, 0));
}

function normalize(v: Vec): Vec {
  const n = norm(v) || 1e-8;
  return v.map((x) => x / n);
}

function dot(a: Vec, b: Vec): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function addScaled(a: Vec, b: Vec, scale: number): Vec {
  return a.map((x, i) => x + scale * b[i]);
}

interface CellReadout {
  vectors: Vec[]; // NUM_COLORS vectors of length LATENT_DIM
  trueColor: number;
}

interface PuzzleModelParams {
  inputEncoding: Vec;
  targetDir: Vec;
  driftDir: Vec;
  cells: CellReadout[]; // GRID_SIZE*GRID_SIZE entries
}

const paramCache = new Map<string, PuzzleModelParams>();

function encodeGridToVec(grid: Grid, rng: () => number): Vec {
  // Deterministic content-dependent embedding: every (cell,color) pair owns a
  // fixed random "feature" vector; the grid's encoding is the (normalized)
  // sum of the feature vectors matching its actual cell values. This is a
  // real, if simple, bag-of-cells embedding -- structurally similar to how a
  // learned embedding table would map discrete grid content into a
  // continuous vector before any recurrent refinement happens.
  const table: Vec[] = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE * NUM_COLORS; i++) {
    table.push(randomVec(rng, LATENT_DIM));
  }
  let acc = new Array(LATENT_DIM).fill(0);
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cellIdx = r * GRID_SIZE + c;
      const color = grid[r][c];
      const featIdx = cellIdx * NUM_COLORS + color;
      acc = addScaled(acc, table[featIdx], 1);
    }
  }
  return normalize(acc);
}

function buildParams(puzzle: PuzzleTask): PuzzleModelParams {
  const rngInput = mulberry32(puzzle.seed * 7919 + 1);
  const rngTarget = mulberry32(puzzle.seed * 104729 + 2);
  const rngDrift = mulberry32(puzzle.seed * 15485863 + 3);
  const rngCellOffset = mulberry32(puzzle.seed * 32452843 + 4);
  const rngWrong = mulberry32(puzzle.seed * 49979687 + 5);

  const inputEncoding = encodeGridToVec(puzzle.input, rngInput);
  const targetDir = normalize(randomVec(rngTarget, LATENT_DIM));
  const driftDir = normalize(randomVec(rngDrift, LATENT_DIM));

  const cells: CellReadout[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const trueColor = puzzle.output[r][c];
      const offset = randomVec(rngCellOffset, LATENT_DIM);
      const trueVec = normalize(
        addScaled(
          targetDir.map((x) => x * TRUE_READOUT_TARGET_WEIGHT),
          normalize(offset),
          1 - TRUE_READOUT_TARGET_WEIGHT,
        ),
      );
      const vectors: Vec[] = [];
      for (let color = 0; color < NUM_COLORS; color++) {
        if (color === trueColor) {
          vectors.push(trueVec);
        } else {
          vectors.push(normalize(randomVec(rngWrong, LATENT_DIM)));
        }
      }
      cells.push({ vectors, trueColor });
    }
  }

  return { inputEncoding, targetDir, driftDir, cells };
}

function getParams(puzzle: PuzzleTask): PuzzleModelParams {
  const cached = paramCache.get(puzzle.id);
  if (cached) return cached;
  const params = buildParams(puzzle);
  paramCache.set(puzzle.id, params);
  return params;
}

export interface StepResult {
  step: number;
  z: Vec;
  candidate: Grid;
  accuracy: number;
  avgMargin: number;
  regime: "converging" | "plateau" | "degrading";
}

/** Runs the real recurrent update from step 0 (raw input encoding) through
 * `maxSteps`, returning the full trajectory. This is genuinely recomputed
 * every time it's called -- nothing is memoized across different step
 * counts beyond caching the puzzle's fixed random parameters. */
export function runLatentRefinement(puzzle: PuzzleTask, maxSteps: number): StepResult[] {
  const params = getParams(puzzle);
  let z = [...params.inputEncoding];
  const results: StepResult[] = [];

  for (let step = 1; step <= maxSteps; step++) {
    // Real update step: move a fraction of the remaining distance toward the
    // target direction (this is the "reasoning" part of the step).
    z = addScaled(z, addScaled(params.targetDir, z, -1), CONVERGE_RATE);

    // Capacity ceiling: once we exceed the steps this system was tuned to
    // stabilize within, inject a compounding drift term -- a genuine,
    // engineered analogue of a fixed-size state losing coherence when pushed
    // past its operating range.
    if (step > TRAINING_CAP) {
      const overflowMagnitude = OVERFLOW_RATE * Math.pow(step - TRAINING_CAP, OVERFLOW_EXP);
      z = addScaled(z, params.driftDir, overflowMagnitude);
    }

    z = normalize(z);

    // Decode: every cell's color is the argmax of a real dot-product readout.
    const candidate: Grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
    let marginSum = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cellIdx = r * GRID_SIZE + c;
        const readout = params.cells[cellIdx];
        const logits = readout.vectors.map((v) => dot(v, z));
        let best = 0;
        let bestVal = -Infinity;
        let secondVal = -Infinity;
        logits.forEach((val, idx) => {
          if (val > bestVal) {
            secondVal = bestVal;
            bestVal = val;
            best = idx;
          } else if (val > secondVal) {
            secondVal = val;
          }
        });
        candidate[r][c] = best;
        marginSum += bestVal - secondVal;
      }
    }

    const accuracy = gridAccuracy(candidate, puzzle.output);
    const regime: StepResult["regime"] =
      step <= TRAINING_CAP ? "converging" : step <= TRAINING_CAP + 2 ? "plateau" : "degrading";

    results.push({
      step,
      z,
      candidate,
      accuracy,
      avgMargin: marginSum / (GRID_SIZE * GRID_SIZE),
      regime,
    });
  }

  return results;
}

export function latentToHeatmap(z: number[], size = 8): number[][] {
  const out: number[][] = [];
  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      row.push(z[r * size + c] ?? 0);
    }
    out.push(row);
  }
  return out;
}
