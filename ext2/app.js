(() => {
  const $ = id => document.getElementById(id);
  const canvas = $('graph');
  const ctx = canvas.getContext('2d');
  const VIEW = 660, LIM = 7, C = 330, S = C / LIM;
  const TMIN = -5, TMAX = 6;
  const colors = {
    axis: '#9aa8bd',
    grid: '#e6edf6',
    ink: '#1c2b44',
    blue: '#2563eb',
    red: '#e45b4c',
    green: '#0a9a72',
    purple: '#7b45ce',
    gold: '#d48b11',
    orange: '#f97316',
    h: '#3b82f6',
    muted: '#6b7a93'
  };

  const stepData = [
    [
      {
        title: '先分清谁绕着谁转',
        short: '分清中心',
        desc: '题目写的是「点 P 关于点 A 的链垂点」。中心是 A，被转动的是 P。A 不在原点，别习惯性地绕着 O 转。<br>A 在 (2,1)，P 在 (5,4)。从 A 到 P 不是横平竖直，而是向右 3、向上 3。',
        say: '先看清，是谁绕着谁转。中心是 A，不是原点。被转的是 P。A 在二、一，P 在五、四。从 A 到 P，不是横平竖直，而是向右三格、再向上三格。',
        formula: '<div class="eqline">A(2,1)，P(5,4)，从 A 到 P 是向右 3、向上 3</div>'
      },
      {
        title: '链垂点要同时满足两件事',
        short: '两个条件',
        desc: '转到的点既要和原来一样远，又要正好转过直角。也就是 AQ = AP，并且 ∠PAQ = 90°。<br>可以逆时针转 90°，也可以顺时针转 90°，两种都要考虑。',
        say: '链垂点要两件事一起成立：一样长，而且正好是直角。也就是说，从 A 到 Q 的距离，要跟从 A 到 P 一样；两条线还要夹成直角。可以向左拧 90 度，也可以向右拧 90 度，两种都要考虑。',
        formula: '<div class="eqline">AQ = AP，∠PAQ = 90°</div>'
      },
      {
        title: '逆时针转 90°',
        short: '逆时针',
        desc: '先向左拧 90°。原来向右 3、向上 3，转完变成向左 3、向上 3。从 A 往左 3 格、再往上 3 格，得到 (−1,4)。',
        say: '先向左拧 90 度，也就是逆时针。原来向右 3、向上 3，转到以后变成向左 3、向上 3。从 A 往左 3 格、再往上 3 格，得到的点是负一、四。',
        formula: '<div class="eqline">向右 3、向上 3，逆时针转 90° 变成向左 3、向上 3</div><div class="eqline">Q = (2,1) + (−3,3) = (−1,4)</div>'
      },
      {
        title: '顺时针转 90°',
        short: '顺时针',
        desc: '再向右拧 90°。原来向右 3、向上 3，转完变成向右 3、向下 3。从 A 往右 3 格、再往下 3 格，得到 (5,−2)。',
        say: '再向右拧 90 度，也就是顺时针。原来向右 3、向上 3，转到以后变成向右 3、向下 3。从 A 往右 3 格、再往下 3 格，得到的点是五、负二。',
        formula: '<div class="eqline">向右 3、向上 3，顺时针转 90° 变成向右 3、向下 3</div><div class="eqline">Q = (2,1) + (3,−3) = (5,−2)</div>'
      },
      {
        title: '两个答案都要留下',
        short: '核对',
        desc: '两个点到 A 都一样远，并且都和 AP 夹成直角，都符合定义。两个都要写上。<br>再核对一眼：从 A 到 (−1,4) 是向左 3、向上 3；从 A 到 (5,−2) 是向右 3、向下 3。',
        say: '两个答案都对，都要写上：负一、四，或者五、负二。你再核对一下：它们到 A 的距离都跟 AP 一样，并且都跟 AP 夹成直角。',
        formula: '<div class="eqline">点 P 关于点 A 的链垂点是 (−1,4) 或 (5,−2)</div>'
      }
    ],
    [
      {
        title: '读清语序：中心是 C',
        short: '读语序',
        desc: '「B 是 A 关于 C 的链垂点」。中心是还不知道的 C，被转的是 A，转完要落到 B。<br>所以三角形 ACB 是等腰直角三角形，直角在 C，斜边是 AB。',
        say: '这一问要倒过来求中心。题目说，B 是 A 关于 C 的链垂点，所以中心是 C，被转的是 A，转完要落到 B。三角形 ACB 是等腰直角三角形，直角在 C，斜边就是 AB。',
        formula: '<div class="eqline">CA = CB，∠ACB = 90°，斜边是 AB</div>'
      },
      {
        title: '斜边向右上，中点和垂直平分线',
        short: '找中点',
        desc: 'A 在 (1,2)，B 在 (5,6)，从 A 到 B 是向右 4、向上 4。斜边中点 M 是 (3,4)，斜边一半是向右 2、向上 2。<br>直角顶点 C 一定在 AB 的垂直平分线上，而且到 M 的距离也是这么长。垂直平分线的方向是向左 2、向上 2，或者相反：向右 2、向下 2。',
        say: '先看斜边。A 在一、二，B 在五、六，从 A 到 B 是向右 4、向上 4。中点 M 是三、四。斜边的一半，就是向右 2、向上 2。直角顶点 C，一定在斜边的垂直平分线上，离 M 的距离也是这么长。垂直平分线的方向，是向左 2、向上 2，或者相反，向右 2、向下 2。',
        formula: '<div class="eqline">M = (3,4)，从 M 沿垂直平分线走「向左 2、向上 2」或「向右 2、向下 2」</div>'
      },
      {
        title: '先把两个可能的点找出来',
        short: '两个可能',
        desc: '从 M 向左 2、向上 2，得到 (1,6)；从 M 向右 2、向下 2，得到 (5,2)。两个先都记下来。',
        say: '所以有两个可能的点。从 M 向左 2、向上 2，得到一、六；从 M 向右 2、向下 2，得到五、二。两个先都记下来。',
        formula: '<div class="eqline">(3,4) + (−2,2) = (1,6)</div><div class="eqline">(3,4) + (2,−2) = (5,2)</div>'
      },
      {
        title: 'C 在 A 的正上方',
        short: '按条件取舍',
        desc: '题目要求 C 在点 A 的正上方。(1,6) 的横坐标和 A 一样，并且在 A 的上面，符合条件。(5,2) 不是，要舍去。留下 C = (1,6)。',
        say: '题目还要求：C 在点 A 的正上方。一、六正好在 A 的正上方，五、二不是，要丢掉。留下的 C，就是一、六。',
        formula: '<div class="eqline">C 与 A 横坐标相同，且在 A 上方 → 留下 (1,6)，舍去 (5,2)</div>'
      },
      {
        title: '代回检验',
        short: '检验',
        desc: '从 C(1,6) 到 A(1,2)，是竖直向下 4 格；从 C 到 B(5,6)，是水平向右 4 格。两条一样长，也正好是直角。所以 C = (1,6)。',
        say: '再代回去检验一下。从 C 到 A，是竖直向下 4 格；从 C 到 B，是水平向右 4 格。两条一样长，也正好是直角。所以 C 等于一、六。',
        formula: '<div class="eqline">CA 竖直向下 4，CB 水平向右 4，CA = CB，∠ACB = 90°</div><div class="eqline">C = (1,6)</div>'
      }
    ],
    [
      {
        title: '先看清三角形和动点',
        short: '看图形',
        desc: 'H 是等腰直角三角形的边界，三个顶点是 (−4,0)、(4,0) 和 (0,4)。直角在最上面的 (0,4)，对称轴正好是 y 轴。<br>点 E 在这条对称轴上，E = (0, t)，t 可正可负，整条 y 轴都能走。点 D 在线段 G 上，G 是从 (2,1) 到 (2,2) 的竖直线段。用 s 表示 D 的位置：D = (2, s)，其中 1 ≤ s ≤ 2。s 不是题干里的字母，只是为了方便描写 D。',
        say: '先把图形看清楚。H 是一个等腰直角三角形的边界，三个顶点是负四、零，正四、零，还有零、四。直角在最上面那个点，对称轴正好是 y 轴。点 E 在这条对称轴上，坐标是零和 t，t 可正可负，整条 y 轴都能走。点 D 在线段 G 上，G 是从二、一到二、二的竖直线段。我们用 s 表示 D 的位置：D 就是二、s，其中 s 从一到二。',
        formula: '<div class="eqline">H：顶点 (−4,0)、(4,0)、(0,4)，只算边界</div><div class="eqline">E = (0, t)，D = (2, s)，1 ≤ s ≤ 2</div>'
      },
      {
        title: '用 t 和 s 写出两个 Q',
        short: '写出 Q',
        desc: '以 E 为中心转 D。从 E 看 D，先向右 2，竖直方向再走 s − t。<br>逆时针转 90° 得到 Q₊，顺时针转 90° 得到 Q₋。两个坐标都可以用 t 和 s 写出来。接下来按 Q 落到 H 的哪一条边上，一种一种看，不要漏。',
        say: '以 E 为中心转 D。逆时针会得到一个 Q，顺时针也会得到一个。这两个点的坐标，都可以用 t 和 s 写出来，右边公式里有。接下来按落到 H 的哪一条边上，一种一种看，不要漏。',
        formula: '<div class="eqline">从 E 到 D：向右 2，竖直方向变化 s − t</div><div class="eqline">逆时针：Q₊ = (t − s, t + 2)</div><div class="eqline">顺时针：Q₋ = (s − t, t − 2)</div>'
      },
      {
        title: '逆时针：得到 [−2, 2]',
        short: '逆时针',
        desc: '逆时针转到左边或者底边时都成立。转到右边那一段也对，不过已经包含在 [−2, 2] 里面了。<br>例如：t = −2 时，Q 落在底边上；t = −2 且 D = (2,2) 时，Q 正好在左下顶点 (−4,0)；t = 2 且 D = (2,2) 时，Q 落到最上面的直角顶点 (0,4)。这样得到第一段：t ∈ [−2, 2]。',
        say: '先看逆时针。转到左边或者底边时都成立，转到右边那一段也对，不过已经包含在负二到正二里面了。这样得到第一段：t 从负二到正二。你可以看看，t 等于负二时，Q 落在底边上；t 等于正二、D 在二、二时，Q 正好落到最上面的直角顶点。',
        formula: '<div class="eqline">逆时针落到左边或底边（右边那一段也在其中）</div><div class="eqline">t ∈ [−2, 2]</div>'
      },
      {
        title: '顺时针：得到 [7/2, 4]',
        short: '顺时针',
        desc: '再看顺时针。落到左边时成立，这时 t ∈ [7/2, 4]。例如 t = 7/2、D = (2,1) 时，Q 落在左边上；t = 4、D = (2,2) 时，Q 也在左边上。<br>顺时针落到右边会得到不在 G 上的位置，不行。',
        say: '再看顺时针。落到左边时成立，这时 t 从二分之七到四。比如 t 等于二分之七、D 在二、一时，Q 落在左边上；t 等于四、D 在二、二时，Q 也在左边上。顺时针落到右边是不行的。',
        formula: '<div class="eqline">顺时针落到左边：t ∈ [7/2, 4]</div>'
      },
      {
        title: '中间有空隙，不要连成一段',
        short: '空隙',
        desc: '两段中间 (2, 7/2) 是空的，不能连成一截。例如 t = 5/2 时，无论 D 取在 G 的哪里，Q 都落不到 H 的边上。<br>所以答案是 t ∈ [−2, 2] ∪ [7/2, 4]，千万不要写成 [−2, 4]。',
        say: '要注意，中间从正二到二分之七是空的，两段不能连成一截。比如现在 t 等于二分之五，也就是两点五，无论 D 取在 G 的哪里，Q 都落不到 H 的边上。所以答案是：负二到正二，再并上二分之七到四。千万别写成负二到四。',
        formula: '<div class="eqline">中间 (2, 7/2) 为空，例如 t = 5/2 无解</div><div class="eqline">t ∈ [−2, 2] ∪ [7/2, 4]</div>'
      }
    ]
  ];

  const answers = [
    { title: '(1)①', value: '(−1,4) 或 (5,−2)', note: '绕点 A 旋转，不是绕原点。两个方向都要写。' },
    { title: '(1)②', value: 'C = (1,6)', note: '先找出 (1,6) 和 (5,2)，再按「C 在 A 的正上方」舍去 (5,2)。' },
    { title: '(2)', value: 't ∈ [−2, 2] ∪ [7/2, 4]', note: '两段中间有空隙 (2, 7/2)，不要写成 [−2, 4]。例如 t = 5/2 无解。' }
  ];

  const titles = [
    '以 A 为中心，旋转点 P',
    '以 C 为中心，旋转点 A 得到 B',
    '以 E 为中心，旋转点 D'
  ];

  const st = {
    tab: 0,
    progress: 0,
    playing: false,
    speed: 1,
    last: 0,
    t: -2,
    s: 1,
    manual: false,
    exploring: false,
    rot: 'ccw',
    explain: false,
    scrubbing: false,
    voice: true
  };

  const fmt = n => {
    const r = Math.round(n * 1e6) / 1e6;
    if (Object.is(r, -0) || r === 0) return '0';
    const sign = r < 0 ? '−' : '';
    const a = Math.abs(r);
    const fracs = [[0.5, '1/2'], [1.5, '3/2'], [2.5, '5/2'], [3.5, '7/2']];
    for (const [v, s] of fracs) if (Math.abs(a - v) < 1e-8) return sign + s;
    const body = Number.isInteger(a) ? String(a) : String(Math.round(a * 100) / 100);
    return sign + body;
  };
  const coord = (x, y) => `(${fmt(x)}, ${fmt(y)})`;
  const xy = (x, y) => [C + x * S, C - y * S];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const displayW = () => canvas.getBoundingClientRect().width || VIEW;
  const kScale = () => VIEW / displayW();
  const fs = px => px * kScale();
  function setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const w = Math.round(VIEW * dpr);
    if (canvas.width !== w || canvas.height !== w) {
      canvas.width = w;
      canvas.height = w;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const voiceAudio = new Audio();
  voiceAudio.preload = 'auto';
  try { voiceAudio.playsInline = true; } catch (e) {}
  let voiceKey = '';
  const totalDur = tab => VOICE_DUR[tab].reduce((a, b) => a + b, 0);
  const stageInfo = p => {
    const durs = VOICE_DUR[st.tab];
    let t = clamp(p, 0, 1) * totalDur(st.tab);
    for (let i = 0; i < 5; i++) {
      if (t < durs[i] - 1e-4 || i === 4) {
        return { k: i, frac: clamp(t / durs[i], 0, 1), dur: durs[i] };
      }
      t -= durs[i];
    }
    return { k: 4, frac: 1, dur: durs[4] };
  };
  const stage = () => stageInfo(st.progress).k;
  const stageFrac = () => {
    if (!st.playing && !st.scrubbing) return 1;
    return stageInfo(st.progress).frac;
  };
  const progressForStep = (i, frac) => {
    const durs = VOICE_DUR[st.tab];
    let t = 0;
    for (let k = 0; k < i; k++) t += durs[k];
    t += durs[i] * frac;
    return t / totalDur(st.tab);
  };
  function stopVoice() {
    voiceAudio.pause();
    voiceKey = '';
  }
  function syncVoice() {
    if (!(st.explain && st.voice && st.playing)) {
      if (!voiceAudio.paused) voiceAudio.pause();
      return;
    }
    const info = stageInfo(st.progress);
    const key = st.tab + ':' + info.k;
    const want = info.frac * info.dur;
    if (voiceKey !== key) {
      voiceKey = key;
      voiceAudio.src = VOICE_SRC[st.tab][info.k];
      voiceAudio.playbackRate = st.speed;
      const kick = () => {
        try { voiceAudio.currentTime = Math.max(0, Math.min(Math.max(0, info.dur - 0.05), want)); } catch (e) {}
        voiceAudio.play().catch(() => {});
      };
      if (voiceAudio.readyState >= 1) kick();
      else voiceAudio.onloadedmetadata = kick;
    } else {
      voiceAudio.playbackRate = st.speed;
      if (Math.abs((voiceAudio.currentTime || 0) - want) > 0.4) {
        try { voiceAudio.currentTime = want; } catch (e) {}
      }
      if (voiceAudio.paused) voiceAudio.play().catch(() => {});
    }
  }

  function rotateVec(v, ang, clockwise) {
    const c = Math.cos(ang), s = Math.sin(ang);
    if (clockwise) return [c * v[0] + s * v[1], -s * v[0] + c * v[1]];
    return [c * v[0] - s * v[1], s * v[0] + c * v[1]];
  }
  // v = (dx, dy) → 逆时针 (−dy, dx)，顺时针 (dy, −dx)
  function rot90(v, clockwise) {
    if (clockwise) return [v[1], -v[0]];
    return [-v[1], v[0]];
  }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }

  function stroke(a, b, color = '#334861', width = 2, dash = []) {
    const [x1, y1] = xy(a[0], a[1]), [x2, y2] = xy(b[0], b[1]);
    ctx.beginPath();
    ctx.setLineDash(dash.map(d => fs(d)));
    ctx.strokeStyle = color;
    ctx.lineWidth = fs(width);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function poly(coords, color, width = 2, dash = [], fill) {
    ctx.beginPath();
    ctx.setLineDash(dash.map(d => fs(d)));
    coords.forEach((p, i) => {
      const [x, y] = xy(p[0], p[1]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = fs(width);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function marker(x, y, color, label, dx = 14, dy = -17, ghost = false) {
    const [px, py] = xy(x, y);
    const k = kScale();
    ctx.beginPath();
    ctx.globalAlpha = ghost ? 0.38 : 1;
    ctx.fillStyle = color;
    ctx.arc(px, py, fs(ghost ? 6 : 7), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    if (label) {
      const fontPx = fs(15);
      ctx.font = '700 ' + fontPx + 'px "PingFang SC","Microsoft YaHei",system-ui,sans-serif';
      ctx.textBaseline = 'alphabetic';
      const w = ctx.measureText(label).width;
      const padX = fs(4), boxH = fontPx + fs(6);
      let lx = px + dx * k, ly = py + dy * k;
      if (lx - padX < 8) lx = 8 + padX;
      if (lx + w + padX > VIEW - 8) lx = VIEW - 8 - w - padX;
      if (ly - fontPx < 8) ly = 8 + fontPx;
      if (ly + fs(6) > VIEW - 8) ly = VIEW - 8 - fs(6);
      ctx.fillStyle = 'rgba(255,255,255,0.86)';
      ctx.fillRect(lx - padX, ly - fontPx + fs(2), w + padX * 2, boxH);
      ctx.fillStyle = ghost ? '#6b7a93' : colors.ink;
      ctx.fillText(label, lx, ly);
    }
  }

  function rightAngle(center, p, q, color = '#f97316') {
    let a = [p[0] - center[0], p[1] - center[1]];
    let b = [q[0] - center[0], q[1] - center[1]];
    const na = Math.hypot(a[0], a[1]) || 1, nb = Math.hypot(b[0], b[1]) || 1;
    const len = 0.45;
    a = [a[0] / na * len, a[1] / na * len];
    b = [b[0] / nb * len, b[1] / nb * len];
    const s1 = add(center, a);
    const s2 = add(s1, b);
    const s3 = add(center, b);
    stroke(s1, s2, color, 2);
    stroke(s2, s3, color, 2);
  }

  function drawGrid() {
    ctx.clearRect(0, 0, VIEW, VIEW);
    ctx.fillStyle = '#fbfcff';
    ctx.fillRect(0, 0, VIEW, VIEW);
    ctx.strokeStyle = colors.grid;
    for (let n = -LIM; n <= LIM; n++) {
      stroke([-LIM, n], [LIM, n], colors.grid, 1);
      stroke([n, -LIM], [n, LIM], colors.grid, 1);
    }
    stroke([-LIM, 0], [LIM, 0], '#4a5c78', 1.6);
    stroke([0, -LIM], [0, LIM], '#4a5c78', 1.6);
    ctx.fillStyle = '#4a5c78';
    ctx.font = fs(12) + 'px system-ui,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let n = -LIM; n <= LIM; n++) {
      if (n === 0) continue;
      const [x, y] = xy(n, 0);
      ctx.fillText(String(n).replace('-', '−'), x, y + fs(6));
      const [x2, y2] = xy(0, n);
      ctx.textAlign = 'right';
      ctx.fillText(String(n).replace('-', '−'), x2 - fs(7), y2 - fs(6));
      ctx.textAlign = 'center';
    }
    ctx.fillText('O', C + fs(12), C + fs(8));
    ctx.font = '700 ' + fs(13) + 'px system-ui,sans-serif';
    const [ax, ay] = xy(LIM - 0.15, 0), [bx, by] = xy(0, LIM - 0.15);
    ctx.fillText('x', ax, ay + fs(8));
    ctx.fillText('y', bx + fs(14), by - fs(2));
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  function canvasBanner(text, tone = 'ok') {
    ctx.save();
    const fontPx = fs(14);
    ctx.font = '700 ' + fontPx + 'px "PingFang SC","Microsoft YaHei",system-ui,sans-serif';
    const maxW = VIEW - fs(40);
    const words = text.split(''), lines = [];
    let line = '';
    for (const ch of words) {
      const trial = line + ch;
      if (ctx.measureText(trial).width > maxW - fs(24) && line) {
        lines.push(line);
        line = ch;
      } else line = trial;
    }
    if (line) lines.push(line);
    const padX = fs(14), padY = fs(8), lineH = fontPx * 1.35;
    const w = Math.min(maxW, Math.max(...lines.map(l => ctx.measureText(l).width)) + padX * 2);
    const h = lines.length * lineH + padY * 2;
    const x = (VIEW - w) / 2, y = VIEW - h - fs(16);
    ctx.fillStyle = tone === 'ok' ? 'rgba(16,110,80,0.92)' : tone === 'warn' ? 'rgba(166,90,12,0.94)' : 'rgba(160,50,40,0.94)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, fs(10));
    else ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    lines.forEach((ln, i) => ctx.fillText(ln, VIEW / 2, y + padY + lineH * (i + 0.5)));
    ctx.restore();
  }

  function arc(center, v, clockwise, frac = 1) {
    const [cx, cy] = xy(...center);
    const a0 = -Math.atan2(v[1], v[0]);
    const span = (Math.PI / 2) * clamp(frac, 0, 1);
    const a1 = clockwise ? a0 + span : a0 - span;
    const r = Math.hypot(v[0], v[1]) * S * 0.42;
    ctx.beginPath();
    ctx.strokeStyle = colors.gold;
    ctx.lineWidth = fs(2);
    ctx.setLineDash([fs(5), fs(4)]);
    ctx.arc(cx, cy, Math.max(fs(18), r), a0, a1, !clockwise);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawP1() {
    const k = stage(), f = stageFrac();
    const A = [2, 1], P = [5, 4], Q1 = [-1, 4], Q2 = [5, -2];
    if (k >= 4) stroke([-2.2, -2.2], [6.2, 6.2], colors.gold, 2, [6, 5]);
    stroke(A, P, colors.blue, 2.4);
    if (k >= 2) {
      const ang = (k === 2 ? f : 1) * Math.PI / 2;
      const cur = add(A, rotateVec(sub(P, A), ang, false));
      stroke(A, k === 2 ? cur : Q1, colors.green, 2.4);
      arc(A, sub(P, A), false, k === 2 ? f : 1);
      if (k > 2 || f > 0.62) {
        rightAngle(A, P, Q1);
        marker(Q1[0], Q1[1], colors.green, 'Q ' + coord(...Q1), 14, -18);
      } else {
        marker(cur[0], cur[1], colors.green, '', 0, 0);
      }
    }
    if (k >= 3) {
      const ang = (k === 3 ? f : 1) * Math.PI / 2;
      const cur = add(A, rotateVec(sub(P, A), ang, true));
      stroke(A, k === 3 ? cur : Q2, '#0a7a8a', 2.4);
      arc(A, sub(P, A), true, k === 3 ? f : 1);
      if (k > 3 || f > 0.62) {
        rightAngle(A, P, Q2, '#0a7a8a');
        marker(Q2[0], Q2[1], '#0a7a8a', 'Q ' + coord(...Q2), 14, 28);
      } else {
        marker(cur[0], cur[1], '#0a7a8a', '', 0, 0);
      }
    }
    marker(A[0], A[1], colors.red, 'A ' + coord(...A), -92, 28);
    marker(P[0], P[1], colors.blue, 'P ' + coord(...P), 14, -18);
    if (k >= 4 && st.explain) canvasBanner('两个答案：(−1,4) 或 (5,−2)', 'ok');
  }

  function drawP2() {
    const k = stage(), f = stageFrac();
    const A = [1, 2], B = [5, 6], M = [3, 4], Cup = [1, 6], Cdn = [5, 2];
    if (k >= 3) {
      stroke([1, -0.4], [1, 6.6], colors.gold, 2, [6, 5]);
    }
    stroke(A, B, colors.blue, 2.6);
    if (k >= 1) {
      stroke([-0.4, 7.4], [6.6, 0.4], colors.gold, 2, [6, 5]);
      marker(M[0], M[1], colors.gold, 'M(3,4)', 16, 26);
    }
    if (k >= 2) {
      stroke(A, Cup, colors.green, 2.2);
      stroke(B, Cup, colors.green, 2.2);
      rightAngle(Cup, A, B, colors.green);
      marker(Cup[0], Cup[1], colors.green, 'C ' + coord(...Cup), -100, 28);
      stroke(A, Cdn, colors.muted, 1.8, [5, 4]);
      stroke(B, Cdn, colors.muted, 1.8, [5, 4]);
      rightAngle(Cdn, A, B, colors.muted);
      marker(Cdn[0], Cdn[1], colors.muted, 'C ' + coord(...Cdn) + (k >= 3 ? ' 舍去' : ''), 14, 28, k >= 3);
    }
    marker(A[0], A[1], colors.blue, 'A ' + coord(...A), 16, 28);
    marker(B[0], B[1], colors.purple, 'B ' + coord(...B), 16, -18);
    if (k >= 4 && st.explain) canvasBanner('C 在 A 的正上方，留下 (1,6)', 'ok');
  }

  function Qpm(t, s) {
    return { ccw: [t - s, t + 2], cw: [s - t, t - 2] };
  }
  function onSeg(Q, A, B) {
    const [x, y] = Q, [x1, y1] = A, [x2, y2] = B;
    if (x < Math.min(x1, x2) - 1e-8 || x > Math.max(x1, x2) + 1e-8) return false;
    if (y < Math.min(y1, y2) - 1e-8 || y > Math.max(y1, y2) + 1e-8) return false;
    return Math.abs((x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)) <= 1e-8;
  }
  function onH(Q) {
    return onSeg(Q, [-4, 0], [4, 0]) || onSeg(Q, [4, 0], [0, 4]) || onSeg(Q, [-4, 0], [0, 4]);
  }
  function allSolutions(t) {
    const out = [];
    const seen = new Set();
    const add = (s, rot) => {
      if (s < 1 - 1e-8 || s > 2 + 1e-8) return;
      s = clamp(s, 1, 2);
      const q = Qpm(t, s)[rot];
      if (!onH(q)) return;
      const key = rot + ':' + Math.round(s * 1e6);
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ s, rot, q, D: [2, s] });
    };
    if (Math.abs(t + 2) < 1e-8) {
      add(1, 'ccw'); add(2, 'ccw'); add(st.s, 'ccw');
    }
    add(2 * (t - 1), 'ccw');
    if (t >= -2 - 1e-8 && t <= 2 + 1e-8) add(2, 'ccw');
    if (Math.abs(t - 2) < 1e-8) {
      add(1, 'cw'); add(2, 'cw'); add(st.s, 'cw');
    }
    add(2 * (t - 3), 'cw');
    return out;
  }
  function matching(t) { return allSolutions(t); }
  function pickAuto(t) {
    const m = matching(t);
    if (!m.length) return null;
    const sameRot = m.filter(x => x.rot === st.rot);
    const pool = sameRot.length ? sameRot : m;
    const keepS = pool.find(x => Math.abs(x.s - st.s) < 1e-6);
    return keepS || pool[0];
  }
  function effective() {
    const m = matching(st.t);
    const q = Qpm(st.t, st.s)[st.rot];
    return { s: st.s, rot: st.rot, q, D: [2, st.s], valid: onH(q), count: m.length };
  }

  function drawTriangleH() {
    const H = [[-4, 0], [4, 0], [0, 4]];
    poly(H, colors.h, 3, [], 'rgba(59,130,246,0.08)');
    rightAngle([0, 4], [-4, 0], [4, 0], colors.h);
    ctx.font = '700 ' + fs(15) + 'px "PingFang SC","Microsoft YaHei",system-ui,sans-serif';
    ctx.fillStyle = colors.h;
    const [hx, hy] = xy(-3.15, 1.15);
    ctx.fillText('H', hx, hy);
  }

  function drawP3() {
    drawTriangleH();
    // symmetry axis (y-axis)
    stroke([0, -LIM + 0.15], [0, LIM - 0.15], 'rgba(212,139,17,0.55)', 2.4, [7, 5]);
    ctx.font = '700 ' + fs(13) + 'px "PingFang SC","Microsoft YaHei",system-ui,sans-serif';
    ctx.fillStyle = colors.gold;
    const [ax, ay] = xy(-1.85, 6.15);
    ctx.fillText('对称轴', ax, ay);

    const G1 = [2, 1], G2 = [2, 2];
    stroke(G1, G2, colors.purple, 6);
    const e = effective();
    const D = e.D, E = [0, st.t], Q = e.q;
    const hideG1 = Math.hypot(D[0] - 2, D[1] - 1) < 0.16;
    const hideG2 = Math.hypot(D[0] - 2, D[1] - 2) < 0.16;
    if (!hideG1) marker(2, 1, colors.purple, '(2,1)', 14, 26);
    if (!hideG2) marker(2, 2, colors.purple, '(2,2)', 14, -16);
    ctx.font = '700 ' + fs(15) + 'px "PingFang SC","Microsoft YaHei",system-ui,sans-serif';
    const [gx, gy] = xy(2.55, 1.5);
    ctx.fillStyle = colors.purple;
    ctx.fillText('G', gx, gy);

    const k = stage();
    if (k === 1 && st.tab === 2 && !st.exploring && !st.manual) {
      const qCcw = Qpm(st.t, st.s).ccw;
      const qCw = Qpm(st.t, st.s).cw;
      stroke(E, D, colors.red, 2, [6, 4]);
      stroke(E, qCcw, colors.green, 2.2);
      stroke(E, qCw, '#0a7a8a', 2.2, [5, 4]);
      marker(qCcw[0], qCcw[1], colors.green, 'Q₊ ' + coord(...qCcw), 14, -18);
      marker(qCw[0], qCw[1], '#0a7a8a', 'Q₋ ' + coord(...qCw), 14, 28);
    } else {
      stroke(E, D, colors.red, 2, [6, 4]);
      stroke(E, Q, e.valid ? colors.green : '#c4483c', 2.4);
      if (Math.hypot(D[0] - E[0], D[1] - E[1]) > 0.2) {
        rightAngle(E, D, Q, e.valid ? colors.orange : '#c4483c');
        arc(E, sub(D, E), e.rot === 'cw', 1);
      }
      const qDx = Q[0] <= -3.2 ? 14 : (Q[0] >= 3.2 ? -100 : 14);
      const qDy = Q[1] >= 3.4 ? 28 : (Q[1] <= 0.3 ? -18 : -18);
      marker(Q[0], Q[1], e.valid ? colors.green : '#c4483c', 'Q ' + coord(...Q), qDx, qDy);
    }

    const nearTop = E[1] >= 3.4;
    const eDy = nearTop ? 30 : (E[1] <= -3.5 ? -18 : -18);
    const eDx = nearTop ? 22 : 16;
    marker(E[0], E[1], colors.red, 'E ' + coord(...E), eDx, eDy);
    const dDx = hideG2 || hideG1 ? -86 : 14;
    const dDy = hideG1 ? -18 : 28;
    marker(D[0], D[1], colors.purple, 'D ' + coord(...D), dDx, dDy);

    if (e.valid) {
      if (st.explain) canvasBanner('Q 落在 H 的边界上  ·  这个 t 符合', 'ok');
      else canvasBanner('Q 落在 H 的边界上', 'ok');
    } else if (e.count === 0) {
      canvasBanner('这个 t 没有解：无论 D 在哪，Q 都落不到 H 上', 'bad');
    } else {
      canvasBanner('当前 Q 不在边界上，试试改 D 的位置或改旋转方向', 'warn');
    }
  }

  function draw() {
    setupCanvas();
    drawGrid();
    if (st.tab === 0) drawP1();
    else if (st.tab === 1) drawP2();
    else drawP3();
  }

  function syncTimelineToT() {
    if (st.manual) return;
    const k = stage();
    const f = (st.playing || st.scrubbing) ? stageInfo(st.progress).frac : 1;
    if (k === 0) {
      st.t = 0;
      st.s = 2;
      st.rot = 'ccw';
    } else if (k === 1) {
      st.t = 0;
      st.s = 1;
      st.rot = 'ccw';
    } else if (k === 2) {
      if (f < 0.16) {
        st.t = -2; st.s = 1; st.rot = 'ccw';
      } else if (f < 0.30) {
        st.t = -2; st.s = 1 + (f - 0.16) / 0.14; st.rot = 'ccw';
      } else if (f < 0.62) {
        st.t = -2 + 4 * ((f - 0.30) / 0.32); st.s = 2; st.rot = 'ccw';
      } else if (f < 0.78) {
        st.t = 2; st.s = 2; st.rot = 'ccw';
      } else if (f < 0.92) {
        st.t = 1.5; st.s = 1; st.rot = 'ccw';
      } else {
        st.t = 2; st.s = 1; st.rot = 'cw';
      }
    } else if (k === 3) {
      const t = 3.5 + 0.5 * f;
      st.t = t;
      st.s = 2 * (t - 3);
      st.rot = 'cw';
    } else {
      st.t = 2.5;
      st.s = 1 + f;
      st.rot = f < 0.5 ? 'ccw' : 'cw';
    }
  }

  function exploreSay() {
    const e = effective();
    const rotTxt = e.rot === 'ccw' ? '逆时针' : '顺时针';
    if (e.valid) {
      return `现在 t = ${fmt(st.t)}，D 在 ${coord(...e.D)}。${rotTxt}转过去，Q 在 ${coord(...e.q)}，正好落在 H 的边上，这个 t 符合。`;
    }
    if (e.count === 0) {
      return `现在 t = ${fmt(st.t)}。无论 D 取在 G 的哪里，Q 都落不到 H 的边上，所以这个 t 没有解。`;
    }
    return `现在 t = ${fmt(st.t)}，D 在 ${coord(...e.D)}。${rotTxt}转过去，Q 在 ${coord(...e.q)}，还没落到 H 的边上。可以改一改 D 的位置，或者换一个旋转方向。`;
  }

  const PIN = '1111';
  const PIN_KEY = 'ext2-explain-unlock';
  const isUnlocked = () => {
    try { return sessionStorage.getItem(PIN_KEY) === '1'; } catch (e) { return !!st._unlocked; }
  };
  const markUnlocked = () => {
    st._unlocked = true;
    try { sessionStorage.setItem(PIN_KEY, '1'); } catch (e) {}
  };
  function closePinModal() {
    const mask = $('pinMask');
    if (!mask) return;
    mask.classList.add('hidden');
    mask.setAttribute('aria-hidden', 'true');
    $('pinInput').value = '';
    $('pinErr').textContent = '';
  }
  function openPinModal() {
    const mask = $('pinMask');
    $('explainToggle').checked = false;
    mask.classList.remove('hidden');
    mask.setAttribute('aria-hidden', 'false');
    $('pinErr').textContent = '';
    $('pinInput').value = '';
    setTimeout(() => { try { $('pinInput').focus(); } catch (e) {} }, 30);
  }
  function submitPin() {
    const val = ($('pinInput').value || '').trim();
    if (val === PIN) {
      markUnlocked();
      closePinModal();
      setExplain(true);
    } else {
      $('pinErr').textContent = '密码不对，请再试一次。';
      $('pinInput').value = '';
      $('pinInput').focus();
    }
  }
  function setExplain(on) {
    if (on && !isUnlocked()) {
      openPinModal();
      return;
    }
    st.explain = on;
    document.body.classList.toggle('explain-off', !on);
    $('explainToggle').checked = on;
    if (!on && !voiceAudio.paused) voiceAudio.pause();
    update();
  }

  function applyAutoD() {
    const hit = pickAuto(st.t);
    if (hit) {
      st.s = hit.s;
      st.rot = hit.rot;
    }
  }

  function update() {
    const k = stage();
    const data = stepData[st.tab][k];
    $('canvasTitle').textContent = titles[st.tab];
    $('graphTag').textContent = '图 ' + (st.tab + 1);
    $('stepTitle').textContent = data.title;
    $('stepBadge').textContent = '步骤 ' + (k + 1) + ' / 5';
    $('stepDesc').innerHTML = data.desc;
    $('stepFormula').innerHTML = data.formula;
    $('stepCount').textContent = (k + 1) + ' / 5';
    $('time').value = Math.round(st.progress * 1000);
    $('play').textContent = st.playing ? '⏸ 暂停' : '▶ 播放';
    const live = (st.tab === 2 && (st.manual || st.exploring)) ? exploreSay() : '';
    $('narration').innerHTML = live || data.say;
    document.body.classList.toggle('is-explore', st.tab === 2);
    document.body.classList.toggle('explain-off', !st.explain);

    for (let i = 0; i < 3; i++) {
      $('tab' + i).setAttribute('aria-selected', i === st.tab ? 'true' : 'false');
    }
    const chips = $('stepChips');
    chips.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const b = document.createElement('button');
      b.className = 'step-chip' + (i === k ? ' active' : '');
      b.type = 'button';
      b.textContent = (i + 1) + '. ' + (stepData[st.tab][i].short || stepData[st.tab][i].title);
      b.addEventListener('click', () => gotoStep(i));
      chips.appendChild(b);
    }
    $('answerText').textContent = answers[st.tab].title;
    $('answerValue').textContent = answers[st.tab].value;
    $('answerNote').textContent = answers[st.tab].note;
    $('explore').classList.toggle('hidden', st.tab !== 2);

    if (st.tab === 2) {
      if (!st.manual && !st.exploring) syncTimelineToT();
      else if (!st.manual && st.exploring) applyAutoD();
      $('tRange').value = String(st.t);
      $('tOutput').textContent = fmt(st.t);
      $('sRange').value = String(st.s);
      $('sOutput').textContent = fmt(st.s) + '，D = ' + coord(2, st.s);
      $('rotCcw').classList.toggle('selected', st.rot === 'ccw');
      $('rotCw').classList.toggle('selected', st.rot === 'cw');
      $('modeAuto').classList.toggle('selected', !st.manual);
      $('modeManual').classList.toggle('selected', st.manual);
      const e = effective();
      const qtxt = coord(...e.q);
      if (e.valid) $('qLive').textContent = 'Q = ' + qtxt + '，在 H 上';
      else if (e.count === 0) $('qLive').textContent = 't = ' + fmt(st.t) + ' 时无解：无论 D 在哪，Q 都落不到 H 上。当前 Q = ' + qtxt;
      else $('qLive').textContent = 'Q = ' + qtxt + '，不在 H 上';
      $('qLive').className = 'live ' + (e.valid ? 'ok' : 'bad');
    }

    draw();
    if (st.playing) syncVoice();
  }

  function pause() {
    st.playing = false;
    st.last = 0;
    $('play').textContent = '▶ 播放';
    if (!voiceAudio.paused) voiceAudio.pause();
  }
  function gotoStep(i) {
    pause();
    voiceKey = '';
    st.progress = progressForStep(i, 0.999);
    if (st.tab === 2) st.manual = false;
    if (st.tab === 2) st.exploring = false;
    update();
  }
  function selectTab(i) {
    pause();
    voiceKey = '';
    st.tab = i;
    st.progress = 0;
    st.manual = false;
    st.exploring = false;
    st.t = -2;
    st.s = 1;
    st.rot = 'ccw';
    update();
  }

  for (let i = 0; i < 3; i++) $('tab' + i).addEventListener('click', () => selectTab(i));
  $('prev').addEventListener('click', () => gotoStep(Math.max(0, stage() - 1)));
  $('next').addEventListener('click', () => gotoStep(Math.min(4, stage() + 1)));
  $('play').addEventListener('click', () => {
    if (st.playing) { pause(); return; }
    if (st.progress >= 1) { st.progress = 0; voiceKey = ''; }
    if (st.tab === 2) { st.manual = false; st.exploring = false; }
    st.playing = true;
    st.last = 0;
    syncVoice();
    update();
  });
  $('restart').addEventListener('click', () => {
    st.progress = 0;
    st.manual = false;
    st.exploring = false;
    st.playing = true;
    st.last = 0;
    voiceKey = '';
    if (st.tab === 2) { st.t = -2; st.s = 1; st.rot = 'ccw'; }
    syncVoice();
    update();
  });
  $('speed').addEventListener('change', ev => {
    st.speed = Number(ev.target.value) || 1;
    voiceAudio.playbackRate = st.speed;
  });
  $('voiceBtn').addEventListener('click', () => {
    st.voice = !st.voice;
    $('voiceBtn').textContent = st.voice ? '🔊 语音开' : '🔇 语音关';
    $('voiceBtn').setAttribute('aria-pressed', st.voice ? 'true' : 'false');
    if (!st.voice) { if (!voiceAudio.paused) voiceAudio.pause(); }
    else if (st.playing) syncVoice();
  });
  $('time').addEventListener('input', ev => {
    pause();
    st.scrubbing = true;
    st.progress = Number(ev.target.value) / 1000;
    if (st.tab === 2) { st.manual = false; st.exploring = false; }
    update();
  });
  $('time').addEventListener('change', () => { st.scrubbing = false; update(); });
  $('explainToggle').addEventListener('change', ev => {
    if (ev.target.checked) {
      if (isUnlocked()) setExplain(true);
      else {
        ev.target.checked = false;
        openPinModal();
      }
    } else setExplain(false);
  });
  $('pinOk').addEventListener('click', submitPin);
  $('pinCancel').addEventListener('click', closePinModal);
  $('pinMask').addEventListener('click', ev => { if (ev.target === $('pinMask')) closePinModal(); });
  $('pinInput').addEventListener('keydown', ev => {
    if (ev.key === 'Enter') { ev.preventDefault(); submitPin(); }
    if (ev.key === 'Escape') closePinModal();
  });
  $('pinInput').addEventListener('input', ev => {
    ev.target.value = ev.target.value.replace(/\D/g, '').slice(0, 4);
    $('pinErr').textContent = '';
    if (ev.target.value.length === 4) submitPin();
  });

  $('modeAuto').addEventListener('click', () => {
    st.manual = false;
    st.exploring = true;
    pause();
    applyAutoD();
    update();
  });
  $('modeManual').addEventListener('click', () => { st.manual = true; st.exploring = true; pause(); update(); });
  $('rotCcw').addEventListener('click', () => { st.rot = 'ccw'; st.manual = true; st.exploring = true; pause(); update(); });
  $('rotCw').addEventListener('click', () => { st.rot = 'cw'; st.manual = true; st.exploring = true; pause(); update(); });
  $('tRange').addEventListener('input', ev => {
    st.t = Number(ev.target.value);
    st.exploring = true;
    pause();
    if (!st.manual) applyAutoD();
    else {
      const m = matching(st.t);
      // keep current s/rot in manual; just update
      void m;
    }
    update();
  });
  $('sRange').addEventListener('input', ev => {
    st.s = Number(ev.target.value);
    st.manual = true;
    st.exploring = true;
    pause();
    update();
  });
  $('snapBtn').addEventListener('click', () => {
    const m = matching(st.t);
    if (!m.length) return;
    const hit = pickAuto(st.t) || m[0];
    st.s = hit.s;
    st.rot = hit.rot;
    st.manual = true;
    st.exploring = true;
    update();
  });

  let dragging = null;
  function graphCoords(ev) {
    const r = canvas.getBoundingClientRect();
    const pt = ev.touches ? ev.touches[0] : ev;
    return [(pt.clientX - r.left) / r.width * VIEW, (pt.clientY - r.top) / r.height * VIEW];
  }
  function fromPx(px, py) {
    return [(px - C) / S, (C - py) / S];
  }
  function pick(ev) {
    if (st.tab !== 2) return;
    const [px, py] = graphCoords(ev);
    const p = fromPx(px, py);
    const E = [0, st.t], D = [2, st.s];
    const dE = Math.hypot(p[0] - E[0], p[1] - E[1]);
    const dD = Math.hypot(p[0] - D[0], p[1] - D[1]);
    if (Math.min(dE, dD) > 0.55) return;
    dragging = dE < dD ? 'E' : 'D';
    if (dragging === 'D') st.manual = true;
    st.exploring = true;
    pause();
  }
  function move(ev) {
    if (!dragging) return;
    ev.preventDefault();
    const [px, py] = graphCoords(ev);
    const p = fromPx(px, py);
    if (dragging === 'E') {
      st.t = clamp(p[1], TMIN, TMAX);
      if (!st.manual) applyAutoD();
    } else {
      st.s = clamp(p[1], 1, 2);
      st.manual = true;
    }
    update();
  }
  function endDrag() { dragging = null; }
  canvas.addEventListener('pointerdown', pick);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', endDrag);
  canvas.addEventListener('touchstart', pick, { passive: true });
  window.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', endDrag);

  function tick(now) {
    if (st.playing) {
      if (!st.last) st.last = now;
      const seconds = totalDur(st.tab);
      st.progress = Math.min(1, st.progress + (now - st.last) / 1000 * st.speed / seconds);
      st.last = now;
      if (st.progress >= 1) {
        st.progress = 1;
        st.playing = false;
        st.last = 0;
        if (!voiceAudio.paused) voiceAudio.pause();
      }
      update();
    }
    requestAnimationFrame(tick);
  }

  function selfTest() {
    const assert = (cond, msg) => { if (!cond) console.error('selfTest: ' + msg); };
    const near = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-8;
    const A = [2, 1], P = [5, 4];
    const v = sub(P, A);
    assert(v[0] === 3 && v[1] === 3, 'P1 vector (3,3)');
    const qccw = add(A, rot90(v, false));
    const qcw = add(A, rot90(v, true));
    assert(near(qccw, [-1, 4]), 'P1 ccw should be (-1,4), got ' + qccw);
    assert(near(qcw, [5, -2]), 'P1 cw should be (5,-2), got ' + qcw);
    const AA = [1, 2], BB = [5, 6], Cup = [1, 6], Cdn = [5, 2];
    const toB = add(Cup, rot90(sub(AA, Cup), false));
    const toB2 = add(Cdn, rot90(sub(AA, Cdn), true));
    assert(near(toB, BB), 'C=(1,6) rotates A to B counterclockwise');
    assert(near(toB2, BB), 'C=(5,2) also works but is excluded');
    assert(Cup[0] === AA[0] && Cup[1] > AA[1], 'C=(1,6) is directly above A');
    assert(!(Cdn[0] === AA[0] && Cdn[1] > AA[1]), '(5,2) is not above A');
    const endpoints = [
      { t: -2, s: 1, dir: 'ccw', q: [-3, 0] },
      { t: -2, s: 2, dir: 'ccw', q: [-4, 0] },
      { t: 0, s: 2, dir: 'ccw', q: [-2, 2] },
      { t: 2, s: 2, dir: 'ccw', q: [0, 4] },
      { t: 2, s: 1, dir: 'cw', q: [-1, 0] },
      { t: 1.5, s: 1, dir: 'ccw', q: [0.5, 3.5] },
      { t: 3.5, s: 1, dir: 'cw', q: [-2.5, 1.5] },
      { t: 4, s: 2, dir: 'cw', q: [-2, 2] }
    ];
    for (const e of endpoints) {
      const E = [0, e.t], D = [2, e.s];
      const got = add(E, rot90(sub(D, E), e.dir === 'cw'));
      const f = Qpm(e.t, e.s)[e.dir];
      assert(near(got, f), 'formula mismatch ' + e.t);
      assert(near(f, e.q), 'endpoint coord t=' + e.t + ' ' + f);
      assert(onH(f), 'endpoint should be on H t=' + e.t);
    }
    assert(allSolutions(2.5).length === 0, 't=2.5 must have no D');
    assert(allSolutions(-2).length >= 1, 't=-2 should work');
    assert(allSolutions(0).length >= 1, 't=0 should work');
    assert(allSolutions(2).length >= 1, 't=2 should work');
    assert(allSolutions(3.5).length >= 1, 't=3.5 should work');
    assert(allSolutions(4).length >= 1, 't=4 should work');
    assert(allSolutions(-2.1).length === 0, 't=-2.1 should miss');
    assert(allSolutions(2.1).length === 0, 't=2.1 should miss');
    assert(allSolutions(3.4).length === 0, 't=3.4 should miss');
    assert(allSolutions(4.1).length === 0, 't=4.1 should miss');
    const qPlus = Qpm(0, 1).ccw, qMinus = Qpm(0, 1).cw;
    assert(near(qPlus, [-1, 2]), 'Q+ formula at t=0 s=1');
    assert(near(qMinus, [1, -2]), 'Q- formula at t=0 s=1');
  }

  window.addEventListener('resize', () => update());
  window.addEventListener('orientationchange', () => setTimeout(update, 80));
  if (window.visualViewport) visualViewport.addEventListener('resize', () => update());
  document.body.classList.toggle('explain-off', !st.explain);
  selfTest();
  update();
  requestAnimationFrame(tick);
})();
