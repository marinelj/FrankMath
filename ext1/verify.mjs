// Independent verification of 第27题扩展题目1
const near = (a,b) => Math.abs(a-b) < 1e-9;
const nearPt = (p,q) => near(p[0],q[0]) && near(p[1],q[1]);
const dot = (a,b) => a[0]*b[0]+a[1]*b[1];
const len = (a) => Math.hypot(a[0],a[1]);
const sub = (p,a) => [p[0]-a[0], p[1]-a[1]];
const add = (a,v) => [a[0]+v[0], a[1]+v[1]];
const ccw = (v) => [-v[1], v[0]];
const cw  = (v) => [v[1], -v[0]];
const chain = (P, A) => ({ ccw: add(A, ccw(sub(P,A))), cw: add(A, cw(sub(P,A))) });

const errors = [];
const assert = (c,m) => { if (!c) errors.push(m); };

function checkChain(P, A, Q, label) {
  const vP = sub(P,A), vQ = sub(Q,A);
  assert(near(dot(vP,vQ), 0), `${label} not perpendicular`);
  assert(near(len(vP), len(vQ)), `${label} lengths differ ${len(vP)} ${len(vQ)}`);
  assert(len(vP) > 1e-9, `${label} zero vector`);
}

// (1)① P=(5,2) about A=(2,2)
const A = [2,2], P = [5,2];
const q1 = chain(P, A);
assert(nearPt(q1.ccw, [2,5]), `(1)① ccw ${q1.ccw}`);
assert(nearPt(q1.cw,  [2,-1]), `(1)① cw ${q1.cw}`);
checkChain(P, A, q1.ccw, '(1)① ccw');
checkChain(P, A, q1.cw, '(1)① cw');
// axis symmetry about line PA (y=2): (2,5) and (2,-1)
assert(near(q1.ccw[0], q1.cw[0]) && near((q1.ccw[1]+q1.cw[1])/2, 2), 'not symmetric about y=2');

// (1)② B is 链垂点 of A about C, A=(1,2), B=(1,6), C to the right of y-axis
const A2=[1,2], B2=[1,6];
const mid = [(A2[0]+B2[0])/2, (A2[1]+B2[1])/2];
const half = sub(B2, mid);
const C1 = add(mid, ccw(half));
const C2 = add(mid, cw(half));
// mid=(1,4), half=(0,2), ccw=(-2,0) => (-1,4); cw=(2,0) => (3,4)
assert(nearPt(C1, [-1,4]) || nearPt(C1, [3,4]), `C1 unexpected ${C1}`);
assert(nearPt(C2, [-1,4]) || nearPt(C2, [3,4]), `C2 unexpected ${C2}`);
const Cs = [C1,C2];
const right = Cs.filter(C => C[0] > 0);
const left  = Cs.filter(C => C[0] < 0);
assert(right.length===1 && nearPt(right[0],[3,4]), `right C ${right}`);
assert(left.length===1 && nearPt(left[0],[-1,4]), `left C ${left}`);
for (const C of Cs) {
  // B is 链垂点 of A about C means B is one of chain(A, C)
  const qs = chain(A2, C);
  const ok = nearPt(qs.ccw, B2) || nearPt(qs.cw, B2);
  assert(ok, `B is not chain of A about ${C}, got ${qs.ccw} ${qs.cw}`);
  checkChain(A2, C, B2, `C=${C}`);
}

// (2) D=(2+s,s), 0≤s≤1; E=(0,t), t<0
// H: boundary of square |x|=4 or |y|=4, other coord in [-4,4]
function candidates(t,s){
  return {
    ccw: [t-s, t+2+s],
    cw:  [s-t, t-2-s]
  };
}
function onBoundary(p){
  return p[0]>=-4-1e-9 && p[0]<=4+1e-9 && p[1]>=-4-1e-9 && p[1]<=4+1e-9 &&
    (Math.abs(Math.abs(p[0])-4)<1e-9 || Math.abs(Math.abs(p[1])-4)<1e-9);
}
function allSolutions(t){
  const sols=[];
  // known closed forms plus exhaustive check via s grid and exact branches
  // Q+ left: s=t+4
  let s=t+4;
  if (s>=-1e-9 && s<=1+1e-9){
    s=Math.max(0,Math.min(1,s));
    const q=candidates(t,s).ccw;
    if (onBoundary(q)) sols.push({s,rot:'ccw',D:[2+s,s],Q:q});
  }
  s=t+2;
  if (s>=-1e-9 && s<=1+1e-9){
    s=Math.max(0,Math.min(1,s));
    const q=candidates(t,s).cw;
    if (onBoundary(q)) sols.push({s,rot:'cw',D:[2+s,s],Q:q});
  }
  return sols;
}

