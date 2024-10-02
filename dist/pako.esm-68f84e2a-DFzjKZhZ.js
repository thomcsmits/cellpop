/*! pako 2.0.4 https://github.com/nodeca/pako @license (MIT AND Zlib) */
function U(t) {
  let i = t.length;
  for (; --i >= 0; )
    t[i] = 0;
}
const it = 3, nt = 258, He = 29, at = 256, ot = at + 1 + He, Fe = 30, lt = 512, st = new Array((ot + 2) * 2);
U(st);
const rt = new Array(Fe * 2);
U(rt);
const ft = new Array(lt);
U(ft);
const ct = new Array(nt - it + 1);
U(ct);
const ht = new Array(He);
U(ht);
const dt = new Array(Fe);
U(dt);
const ut = (t, i, e, l) => {
  let f = t & 65535 | 0, n = t >>> 16 & 65535 | 0, h = 0;
  for (; e !== 0; ) {
    h = e > 2e3 ? 2e3 : e, e -= h;
    do
      f = f + i[l++] | 0, n = n + f | 0;
    while (--h);
    f %= 65521, n %= 65521;
  }
  return f | n << 16 | 0;
};
var ne = ut;
const _t = () => {
  let t, i = [];
  for (var e = 0; e < 256; e++) {
    t = e;
    for (var l = 0; l < 8; l++)
      t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
    i[e] = t;
  }
  return i;
}, wt = new Uint32Array(_t()), bt = (t, i, e, l) => {
  const f = wt, n = l + e;
  t ^= -1;
  for (let h = l; h < n; h++)
    t = t >>> 8 ^ f[(t ^ i[h]) & 255];
  return t ^ -1;
};
var I = bt, ae = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
}, le = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  //Z_VERSION_ERROR: -6,
  /* compression levels */
  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,
  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,
  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY: 0,
  Z_TEXT: 1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN: 2,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
const kt = (t, i) => Object.prototype.hasOwnProperty.call(t, i);
var gt = function(t) {
  const i = Array.prototype.slice.call(arguments, 1);
  for (; i.length; ) {
    const e = i.shift();
    if (e) {
      if (typeof e != "object")
        throw new TypeError(e + "must be non-object");
      for (const l in e)
        kt(e, l) && (t[l] = e[l]);
    }
  }
  return t;
}, Et = (t) => {
  let i = 0;
  for (let l = 0, f = t.length; l < f; l++)
    i += t[l].length;
  const e = new Uint8Array(i);
  for (let l = 0, f = 0, n = t.length; l < n; l++) {
    let h = t[l];
    e.set(h, f), f += h.length;
  }
  return e;
}, Be = {
  assign: gt,
  flattenChunks: Et
};
let Ge = !0;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  Ge = !1;
}
const $ = new Uint8Array(256);
for (let t = 0; t < 256; t++)
  $[t] = t >= 252 ? 6 : t >= 248 ? 5 : t >= 240 ? 4 : t >= 224 ? 3 : t >= 192 ? 2 : 1;
