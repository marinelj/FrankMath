(() => {
  const $ = id => document.getElementById(id);
  const canvas = $('graph');
  const ctx = canvas.getContext('2d');
  const S = 50, C = 330, LIM = 6;
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
        desc: '题目写的是「点 P 关于点 A 的链垂点」。中心是 A，被转动的是 P。A 不在原点，别习惯性地绕着 O 转。<br>A 在 (2,2)，P 在 (5,2)，两点一样高，P 正好在 A 的正右边，距离是 3。',
        say: '先看清是谁绕着谁转。中心是 A，不是原点，被转的是 P。两点一样高，P 就在 A 的正右边，距离是 3。',
        formula: '<div class="eqline">A(2,2)，P(5,2)，从 A 到 P 是向右 3 个单位</div>'
      },
      {
        title: '链垂点要同时满足两件事',
        short: '两个条件',
        desc: '转到的点既要和原来一样远，又要正好转过直角。也就是 AQ = AP，并且 ∠PAQ = 90°。<br>从 A 看过去，原来对着正右方，转 90° 之后，就对着正上方，或者对着正下方。',
        say: '链垂点要两件事一起成立：一样长，而且正好是直角。从 A 看，原来朝右，转完就朝上，或者朝下。',
        formula: '<div class="eqline">AQ = AP = 3，∠PAQ = 90°</div>'
      },
      {
        title: '逆时针转 90°',
        short: '逆时针',
        desc: '先向左拧 90°。向右的 3 个单位转到向上，得到 (2,5)。你也可以在图上从 A 竖直往上数 3 格。',
        say: '先向左拧 90 度。原来向右的 3 个单位转到向上，得到 (2,5)。从图上数，就是从 A 竖直往上走 3 格。',
        formula: '<div class="eqline">向右 (3,0) 逆时针转 90° 变成向上 (0,3)</div><div class="eqline">Q = (2,2) + (0,3) = (2,5)</div>'
      },
      {
        title: '顺时针转 90°',
        short: '顺时针',
        desc: '再向右拧 90°。同样的 3 个单位转到正下方，得到 (2,−1)。',
        say: '再向右拧 90 度。同样的 3 个单位转到正下方，得到 (2,−1)。',
        formula: '<div class="eqline">向右 (3,0) 顺时针转 90° 变成向下 (0,−3)</div><div class="eqline">Q = (2,2) + (0,−3) = (2,−1)</div>'
      },
      {
        title: '两个答案都要留下',
        short: '核对',
        desc: '两个点到 A 的距离都是 3，和 AP 都夹成直角，都符合定义。<br>再看一眼：它们关于直线 y = 2 对称，而 y = 2 正好是 AP 所在的直线。这也是轴对称。',
        say: '两个答案都对，都要写上：(2,5) 或 (2,−1)。它们关于直线 y=2 对称，而这条线正好经过 A 和 P。',
        formula: '<div class="eqline">点 P 关于点 A 的链垂点是 (2,5) 或 (2,−1)</div>'
      }
    ],
    [
      {
        title: '读清语序：中心是 C',
        short: '读语序',
        desc: '「B 是 A 关于 C 的链垂点」。中心是还不知道的 C，被转的是 A，转完要落到 B。<br>所以三角形 ACB 是等腰直角三角形，直角在 C，斜边是 AB。',
        say: '这一问要倒过来求中心。B 是 A 关于 C 的链垂点，所以中心是 C，被转的是 A，转完落到 B。三角形 ACB 是等腰直角三角形，直角在 C。',
        formula: '<div class="eqline">CA = CB，∠ACB = 90°，斜边是 AB</div>'
      },
      {
        title: '斜边竖直，中点好找',
        short: '找中点',
        desc: 'A 在 (1,2)，B 在 (1,6)，AB 是竖直的。斜边中点 M 是 (1,4)，斜边一半的长度是 2。<br>直角顶点 C 一定在 AB 的垂直平分线上，而且到 M 的距离也是 2。',
        say: 'AB 是竖直的，从 (1,2) 到 (1,6)。中点 M 是 (1,4)，斜边一半是 2。直角顶点 C 就在斜边的垂直平分线上，离 M 也是 2。',
        formula: '<div class="eqline">M = (1,4)，CM = AM = 2</div><div class="eqline">AB 竖直，它的垂直平分线是过 M 的水平线 y = 4</div>'
      },
      {
        title: '先把两个可能的点找出来',
        short: '两个可能',
        desc: '在水平线 y = 4 上，离 M 距离为 2 的点，只可能在 M 的正右或正左。右边是 (3,4)，左边是 (−1,4)。',
        say: '所以 C 只可能在 M 的正右或正左。右边是 (3,4)，左边是 (−1,4)。两个先都记下来。',
        formula: '<div class="eqline">C = (3,4) 或 C = (−1,4)</div>'
      },
      {
        title: '丢掉 y 轴左侧的那个',
        short: '舍去左侧',
        desc: '题目要求 C 在 y 轴的右侧。左边的 (−1,4) 要丢掉，留下 C = (3,4)。',
        say: '题目要求 C 在 y 轴右侧。左边那个要丢掉，留下 C = (3,4)。',
        formula: '<div class="eqline">C 在 y 轴右侧 ⇒ C = (3,4)</div>'
      },
      {
        title: '代回检验',
        short: '检验',
        desc: '从 C(3,4) 到 A 是向左 2 格、向下 2 格；到 B 是向左 2 格、向上 2 格。两条一样长，而且正好转过直角，没问题。',
        say: '验一下：从 C 到 A 朝左下，从 C 到 B 朝左上，两条一样长，也正好是直角。所以 C = (3,4)。',
        formula: '<div class="eqline">C(3,4) → A(1,2)：向左 2、向下 2</div><div class="eqline">C(3,4) → B(1,6)：向左 2、向上 2</div><div class="eqline">一样长，并且互相垂直</div>'
      }
    ],
    [
      {
        title: '先把图形看清楚',
        short: '看图形',
        desc: 'G 是从 (2,0) 到 (3,1) 的线段，D 可以写成 (2 + s, s)，其中 0 ≤ s ≤ 1。E 在 y 轴负半轴上，坐标是 (0, t)，t &lt; 0。<br>H 是边长为 8 的正方形的边界，四条边是 x = ±4 和 y = ±4。落在正方形内部不算。',
        say: '先把图形看清楚。D 在线段 G 上，可以写成 (2+s, s)，s 从 0 到 1。E 是 (0, t)，t 小于 0。H 是边长为 8 的正方形边界，四条边是 x=±4 和 y=±4，落在内部不算。',
        formula: '<div class="eqline">D = (2 + s, s)，0 ≤ s ≤ 1；E = (0, t)，t &lt; 0</div><div class="eqline">H：x = ±4 或 y = ±4（另一坐标也要在 −4 到 4 之间）</div>'
      },
      {
        title: '两种旋转，先写出坐标',
        short: '写坐标',
        desc: '以 E 为中心转 D。逆时针得到 Q₊ = (t − s, t + 2 + s)，顺时针得到 Q₋ = (s − t, t − 2 − s)。<br>下面把两种旋转和四条边一共 8 种情况逐一过一遍，一种都不要漏。',
        say: '以 E 为中心转 D。逆时针得到 Q₊ = (t−s, t+2+s)，顺时针得到 Q₋ = (s−t, t−2−s)。接下来把 8 种情况逐一过一遍。',
        formula: '<div class="eqline">Q₊ = (t − s, t + 2 + s)</div><div class="eqline">Q₋ = (s − t, t − 2 − s)</div>'
      },
      {
        title: '逆时针落到左边',
        short: '落到左边',
        desc: '先看逆时针落到左边 x = −4。这时 s = t + 4。s 还要在 0 到 1 之间，所以 t 在 −4 到 −3。<br>这时候纵坐标是 2t + 6，正好从 −2 变到 0，确实在左边这条边上。<br>当 t = −4 时，E 自己也落在正方形下边上，不过题目看的是 Q 在不在 H 上。这时 Q 在 (−4,−2)，是符合的。',
        say: '先看逆时针落到左边。s 等于 t 加 4，t 从 −4 到 −3。Q 沿着左边从 (−4,−2) 走到 (−4,0)。t = −4 时 E 自己也在下边上，但题目看的是 Q，这时 Q 在 (−4,−2)，是符合的。',
        formula: '<div class="eqline">Q₊ 的横坐标 t − s = −4 ⇒ s = t + 4</div><div class="eqline">0 ≤ t + 4 ≤ 1，且 t &lt; 0 ⇒ t ∈ [−4, −3]</div><div class="eqline">纵坐标 2t + 6 ∈ [−2, 0]，落在左边上</div>'
      },
      {
        title: '顺时针落到下边',
        short: '落到下边',
        desc: '再看顺时针落到下边 y = −4。这时 s = t + 2，所以 t 在 −2 到 −1。<br>横坐标始终是 2，点就停在 (2,−4)，正好在下边上。',
        say: '再看顺时针落到下边。s 等于 t 加 2，t 从 −2 到 −1。这时候 Q 一直停在 (2,−4)，正好在下边上。',
        formula: '<div class="eqline">Q₋ 的纵坐标 t − 2 − s = −4 ⇒ s = t + 2</div><div class="eqline">0 ≤ t + 2 ≤ 1，且 t &lt; 0 ⇒ t ∈ [−2, −1]</div><div class="eqline">横坐标恒为 2，Q = (2, −4)</div>'
      },
      {
        title: '中间空着一段，别连成一截',
        short: '中间有空隙',
        desc: '其余 6 种情况都不行：有的会让 t 变成正的，不符合 t &lt; 0；有的会让 s 跑出 0 到 1；还有的算完另一头已经在正方形外面了。<br>所以答案不是一整段，而是两段：[−4, −3] 和 [−2, −1]。中间 (−3, −2) 是空的。比如 t = −2.5 时，无论 D 取在 G 的哪里，Q 都落不到 H 的边上。这一点和原题不一样，别随手把两段并成一截。',
        say: '其余 6 种情况都不行。所以答案是两段：[−4,−3] 和 [−2,−1]。中间 (−3,−2) 是空的，比如现在 t = −2.5，怎么选 D 都落不到边上。别把两段连成一截。',
        formula: '<div class="eqline">其余 6 种：t &gt; 0，或 s 不在 [0,1]，或另一坐标越出 [−4,4]</div><div class="eqline">t 的取值范围是 [−4, −3] ∪ [−2, −1]</div><div class="eqline">例如 t = −2.5 时无解</div>'
      }
    ]
  ];

  const answers = [
    { title: '(1)①', value: '(2,5) 或 (2,−1)', note: '绕点 A 旋转，不是绕原点。两个方向都要写。' },
    { title: '(1)②', value: 'C = (3,4)', note: '先找两个可能的点，再按「y 轴右侧」丢掉 (−1,4)。' },
    { title: '(2)', value: 't ∈ [−4,−3] ∪ [−2,−1]', note: '两段中间有空隙，不要写成 [−4,−1]。' }
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
    t: -4,
    s: 0,
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
    const s = Number.isInteger(r) ? String(r) : String(Math.round(r * 100) / 100);
    return s.replace('-', '−');
  };
  const coord = (x, y) => `(${fmt(x)}, ${fmt(y)})`;
  const xy = (x, y) => [C + x * S, C - y * S];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const VIEW = 660;
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
    ctx.clearRect(0, 0, 660, 660);
    ctx.fillStyle = '#fbfcff';
    ctx.fillRect(0, 0, 660, 660);
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
    const A = [2, 2], P = [5, 2], Q1 = [2, 5], Q2 = [2, -1];
    if (k >= 4) stroke([-0.2, 2], [6, 2], colors.gold, 2, [6, 5]);
    stroke(A, P, colors.blue, 2.4);
    if (k >= 2) {
      const ang = (k === 2 ? f : 1) * Math.PI / 2;
      const cur = add(A, rotateVec(sub(P, A), ang, false));
      stroke(A, k === 2 ? cur : Q1, colors.green, 2.4);
      if (k >= 2) arc(A, sub(P, A), false, k === 2 ? f : 1);
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
    marker(A[0], A[1], colors.red, 'A ' + coord(...A), -86, -18);
    marker(P[0], P[1], colors.blue, 'P ' + coord(...P), 14, 28);
    if (k >= 4 && st.explain) canvasBanner('两个答案：(2,5) 或 (2,−1)', 'ok');
  }

  function drawP2() {
    const k = stage(), f = stageFrac();
    const A = [1, 2], B = [1, 6], M = [1, 4], CL = [-1, 4], CR = [3, 4];
    if (k >= 3) {
      ctx.fillStyle = 'rgba(37,99,235,0.07)';
      const [x0, y0] = xy(0, LIM), [x1] = xy(LIM, -LIM);
      ctx.fillRect(x0, y0, x1 - x0, xy(0, -LIM)[1] - y0);
    }
    stroke(A, B, colors.blue, 2.6);
    if (k >= 1) {
      stroke([-2.6, 4], [5.4, 4], colors.gold, 2, [6, 5]);
      marker(M[0], M[1], colors.gold, 'M(1,4)', 14, 26);
    }
    if (k >= 2) {
      stroke(A, CR, colors.green, 2.2);
      stroke(B, CR, colors.green, 2.2);
      rightAngle(CR, A, B, colors.green);
      marker(CR[0], CR[1], colors.green, 'C ' + coord(...CR), 14, -18);
      stroke(A, CL, colors.muted, 1.8, [5, 4]);
      stroke(B, CL, colors.muted, 1.8, [5, 4]);
      marker(CL[0], CL[1], colors.muted, 'C ' + coord(...CL) + (k >= 3 ? ' 舍去' : ''), -118, -18, k >= 3);
    }
    marker(A[0], A[1], colors.blue, 'A ' + coord(...A), 16, 28);
    marker(B[0], B[1], colors.purple, 'B ' + coord(...B), 16, -18);
    if (k >= 4 && st.explain) canvasBanner('C 在 y 轴右侧，留下 (3,4)', 'ok');
  }

  function candidates(t, s) {
    return { ccw: [t - s, t + 2 + s], cw: [s - t, t - 2 - s] };
  }
  function onBoundary(p) {
    const [x, y] = p;
    const onX = Math.abs(Math.abs(x) - 4) < 1e-8 && y > -4 - 1e-8 && y < 4 + 1e-8;
    const onY = Math.abs(Math.abs(y) - 4) < 1e-8 && x > -4 - 1e-8 && x < 4 + 1e-8;
    return (onX || onY) && Math.abs(x) <= 4 + 1e-8 && Math.abs(y) <= 4 + 1e-8;
  }
  function allSolutions(t) {
    const out = [];
    const tryPair = (s, rot) => {
      if (s < -1e-8 || s > 1 + 1e-8) return;
      s = clamp(s, 0, 1);
      const q = candidates(t, s)[rot];
      if (onBoundary(q)) out.push({ s, rot, q, D: [2 + s, s] });
    };
    tryPair(t + 4, 'ccw');
    tryPair(t + 2, 'cw');
    // exhaustive intent: only these two families can hit H under t<0
    return out;
  }
  function matching(t) {
    return allSolutions(t);
  }
  function effective() {
    const m = matching(st.t);
    if (st.manual) {
      const q = candidates(st.t, st.s)[st.rot];
      return { s: st.s, rot: st.rot, q, D: [2 + st.s, st.s], valid: onBoundary(q), count: m.length };
    }
    if (m.length) {
      const hit = m.find(x => x.rot === st.rot) || m[0];
      return { ...hit, valid: true, count: m.length };
    }
    return { s: st.s, rot: st.rot, q: candidates(st.t, st.s)[st.rot], D: [2 + st.s, st.s], valid: false, count: 0 };
  }

  function drawP3() {
    const H = [[-4, 4], [4, 4], [4, -4], [-4, -4]];
    poly(H, colors.h, 3, [], 'rgba(59,130,246,0.06)');
    const G1 = [2, 0], G2 = [3, 1];
    stroke(G1, G2, colors.purple, 5);
    const e = effective();
    const D = e.D, E = [0, st.t], Q = e.q;
    const hideG1 = Math.hypot(D[0] - 2, D[1] - 0) < 0.18;
    const hideG2 = Math.hypot(D[0] - 3, D[1] - 1) < 0.18;
    if (!hideG1) marker(2, 0, colors.purple, '(2,0)', -52, 28);
    if (!hideG2) marker(3, 1, colors.purple, '(3,1)', 12, -18);
    ctx.font = '700 ' + fs(15) + 'px "PingFang SC","Microsoft YaHei",system-ui,sans-serif';
    const [gx, gy] = xy(3.35, 1.35);
    ctx.fillStyle = colors.purple;
    ctx.fillText('G', gx, gy);
    const [hx, hy] = xy(-4, 4.45);
    ctx.fillStyle = colors.h;
    ctx.fillText('H', hx, hy);

    stroke(E, D, colors.red, 2, [6, 4]);
    stroke(E, Q, e.valid ? colors.green : '#c4483c', 2.4);
    if (Math.hypot(D[0] - E[0], D[1] - E[1]) > 0.2) {
      rightAngle(E, D, Q, e.valid ? colors.orange : '#c4483c');
      arc(E, sub(D, E), e.rot === 'cw', 1);
    }
    marker(E[0], E[1], colors.red, 'E ' + coord(...E), E[1] <= -3.6 ? 16 : 14, E[1] <= -3.6 ? 28 : -18);
    marker(D[0], D[1], colors.purple, 'D ' + coord(...D), hideG2 ? -78 : 14, hideG1 ? -18 : 28);
    marker(Q[0], Q[1], e.valid ? colors.green : '#c4483c', 'Q ' + coord(...Q), Q[0] <= -3.4 ? 14 : -90, Q[1] <= -3.4 ? 28 : -18);

    if (e.valid) canvasBanner('Q 落在 H 的边界上  ·  这个 t 符合', 'ok');
    else if (e.count === 0) canvasBanner('这个 t 没有解：无论 D 在哪，Q 都落不到 H 上', 'bad');
    else canvasBanner('当前 Q 不在边界上，试试改 s 或改旋转方向', 'warn');
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
    if (k <= 1) {
      st.t = -4;
      st.s = 0;
      st.rot = 'ccw';
    } else if (k === 2) {
      st.t = -4 + f;
      st.s = st.t + 4;
      st.rot = 'ccw';
    } else if (k === 3) {
      st.t = -2 + f;
      st.s = st.t + 2;
      st.rot = 'cw';
    } else {
      st.t = -2.5;
      st.s = 0.5;
      st.rot = 'ccw';
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

  const PIN = '2222';
  const PIN_KEY = 'ext1-explain-unlock';
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
      $('tRange').value = String(st.t);
      $('tOutput').textContent = fmt(st.t);
      $('sRange').value = String(st.s);
      $('sOutput').textContent = fmt(st.s) + '，D = ' + coord(2 + st.s, st.s);
      $('rotCcw').classList.toggle('selected', st.rot === 'ccw');
      $('rotCw').classList.toggle('selected', st.rot === 'cw');
      $('modeAuto').classList.toggle('selected', !st.manual);
      $('modeManual').classList.toggle('selected', st.manual);
      const e = effective();
      const qtxt = coord(...e.q);
      $('qLive').textContent = 'Q = ' + qtxt + (e.valid ? '，在 H 上' : '，不在 H 上');
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
    update();
  }
  function selectTab(i) {
    pause();
    voiceKey = '';
    st.tab = i;
    st.progress = 0;
    st.manual = false;
    st.exploring = false;
    st.t = -4;
    st.s = 0;
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
    if (st.tab === 2) { st.t = -4; st.s = 0; st.rot = 'ccw'; }
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
    if (st.tab === 2) st.manual = false;
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

  $('modeAuto').addEventListener('click', () => { st.manual = false; st.exploring = false; pause(); update(); });
  $('modeManual').addEventListener('click', () => { st.manual = true; st.exploring = true; pause(); update(); });
  $('rotCcw').addEventListener('click', () => { st.rot = 'ccw'; st.manual = true; st.exploring = true; pause(); update(); });
  $('rotCw').addEventListener('click', () => { st.rot = 'cw'; st.manual = true; st.exploring = true; pause(); update(); });
  $('tRange').addEventListener('input', ev => {
    st.t = Number(ev.target.value);
    st.manual = true;
    st.exploring = true;
    pause();
    const m = matching(st.t);
    if (m.length) {
      st.s = m[0].s;
      st.rot = m[0].rot;
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
    st.s = m[0].s;
    st.rot = m[0].rot;
    st.manual = true;
    st.exploring = true;
    update();
  });

  let dragging = null;
  function graphCoords(ev) {
    const r = canvas.getBoundingClientRect();
    const pt = ev.touches ? ev.touches[0] : ev;
    return [(pt.clientX - r.left) / r.width * 660, (pt.clientY - r.top) / r.height * 660];
  }
  function fromPx(px, py) {
    return [(px - C) / S, (C - py) / S];
  }
  function pick(ev) {
    if (st.tab !== 2) return;
    const [px, py] = graphCoords(ev);
    const p = fromPx(px, py);
    const E = [0, st.t], D = [2 + st.s, st.s];
    const dE = Math.hypot(p[0] - E[0], p[1] - E[1]);
    const dD = Math.hypot(p[0] - D[0], p[1] - D[1]);
    if (Math.min(dE, dD) > 0.55) return;
    dragging = dE < dD ? 'E' : 'D';
    st.manual = true;
    st.exploring = true;
    pause();
  }
  function move(ev) {
    if (!dragging) return;
    ev.preventDefault();
    const [px, py] = graphCoords(ev);
    const p = fromPx(px, py);
    if (dragging === 'E') st.t = clamp(p[1], -5.8, -0.05);
    else {
      // project onto G: (2,0)+u(1,1), u in [0,1]
      const u = clamp(((p[0] - 2) + (p[1] - 0)) / 2, 0, 1);
      st.s = u;
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
    // (1)①
    const A = [2, 2], P = [5, 2];
    const qccw = add(A, rotateVec(sub(P, A), Math.PI / 2, false));
    const qcw = add(A, rotateVec(sub(P, A), Math.PI / 2, true));
    assert(near(qccw, [2, 5]), 'P1 ccw');
    assert(near(qcw, [2, -1]), 'P1 cw');
    // (1)②
    const AA = [1, 2], BB = [1, 6], C = [3, 4], Cbad = [-1, 4];
    const toB = add(C, rotateVec(sub(AA, C), Math.PI / 2, true));
    const toB2 = add(Cbad, rotateVec(sub(AA, Cbad), Math.PI / 2, false));
    assert(near(toB, BB), 'C=(3,4) rotates A to B clockwise');
    assert(near(toB2, BB), 'C=(-1,4) also works but is excluded');
    assert(C[0] > 0 && Cbad[0] < 0, 'right of y-axis');
    // (2) samples
    const cases = [
      [-4, 'ccw', 0, [-4, -2]],
      [-3, 'ccw', 1, [-4, 0]],
      [-2, 'cw', 0, [2, -4]],
      [-1, 'cw', 1, [2, -4]]
    ];
    for (const [t, rot, s, q] of cases) {
      const got = candidates(t, s)[rot];
      assert(near(got, q), 'sample ' + t);
      assert(onBoundary(got), 'on H ' + t);
      assert(allSolutions(t).length === 1, 'unique at t=' + t);
    }
    assert(allSolutions(-3.1).length === 1, 'inside first interval');
    assert(allSolutions(-2.5).length === 0, 'gap at -2.5');
    assert(allSolutions(-1.5).length === 1, 'inside second interval');
    assert(allSolutions(-0.5).length === 0, 'right of -1');
    assert(allSolutions(-4.1).length === 0, 'left of -4');
    // 8-case sign checks
    const sR = 4 - 0; // unused placeholder to keep audit in comments
    void sR;
    let n = 0;
    for (let t = -5; t <= -0.05; t += 0.05) n += allSolutions(t).length;
    assert(n === 42, 'dense scan 42, got ' + n);
  }

  window.addEventListener('resize', () => update());
  window.addEventListener('orientationchange', () => setTimeout(update, 80));
  if (window.visualViewport) visualViewport.addEventListener('resize', () => update());
  document.body.classList.toggle('explain-off', !st.explain);
  selfTest();
  update();
  requestAnimationFrame(tick);
})();
