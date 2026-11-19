// Independent verification for 第27题扩展题目2
// Run: node verify.mjs

const eps = 1e-9;
const nearly = (a, b) => Math.abs(a - b) <= 1e-8;
const clampOk = (x, a, b) => x >= a - eps && x <= b + eps;

function rot(E, D, dir) {
  const dx = D[0] - E[0], dy = D[1] - E[1];
  if (dir === 'cw') return [E[0] + dy, E[1] - dx];
  return [E[0] - dy, E[1] + dx];
}

function onSeg(Q, A, B) {
  const [x, y] = Q, [x1, y1] = A, [x2, y2] = B;
  if (x < Math.min(x1, x2) - eps || x > Math.max(x1, x2) + eps) return false;
  if (y < Math.min(y1, y2) - eps || y > Math.max(y1, y2) + eps) return false;
  return Math.abs((x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)) <= 1e-8;
}

const H = [
  [[-4, 0], [4, 0]],   // base
  [[4, 0], [0, 4]],    // right y = 4 - x
  [[-4, 0], [0, 4]],   // left  y = 4 + x
];

function onH(Q) {
  return H.some(seg => onSeg(Q, seg[0], seg[1]));
}

function Qpm(t, s) {
  // D = (2, s), E = (0, t)
  return {
    ccw: [t - s, t + 2],
    cw: [s - t, t - 2],
    D: [2, s],
    E: [0, t],
  };
}

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed++;
    console.error('FAIL:', msg);
  }
}

// ---------- (1)① ----------
const A1 = [2, 1], P1 = [5, 4];
const v1 = [P1[0] - A1[0], P1[1] - A1[1]];
assert(v1[0] === 3 && v1[1] === 3, '(1)① vector should be (3,3)');
const Qccw1 = [A1[0] - v1[1], A1[1] + v1[0]]; // (-1, 4)
const Qcw1 = [A1[0] + v1[1], A1[1] - v1[0]];  // (5, -2)
assert(Qccw1[0] === -1 && Qccw1[1] === 4, '(1)① ccw = (-1,4), got ' + Qccw1);
assert(Qcw1[0] === 5 && Qcw1[1] === -2, '(1)① cw = (5,-2), got ' + Qcw1);
for (const Q of [Qccw1, Qcw1]) {
  const dAQ = Math.hypot(Q[0] - A1[0], Q[1] - A1[1]);
  const dAP = Math.hypot(P1[0] - A1[0], P1[1] - A1[1]);
  const dot = (P1[0] - A1[0]) * (Q[0] - A1[0]) + (P1[1] - A1[1]) * (Q[1] - A1[1]);
  assert(nearly(dAQ, dAP), '(1)① equal length');
  assert(nearly(dot, 0), '(1)① right angle');
}

// ---------- (1)② ----------
const A2 = [1, 2], B2 = [5, 6];
const M = [(A2[0] + B2[0]) / 2, (A2[1] + B2[1]) / 2];
assert(M[0] === 3 && M[1] === 4, 'midpoint (3,4)');
const C_up = [1, 6], C_down = [5, 2];
for (const C of [C_up, C_down]) {
  const dCA = Math.hypot(A2[0] - C[0], A2[1] - C[1]);
  const dCB = Math.hypot(B2[0] - C[0], B2[1] - C[1]);
  const dot = (A2[0] - C[0]) * (B2[0] - C[0]) + (A2[1] - C[1]) * (B2[1] - C[1]);
  assert(nearly(dCA, dCB), 'CA=CB for ' + C);
  assert(nearly(dot, 0), 'right at C for ' + C);
}
assert(C_up[0] === A2[0] && C_up[1] > A2[1], 'C=(1,6) is directly above A');
assert(!(C_down[0] === A2[0] && C_down[1] > A2[1]), '(5,2) is not above A');

// formulas match
function checkFormula(t, s) {
  const E = [0, t], D = [2, s];
  const got = Qpm(t, s);
  const ccw = rot(E, D, 'ccw');
  const cw = rot(E, D, 'cw');
  assert(nearly(got.ccw[0], ccw[0]) && nearly(got.ccw[1], ccw[1]), `formula ccw t=${t} s=${s}`);
  assert(nearly(got.cw[0], cw[0]) && nearly(got.cw[1], cw[1]), `formula cw t=${t} s=${s}`);
}

