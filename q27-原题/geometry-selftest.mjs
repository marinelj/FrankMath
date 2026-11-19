// Independent numerical checks for 链垂点 geometry.
const candidates = (t, s) => ({
  ccw: [t - s, 1 + s + t],
  cw: [s - t, t - 1 - s]
});

const onBoundary = (p) =>
  p[0] >= -3 - 1e-7 && p[0] <= 3 + 1e-7 &&
  p[1] >= -3 - 1e-7 && p[1] <= 3 + 1e-7 &&
  (Math.abs(Math.abs(p[0]) - 3) < 1e-7 || Math.abs(Math.abs(p[1]) - 3) < 1e-7);

function allSolutions(t) {
  const tol = 1e-7, sols = [];
  let s = t + 3;
  if (s >= -tol && s <= 1 + tol) {
    s = Math.max(0, Math.min(1, s));
    const q = candidates(t, s).ccw;
    if (onBoundary(q)) sols.push({ s, rot: 'ccw', D: [1 + s, s], Q: q });
  }
  s = t + 2;
  if (s >= -tol && s <= 1 + tol) {
    s = Math.max(0, Math.min(1, s));
    const q = candidates(t, s).cw;
    if (onBoundary(q)) sols.push({ s, rot: 'cw', D: [1 + s, s], Q: q });
  }
  return sols;
}

const errors = [];
const assert = (cond, msg) => { if (!cond) errors.push(msg); };
const near = (a, b) => Math.abs(a - b) < 1e-8;
const nearPt = (p, q) => near(p[0], q[0]) && near(p[1], q[1]);

// (1)① rotate A=(2,1) about O
const A = [2, 1];
const qCcw = [-A[1], A[0]];
const qCw = [A[1], -A[0]];
assert(nearPt(qCcw, [-1, 2]), `(1)① ccw got ${qCcw}`);
assert(nearPt(qCw, [1, -2]), `(1)① cw got ${qCw}`);
assert(Math.abs(A[0]*qCcw[0] + A[1]*qCcw[1]) < 1e-8, '(1)① ccw not right angle');
assert(Math.abs(A[0]*qCw[0] + A[1]*qCw[1]) < 1e-8, '(1)① cw not right angle');

// (1)② C candidates
const M = [2.5, 1.5], half = [2.5, 1.5];
const C1 = [M[0] - half[1], M[1] + half[0]];
const C2 = [M[0] + half[1], M[1] - half[0]];
assert(nearPt(C1, [1, 4]), `(1)② C1 got ${C1}`);
assert(nearPt(C2, [4, -1]), `(1)② C2 got ${C2}`);
const CO = [-1, -4], CB = [4, -1];
assert(Math.abs(CO[0]*CB[0] + CO[1]*CB[1]) < 1e-8, '(1)② not right angle');
assert(near(Math.hypot(...CO), Math.hypot(...CB)), '(1)② lengths differ');

const samples = [
  [-3, 'ccw', 0, [-3, -2]],
  [-2.5, 'ccw', 0.5, [-3, -1]],
  [-2, 'ccw', 1, [-3, 0]],
  [-2, 'cw', 0, [2, -3]],
  [-1.5, 'cw', 0.5, [2, -3]],
  [-1, 'cw', 1, [2, -3]],
];
for (const [t, rot, s, expectQ] of samples) {
  const q = candidates(t, s)[rot];
  const E = [0, t], D = [1 + s, s];
  const a = [D[0]-E[0], D[1]-E[1]], b = [q[0]-E[0], q[1]-E[1]];
  assert(onBoundary(q), `boundary t=${t} s=${s} ${rot} q=${q}`);
  assert(nearPt(q, expectQ), `coords t=${t} got ${q} expected ${expectQ}`);
  assert(Math.abs(a[0]*b[0] + a[1]*b[1]) < 1e-8, `right angle t=${t}`);
  assert(near(Math.hypot(...a), Math.hypot(...b)), `equal length t=${t}`);
}

assert(allSolutions(-2).length === 2, 't=-2 should have 2 solutions');
assert(allSolutions(-2.5).length === 1, 't=-2.5 one solution');
assert(allSolutions(-1.5).length === 1, 't=-1.5 one solution');
assert(allSolutions(-3).length === 1 && allSolutions(-1).length === 1, 'endpoints have one solution');
assert(allSolutions(-3.1).length === 0 && allSolutions(-0.9).length === 0, 'outside range no solution');

// Dense scan of t<0, 0≤s≤1: only left-ccw or bottom-cw should be valid
let found = 0;
for (let t = -5; t <= -0.05 + 1e-12; t += 0.05) {
  for (let s = 0; s <= 1 + 1e-12; s += 0.05) {
    const qq = candidates(t, s);
    for (const rot of ['ccw', 'cw']) {
      if (onBoundary(qq[rot])) {
        found++;
        const q = qq[rot];
        const onLeft = rot === 'ccw' && Math.abs(q[0] + 3) < 1e-6;
        const onBottom = rot === 'cw' && Math.abs(q[1] + 3) < 1e-6;
        if (!onLeft && !onBottom) errors.push(`unexpected valid pair ${rot} t=${t} s=${s} q=${q}`);
      }
    }
  }
}
assert(found > 0, 'scan found no valid pairs');

// Closed-form leftover cases
for (let t = -5; t <= -4 + 1e-12; t += 0.05) {
  const s = -4 - t;
  assert(!onBoundary(candidates(t, s).ccw), `Q+ bottom invalid t=${t}`);
}
for (let t = -3; t <= -2 + 1e-12; t += 0.05) {
  const s = t + 3;
  assert(!onBoundary(candidates(t, s).cw), `Q- right invalid t=${t}`);
}

if (errors.length) {
  console.error('FAILED', errors.length);
  for (const e of errors) console.error(' -', e);
  process.exit(1);
}
console.log('All geometry checks passed. Valid pairs in dense scan:', found);
