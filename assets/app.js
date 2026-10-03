(function () {
  'use strict';
  var C = { blue: '#1f3bff', paper: '#ecebe4', ink: '#15151a', orange: '#ff5a1f', yellow: '#ffd400', pink: '#ff6fb5', wall: '#2b2b33' };
  var F = { d: '"Archivo Black", "Arial Black", Impact, sans-serif', m: '"Space Mono", ui-monospace, Menlo, monospace', k: '"Permanent Marker", "Marker Felt", cursive' };
  var TAU = Math.PI * 2, NOTEXT = false;

  /* ---------------- helpers ---------------- */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function pick(R, a) { return a[(R() * a.length) | 0]; }
  function rr(R, a, b) { return a + R() * (b - a); }
  function makeNoise(R) {
    var p = new Uint8Array(512), i, j, t;
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) { j = (R() * (i + 1)) | 0; t = p[i]; p[i] = p[j]; p[j] = t; }
    for (i = 0; i < 256; i++) p[256 + i] = p[i];
    function h(x, y) { return p[p[x & 255] + (y & 255)] / 255; }
    return function (x, y) {
      var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      var a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
  }
  function spray(ctx, R, x, y, r, color, n) {
    ctx.fillStyle = color;
    for (var i = 0; i < n; i++) {
      var a = R() * TAU, d = r * Math.pow(R(), 0.6) * (R() < 0.07 ? 2.3 : 1), s = R() < 0.15 ? 3 : 1.6;
      ctx.globalAlpha = 0.25 + R() * 0.55;
      ctx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d, s, s);
    }
    ctx.globalAlpha = 1;
  }
  function sprayLine(ctx, R, x0, y0, x1, y1, r, color, dens) {
    var L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, L / (r * 0.35));
    for (var i = 0; i <= n; i++) { var t = i / n; spray(ctx, R, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r, color, dens); }
  }
  function drip(ctx, R, x, y, w, len, color) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineCap = 'round'; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + len); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y + len, w * 0.72, 0, TAU); ctx.fill();
  }
  function grain(ctx, R, W, H, amt) {
    var n = W * H * amt;
    for (var i = 0; i < n; i++) {
      ctx.globalAlpha = R() * 0.22; ctx.fillStyle = R() < 0.5 ? '#000' : '#fff';
      var s = R() < 0.1 ? 3 : 1.5; ctx.fillRect(R() * W, R() * H, s, s);
    }
    ctx.globalAlpha = 1;
  }
  function halftone(ctx, W, H, step, ang, color, fn) {
    var ca = Math.cos(ang), sa = Math.sin(ang), n = Math.ceil(Math.hypot(W, H) / step / 2) + 2;
    ctx.fillStyle = color;
    for (var i = -n; i <= n; i++) for (var j = -n; j <= n; j++) {
      var x = W / 2 + (i * ca - j * sa) * step, y = H / 2 + (i * sa + j * ca) * step;
      if (x < -step || y < -step || x > W + step || y > H + step) continue;
      var v = fn(x, y); if (v <= 0.02) continue;
      ctx.beginPath(); ctx.arc(x, y, Math.min(1, v) * step * 0.72, 0, TAU); ctx.fill();
    }
  }
  function torn(ctx, R, w, h, j) {
    var pts = [], s = 18, x, y;
    for (x = -w / 2; x < w / 2; x += s) pts.push([x, -h / 2 + (R() - 0.5) * j]);
    for (y = -h / 2; y < h / 2; y += s) pts.push([w / 2 + (R() - 0.5) * j, y]);
    for (x = w / 2; x > -w / 2; x -= s) pts.push([x, h / 2 + (R() - 0.5) * j]);
    for (y = h / 2; y > -h / 2; y -= s) pts.push([-w / 2 + (R() - 0.5) * j, y]);
    ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath();
  }
  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function stripes(ctx, x, y, w, h, sw, c1, c2) {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = c1; ctx.fillRect(x, y, w, h); ctx.fillStyle = c2;
    for (var k = -h; k < w + h; k += sw * 2) { ctx.beginPath(); ctx.moveTo(x + k, y + h); ctx.lineTo(x + k + sw, y + h); ctx.lineTo(x + k + sw + h, y); ctx.lineTo(x + k + h, y); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  function fit(ctx, txt, fam, maxW, weight) {
    ctx.font = (weight || 400) + ' 100px ' + fam; var s = 100 * maxW / ctx.measureText(txt).width;
    ctx.font = (weight || 400) + ' ' + s + 'px ' + fam; return s;
  }
  function label(ctx, txt, x, y, size, color, align, fam, weight) { if (NOTEXT) return;
    ctx.font = (weight || 400) + ' ' + size + 'px ' + (fam || F.m); ctx.fillStyle = color; ctx.textAlign = align || 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(txt, x, y);
  }
  function marker(ctx, txt, x, y, size, color, rot) { if (NOTEXT) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); label(ctx, txt, 0, 0, size, color, 'left', F.k); ctx.restore();
  }
  function arrow(ctx, x, y, a, len, lw, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.moveTo(-len / 2, 0); ctx.lineTo(len / 2 - lw * 1.5, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(len / 2, 0); ctx.lineTo(len / 2 - lw * 3, -lw * 1.8); ctx.lineTo(len / 2 - lw * 3, lw * 1.8); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function onColor(c) { return (c === C.blue || c === C.ink || c === C.wall) ? C.paper : C.ink; }


  /* ---------- compositions, drawn in the art palette then sampled into dots.
     ink = ink, blue = the plan (renders gray), orange = what happened (renders red) ---------- */
  function drawTrace(ctx, W, H) { // the brand's policy drift, as a dot target
    ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
    var s = Math.min(W, H * 1.7), x0 = (W - s * 0.84) / 2, x1 = x0 + s * 0.84, fx = x0 + s * 0.2, y = H * 0.54, lw = Math.max(2, s / 520);
    ctx.lineCap = 'butt'; ctx.strokeStyle = C.ink; ctx.lineWidth = lw * 1.2;
    ctx.beginPath(); ctx.moveTo(x0, y - s * 0.03); ctx.lineTo(x0, y + s * 0.03); ctx.stroke();
    ctx.setLineDash([lw * 5, lw * 4]); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(fx, y); ctx.stroke(); ctx.setLineDash([]);
    function curve(ey, col, dotted) { ctx.strokeStyle = col; ctx.lineWidth = lw; if (dotted) ctx.setLineDash([lw, lw * 3.2]); ctx.beginPath(); ctx.moveTo(fx, y); ctx.bezierCurveTo(fx + s * 0.25, y, x1 - s * 0.3, ey, x1, ey); ctx.stroke(); ctx.setLineDash([]); if (col !== C.orange) { ctx.beginPath(); ctx.moveTo(x1, ey - s * 0.02); ctx.lineTo(x1, ey + s * 0.02); ctx.stroke(); } }
    curve(y - s * 0.08, C.blue); curve(y + s * 0.07, C.blue); curve(y + s * 0.2, C.blue, true); curve(y - s * 0.24, C.orange);
    return [x1, y - s * 0.24];
  }
  function drawWc3(ctx, W, H, R) { // illustrative map of the "into the towers" game from the field notes, drawn bold for dots
    ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
    var bw = Math.min(W, H * 1.3) * 0.96, bh = bw / 1.3, ox = (W - bw) / 2, oy = (H - bh) / 2, u = bw / 100, i, j;
    function P(x, y) { return [ox + x * bw, oy + y * bh]; }
    function disk(x, y, r, col, a) { var p = P(x, y); ctx.globalAlpha = a || 1; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p[0], p[1], r * u, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
    function ring(x, y, r, col, w, dash) { var p = P(x, y); ctx.strokeStyle = col; ctx.lineWidth = w * u; if (dash) ctx.setLineDash(dash.map(function (v) { return v * u; })); ctx.beginPath(); ctx.arc(p[0], p[1], r * u, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
    function box(x, y, s, col) { var p = P(x, y), h = s * u / 2; ctx.fillStyle = col; ctx.fillRect(p[0] - h, p[1] - h, h * 2, h * 2); }
    function line(pts, col, w, dash, a) { ctx.globalAlpha = a || 1; ctx.strokeStyle = col; ctx.lineWidth = w * u; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (dash) ctx.setLineDash(dash.map(function (v) { return v * u; })); ctx.beginPath(); pts.forEach(function (q, k) { var p = P(q[0], q[1]); if (k) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; }
    function curve(a, b, c, d) { var out = []; for (var t = 0; t <= 1.0001; t += 0.02) { var v = 1 - t; out.push([v * v * v * a[0] + 3 * v * v * t * b[0] + 3 * v * t * t * c[0] + t * t * t * d[0], v * v * v * a[1] + 3 * v * v * t * b[1] + 3 * v * t * t * c[1] + t * t * t * d[1]]); } return out; }

    var ours = [], theirs = [[0.8, 0.13], [0.87, 0.18], [0.92, 0.27], [0.75, 0.21], [0.84, 0.3]], towers = [[0.71, 0.34], [0.93, 0.42]], enemyArmy = [];
    for (i = 0; i < 7; i++) enemyArmy.push([0.66 + (i % 4) * 0.035, 0.05 + (i / 4 | 0) * 0.045]);
    var red = curve([0.5, 0.63], [0.43, 0.69], [0.5, 0.26], [0.79, 0.22]);
    for (i = 0; i < 9; i++) { var t = red[34 + (i % 5) * 3]; ours.push([t[0] + ((i * 37) % 7 - 3) * 0.009, t[1] + ((i * 53) % 5 - 2) * 0.012]); }

    // the observation: faint sight lines from our base to every unit it can see. They break up into scattered dots.
    var seen = theirs.concat(towers, enemyArmy.filter(function (e, k) { return k % 2 === 0; }), [[0.5, 0.59], [0.27, 0.66], [0.4, 0.25], [0.97, 0.6], [0.6, 0.45]]);
    [[0.12, 0.8], [0.03, 0.66], [0.27, 0.88]].forEach(function (src, k) { seen.forEach(function (b, n) { if ((n + k) % (k ? 3 : 1)) return; line([src, b], C.ink, 0.3, null, 0.3); }); });
    // tower range, and the plan out to camp 5 and home again
    towers.forEach(function (t) { ring(t[0], t[1], 11, C.blue, 0.9, [2.4, 2.4]); });
    line(curve([0.17, 0.74], [0.28, 0.72], [0.38, 0.6], [0.46, 0.6]), C.blue, 1.8, [4, 3.2]);
    line(curve([0.5, 0.67], [0.44, 0.78], [0.3, 0.84], [0.2, 0.84]), C.blue, 1.8, [4, 3.2]);
    // a scout's lap and a hero creeping, lighter
    line(curve([0.24, 0.92], [0.5, 0.99], [0.84, 0.92], [0.97, 0.6]), C.blue, 0.9, [1, 2.2]);
    line(curve([0.09, 0.66], [0.1, 0.42], [0.26, 0.28], [0.4, 0.25]), C.ink, 1.4);
    // our base: town hall, farms, gold mine, workers
    box(0.12, 0.8, 9, C.ink); ring(0.12, 0.8, 8.2, C.paper, 1.1); box(0.12, 0.8, 3.4, C.ink);
    [[0.03, 0.66], [0.07, 0.64], [0.23, 0.92], [0.27, 0.88], [0.03, 0.94]].forEach(function (f) { box(f[0], f[1], 3.6, C.ink); });
    disk(0.27, 0.66, 3.2, C.blue); for (i = 0; i < 5; i++) disk(0.19 + i * 0.014, 0.72 - i * 0.011, 0.9, C.ink);
    // camp 5, cleared
    ring(0.5, 0.59, 5.4, C.blue, 1.6); [[0.48, 0.58], [0.52, 0.61], [0.51, 0.56]].forEach(function (x) { var p = P(x[0], x[1]), e = 1.2 * u; ctx.strokeStyle = C.ink; ctx.lineWidth = 0.9 * u; ctx.beginPath(); ctx.moveTo(p[0] - e, p[1] - e); ctx.lineTo(p[0] + e, p[1] + e); ctx.moveTo(p[0] + e, p[1] - e); ctx.lineTo(p[0] - e, p[1] + e); ctx.stroke(); });
    // their base: burrows as rings and solid bodies, towers solid
    theirs.forEach(function (b, k) { if (k % 2) disk(b[0], b[1], 3.1, C.blue); else ring(b[0], b[1], 2.6, C.blue, 1.3); });
    towers.forEach(function (t) { box(t[0], t[1], 3.4, C.ink); });
    enemyArmy.forEach(function (e, k) { disk(e[0], e[1], k === 1 ? 1.9 : 1.2, C.blue); });
    line(curve([0.7, 0.13], [0.72, 0.16], [0.75, 0.19], [0.77, 0.22]), C.blue, 1, [1, 1.8]);
    // what happened: the army attack-moves into the base; the Tauren Chieftain in front
    line(red, C.orange, 2.8);
    ours.forEach(function (o, k) { disk(o[0], o[1], k === 0 ? 2.2 : 1.25, C.ink); });
    var o = P(0.17, 0.74); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2 * u; ctx.beginPath(); ctx.moveTo(o[0] - 2 * u, o[1] - 2 * u); ctx.lineTo(o[0] + 2 * u, o[1] + 2 * u); ctx.stroke();
    return P(0.79, 0.22);
  }

  /* ---------- the dot field: one pool, draws once, then holds ---------- */
  var INKS = ['#737373', '#111111', '#E52228'], ORDER = [0, 1, 2], SRC = [[21, 21, 26], [31, 59, 255], [255, 90, 31]], SRC_PAPER = [236, 235, 228], SRC_TO = [1, 0, 2];
  function sampleInto(off, W, H, g, oneRed) {
    var cols = Math.floor(W / g), rows = Math.floor(H / g), sm = document.createElement('canvas'); sm.width = cols; sm.height = rows; var sc = sm.getContext('2d'); sc.imageSmoothingQuality = 'high'; sc.drawImage(off, 0, 0, cols, rows); var data = sc.getImageData(0, 0, cols, rows).data, out = [];
    for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) {
      var o = (j * cols + i) * 4, vr = data[o] - SRC_PAPER[0], vg = data[o + 1] - SRC_PAPER[1], vb = data[o + 2] - SRC_PAPER[2]; if (vr * vr + vg * vg + vb * vb < 500) continue;
      var best = 0, bt = 0, bres = 1e12; for (var c = 0; c < 3; c++) { var cr = SRC[c][0] - SRC_PAPER[0], cg = SRC[c][1] - SRC_PAPER[1], cb = SRC[c][2] - SRC_PAPER[2], t = (vr * cr + vg * cg + vb * cb) / (cr * cr + cg * cg + cb * cb), rx = vr - t * cr, ry = vg - t * cg, rz = vb - t * cb, res = rx * rx + ry * ry + rz * rz; if (res < bres) { bres = res; best = c; bt = t; } }
      bt = Math.min(1, bt); if (bt < 0.1) continue; out.push([(i + 0.5 + (j % 2 ? 0.25 : -0.25)) * g, (j + 0.5) * g, g * 0.62 * Math.sqrt(bt), SRC_TO[best], bt, i, j]);
    }
    if (oneRed) { // red selects: keep a single connected red path, walked from the rightmost cell of the largest red shape; the rest goes to ink
      var cell = {}, seed = null, budget = Math.max(160, Math.round(out.length * 0.05)), q = [], kept = 0;
      out.forEach(function (p) { if (p[3] === 2) cell[p[6] * cols + p[5]] = p; });
      var bestSize = 0; Object.keys(cell).forEach(function (k) { var st = cell[k]; if (st.comp) return; var stack = [st], size = 0, right = st; st.comp = true; while (stack.length) { var c1 = stack.pop(); size++; if (c1[5] > right[5]) right = c1; for (var yy = -1; yy <= 1; yy++) for (var xx = -1; xx <= 1; xx++) { var n1 = cell[(c1[6] + yy) * cols + c1[5] + xx]; if (n1 && !n1.comp) { n1.comp = true; stack.push(n1); } } } if (size > bestSize) { bestSize = size; seed = right; } });
      if (seed) { q.push(seed); seed.keep = true; while (q.length && kept < budget) { var c0 = q.shift(); kept++; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var nb = cell[(c0[6] + dy) * cols + c0[5] + dx]; if (nb && !nb.keep) { nb.keep = true; q.push(nb); } } } }
      out.forEach(function (p) { if (p[3] === 2 && !p.keep) p[3] = 1; });
    }
    return out;
  }
  function DotField(cv, opt) {
    var oneRed = false, ctx = cv.getContext('2d'), still = window.matchMedia('(prefers-reduced-motion: reduce)').matches, W = 0, H = 0, d = 1, N = 0, raf = 0, vis = true, mouse = null, frameNo = 0, endAt = 0, end = null, provider = null;
    var px, py, tx, ty, pr, tr, pk, pdel, pcol, tcol, G = opt.grid || 3.4;
    function targets() { var off = document.createElement('canvas'); off.width = W; off.height = H; var e = provider(off.getContext('2d'), W, H); return { pts: sampleInto(off, W, H, G * d, oneRed), end: e || null }; }
    function retarget(snap) {
      if (!provider || !W) return; var t = targets(), list = t.pts, i, maxDel = 0; end = t.end;
      if (list.length > N) { list.sort(function (a, b) { return b[4] - a[4]; }); list.length = N; }
      for (i = list.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0, s = list[i]; list[i] = list[j]; list[j] = s; }
      for (i = 0; i < N; i++) { var q = list[i];
        if (q) { tx[i] = q[0]; ty[i] = q[1]; tr[i] = q[2]; tcol[i] = q[3]; } else { tx[i] = px[i]; ty[i] = py[i]; tr[i] = 0; tcol[i] = pcol[i]; }
        pdel[i] = snap ? 0 : (tx[i] / W) * 40 + Math.random() * 16 + (tcol[i] === 2 ? 20 : 0); if (pdel[i] > maxDel) maxDel = pdel[i];
        pk[i] = 0.07 + Math.random() * 0.08; if (snap) { px[i] = tx[i]; py[i] = ty[i]; pr[i] = tr[i]; pcol[i] = tcol[i]; } }
      frameNo = 0; endAt = snap ? 0 : maxDel + 26; kick();
    }
    function frame() {
      raf = 0; if (!vis) return; frameNo++; var moving = false, i, c, mr = 70 * d;
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);
      for (i = 0; i < N; i++) {
        if (pdel[i] > 0) { pdel[i]--; moving = true; continue; } pcol[i] = tcol[i]; var gx = tx[i], gy = ty[i];
        if (mouse) { var mx = px[i] - mouse[0], my = py[i] - mouse[1], m2 = mx * mx + my * my; if (m2 < mr * mr && m2 > 0.01) { var m = Math.sqrt(m2), push = (1 - m / mr) * 24 * d; gx += mx / m * push; gy += my / m * push; } }
        var dx = gx - px[i], dy = gy - py[i], dr = tr[i] - pr[i]; if (dx * dx + dy * dy > 0.04 || dr * dr > 0.001) moving = true; px[i] += dx * pk[i]; py[i] += dy * pk[i]; pr[i] += dr * pk[i];
      }
      for (var k = 0; k < 3; k++) { c = ORDER[k]; ctx.fillStyle = INKS[c]; ctx.beginPath(); for (i = 0; i < N; i++) { var r = pr[i]; if (pcol[i] !== c || r < 0.15) continue; ctx.moveTo(px[i] + r, py[i]); ctx.arc(px[i], py[i], r, 0, TAU); } ctx.fill(); }
      if (end && frameNo >= endAt) { var s = 9 * d; ctx.fillStyle = '#F3E52B'; ctx.fillRect(end[0] - s / 2, end[1] - s / 2, s, s); ctx.strokeStyle = '#111111'; ctx.lineWidth = d; ctx.strokeRect(end[0] - s / 2, end[1] - s / 2, s, s); }
      if (moving || mouse || (end && frameNo < endAt)) kick(); // otherwise hold: no loop at rest
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    function size() {
      var r = cv.getBoundingClientRect(), nd = Math.min(2, window.devicePixelRatio || 1), nW = Math.max(200, Math.round(r.width * nd)), nH = Math.max(160, Math.round(r.height * nd));
      if (nW === W && nH === H && nd === d) return; d = nd; W = cv.width = nW; H = cv.height = nH;
      var n = Math.min(opt.max || 60000, Math.round((W / (G * d)) * (H / (G * d)) * 0.7));
      if (n !== N) { N = n; px = new Float32Array(N); py = new Float32Array(N); tx = new Float32Array(N); ty = new Float32Array(N); pr = new Float32Array(N); tr = new Float32Array(N); pk = new Float32Array(N); pdel = new Float32Array(N); pcol = new Uint8Array(N); tcol = new Uint8Array(N); for (var i = 0; i < N; i++) { px[i] = Math.random() * W; py[i] = Math.random() * H; } }
      retarget(still);
    }
    if (opt.mouse !== false) { cv.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mouse = [(e.clientX - r.left) * d, (e.clientY - r.top) * d]; kick(); }); cv.addEventListener('pointerleave', function () { mouse = null; kick(); }); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) kick(); }).observe(cv);
    var rt; function later() { clearTimeout(rt); rt = setTimeout(size, 120); } window.addEventListener('resize', later);
    return { show: function (fn, single) { provider = fn; oneRed = !!single; if (!W) size(); else retarget(still); }, size: size, later: later };
  }


  /* ================= the work: real projects, exact words from X, and one dot artwork each =================
     Art palette (sampled into dots): C.ink -> ink, C.blue -> gray (the plan / context), C.orange -> red (what happened). */

  function stage(ctx, W, H, aspect) {
    ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);
    aspect = aspect || 1.3;
    var bw = Math.min(W, H * aspect) * 0.94, bh = bw / aspect, ox = (W - bw) / 2, oy = (H - bh) / 2, u = bw / 100;
    var S = {
      u: u, P: function (x, y) { return [ox + x * bw, oy + y * bh]; },
      disk: function (x, y, r, col, a) { var p = S.P(x, y); ctx.globalAlpha = a || 1; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p[0], p[1], r * u, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; },
      ring: function (x, y, r, col, w, dash) { var p = S.P(x, y); ctx.strokeStyle = col; ctx.lineWidth = w * u; ctx.setLineDash(dash ? dash.map(function (v) { return v * u; }) : []); ctx.beginPath(); ctx.arc(p[0], p[1], r * u, 0, TAU); ctx.stroke(); ctx.setLineDash([]); },
      rect: function (x, y, w, h, col, a) { var p = S.P(x, y), q = S.P(x + w, y + h); ctx.globalAlpha = a || 1; ctx.fillStyle = col; ctx.fillRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); ctx.globalAlpha = 1; },
      box: function (x, y, s, col) { var p = S.P(x, y), h = s * u / 2; ctx.fillStyle = col; ctx.fillRect(p[0] - h, p[1] - h, h * 2, h * 2); },
      line: function (pts, col, w, dash, a) { ctx.globalAlpha = a || 1; ctx.strokeStyle = col; ctx.lineWidth = w * u; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash(dash ? dash.map(function (v) { return v * u; }) : []); ctx.beginPath(); pts.forEach(function (q, k) { var p = S.P(q[0], q[1]); if (k) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; },
      curve: function (a, b, c, d) { var out = []; for (var t = 0; t <= 1.0001; t += 0.02) { var v = 1 - t; out.push([v * v * v * a[0] + 3 * v * v * t * b[0] + 3 * v * t * t * c[0] + t * t * t * d[0], v * v * v * a[1] + 3 * v * v * t * b[1] + 3 * v * t * t * c[1] + t * t * t * d[1]]); } return out; }
    };
    return S;
  }

  // I turned the fly bisexual: 8 P1 neurons, male and female cues, before and after mAL blockade (ranges as reported)
  function drawBi(ctx, W, H) {
    var S = stage(ctx, W, H, 1.3), R = rng(1015), i, k;
    function raster(x0, y0, w, rows, counts, col) {
      for (i = 0; i < rows; i++) {
        var y = y0 + i * 0.047; S.line([[x0, y], [x0 + w, y]], C.blue, 0.25, null, 0.5);
        var n = counts(i); for (k = 0; k < n; k++) { var x = x0 + 0.02 + R() * (w - 0.04); S.line([[x, y - 0.016], [x, y + 0.016]], col, 1.1); }
      }
    }
    // male cue: control silent, mAL blocked 1-5 spikes (the finding, in red)
    raster(0.04, 0.09, 0.42, 8, function () { return 0; }, C.ink);
    raster(0.54, 0.09, 0.42, 8, function () { return 1 + (R() * 5 | 0); }, C.orange);
    // female cue: 8-11 spikes, then 18-20 after blockade
    raster(0.04, 0.6, 0.42, 8, function () { return 8 + (R() * 4 | 0); }, C.ink);
    raster(0.54, 0.6, 0.42, 8, function () { return 18 + (R() * 3 | 0); }, C.ink);
    // the cut: mAL output blocked between the two columns
    S.line([[0.5, 0.05], [0.5, 0.95]], C.ink, 0.9, [1.6, 1.6]);
    S.box(0.5, 0.5, 3.2, C.orange);
  }

  // fast-weight path integration: a fly wanders from a drop of food in the dark and heads straight back
  function drawPath(ctx, W, H) {
    var S = stage(ctx, W, H, 1.3), R = rng(4), i, home = [0.14, 0.86], far = [0.66, 0.5], walk = [];
    for (i = 0; i <= 260; i++) { var t = i / 260, e = t * t * (3 - 2 * t), r = 0.035 + 0.06 * Math.sin(Math.PI * t), ph = t * Math.PI * 11 + (R() - 0.5) * 0.25;
      var v = 1 - e, bx = v * v * v * home[0] + 3 * v * v * e * 0.02 + 3 * v * e * e * 0.5 + e * e * e * far[0], by = v * v * v * home[1] + 3 * v * v * e * 0.12 + 3 * v * e * e * 0.0 + e * e * e * far[1]; walk.push([bx + r * 0.7 * Math.cos(ph), by + r * 0.9 * Math.sin(ph)]); }
    var end = walk[walk.length - 1];
    for (i = 0; i < 26; i++) { var q = [R() * 0.7, R()]; S.line([home, q], C.ink, 0.25, null, 0.16); } // the dark: faint sight lines to nothing
    S.line(walk, C.blue, 1.5, [2.4, 1.8]);
    S.line([end, home], C.orange, 2.6); // the home vector, straight back to the food
    S.disk(end[0], end[1], 2, C.ink);
    // the heading bump on a ring of 16 wedges (the hΔ circuit keeps it)
    var cx = 0.84, cy = 0.3; for (i = 0; i < 16; i++) { var t = i / 16 * TAU, bump = Math.exp(-Math.pow(((i - 3 + 16) % 16) - 0, 2) / 2.2) + Math.exp(-Math.pow(((i - 3 + 16) % 16) - 16, 2) / 2.2); S.disk(cx + Math.cos(t) * 0.1, cy + Math.sin(t) * 0.13, 1 + bump * 2.4, bump > 0.3 ? C.ink : C.blue); }
    S.ring(cx, cy, 5, C.blue, 0.6, [1, 1.4]);
    return S.P(home[0], home[1]);
  }

  // system1 (multi-agent Jevs) + system2 (astra): one general, seven platoon leaders, focus fire
  function drawHarness(ctx, W, H) {
    var S = stage(ctx, W, H, 1.3), R = rng(7), i, k, gen = [0.2, 0.18], plats = [], enemy = [], target = [0.8, 0.46];
    for (i = 0; i < 7; i++) plats.push([0.08 + i * 0.07, 0.52 + Math.sin(i * 0.9) * 0.08]);
    for (i = 0; i < 14; i++) enemy.push([0.74 + (i % 4) * 0.055 + R() * 0.02, 0.3 + (i / 4 | 0) * 0.1 + R() * 0.03]);
    plats.forEach(function (p) { S.line([gen, p], C.ink, 0.35, null, 0.35); enemy.forEach(function (e) { if (R() < 0.3) S.line([p, e], C.ink, 0.25, null, 0.2); }); });
    S.disk(gen[0], gen[1], 4.6, C.ink); S.ring(gen[0], gen[1], 6.6, C.blue, 0.9, [1.2, 1.2]);
    plats.forEach(function (p, j) { S.ring(p[0], p[1], 2.8, C.blue, 1.1); for (k = 0; k < 5; k++) S.disk(p[0] + (R() - 0.5) * 0.06, p[1] + 0.07 + R() * 0.07, 0.9, C.ink); });
    enemy.forEach(function (e) { S.disk(e[0], e[1], 1.5, C.blue); });
    [1, 3, 4, 6].forEach(function (j) { var p = plats[j]; S.line(S.curve(p, [p[0] + 0.15, p[1] - 0.1], [target[0] - 0.2, target[1] + 0.1], target), C.orange, 1.3); });
    S.disk(target[0], target[1], 2.6, C.ink);
    return S.P(target[0], target[1] - 0.04);
  }

  // Jev in GTA 5: a city grid, the getaway route, the police behind
  function drawGTA(ctx, W, H) {
    var S = stage(ctx, W, H, 1.3), R = rng(5), i, j, bx = 0.1, by = 0.12;
    for (i = 0; i < 6; i++) for (j = 0; j < 4; j++) S.rect(0.04 + i * 0.16, 0.06 + j * 0.23, 0.12, 0.18, C.blue, R() < 0.25 ? 0.5 : 0.22);
    var route = [[0.02, 0.96], [0.02, 0.73], [0.34, 0.73], [0.34, 0.5], [0.66, 0.5], [0.66, 0.27], [0.82, 0.27], [0.82, 0.04], [0.99, 0.04]];
    S.line(route, C.orange, 2.2);
    [[0.18, 0.73], [0.34, 0.62], [0.5, 0.5]].forEach(function (c, k) { S.box(c[0], c[1], 2.6, C.ink); S.line([[c[0] - 0.03, c[1]], [c[0] - 0.08, c[1]]], C.ink, 0.5, [0.6, 0.8]); });
    S.ring(0.34, 0.62, 6, C.ink, 0.8, [0.8, 1.2]); for (i = 0; i < 12; i++) { var t = i / 12 * TAU; S.line([[0.34 + Math.cos(t) * 0.05, 0.62 + Math.sin(t) * 0.065], [0.34 + Math.cos(t) * 0.08, 0.62 + Math.sin(t) * 0.1]], C.ink, 0.6); }
    for (i = 0; i < 30; i++) { var a = [R(), R()]; S.disk(a[0], a[1], 0.5, C.ink, 0.6); }
    return S.P(0.99, 0.04);
  }

  // ScrapeMyProfessor: every rating scraped into one ranking, one of them yours
  function drawRank(ctx, W, H) {
    var S = stage(ctx, W, H, 1.3), R = rng(12), i, n = 18, pick = 5;
    for (i = 0; i < 700; i++) S.disk(0.02 + R() * 0.28, 0.06 + R() * 0.88, 0.45, C.ink, 0.25 + R() * 0.5);
    for (i = 0; i < n; i++) { var y = 0.07 + i * 0.049, w = 0.6 * Math.pow(0.93, i) * (0.92 + R() * 0.08); S.line([[0.36, y], [0.36 + w, y]], i === pick ? C.orange : (i < 3 ? C.ink : C.blue), 1.7); if (i === pick) S.line([[0.3, y], [0.35, y]], C.ink, 0.4, [0.6, 0.8]); }
    return S.P(0.36 + 0.6 * Math.pow(0.93, pick) * 0.96, 0.07 + pick * 0.049);
  }

  // Xbench: 23k posts from 14k people; 29 users moved one way, 9 the other
  function drawXbench(ctx, W, H) {
    var S = stage(ctx, W, H, 1.3), R = rng(23), i, A = [0.26, 0.55], B = [0.76, 0.5];
    for (i = 0; i < 900; i++) S.disk(R(), R(), 0.4, C.blue, 0.2 + R() * 0.35);
    function mass(c, r, col, n) { for (var k = 0; k < n; k++) { var t = R() * TAU, d = Math.sqrt(R()) * r; S.disk(c[0] + Math.cos(t) * d * 0.77, c[1] + Math.sin(t) * d, 0.9, col); } }
    mass(A, 0.2, C.blue, 260); mass(B, 0.22, C.ink, 320);
    for (i = 0; i < 29; i++) { var a = [A[0] + (R() - 0.5) * 0.12, A[1] + (R() - 0.5) * 0.2], b = [B[0] + (R() - 0.5) * 0.12, B[1] + (R() - 0.5) * 0.2]; S.line(S.curve(a, [a[0] + 0.12, a[1] - 0.3 - R() * 0.1], [b[0] - 0.12, b[1] - 0.3 - R() * 0.1], b), C.orange, 0.5); }
    for (i = 0; i < 9; i++) { var c = [B[0] + (R() - 0.5) * 0.12, B[1] + (R() - 0.5) * 0.2], e = [A[0] + (R() - 0.5) * 0.12, A[1] + (R() - 0.5) * 0.2]; S.line(S.curve(c, [c[0] - 0.12, c[1] + 0.3], [e[0] + 0.12, e[1] + 0.3], e), C.ink, 0.45, null, 0.6); }
  }

  // Opus 5 mini games: a shelf of one-prompt games, and paper pilot's flight through them
  function drawGames(ctx, W, H) {
    var S = stage(ctx, W, H, 1.3), R = rng(25), i, j;
    for (i = 0; i < 4; i++) for (j = 0; j < 3; j++) { var x = 0.06 + i * 0.235, y = 0.08 + j * 0.3; S.line([[x, y], [x + 0.19, y], [x + 0.19, y + 0.24], [x, y + 0.24], [x, y]], C.blue, 0.8); }
    for (i = 0; i < 40; i++) S.disk(0.1 + R() * 0.12, 0.42 + R() * 0.16, 0.9, C.ink); // the zombie horde
    for (i = 0; i < 7; i++) for (j = 0; j < 5; j++) if ((i + j) % 2) S.rect(0.77 + i * 0.022, 0.72 + j * 0.03, 0.02, 0.028, C.ink, 0.8); // a mini civ
    var fl = []; for (i = 0; i <= 80; i++) { var t = i / 80; fl.push([0.08 + t * 0.86, 0.3 + Math.sin(t * 9) * 0.12 * (1 - t) - t * 0.18]); }
    S.line(fl, C.orange, 1.8);
    var e = fl[fl.length - 1], p = S.P(e[0], e[1]), u = S.u; ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(p[0] + 3 * u, p[1]); ctx.lineTo(p[0] - 2 * u, p[1] - 2 * u); ctx.lineTo(p[0] - 1 * u, p[1]); ctx.lineTo(p[0] - 2 * u, p[1] + 2 * u); ctx.closePath(); ctx.fill();
  }


  // a stick figure from joint positions (stage units): head, shoulders, elbows, wrists, hips, knees, ankles
  function stick(S, j, col, w) {
    [['ls', 'rs'], ['lh', 'rh'], ['ls', 'lh'], ['rs', 'rh'], ['ls', 'le'], ['le', 'lw'], ['rs', 're'], ['re', 'rw'],
     ['lh', 'lk'], ['lk', 'la'], ['rh', 'rk'], ['rk', 'ra']].forEach(function (b) { S.line([j[b[0]], j[b[1]]], col, w); });
    S.disk(j.hd[0], j.hd[1], w * 1.6, col);
  }
  function pose(x, y, s, arm) { // a forehand stance at (x, y), height s; arm in [0, 1] swings the hitting arm through
    var a = -2.6 + arm * 3.4, sx = x + 0.05 * s, sy = y - 0.62 * s, P = function (dx, dy) { return [x + dx * s, y + dy * s]; };
    return { hd: P(0.0, -0.78), ls: P(-0.07, -0.62), rs: [sx, sy], lh: P(-0.05, -0.32), rh: P(0.05, -0.32),
             le: P(-0.16, -0.5), lw: P(-0.2, -0.38), re: [sx + Math.cos(a) * 0.17 * s, sy + Math.sin(a) * 0.17 * s],
             rw: [sx + Math.cos(a) * 0.33 * s, sy + Math.sin(a) * 0.33 * s], lk: P(-0.12, -0.15), la: P(-0.16, 0), rk: P(0.1, -0.16), ra: P(0.16, 0) };
  }

  // Federer, 2003-2019: a forehand (the swing traced in red, earlier arm positions in gray) beside the map of his
  // movement syllables, one cluster circled the way the explorer selects it
  function drawFederer(ctx, W, H) {
    var S = stage(ctx, W, H, 1.3), R = rng(2003), i, k, x = 0.24, y = 0.9, s = 0.72;
    S.line([[0.02, y], [0.46, y]], C.ink, 0.8);
    var sh = [x + 0.05 * s, y - 0.62 * s], head = function (t) { var a = -2.6 + t * 3.4; return [sh[0] + Math.cos(a) * 0.42 * s, sh[1] + Math.sin(a) * 0.42 * s]; };
    var arc = []; for (i = 0; i <= 40; i++) arc.push(head(0.1 + 0.55 * i / 40));
    S.line(arc, C.orange, 1.4, [1.4, 1.2]);
    [0.1, 0.3].forEach(function (t) { var j = pose(x, y, s, t); S.line([j.rs, j.re, j.rw], C.blue, 0.9); });
    var j = pose(x, y, s, 0.65); stick(S, j, C.ink, 1.5); S.line([j.rw, head(0.65)], C.ink, 0.9);
    var h = head(0.65); S.ring(h[0], h[1], 2, C.ink, 0.9);
    S.disk(h[0] + 0.03, h[1] - 0.01, 1.2, C.orange);
    var centres = [[0.64, 0.24], [0.82, 0.2], [0.91, 0.44], [0.72, 0.52], [0.6, 0.76], [0.84, 0.76]];
    centres.forEach(function (c, n) { for (k = 0; k < 70; k++) { var r = Math.sqrt(R()) * 0.07, t = R() * TAU; S.disk(c[0] + Math.cos(t) * r, c[1] + Math.sin(t) * r * 1.2, 0.75, n === 3 ? C.orange : C.ink); } });
    for (k = 0; k < 90; k++) S.disk(0.54 + R() * 0.42, 0.08 + R() * 0.84, 0.6, C.blue);
    S.ring(0.72, 0.52, 11, C.ink, 0.9);
    return S.P(0.72, 0.52);
  }

  // Skeleton Tennis: a rally drawn only as two skeletons, the court and the ball; name both players
  function drawSkeletonTennis(ctx, W, H) {
    var S = stage(ctx, W, H, 1.3), i;
    var c = [[0.16, 0.92], [0.84, 0.92], [0.68, 0.12], [0.32, 0.12], [0.16, 0.92]];
    S.line(c, C.blue, 0.8); S.line([[0.24, 0.47], [0.76, 0.47]], C.ink, 1.1); S.line([[0.24, 0.42], [0.76, 0.42]], C.blue, 0.4, [1, 1]);
    S.line([[0.5, 0.12], [0.5, 0.92]], C.blue, 0.4, [1.2, 1.2]);
    var ball = []; for (i = 0; i <= 50; i++) { var t = i / 50; ball.push([0.72 - t * 0.22, 0.62 - t * 0.44 - Math.sin(t * Math.PI) * 0.1]); }
    S.line(ball, C.orange, 1.2, [1.4, 1.2]);
    stick(S, pose(0.64, 0.95, 0.36, 0.8), C.ink, 1.3);
    stick(S, pose(0.42, 0.26, 0.26, 0.3), C.ink, 0.9);
    S.disk(ball[50][0], ball[50][1], 1.3, C.orange);
    return S.P(0.64, 0.7);
  }

  var THEMES = [{ id: 'ml', art: drawTrace }, { id: 'neuro', art: drawPath }, { id: 'envs', art: drawXbench }, { id: 'games', art: drawHarness }, { id: 'sports', art: drawTrace }];
  var WRITING = [{ slug: 'federer', art: drawFederer }, { slug: 'skeleton-tennis', art: drawSkeletonTennis }, { slug: 'wc3env', art: drawWc3 }, { slug: 'harness', art: drawHarness }, { slug: 'fast-weights', art: drawPath }, { slug: 'bisexual-fly', art: drawBi }, { slug: 'xbench', art: drawXbench }];
  /* ================= boot: the home page ================= */
  // home: the theme filter (remembered in the address, e.g. /#neuro)
  function bootFilter() {
    var chips = document.querySelectorAll('.tf[data-filter]'); if (!chips.length) return;
    function filter(id) {
      chips.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.filter === id ? 'true' : 'false'); });
      var shown = 0;
      document.querySelectorAll('.list, .notes').forEach(function (list) {  // hide a section, and its heading, left empty
        var n = 0; list.querySelectorAll('[data-themes]').forEach(function (r) { r.hidden = !!id && r.dataset.themes.split(' ').indexOf(id) < 0; if (!r.hidden) n++; });
        list.hidden = !n; var h = list.previousElementSibling; if (h && h.classList.contains('tag')) h.hidden = !n; shown += n;
      });
      var e = document.querySelector('.shelf .empty'); if (e) e.hidden = shown > 0;
    }
    chips.forEach(function (b) { b.addEventListener('click', function () { filter(b.dataset.filter); if (history.replaceState) history.replaceState(null, '', b.dataset.filter ? '#' + b.dataset.filter : location.pathname); }); });
    function fromHash() { var h = location.hash.slice(1); filter(THEMES.some(function (t) { return t.id === h; }) ? h : ''); }
    fromHash(); window.addEventListener('hashchange', fromHash);
  }
  // writeups: click a picture to see it full size; click again, or press Escape, to close
  function bootZoom() {
    var box = null;
    function close() { if (box) { box.remove(); box = null; document.documentElement.style.overflow = ''; } }
    document.addEventListener('click', function (e) {
      var img = e.target.closest && e.target.closest('.prose img');
      if (box) { close(); return; }
      if (!img || img.closest('a')) return;
      box = document.createElement('div'); box.className = 'zoom'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', img.alt || 'Picture');
      var big = document.createElement('img'); big.src = img.currentSrc || img.src; big.alt = img.alt; box.appendChild(big);
      document.body.appendChild(box); document.documentElement.style.overflow = 'hidden';
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
  (document.readyState === 'loading' ? document.addEventListener.bind(document, 'DOMContentLoaded') : function (f) { f(); })(function () { bootFilter(); bootZoom(); });

})();
