import { B as re } from "./index-DYh2V44F.js";
import "react";
const O = new Int32Array([
  0,
  1,
  8,
  16,
  9,
  2,
  3,
  10,
  17,
  24,
  32,
  25,
  18,
  11,
  4,
  5,
  12,
  19,
  26,
  33,
  40,
  48,
  41,
  34,
  27,
  20,
  13,
  6,
  7,
  14,
  21,
  28,
  35,
  42,
  49,
  56,
  57,
  50,
  43,
  36,
  29,
  22,
  15,
  23,
  30,
  37,
  44,
  51,
  58,
  59,
  52,
  45,
  38,
  31,
  39,
  46,
  53,
  60,
  61,
  54,
  47,
  55,
  62,
  63
]), Y = 4017, Z = 799, $ = 3406, N = 2276, Q = 1567, W = 3784, F = 5793, K = 2896;
function ne(j, l) {
  let o = 0;
  const u = [];
  let q = 16;
  for (; q > 0 && !j[q - 1]; )
    --q;
  u.push({ children: [], index: 0 });
  let g = u[0], v;
  for (let t = 0; t < q; t++) {
    for (let h = 0; h < j[t]; h++) {
      for (g = u.pop(), g.children[g.index] = l[o]; g.index > 0; )
        g = u.pop();
      for (g.index++, u.push(g); u.length <= t; )
        u.push(v = { children: [], index: 0 }), g.children[g.index] = v.children, g = v;
      o++;
    }
    t + 1 < q && (u.push(v = { children: [], index: 0 }), g.children[g.index] = v.children, g = v);
  }
  return u[0].children;
}
function ce(j, l, o, u, q, g, v, t, h) {
  const { mcusPerLine: b, progressive: c } = o, r = l;
  let d = l, i = 0, m = 0;
  function p() {
    if (m > 0)
      return m--, i >> m & 1;
    if (i = j[d++], i === 255) {
      const a = j[d++];
      if (a)
        throw new Error(`unexpected marker: ${(i << 8 | a).toString(16)}`);
    }
    return m = 7, i >>> 7;
  }
  function k(a) {
    let f = a, w;
    for (; (w = p()) !== null; ) {
      if (f = f[w], typeof f == "number")
        return f;
      if (typeof f != "object")
        throw new Error("invalid huffman sequence");
    }
    return null;
  }
  function x(a) {
    let f = a, w = 0;
    for (; f > 0; ) {
      const D = p();
      if (D === null)
        return;
      w = w << 1 | D, --f;
    }
    return w;
  }
  function C(a) {
    const f = x(a);
    return f >= 1 << a - 1 ? f : f + (-1 << a) + 1;
  }
  function T(a, f) {
    const w = k(a.huffmanTableDC), D = w === 0 ? 0 : C(w);
    a.pred += D, f[0] = a.pred;
    let L = 1;
    for (; L < 64; ) {
      const y = k(a.huffmanTableAC), S = y & 15, E = y >> 4;
      if (S === 0) {
        if (E < 15)
          break;
        L += 16;
      } else {
        L += E;
        const M = O[L];
        f[M] = C(S), L++;
      }
    }
  }
  function A(a, f) {
    const w = k(a.huffmanTableDC), D = w === 0 ? 0 : C(w) << h;
    a.pred += D, f[0] = a.pred;
  }
  function s(a, f) {
    f[0] |= p() << h;
  }
  let n = 0;
  function P(a, f) {
    if (n > 0) {
      n--;
      return;
    }
    let w = g;
    const D = v;
    for (; w <= D; ) {
      const L = k(a.huffmanTableAC), y = L & 15, S = L >> 4;
      if (y === 0) {
        if (S < 15) {
          n = x(S) + (1 << S) - 1;
          break;
        }
        w += 16;
      } else {
        w += S;
        const E = O[w];
        f[E] = C(y) * (1 << h), w++;
      }
    }
  }
  let e = 0, _;
  function te(a, f) {
    let w = g;
    const D = v;
    let L = 0;
    for (; w <= D; ) {
      const y = O[w], S = f[y] < 0 ? -1 : 1;
      switch (e) {
        case 0: {
          const E = k(a.huffmanTableAC), M = E & 15;
          if (L = E >> 4, M === 0)
            L < 15 ? (n = x(L) + (1 << L), e = 4) : (L = 16, e = 1);
          else {
            if (M !== 1)
              throw new Error("invalid ACn encoding");
            _ = C(M), e = L ? 2 : 3;
          }
          continue;
        }
        case 1:
        case 2:
          f[y] ? f[y] += (p() << h) * S : (L--, L === 0 && (e = e === 2 ? 3 : 0));
          break;
        case 3:
          f[y] ? f[y] += (p() << h) * S : (f[y] = _ << h, e = 0);
          break;
        case 4:
          f[y] && (f[y] += (p() << h) * S);
          break;
      }
      w++;
    }
    e === 4 && (n--, n === 0 && (e = 0));
  }
  function se(a, f, w, D, L) {
    const y = w / b | 0, S = w % b, E = y * a.v + D, M = S * a.h + L;
    f(a, a.blocks[E][M]);
  }
  function oe(a, f, w) {
    const D = w / a.blocksPerLine | 0, L = w % a.blocksPerLine;
    f(a, a.blocks[D][L]);
  }
  const V = u.length;
  let U, I, G, z, R, H;
  c ? g === 0 ? H = t === 0 ? A : s : H = t === 0 ? P : te : H = T;
  let B = 0, X, J;
  V === 1 ? J = u[0].blocksPerLine * u[0].blocksPerColumn : J = b * o.mcusPerColumn;
  const ee = q || J;
  for (; B < J; ) {
    for (I = 0; I < V; I++)
      u[I].pred = 0;
    if (n = 0, V === 1)
      for (U = u[0], R = 0; R < ee; R++)
        oe(U, H, B), B++;
    else
      for (R = 0; R < ee; R++) {
        for (I = 0; I < V; I++) {
          U = u[I];
          const { h: a, v: f } = U;
          for (G = 0; G < f; G++)
            for (z = 0; z < a; z++)
              se(U, H, B, G, z);
        }
        if (B++, B === J)
          break;
      }
    if (m = 0, X = j[d] << 8 | j[d + 1], X < 65280)
      throw new Error("marker was not found");
    if (X >= 65488 && X <= 65495)
      d += 2;
    else
      break;
  }
  return d - r;
}
function ie(j, l) {
  const o = [], { blocksPerLine: u, blocksPerColumn: q } = l, g = u << 3, v = new Int32Array(64), t = new Uint8Array(64);
  function h(b, c, r) {
    const d = l.quantizationTable;
    let i, m, p, k, x, C, T, A, s;
    const n = r;
    let P;
    for (P = 0; P < 64; P++)
      n[P] = b[P] * d[P];
    for (P = 0; P < 8; ++P) {
      const e = 8 * P;
      if (n[1 + e] === 0 && n[2 + e] === 0 && n[3 + e] === 0 && n[4 + e] === 0 && n[5 + e] === 0 && n[6 + e] === 0 && n[7 + e] === 0) {
        s = F * n[0 + e] + 512 >> 10, n[0 + e] = s, n[1 + e] = s, n[2 + e] = s, n[3 + e] = s, n[4 + e] = s, n[5 + e] = s, n[6 + e] = s, n[7 + e] = s;
        continue;
      }
      i = F * n[0 + e] + 128 >> 8, m = F * n[4 + e] + 128 >> 8, p = n[2 + e], k = n[6 + e], x = K * (n[1 + e] - n[7 + e]) + 128 >> 8, A = K * (n[1 + e] + n[7 + e]) + 128 >> 8, C = n[3 + e] << 4, T = n[5 + e] << 4, s = i - m + 1 >> 1, i = i + m + 1 >> 1, m = s, s = p * W + k * Q + 128 >> 8, p = p * Q - k * W + 128 >> 8, k = s, s = x - T + 1 >> 1, x = x + T + 1 >> 1, T = s, s = A + C + 1 >> 1, C = A - C + 1 >> 1, A = s, s = i - k + 1 >> 1, i = i + k + 1 >> 1, k = s, s = m - p + 1 >> 1, m = m + p + 1 >> 1, p = s, s = x * N + A * $ + 2048 >> 12, x = x * $ - A * N + 2048 >> 12, A = s, s = C * Z + T * Y + 2048 >> 12, C = C * Y - T * Z + 2048 >> 12, T = s, n[0 + e] = i + A, n[7 + e] = i - A, n[1 + e] = m + T, n[6 + e] = m - T, n[2 + e] = p + C, n[5 + e] = p - C, n[3 + e] = k + x, n[4 + e] = k - x;
    }
    for (P = 0; P < 8; ++P) {
      const e = P;
      if (n[1 * 8 + e] === 0 && n[2 * 8 + e] === 0 && n[3 * 8 + e] === 0 && n[4 * 8 + e] === 0 && n[5 * 8 + e] === 0 && n[6 * 8 + e] === 0 && n[7 * 8 + e] === 0) {
        s = F * r[P + 0] + 8192 >> 14, n[0 * 8 + e] = s, n[1 * 8 + e] = s, n[2 * 8 + e] = s, n[3 * 8 + e] = s, n[4 * 8 + e] = s, n[5 * 8 + e] = s, n[6 * 8 + e] = s, n[7 * 8 + e] = s;
        continue;
      }
      i = F * n[0 * 8 + e] + 2048 >> 12, m = F * n[4 * 8 + e] + 2048 >> 12, p = n[2 * 8 + e], k = n[6 * 8 + e], x = K * (n[1 * 8 + e] - n[7 * 8 + e]) + 2048 >> 12, A = K * (n[1 * 8 + e] + n[7 * 8 + e]) + 2048 >> 12, C = n[3 * 8 + e], T = n[5 * 8 + e], s = i - m + 1 >> 1, i = i + m + 1 >> 1, m = s, s = p * W + k * Q + 2048 >> 12, p = p * Q - k * W + 2048 >> 12, k = s, s = x - T + 1 >> 1, x = x + T + 1 >> 1, T = s, s = A + C + 1 >> 1, C = A - C + 1 >> 1, A = s, s = i - k + 1 >> 1, i = i + k + 1 >> 1, k = s, s = m - p + 1 >> 1, m = m + p + 1 >> 1, p = s, s = x * N + A * $ + 2048 >> 12, x = x * $ - A * N + 2048 >> 12, A = s, s = C * Z + T * Y + 2048 >> 12, C = C * Y - T * Z + 2048 >> 12, T = s, n[0 * 8 + e] = i + A, n[7 * 8 + e] = i - A, n[1 * 8 + e] = m + T, n[6 * 8 + e] = m - T, n[2 * 8 + e] = p + C, n[5 * 8 + e] = p - C, n[3 * 8 + e] = k + x, n[4 * 8 + e] = k - x;
    }
    for (P = 0; P < 64; ++P) {
      const e = 128 + (n[P] + 8 >> 4);
      e < 0 ? c[P] = 0 : e > 255 ? c[P] = 255 : c[P] = e;
    }
  }
  for (let b = 0; b < q; b++) {
    const c = b << 3;
    for (let r = 0; r < 8; r++)
      o.push(new Uint8Array(g));
    for (let r = 0; r < u; r++) {
      h(l.blocks[b][r], t, v);
      let d = 0;
      const i = r << 3;
      for (let m = 0; m < 8; m++) {
        const p = o[c + m];
        for (let k = 0; k < 8; k++)
          p[i + k] = t[d++];
      }
    }
  }
  return o;
}
class le {
  constructor() {
    this.jfif = null, this.adobe = null, this.quantizationTables = [], this.huffmanTablesAC = [], this.huffmanTablesDC = [], this.resetFrames();
  }
  resetFrames() {
    this.frames = [];
  }
  parse(l) {
    let o = 0;
    function u() {
      const t = l[o] << 8 | l[o + 1];
      return o += 2, t;
    }
    function q() {
      const t = u(), h = l.subarray(o, o + t - 2);
      return o += h.length, h;
    }
    function g(t) {
      let h = 0, b = 0, c, r;
      for (r in t.components)
        t.components.hasOwnProperty(r) && (c = t.components[r], h < c.h && (h = c.h), b < c.v && (b = c.v));
      const d = Math.ceil(t.samplesPerLine / 8 / h), i = Math.ceil(t.scanLines / 8 / b);
      for (r in t.components)
        if (t.components.hasOwnProperty(r)) {
          c = t.components[r];
          const m = Math.ceil(Math.ceil(t.samplesPerLine / 8) * c.h / h), p = Math.ceil(Math.ceil(t.scanLines / 8) * c.v / b), k = d * c.h, x = i * c.v, C = [];
          for (let T = 0; T < x; T++) {
            const A = [];
            for (let s = 0; s < k; s++)
              A.push(new Int32Array(64));
            C.push(A);
          }
          c.blocksPerLine = m, c.blocksPerColumn = p, c.blocks = C;
        }
      t.maxH = h, t.maxV = b, t.mcusPerLine = d, t.mcusPerColumn = i;
    }
    let v = u();
    if (v !== 65496)
      throw new Error("SOI not found");
    for (v = u(); v !== 65497; ) {
      switch (v) {
        case 65280:
          break;
        case 65504:
        case 65505:
        case 65506:
        case 65507:
        case 65508:
        case 65509:
        case 65510:
        case 65511:
        case 65512:
        case 65513:
        case 65514:
        case 65515:
        case 65516:
        case 65517:
        case 65518:
        case 65519:
        case 65534: {
          const t = q();
          v === 65504 && t[0] === 74 && t[1] === 70 && t[2] === 73 && t[3] === 70 && t[4] === 0 && (this.jfif = {
            version: { major: t[5], minor: t[6] },
            densityUnits: t[7],
            xDensity: t[8] << 8 | t[9],
            yDensity: t[10] << 8 | t[11],
            thumbWidth: t[12],
            thumbHeight: t[13],
            thumbData: t.subarray(14, 14 + 3 * t[12] * t[13])
          }), v === 65518 && t[0] === 65 && t[1] === 100 && t[2] === 111 && t[3] === 98 && t[4] === 101 && t[5] === 0 && (this.adobe = {
            version: t[6],
            flags0: t[7] << 8 | t[8],
            flags1: t[9] << 8 | t[10],
            transformCode: t[11]
          });
          break;
        }
        case 65499: {
          const h = u() + o - 2;
          for (; o < h; ) {
            const b = l[o++], c = new Int32Array(64);
            if (b >> 4)
              if (b >> 4 === 1)
                for (let r = 0; r < 64; r++) {
                  const d = O[r];
                  c[d] = u();
                }
              else
                throw new Error("DQT: invalid table spec");
            else for (let r = 0; r < 64; r++) {
              const d = O[r];
              c[d] = l[o++];
            }
            this.quantizationTables[b & 15] = c;
          }
          break;
        }
        case 65472:
        case 65473:
        case 65474: {
          u();
          const t = {
            extended: v === 65473,
            progressive: v === 65474,
            precision: l[o++],
            scanLines: u(),
            samplesPerLine: u(),
            components: {},
            componentsOrder: []
          }, h = l[o++];
          let b;
          for (let c = 0; c < h; c++) {
            b = l[o];
            const r = l[o + 1] >> 4, d = l[o + 1] & 15, i = l[o + 2];
            t.componentsOrder.push(b), t.components[b] = {
              h: r,
              v: d,
              quantizationIdx: i
            }, o += 3;
          }
          g(t), this.frames.push(t);
          break;
        }
        case 65476: {
          const t = u();
          for (let h = 2; h < t; ) {
            const b = l[o++], c = new Uint8Array(16);
            let r = 0;
            for (let i = 0; i < 16; i++, o++)
              c[i] = l[o], r += c[i];
            const d = new Uint8Array(r);
            for (let i = 0; i < r; i++, o++)
              d[i] = l[o];
            h += 17 + r, b >> 4 ? this.huffmanTablesAC[b & 15] = ne(
              c,
              d
            ) : this.huffmanTablesDC[b & 15] = ne(
              c,
              d
            );
          }
          break;
        }
        case 65501:
          u(), this.resetInterval = u();
          break;
        case 65498: {
          u();
          const t = l[o++], h = [], b = this.frames[0];
          for (let m = 0; m < t; m++) {
            const p = b.components[l[o++]], k = l[o++];
            p.huffmanTableDC = this.huffmanTablesDC[k >> 4], p.huffmanTableAC = this.huffmanTablesAC[k & 15], h.push(p);
          }
          const c = l[o++], r = l[o++], d = l[o++], i = ce(
            l,
            o,
            b,
            h,
            this.resetInterval,
            c,
            r,
            d >> 4,
            d & 15
          );
          o += i;
          break;
        }
        case 65535:
          l[o] !== 255 && o--;
          break;
        default:
          if (l[o - 3] === 255 && l[o - 2] >= 192 && l[o - 2] <= 254) {
            o -= 3;
            break;
          }
          throw new Error(`unknown JPEG marker ${v.toString(16)}`);
      }
      v = u();
    }
  }
  getResult() {
    const { frames: l } = this;
    if (this.frames.length === 0)
      throw new Error("no frames were decoded");
    this.frames.length > 1 && console.warn("more than one frame is not supported");
    for (let c = 0; c < this.frames.length; c++) {
      const r = this.frames[c].components;
      for (const d of Object.keys(r))
        r[d].quantizationTable = this.quantizationTables[r[d].quantizationIdx], delete r[d].quantizationIdx;
    }
    const o = l[0], { components: u, componentsOrder: q } = o, g = [], v = o.samplesPerLine, t = o.scanLines;
    for (let c = 0; c < q.length; c++) {
      const r = u[q[c]];
      g.push({
        lines: ie(o, r),
        scaleX: r.h / o.maxH,
        scaleY: r.v / o.maxV
      });
    }
    const h = new Uint8Array(v * t * g.length);
    let b = 0;
    for (let c = 0; c < t; ++c)
      for (let r = 0; r < v; ++r)
        for (let d = 0; d < g.length; ++d) {
          const i = g[d];
          h[b] = i.lines[0 | c * i.scaleY][0 | r * i.scaleX], ++b;
        }
    return h;
  }
}
class ue extends re {
  constructor(l) {
    super(), this.reader = new le(), l.JPEGTables && this.reader.parse(l.JPEGTables);
  }
  decodeBlock(l) {
    return this.reader.resetFrames(), this.reader.parse(new Uint8Array(l)), this.reader.getResult().buffer;
  }
}
export {
  ue as default
};
