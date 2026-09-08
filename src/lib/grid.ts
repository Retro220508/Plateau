// ---------------------------------------------------------------------------
// Plateau — synthetic grid-puzzle generator
// ---------------------------------------------------------------------------
// A "puzzle" is a 5x5 grid of integers 0-4 (5 colors) transformed by composing
// exactly 2 primitives from {rotate90, hflip, recolor, translate}. Ground
// truth is always computed programmatically — there is no hand-labeling.
// ---------------------------------------------------------------------------

export const GRID_SIZE = 5;
export const NUM_COLORS = 5;

export type Grid = number[][]; // GRID_SIZE x GRID_SIZE, values in [0, NUM_COLORS)

export type PrimitiveName = "rotate90" | "hflip" | "recolor" | "translate";

export interface Primitive {
  name: PrimitiveName;
  label: string;
  apply: (g: Grid, rng: () => number) => Grid;
}

function cloneGrid(g: Grid): Grid {
  return g.map((row) => [...row]);
}

export function rotate90(g: Grid): Grid {
  const n = g.length;
  const out: Grid = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      out[c][n - 1 - r] = g[r][c];
    }
  }
  return out;
}

export function hflip(g: Grid): Grid {
  return g.map((row) => [...row].reverse());
}

export function recolor(g: Grid, from: number, to: number): Grid {
  return g.map((row) => row.map((v) => (v === from ? to : v)));
}

export function translate(g: Grid, dr: number, dc: number): Grid {
  const n = g.length;
  const out: Grid = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const sr = (r - dr + n) % n;
      const sc = (c - dc + n) % n;
      out[r][c] = g[sr][sc];
    }
  }
  return out;
}

// Simple seeded PRNG (mulberry32) so puzzles are reproducible per seed.
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomGrid(rng: () => number): Grid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => Math.floor(rng() * NUM_COLORS)),
  );
}

export interface PuzzleTask {
  id: string;
  seed: number;
  input: Grid;
  output: Grid;
  steps: { name: PrimitiveName; detail: string }[];
}

const PRIMITIVE_NAMES: PrimitiveName[] = ["rotate90", "hflip", "recolor", "translate"];

export function generatePuzzle(seed: number, id: string): PuzzleTask {
  const rng = mulberry32(seed);
  const input = randomGrid(rng);
  let g = cloneGrid(input);

  // choose 2 distinct primitives
  const idxA = Math.floor(rng() * PRIMITIVE_NAMES.length);
  let idxB = Math.floor(rng() * PRIMITIVE_NAMES.length);
  while (idxB === idxA) idxB = Math.floor(rng() * PRIMITIVE_NAMES.length);
  const chosen = [PRIMITIVE_NAMES[idxA], PRIMITIVE_NAMES[idxB]];

  const steps: { name: PrimitiveName; detail: string }[] = [];

  for (const name of chosen) {
    if (name === "rotate90") {
      g = rotate90(g);
      steps.push({ name, detail: "rotate 90° clockwise" });
    } else if (name === "hflip") {
      g = hflip(g);
      steps.push({ name, detail: "flip horizontally" });
    } else if (name === "recolor") {
      const from = Math.floor(rng() * NUM_COLORS);
      let to = Math.floor(rng() * NUM_COLORS);
      while (to === from) to = Math.floor(rng() * NUM_COLORS);
      g = recolor(g, from, to);
      steps.push({ name, detail: `recolor ${from} → ${to}` });
    } else if (name === "translate") {
      const dr = 1 + Math.floor(rng() * (GRID_SIZE - 1));
      const dc = 1 + Math.floor(rng() * (GRID_SIZE - 1));
      g = translate(g, dr, dc);
      steps.push({ name, detail: `shift by (${dr}, ${dc})` });
    }
  }

  return { id, seed, input, output: g, steps };
}

export function gridAccuracy(a: Grid, b: Grid): number {
  let correct = 0;
  let total = 0;
  for (let r = 0; r < a.length; r++) {
    for (let c = 0; c < a[r].length; c++) {
      total++;
      if (a[r][c] === b[r][c]) correct++;
    }
  }
  return correct / total;
}

// Fixed catalogue: the demo (guided) puzzle and a bank of held-out puzzles
// for the sandbox stage. Seeds are picked once and fixed so the experience is
// reproducible.
export const DEMO_PUZZLE = generatePuzzle(1337, "demo-guided");
export const HELD_OUT_PUZZLES = [4242, 90210, 5551, 8675309, 271828].map((s, i) =>
  generatePuzzle(s, `held-out-${i}`),
);