// ---------- (2) endpoints ----------
const endpoints = [
  { t: -2, s: 1, dir: 'ccw', q: [-3, 0], note: 't=-2, D=(2,1), Q on base' },
  { t: -2, s: 2, dir: 'ccw', q: [-4, 0], note: 't=-2, D=(2,2), Q at left-base vertex' },
  { t: 0, s: 2, dir: 'ccw', q: [-2, 2], note: 't=0, D=(2,2), Q on left leg' },
  { t: 2, s: 2, dir: 'ccw', q: [0, 4], note: 't=2, D=(2,2), Q at top vertex' },
  { t: 2, s: 1, dir: 'cw', q: [-1, 0], note: 't=2, D=(2,1), Q on base' },
  { t: 1.5, s: 1, dir: 'ccw', q: [0.5, 3.5], note: 't=3/2, D=(2,1), Q on right leg' },
  { t: 3.5, s: 1, dir: 'cw', q: [-2.5, 1.5], note: 't=7/2, D=(2,1), Q on left leg' },
  { t: 4, s: 2, dir: 'cw', q: [-2, 2], note: 't=4, D=(2,2), Q on left leg' },
];

for (const e of endpoints) {
  checkFormula(e.t, e.s);
  const q = Qpm(e.t, e.s)[e.dir];
  assert(nearly(q[0], e.q[0]) && nearly(q[1], e.q[1]), e.note + ' coord ' + q);
  assert(onH(q), e.note + ' should be on H');
}

// just-outside endpoints should fail
const outside = [
  { t: -2.1, s: 2 },
  { t: 2.1, s: 2 },
  { t: 2.5, s: 1 },
  { t: 2.5, s: 2 },
  { t: 3.4, s: 1 },
  { t: 3.4, s: 2 },
  { t: 4.1, s: 2 },
  { t: 5, s: 1 },
  { t: -3, s: 1 },
];
for (const e of outside) {
  const p = Qpm(e.t, e.s);
  assert(!onH(p.ccw) && !onH(p.cw), `t=${e.t} s=${e.s} should miss H: ccw=${p.ccw} cw=${p.cw}`);
}

// exhaustive scan: exists s in [1,2] iff t in [-2,2] U [3.5,4]
const stepT = 0.05, stepS = 0.01;
const hits = [];
for (let t = -5; t <= 6 + 1e-12; t = Math.round((t + stepT) * 1000) / 1000) {
  let ok = false;
  for (let s = 1; s <= 2 + 1e-12; s = Math.round((s + stepS) * 1000) / 1000) {
    const p = Qpm(t, s);
    if (onH(p.ccw) || onH(p.cw)) { ok = true; break; }
  }
  if (ok) hits.push(t);
}

function inAnswer(t) {
  return (t >= -2 - 1e-8 && t <= 2 + 1e-8) || (t >= 3.5 - 1e-8 && t <= 4 + 1e-8);
}

for (const t of hits) {
  assert(inAnswer(t), `scan hit t=${t} not in answer`);
}
for (let t = -5; t <= 6 + 1e-12; t = Math.round((t + stepT) * 1000) / 1000) {
  if (inAnswer(t)) {
    assert(hits.includes(t) || hits.some(h => nearly(h, t)), `answer t=${t} missed by scan`);
  }
}

// gap example
assert(!hits.some(t => t > 2 + 1e-8 && t < 3.5 - 1e-8), 'gap (2, 3.5) must be empty');

if (failed === 0) {
  console.log('ALL PASSED');
  console.log('Answers:');
  console.log('(1)① (-1,4) or (5,-2)');
  console.log('(1)② C = (1,6)  (discard (5,2))');
  console.log('(2) t ∈ [-2, 2] ∪ [7/2, 4]');
  process.exit(0);
} else {
  console.error(failed + ' failed');
  process.exit(1);
}