const samples = [
  [-4,'ccw',0,[-4,-2]],
  [-3.5,'ccw',0.5,[-4,-1]],
  [-3,'ccw',1,[-4,0]],
  [-2,'cw',0,[2,-4]],
  [-1.5,'cw',0.5,[2,-4]],
  [-1,'cw',1,[2,-4]],
];
for (const [t,rot,s,expect] of samples){
  const q=candidates(t,s)[rot];
  assert(onBoundary(q), `boundary t=${t} q=${q}`);
  assert(nearPt(q,expect), `coords t=${t} got ${q} expected ${expect}`);
  const E=[0,t], D=[2+s,s];
  checkChain(D,E,q, `t=${t}`);
  assert(allSolutions(t).length>=1, `allSolutions missed t=${t}`);
}

assert(allSolutions(-2.5).length===0, 'gap t=-2.5 should be empty');
// typo check: -3.1 is inside first interval
assert(allSolutions(-3.1).length===1, 't=-3.1 should work');
assert(allSolutions(-4.1).length===0, 't=-4.1 no');
assert(allSolutions(-0.9).length===0, 't=-0.9 no');
assert(allSolutions(-2.5).length===0 && allSolutions(-2.1).length===0 && allSolutions(-2.9).length===0, 'gap');

// Dense scan t<0, 0≤s≤1: only the two branches
let found=0, unexpected=0;
const extra=[];
for (let t=-6; t<=-0.05+1e-12; t+=0.05){
  for (let s=0; s<=1+1e-12; s+=0.05){
    const qq=candidates(t,s);
    for (const rot of ['ccw','cw']){
      if (onBoundary(qq[rot])){
        found++;
        const q=qq[rot];
        const onLeft = rot==='ccw' && Math.abs(q[0]+4)<1e-6;
        const onBottom = rot==='cw' && Math.abs(q[1]+4)<1e-6;
        if (!onLeft && !onBottom){
          unexpected++;
          extra.push({t,s,rot,q});
        }
      }
    }
  }
}
assert(found>0, 'scan found nothing');
assert(unexpected===0, 'unexpected pairs '+JSON.stringify(extra.slice(0,8)));

// Closed-form impossible leftover cases for t<0
// Q+ right, top: t>0; Q+ bottom: x off; Q- left/top t>0; Q- right y=-6 off
for (let t=-4; t<=-3+1e-12; t+=0.05){
  const s=t+4;
  const q=candidates(t,s).cw; // Q- right at same s? s=t+4, Q- x=s-t=4, y=t-2-(t+4)=-6
  assert(!onBoundary(q), `Q- right should be invalid t=${t} q=${q}`);
}
for (let t=-7; t<=-6+1e-12; t+=0.05){
  const s=-t-6;
  if (s>=0 && s<=1) assert(!onBoundary(candidates(t,s).ccw), `Q+ bottom t=${t}`);
}

// Range statement
function inAnswer(t){
  return (t>=-4-1e-9 && t<=-3+1e-9) || (t>=-2-1e-9 && t<=-1+1e-9);
}
for (let t=-5; t<=-0.05+1e-12; t+=0.05){
  const n=allSolutions(t).length;
  const should=inAnswer(t);
  assert((n>0)===should, `range mismatch t=${t.toFixed(2)} sols=${n} should=${should}`);
}

if (errors.length){
  console.error('FAILED', errors.length);
  for (const e of errors) console.error(' -', e);
  process.exit(1);
}
console.log('All checks passed. Scan valid pairs:', found);
console.log('(1)①', q1);
console.log('(1)② C=', right[0], 'excluded', left[0]);
console.log('(2) t ∈ [-4,-3] ∪ [-2,-1]');