$[254] = $[254] = 1;
var vt = (t) => {
  if (typeof TextEncoder == "function" && TextEncoder.prototype.encode)
    return new TextEncoder().encode(t);
  let i, e, l, f, n, h = t.length, s = 0;
  for (f = 0; f < h; f++)
    e = t.charCodeAt(f), (e & 64512) === 55296 && f + 1 < h && (l = t.charCodeAt(f + 1), (l & 64512) === 56320 && (e = 65536 + (e - 55296 << 10) + (l - 56320), f++)), s += e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : 4;
  for (i = new Uint8Array(s), n = 0, f = 0; n < s; f++)
    e = t.charCodeAt(f), (e & 64512) === 55296 && f + 1 < h && (l = t.charCodeAt(f + 1), (l & 64512) === 56320 && (e = 65536 + (e - 55296 << 10) + (l - 56320), f++)), e < 128 ? i[n++] = e : e < 2048 ? (i[n++] = 192 | e >>> 6, i[n++] = 128 | e & 63) : e < 65536 ? (i[n++] = 224 | e >>> 12, i[n++] = 128 | e >>> 6 & 63, i[n++] = 128 | e & 63) : (i[n++] = 240 | e >>> 18, i[n++] = 128 | e >>> 12 & 63, i[n++] = 128 | e >>> 6 & 63, i[n++] = 128 | e & 63);
  return i;
};
const pt = (t, i) => {
  if (i < 65534 && t.subarray && Ge)
    return String.fromCharCode.apply(null, t.length === i ? t : t.subarray(0, i));
  let e = "";
  for (let l = 0; l < i; l++)
    e += String.fromCharCode(t[l]);
  return e;
};
var xt = (t, i) => {
  const e = i || t.length;
  if (typeof TextDecoder == "function" && TextDecoder.prototype.decode)
    return new TextDecoder().decode(t.subarray(0, i));
  let l, f;
  const n = new Array(e * 2);
  for (f = 0, l = 0; l < e; ) {
    let h = t[l++];
    if (h < 128) {
      n[f++] = h;
      continue;
    }
    let s = $[h];
    if (s > 4) {
      n[f++] = 65533, l += s - 1;
      continue;
    }
    for (h &= s === 2 ? 31 : s === 3 ? 15 : 7; s > 1 && l < e; )
      h = h << 6 | t[l++] & 63, s--;
    if (s > 1) {
      n[f++] = 65533;
      continue;
    }
    h < 65536 ? n[f++] = h : (h -= 65536, n[f++] = 55296 | h >> 10 & 1023, n[f++] = 56320 | h & 1023);
  }
  return pt(n, f);
}, Rt = (t, i) => {
  i = i || t.length, i > t.length && (i = t.length);
  let e = i - 1;
  for (; e >= 0 && (t[e] & 192) === 128; )
    e--;
  return e < 0 || e === 0 ? i : e + $[t[e]] > i ? e : i;
}, oe = {
  string2buf: vt,
  buf2string: xt,
  utf8border: Rt
};
function At() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var St = At;
const P = 30, yt = 12;
var Tt = function(i, e) {
  let l, f, n, h, s, x, a, o, y, _, r, u, T, E, w, p, g, c, v, D, d, A, R, b;
  const k = i.state;
  l = i.next_in, R = i.input, f = l + (i.avail_in - 5), n = i.next_out, b = i.output, h = n - (e - i.avail_out), s = n + (i.avail_out - 257), x = k.dmax, a = k.wsize, o = k.whave, y = k.wnext, _ = k.window, r = k.hold, u = k.bits, T = k.lencode, E = k.distcode, w = (1 << k.lenbits) - 1, p = (1 << k.distbits) - 1;
  e:
    do {
      u < 15 && (r += R[l++] << u, u += 8, r += R[l++] << u, u += 8), g = T[r & w];
      t:
        for (; ; ) {
          if (c = g >>> 24, r >>>= c, u -= c, c = g >>> 16 & 255, c === 0)
            b[n++] = g & 65535;
          else if (c & 16) {
            v = g & 65535, c &= 15, c && (u < c && (r += R[l++] << u, u += 8), v += r & (1 << c) - 1, r >>>= c, u -= c), u < 15 && (r += R[l++] << u, u += 8, r += R[l++] << u, u += 8), g = E[r & p];
            i:
              for (; ; ) {
                if (c = g >>> 24, r >>>= c, u -= c, c = g >>> 16 & 255, c & 16) {
                  if (D = g & 65535, c &= 15, u < c && (r += R[l++] << u, u += 8, u < c && (r += R[l++] << u, u += 8)), D += r & (1 << c) - 1, D > x) {
                    i.msg = "invalid distance too far back", k.mode = P;
                    break e;
                  }
                  if (r >>>= c, u -= c, c = n - h, D > c) {
                    if (c = D - c, c > o && k.sane) {
                      i.msg = "invalid distance too far back", k.mode = P;
                      break e;
                    }
                    if (d = 0, A = _, y === 0) {
                      if (d += a - c, c < v) {
                        v -= c;
                        do
                          b[n++] = _[d++];
                        while (--c);
                        d = n - D, A = b;
                      }
                    } else if (y < c) {
                      if (d += a + y - c, c -= y, c < v) {
                        v -= c;
                        do
                          b[n++] = _[d++];
                        while (--c);
                        if (d = 0, y < v) {
                          c = y, v -= c;
                          do
                            b[n++] = _[d++];
                          while (--c);
                          d = n - D, A = b;
                        }
                      }
                    } else if (d += y - c, c < v) {
                      v -= c;
                      do
                        b[n++] = _[d++];
                      while (--c);
                      d = n - D, A = b;
                    }
                    for (; v > 2; )
                      b[n++] = A[d++], b[n++] = A[d++], b[n++] = A[d++], v -= 3;
                    v && (b[n++] = A[d++], v > 1 && (b[n++] = A[d++]));
                  } else {
                    d = n - D;
                    do
                      b[n++] = b[d++], b[n++] = b[d++], b[n++] = b[d++], v -= 3;
                    while (v > 2);
                    v && (b[n++] = b[d++], v > 1 && (b[n++] = b[d++]));
                  }
                } else if (c & 64) {
                  i.msg = "invalid distance code", k.mode = P;
                  break e;
                } else {
                  g = E[(g & 65535) + (r & (1 << c) - 1)];
                  continue i;
                }
                break;
              }
          } else if (c & 64)
            if (c & 32) {
              k.mode = yt;
              break e;
            } else {
              i.msg = "invalid literal/length code", k.mode = P;
              break e;
            }
          else {
            g = T[(g & 65535) + (r & (1 << c) - 1)];
            continue t;
          }
          break;
        }
    } while (l < f && n < s);
  v = u >> 3, l -= v, u -= v << 3, r &= (1 << u) - 1, i.next_in = l, i.next_out = n, i.avail_in = l < f ? 5 + (f - l) : 5 - (l - f), i.avail_out = n < s ? 257 + (s - n) : 257 - (n - s), k.hold = r, k.bits = u;
};
const L = 15, ce = 852, he = 592, de = 0, W = 1, ue = 2, Dt = new Uint16Array([
  /* Length codes 257..285 base */
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
]), Zt = new Uint8Array([
  /* Length codes 257..285 extra */
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
]), It = new Uint16Array([
  /* Distance codes 0..29 base */
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
]), Ot = new Uint8Array([
  /* Distance codes 0..29 extra */
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
]), mt = (t, i, e, l, f, n, h, s) => {
  const x = s.bits;
  let a = 0, o = 0, y = 0, _ = 0, r = 0, u = 0, T = 0, E = 0, w = 0, p = 0, g, c, v, D, d, A = null, R = 0, b;
  const k = new Uint16Array(L + 1), N = new Uint16Array(L + 1);
  let F = null, re = 0, fe, B, G;
  for (a = 0; a <= L; a++)
    k[a] = 0;
  for (o = 0; o < l; o++)
    k[i[e + o]]++;
  for (r = x, _ = L; _ >= 1 && k[_] === 0; _--)
    ;
  if (r > _ && (r = _), _ === 0)
    return f[n++] = 1 << 24 | 64 << 16 | 0, f[n++] = 1 << 24 | 64 << 16 | 0, s.bits = 1, 0;
  for (y = 1; y < _ && k[y] === 0; y++)
    ;
  for (r < y && (r = y), E = 1, a = 1; a <= L; a++)
    if (E <<= 1, E -= k[a], E < 0)
      return -1;
  if (E > 0 && (t === de || _ !== 1))
    return -1;
  for (N[1] = 0, a = 1; a < L; a++)
    N[a + 1] = N[a] + k[a];
  for (o = 0; o < l; o++)
    i[e + o] !== 0 && (h[N[i[e + o]]++] = o);
  if (t === de ? (A = F = h, b = 19) : t === W ? (A = Dt, R -= 257, F = Zt, re -= 257, b = 256) : (A = It, F = Ot, b = -1), p = 0, o = 0, a = y, d = n, u = r, T = 0, v = -1, w = 1 << r, D = w - 1, t === W && w > ce || t === ue && w > he)
    return 1;
  for (; ; ) {
    fe = a - T, h[o] < b ? (B = 0, G = h[o]) : h[o] > b ? (B = F[re + h[o]], G = A[R + h[o]]) : (B = 96, G = 0), g = 1 << a - T, c = 1 << u, y = c;
    do
      c -= g, f[d + (p >> T) + c] = fe << 24 | B << 16 | G | 0;
    while (c !== 0);
    for (g = 1 << a - 1; p & g; )
      g >>= 1;
    if (g !== 0 ? (p &= g - 1, p += g) : p = 0, o++, --k[a] === 0) {
      if (a === _)
        break;
      a = i[e + h[o]];
    }
    if (a > r && (p & D) !== v) {
      for (T === 0 && (T = r), d += y, u = a - T, E = 1 << u; u + T < _ && (E -= k[u + T], !(E <= 0)); )
        u++, E <<= 1;
      if (w += 1 << u, t === W && w > ce || t === ue && w > he)
        return 1;
      v = p & D, f[v] = r << 24 | u << 16 | d - n | 0;
    }
  }
  return p !== 0 && (f[d + p] = a - T << 24 | 64 << 16 | 0), s.bits = r, 0;
};
var M = mt;
const Nt = 0, Pe = 1, Ke = 2, {
  Z_FINISH: _e,
  Z_BLOCK: Ct,
  Z_TREES: K,
  Z_OK: C,
  Z_STREAM_END: Lt,
  Z_NEED_DICT: Ut,
  Z_STREAM_ERROR: Z,
  Z_DATA_ERROR: Ye,
  Z_MEM_ERROR: Xe,
  Z_BUF_ERROR: Mt,
  Z_DEFLATED: we
} = le, je = 1, be = 2, ke = 3, ge = 4, Ee = 5, ve = 6, pe = 7, xe = 8, Re = 9, Ae = 10, j = 11, O = 12, J = 13, Se = 14, Q = 15, ye = 16, Te = 17, De = 18, Ze = 19, Y = 20, X = 21, Ie = 22, Oe = 23, me = 24, Ne = 25, Ce = 26, V = 27, Le = 28, Ue = 29, S = 30, We = 31, $t = 32, zt = 852, Ht = 592, Ft = 15, Bt = Ft, Me = (t) => (t >>> 24 & 255) + (t >>> 8 & 65280) + ((t & 65280) << 8) + ((t & 255) << 24);
function Gt() {
  this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
const Je = (t) => {
  if (!t || !t.state)
    return Z;
  const i = t.state;
  return t.total_in = t.total_out = i.total = 0, t.msg = "", i.wrap && (t.adler = i.wrap & 1), i.mode = je, i.last = 0, i.havedict = 0, i.dmax = 32768, i.head = null, i.hold = 0, i.bits = 0, i.lencode = i.lendyn = new Int32Array(zt), i.distcode = i.distdyn = new Int32Array(Ht), i.sane = 1, i.back = -1, C;
}, Qe = (t) => {
  if (!t || !t.state)
    return Z;
  const i = t.state;
  return i.wsize = 0, i.whave = 0, i.wnext = 0, Je(t);
}, Ve = (t, i) => {
  let e;
  if (!t || !t.state)
    return Z;
  const l = t.state;
  return i < 0 ? (e = 0, i = -i) : (e = (i >> 4) + 1, i < 48 && (i &= 15)), i && (i < 8 || i > 15) ? Z : (l.window !== null && l.wbits !== i && (l.window = null), l.wrap = e, l.wbits = i, Qe(t));
}, qe = (t, i) => {
  if (!t)
    return Z;
  const e = new Gt();
  t.state = e, e.window = null;
  const l = Ve(t, i);
  return l !== C && (t.state = null), l;
}, Pt = (t) => qe(t, Bt);
let $e = !0, q, ee;
const Kt = (t) => {
  if ($e) {
    q = new Int32Array(512), ee = new Int32Array(32);
    let i = 0;
    for (; i < 144; )
      t.lens[i++] = 8;
    for (; i < 256; )
      t.lens[i++] = 9;
    for (; i < 280; )
      t.lens[i++] = 7;
    for (; i < 288; )
      t.lens[i++] = 8;
    for (M(Pe, t.lens, 0, 288, q, 0, t.work, { bits: 9 }), i = 0; i < 32; )
      t.lens[i++] = 5;
    M(Ke, t.lens, 0, 32, ee, 0, t.work, { bits: 5 }), $e = !1;
  }
  t.lencode = q, t.lenbits = 9, t.distcode = ee, t.distbits = 5;
}, et = (t, i, e, l) => {
  let f;
  const n = t.state;
  return n.window === null && (n.wsize = 1 << n.wbits, n.wnext = 0, n.whave = 0, n.window = new Uint8Array(n.wsize)), l >= n.wsize ? (n.window.set(i.subarray(e - n.wsize, e), 0), n.wnext = 0, n.whave = n.wsize) : (f = n.wsize - n.wnext, f > l && (f = l), n.window.set(i.subarray(e - l, e - l + f), n.wnext), l -= f, l ? (n.window.set(i.subarray(e - l, e), 0), n.wnext = l, n.whave = n.wsize) : (n.wnext += f, n.wnext === n.wsize && (n.wnext = 0), n.whave < n.wsize && (n.whave += f))), 0;
}, Yt = (t, i) => {
  let e, l, f, n, h, s, x, a, o, y, _, r, u, T, E = 0, w, p, g, c, v, D, d, A;
  const R = new Uint8Array(4);
  let b, k;
  const N = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (!t || !t.state || !t.output || !t.input && t.avail_in !== 0)
    return Z;
  e = t.state, e.mode === O && (e.mode = J), h = t.next_out, f = t.output, x = t.avail_out, n = t.next_in, l = t.input, s = t.avail_in, a = e.hold, o = e.bits, y = s, _ = x, A = C;
  e:
    for (; ; )
      switch (e.mode) {
        case je:
          if (e.wrap === 0) {
            e.mode = J;
            break;
          }
          for (; o < 16; ) {
            if (s === 0)
              break e;
            s--, a += l[n++] << o, o += 8;
          }
          if (e.wrap & 2 && a === 35615) {
            e.check = 0, R[0] = a & 255, R[1] = a >>> 8 & 255, e.check = I(e.check, R, 2, 0), a = 0, o = 0, e.mode = be;
            break;
          }
          if (e.flags = 0, e.head && (e.head.done = !1), !(e.wrap & 1) || /* check if zlib header allowed */
          (((a & 255) << 8) + (a >> 8)) % 31) {
            t.msg = "incorrect header check", e.mode = S;
            break;
          }
          if ((a & 15) !== we) {
            t.msg = "unknown compression method", e.mode = S;
            break;
          }
          if (a >>>= 4, o -= 4, d = (a & 15) + 8, e.wbits === 0)
            e.wbits = d;
          else if (d > e.wbits) {
            t.msg = "invalid window size", e.mode = S;
            break;
          }
          e.dmax = 1 << e.wbits, t.adler = e.check = 1, e.mode = a & 512 ? Ae : O, a = 0, o = 0;
          break;
        case be:
          for (; o < 16; ) {
            if (s === 0)
              break e;
            s--, a += l[n++] << o, o += 8;
          }
          if (e.flags = a, (e.flags & 255) !== we) {
            t.msg = "unknown compression method", e.mode = S;
            break;
          }
          if (e.flags & 57344) {
            t.msg = "unknown header flags set", e.mode = S;
            break;
          }
          e.head && (e.head.text = a >> 8 & 1), e.flags & 512 && (R[0] = a & 255, R[1] = a >>> 8 & 255, e.check = I(e.check, R, 2, 0)), a = 0, o = 0, e.mode = ke;
        case ke:
          for (; o < 32; ) {
            if (s === 0)
              break e;
            s--, a += l[n++] << o, o += 8;
          }
          e.head && (e.head.time = a), e.flags & 512 && (R[0] = a & 255, R[1] = a >>> 8 & 255, R[2] = a >>> 16 & 255, R[3] = a >>> 24 & 255, e.check = I(e.check, R, 4, 0)), a = 0, o = 0, e.mode = ge;
        case ge:
          for (; o < 16; ) {
            if (s === 0)
              break e;
            s--, a += l[n++] << o, o += 8;
          }
          e.head && (e.head.xflags = a & 255, e.head.os = a >> 8), e.flags & 512 && (R[0] = a & 255, R[1] = a >>> 8 & 255, e.check = I(e.check, R, 2, 0)), a = 0, o = 0, e.mode = Ee;
        case Ee:
          if (e.flags & 1024) {
            for (; o < 16; ) {
              if (s === 0)
                break e;
              s--, a += l[n++] << o, o += 8;
            }
            e.length = a, e.head && (e.head.extra_len = a), e.flags & 512 && (R[0] = a & 255, R[1] = a >>> 8 & 255, e.check = I(e.check, R, 2, 0)), a = 0, o = 0;
          } else e.head && (e.head.extra = null);
          e.mode = ve;
        case ve:
          if (e.flags & 1024 && (r = e.length, r > s && (r = s), r && (e.head && (d = e.head.extra_len - e.length, e.head.extra || (e.head.extra = new Uint8Array(e.head.extra_len)), e.head.extra.set(
            l.subarray(
              n,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              n + r
            ),
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            d
          )), e.flags & 512 && (e.check = I(e.check, l, r, n)), s -= r, n += r, e.length -= r), e.length))
            break e;
          e.length = 0, e.mode = pe;
        case pe:
          if (e.flags & 2048) {
            if (s === 0)
              break e;
            r = 0;
            do
              d = l[n + r++], e.head && d && e.length < 65536 && (e.head.name += String.fromCharCode(d));
            while (d && r < s);
            if (e.flags & 512 && (e.check = I(e.check, l, r, n)), s -= r, n += r, d)
              break e;
          } else e.head && (e.head.name = null);
          e.length = 0, e.mode = xe;
        case xe:
          if (e.flags & 4096) {
            if (s === 0)
              break e;
            r = 0;
            do
              d = l[n + r++], e.head && d && e.length < 65536 && (e.head.comment += String.fromCharCode(d));
            while (d && r < s);
            if (e.flags & 512 && (e.check = I(e.check, l, r, n)), s -= r, n += r, d)
              break e;
          } else e.head && (e.head.comment = null);
          e.mode = Re;
        case Re:
          if (e.flags & 512) {
            for (; o < 16; ) {
              if (s === 0)
                break e;
              s--, a += l[n++] << o, o += 8;
            }
            if (a !== (e.check & 65535)) {
              t.msg = "header crc mismatch", e.mode = S;
              break;
            }
            a = 0, o = 0;
          }
          e.head && (e.head.hcrc = e.flags >> 9 & 1, e.head.done = !0), t.adler = e.check = 0, e.mode = O;
          break;
        case Ae:
          for (; o < 32; ) {
            if (s === 0)
              break e;
            s--, a += l[n++] << o, o += 8;
          }
          t.adler = e.check = Me(a), a = 0, o = 0, e.mode = j;
        case j:
          if (e.havedict === 0)
            return t.next_out = h, t.avail_out = x, t.next_in = n, t.avail_in = s, e.hold = a, e.bits = o, Ut;
          t.adler = e.check = 1, e.mode = O;
        case O:
          if (i === Ct || i === K)
            break e;
        case J:
          if (e.last) {
            a >>>= o & 7, o -= o & 7, e.mode = V;
            break;
          }
          for (; o < 3; ) {
            if (s === 0)
              break e;
            s--, a += l[n++] << o, o += 8;
          }
          switch (e.last = a & 1, a >>>= 1, o -= 1, a & 3) {
            case 0:
              e.mode = Se;
              break;
            case 1:
              if (Kt(e), e.mode = Y, i === K) {
                a >>>= 2, o -= 2;
                break e;
              }
              break;
            case 2:
              e.mode = Te;
              break;
            case 3:
              t.msg = "invalid block type", e.mode = S;
          }
          a >>>= 2, o -= 2;
          break;
        case Se:
          for (a >>>= o & 7, o -= o & 7; o < 32; ) {
            if (s === 0)
              break e;
            s--, a += l[n++] << o, o += 8;
          }
          if ((a & 65535) !== (a >>> 16 ^ 65535)) {
            t.msg = "invalid stored block lengths", e.mode = S;
            break;
          }
          if (e.length = a & 65535, a = 0, o = 0, e.mode = Q, i === K)
            break e;
        case Q:
          e.mode = ye;
        case ye:
          if (r = e.length, r) {
            if (r > s && (r = s), r > x && (r = x), r === 0)
              break e;
            f.set(l.subarray(n, n + r), h), s -= r, n += r, x -= r, h += r, e.length -= r;
            break;
          }
          e.mode = O;
          break;
        case Te:
          for (; o < 14; ) {
            if (s === 0)
              break e;
            s--, a += l[n++] << o, o += 8;
          }
          if (e.nlen = (a & 31) + 257, a >>>= 5, o -= 5, e.ndist = (a & 31) + 1, a >>>= 5, o -= 5, e.ncode = (a & 15) + 4, a >>>= 4, o -= 4, e.nlen > 286 || e.ndist > 30) {
            t.msg = "too many length or distance symbols", e.mode = S;
            break;
          }
          e.have = 0, e.mode = De;
        case De:
          for (; e.have < e.ncode; ) {
            for (; o < 3; ) {
              if (s === 0)
                break e;
              s--, a += l[n++] << o, o += 8;
            }
            e.lens[N[e.have++]] = a & 7, a >>>= 3, o -= 3;
          }
          for (; e.have < 19; )
            e.lens[N[e.have++]] = 0;
          if (e.lencode = e.lendyn, e.lenbits = 7, b = { bits: e.lenbits }, A = M(Nt, e.lens, 0, 19, e.lencode, 0, e.work, b), e.lenbits = b.bits, A) {
            t.msg = "invalid code lengths set", e.mode = S;
            break;
          }
          e.have = 0, e.mode = Ze;
        case Ze:
          for (; e.have < e.nlen + e.ndist; ) {
            for (; E = e.lencode[a & (1 << e.lenbits) - 1], w = E >>> 24, p = E >>> 16 & 255, g = E & 65535, !(w <= o); ) {
              if (s === 0)
                break e;
              s--, a += l[n++] << o, o += 8;
            }
            if (g < 16)
              a >>>= w, o -= w, e.lens[e.have++] = g;
            else {
              if (g === 16) {
                for (k = w + 2; o < k; ) {
                  if (s === 0)
                    break e;
                  s--, a += l[n++] << o, o += 8;
                }
                if (a >>>= w, o -= w, e.have === 0) {
                  t.msg = "invalid bit length repeat", e.mode = S;
                  break;
                }
                d = e.lens[e.have - 1], r = 3 + (a & 3), a >>>= 2, o -= 2;
              } else if (g === 17) {
                for (k = w + 3; o < k; ) {
                  if (s === 0)
                    break e;
                  s--, a += l[n++] << o, o += 8;
                }
                a >>>= w, o -= w, d = 0, r = 3 + (a & 7), a >>>= 3, o -= 3;
              } else {
                for (k = w + 7; o < k; ) {
                  if (s === 0)
                    break e;
                  s--, a += l[n++] << o, o += 8;
                }
                a >>>= w, o -= w, d = 0, r = 11 + (a & 127), a >>>= 7, o -= 7;
              }
              if (e.have + r > e.nlen + e.ndist) {
                t.msg = "invalid bit length repeat", e.mode = S;
                break;
              }
              for (; r--; )
                e.lens[e.have++] = d;
            }
          }
          if (e.mode === S)
            break;
          if (e.lens[256] === 0) {
            t.msg = "invalid code -- missing end-of-block", e.mode = S;
            break;
          }
          if (e.lenbits = 9, b = { bits: e.lenbits }, A = M(Pe, e.lens, 0, e.nlen, e.lencode, 0, e.work, b), e.lenbits = b.bits, A) {
            t.msg = "invalid literal/lengths set", e.mode = S;
            break;
          }
          if (e.distbits = 6, e.distcode = e.distdyn, b = { bits: e.distbits }, A = M(Ke, e.lens, e.nlen, e.ndist, e.distcode, 0, e.work, b), e.distbits = b.bits, A) {
            t.msg = "invalid distances set", e.mode = S;
            break;
          }
          if (e.mode = Y, i === K)
            break e;
        case Y:
          e.mode = X;
        case X:
          if (s >= 6 && x >= 258) {
            t.next_out = h, t.avail_out = x, t.next_in = n, t.avail_in = s, e.hold = a, e.bits = o, Tt(t, _), h = t.next_out, f = t.output, x = t.avail_out, n = t.next_in, l = t.input, s = t.avail_in, a = e.hold, o = e.bits, e.mode === O && (e.back = -1);
            break;
          }
          for (e.back = 0; E = e.lencode[a & (1 << e.lenbits) - 1], w = E >>> 24, p = E >>> 16 & 255, g = E & 65535, !(w <= o); ) {
            if (s === 0)
              break e;
            s--, a += l[n++] << o, o += 8;
          }
          if (p && !(p & 240)) {
            for (c = w, v = p, D = g; E = e.lencode[D + ((a & (1 << c + v) - 1) >> c)], w = E >>> 24, p = E >>> 16 & 255, g = E & 65535, !(c + w <= o); ) {
              if (s === 0)
                break e;
              s--, a += l[n++] << o, o += 8;
            }
            a >>>= c, o -= c, e.back += c;
          }
          if (a >>>= w, o -= w, e.back += w, e.length = g, p === 0) {
            e.mode = Ce;
            break;
          }
          if (p & 32) {
            e.back = -1, e.mode = O;
            break;
          }
          if (p & 64) {
            t.msg = "invalid literal/length code", e.mode = S;
            break;
          }
          e.extra = p & 15, e.mode = Ie;
        case Ie:
          if (e.extra) {
            for (k = e.extra; o < k; ) {
              if (s === 0)
                break e;
              s--, a += l[n++] << o, o += 8;
            }
            e.length += a & (1 << e.extra) - 1, a >>>= e.extra, o -= e.extra, e.back += e.extra;
          }
          e.was = e.length, e.mode = Oe;
        case Oe:
          for (; E = e.distcode[a & (1 << e.distbits) - 1], w = E >>> 24, p = E >>> 16 & 255, g = E & 65535, !(w <= o); ) {
            if (s === 0)
              break e;
            s--, a += l[n++] << o, o += 8;
          }
          if (!(p & 240)) {
            for (c = w, v = p, D = g; E = e.distcode[D + ((a & (1 << c + v) - 1) >> c)], w = E >>> 24, p = E >>> 16 & 255, g = E & 65535, !(c + w <= o); ) {
              if (s === 0)
                break e;
              s--, a += l[n++] << o, o += 8;
            }
            a >>>= c, o -= c, e.back += c;
          }
          if (a >>>= w, o -= w, e.back += w, p & 64) {
            t.msg = "invalid distance code", e.mode = S;
            break;
          }
          e.offset = g, e.extra = p & 15, e.mode = me;
        case me:
          if (e.extra) {
            for (k = e.extra; o < k; ) {
              if (s === 0)
                break e;
              s--, a += l[n++] << o, o += 8;
            }
            e.offset += a & (1 << e.extra) - 1, a >>>= e.extra, o -= e.extra, e.back += e.extra;
          }
          if (e.offset > e.dmax) {
            t.msg = "invalid distance too far back", e.mode = S;
            break;
          }
          e.mode = Ne;
        case Ne:
          if (x === 0)
            break e;
          if (r = _ - x, e.offset > r) {
            if (r = e.offset - r, r > e.whave && e.sane) {
              t.msg = "invalid distance too far back", e.mode = S;
              break;
            }
            r > e.wnext ? (r -= e.wnext, u = e.wsize - r) : u = e.wnext - r, r > e.length && (r = e.length), T = e.window;
          } else
            T = f, u = h - e.offset, r = e.length;
          r > x && (r = x), x -= r, e.length -= r;
          do
            f[h++] = T[u++];
          while (--r);
          e.length === 0 && (e.mode = X);
          break;
        case Ce:
          if (x === 0)
            break e;
          f[h++] = e.length, x--, e.mode = X;
          break;
        case V:
          if (e.wrap) {
            for (; o < 32; ) {
              if (s === 0)
                break e;
              s--, a |= l[n++] << o, o += 8;
            }
            if (_ -= x, t.total_out += _, e.total += _, _ && (t.adler = e.check = /*UPDATE(state.check, put - _out, _out);*/
            e.flags ? I(e.check, f, _, h - _) : ne(e.check, f, _, h - _)), _ = x, (e.flags ? a : Me(a)) !== e.check) {
              t.msg = "incorrect data check", e.mode = S;
              break;
            }
            a = 0, o = 0;
          }
          e.mode = Le;
        case Le:
          if (e.wrap && e.flags) {
            for (; o < 32; ) {
              if (s === 0)
                break e;
              s--, a += l[n++] << o, o += 8;
            }
            if (a !== (e.total & 4294967295)) {
              t.msg = "incorrect length check", e.mode = S;
              break;
            }
            a = 0, o = 0;
          }
          e.mode = Ue;
        case Ue:
          A = Lt;
          break e;
        case S:
          A = Ye;
          break e;
        case We:
          return Xe;
        case $t:
        default:
          return Z;
      }
  return t.next_out = h, t.avail_out = x, t.next_in = n, t.avail_in = s, e.hold = a, e.bits = o, (e.wsize || _ !== t.avail_out && e.mode < S && (e.mode < V || i !== _e)) && et(t, t.output, t.next_out, _ - t.avail_out), y -= t.avail_in, _ -= t.avail_out, t.total_in += y, t.total_out += _, e.total += _, e.wrap && _ && (t.adler = e.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
  e.flags ? I(e.check, f, _, t.next_out - _) : ne(e.check, f, _, t.next_out - _)), t.data_type = e.bits + (e.last ? 64 : 0) + (e.mode === O ? 128 : 0) + (e.mode === Y || e.mode === Q ? 256 : 0), (y === 0 && _ === 0 || i === _e) && A === C && (A = Mt), A;
}, Xt = (t) => {
  if (!t || !t.state)
    return Z;
  let i = t.state;
  return i.window && (i.window = null), t.state = null, C;
}, jt = (t, i) => {
  if (!t || !t.state)
    return Z;
  const e = t.state;
  return e.wrap & 2 ? (e.head = i, i.done = !1, C) : Z;
}, Wt = (t, i) => {
  const e = i.length;
  let l, f, n;
  return !t || !t.state || (l = t.state, l.wrap !== 0 && l.mode !== j) ? Z : l.mode === j && (f = 1, f = ne(f, i, e, 0), f !== l.check) ? Ye : (n = et(t, i, e, e), n ? (l.mode = We, Xe) : (l.havedict = 1, C));
};
var Jt = Qe, Qt = Ve, Vt = Je, qt = Pt, ei = qe, ti = Yt, ii = Xt, ni = jt, ai = Wt, oi = "pako inflate (from Nodeca project)", m = {
  inflateReset: Jt,
  inflateReset2: Qt,
  inflateResetKeep: Vt,
  inflateInit: qt,
  inflateInit2: ei,
  inflate: ti,
  inflateEnd: ii,
  inflateGetHeader: ni,
  inflateSetDictionary: ai,
  inflateInfo: oi
};
function li() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var si = li;
const tt = Object.prototype.toString, {
  Z_NO_FLUSH: ri,
  Z_FINISH: fi,
  Z_OK: z,
  Z_STREAM_END: te,
  Z_NEED_DICT: ie,
  Z_STREAM_ERROR: ci,
  Z_DATA_ERROR: ze,
  Z_MEM_ERROR: hi
} = le;
function H(t) {
  this.options = Be.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, t || {});
  const i = this.options;
  i.raw && i.windowBits >= 0 && i.windowBits < 16 && (i.windowBits = -i.windowBits, i.windowBits === 0 && (i.windowBits = -15)), i.windowBits >= 0 && i.windowBits < 16 && !(t && t.windowBits) && (i.windowBits += 32), i.windowBits > 15 && i.windowBits < 48 && (i.windowBits & 15 || (i.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new St(), this.strm.avail_out = 0;
  let e = m.inflateInit2(
    this.strm,
    i.windowBits
  );
  if (e !== z)
    throw new Error(ae[e]);
  if (this.header = new si(), m.inflateGetHeader(this.strm, this.header), i.dictionary && (typeof i.dictionary == "string" ? i.dictionary = oe.string2buf(i.dictionary) : tt.call(i.dictionary) === "[object ArrayBuffer]" && (i.dictionary = new Uint8Array(i.dictionary)), i.raw && (e = m.inflateSetDictionary(this.strm, i.dictionary), e !== z)))
    throw new Error(ae[e]);
}
H.prototype.push = function(t, i) {
  const e = this.strm, l = this.options.chunkSize, f = this.options.dictionary;
  let n, h, s;
  if (this.ended)
    return !1;
  for (i === ~~i ? h = i : h = i === !0 ? fi : ri, tt.call(t) === "[object ArrayBuffer]" ? e.input = new Uint8Array(t) : e.input = t, e.next_in = 0, e.avail_in = e.input.length; ; ) {
    for (e.avail_out === 0 && (e.output = new Uint8Array(l), e.next_out = 0, e.avail_out = l), n = m.inflate(e, h), n === ie && f && (n = m.inflateSetDictionary(e, f), n === z ? n = m.inflate(e, h) : n === ze && (n = ie)); e.avail_in > 0 && n === te && e.state.wrap > 0 && t[e.next_in] !== 0; )
      m.inflateReset(e), n = m.inflate(e, h);
    switch (n) {
      case ci:
      case ze:
      case ie:
      case hi:
        return this.onEnd(n), this.ended = !0, !1;
    }
    if (s = e.avail_out, e.next_out && (e.avail_out === 0 || n === te))
      if (this.options.to === "string") {
        let x = oe.utf8border(e.output, e.next_out), a = e.next_out - x, o = oe.buf2string(e.output, x);
        e.next_out = a, e.avail_out = l - a, a && e.output.set(e.output.subarray(x, x + a), 0), this.onData(o);
      } else
        this.onData(e.output.length === e.next_out ? e.output : e.output.subarray(0, e.next_out));
    if (!(n === z && s === 0)) {
      if (n === te)
        return n = m.inflateEnd(this.strm), this.onEnd(n), this.ended = !0, !0;
      if (e.avail_in === 0)
        break;
    }
  }
  return !0;
};
H.prototype.onData = function(t) {
  this.chunks.push(t);
};
H.prototype.onEnd = function(t) {
  t === z && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = Be.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
};
function se(t, i) {
  const e = new H(i);
  if (e.push(t), e.err)
    throw e.msg || ae[e.err];
  return e.result;
}
function di(t, i) {
  return i = i || {}, i.raw = !0, se(t, i);
}
var ui = H, _i = se, wi = di, bi = se, ki = le, gi = {
  Inflate: ui,
  inflate: _i,
  inflateRaw: wi,
  ungzip: bi,
  constants: ki
};
const { Inflate: vi, inflate: Ei, inflateRaw: pi, ungzip: xi } = gi;
var Ri = Ei;
export {
  Ri as i
};
