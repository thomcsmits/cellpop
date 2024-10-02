import { i as fe } from "./pako.esm-68f84e2a-DFzjKZhZ.js";
import { B as se, g as le } from "./index-DYh2V44F.js";
import "react";
const oe = {
  Version: 0,
  AddCompression: 1
}, re = {
  None: 0,
  Deflate: 1
};
var ie = { exports: {} };
(function($) {
  /* Copyright 2015-2021 Esri. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 @preserve */
  (function() {
    var Y = function() {
      var C = {};
      C.defaultNoDataValue = -34027999387901484e22, C.decode = function(r, o) {
        o = o || {};
        var a = o.encodedMaskData || o.encodedMaskData === null, i = f(r, o.inputOffset || 0, a), m = o.noDataValue !== null ? o.noDataValue : C.defaultNoDataValue, n = A(
          i,
          o.pixelType || Float32Array,
          o.encodedMaskData,
          m,
          o.returnMask
        ), t = {
          width: i.width,
          height: i.height,
          pixelData: n.resultPixels,
          minValue: n.minValue,
          maxValue: i.pixels.maxValue,
          noDataValue: m
        };
        return n.resultMask && (t.maskData = n.resultMask), o.returnEncodedMask && i.mask && (t.encodedMaskData = i.mask.bitset ? i.mask.bitset : null), o.returnFileInfo && (t.fileInfo = X(i), o.computeUsedBitDepths && (t.fileInfo.bitDepths = R(i))), t;
      };
      var A = function(r, o, a, i, m) {
        var n = 0, t = r.pixels.numBlocksX, v = r.pixels.numBlocksY, u = Math.floor(r.width / t), h = Math.floor(r.height / v), g = 2 * r.maxZError, l = Number.MAX_VALUE, s;
        a = a || (r.mask ? r.mask.bitset : null);
        var w, x;
        w = new o(r.width * r.height), m && a && (x = new Uint8Array(r.width * r.height));
        for (var D = new Float32Array(u * h), d, M, k = 0; k <= v; k++) {
          var L = k !== v ? h : r.height % v;
          if (L !== 0)
            for (var p = 0; p <= t; p++) {
              var c = p !== t ? u : r.width % t;
              if (c !== 0) {
                var U = k * r.width * h + p * u, I = r.width - c, y = r.pixels.blocks[n], T, V, S;
                y.encoding < 2 ? (y.encoding === 0 ? T = y.rawData : (e(y.stuffedData, y.bitsPerPixel, y.numValidPixels, y.offset, g, D, r.pixels.maxValue), T = D), V = 0) : y.encoding === 2 ? S = 0 : S = y.offset;
                var B;
                if (a)
                  for (M = 0; M < L; M++) {
                    for (U & 7 && (B = a[U >> 3], B <<= U & 7), d = 0; d < c; d++)
                      U & 7 || (B = a[U >> 3]), B & 128 ? (x && (x[U] = 1), s = y.encoding < 2 ? T[V++] : S, l = l > s ? s : l, w[U++] = s) : (x && (x[U] = 0), w[U++] = i), B <<= 1;
                    U += I;
                  }
                else if (y.encoding < 2)
                  for (M = 0; M < L; M++) {
                    for (d = 0; d < c; d++)
                      s = T[V++], l = l > s ? s : l, w[U++] = s;
                    U += I;
                  }
                else
                  for (l = l > S ? S : l, M = 0; M < L; M++) {
                    for (d = 0; d < c; d++)
                      w[U++] = S;
                    U += I;
                  }
                if (y.encoding === 1 && V !== y.numValidPixels)
                  throw "Block and Mask do not match";
                n++;
              }
            }
        }
        return {
          resultPixels: w,
          resultMask: x,
          minValue: l
        };
      }, X = function(r) {
        return {
          fileIdentifierString: r.fileIdentifierString,
          fileVersion: r.fileVersion,
          imageType: r.imageType,
          height: r.height,
          width: r.width,
          maxZError: r.maxZError,
          eofOffset: r.eofOffset,
          mask: r.mask ? {
            numBlocksX: r.mask.numBlocksX,
            numBlocksY: r.mask.numBlocksY,
            numBytes: r.mask.numBytes,
            maxValue: r.mask.maxValue
          } : null,
          pixels: {
            numBlocksX: r.pixels.numBlocksX,
            numBlocksY: r.pixels.numBlocksY,
            numBytes: r.pixels.numBytes,
            maxValue: r.pixels.maxValue,
            noDataValue: r.noDataValue
          }
        };
      }, R = function(r) {
        for (var o = r.pixels.numBlocksX * r.pixels.numBlocksY, a = {}, i = 0; i < o; i++) {
          var m = r.pixels.blocks[i];
          m.encoding === 0 ? a.float32 = !0 : m.encoding === 1 ? a[m.bitsPerPixel] = !0 : a[0] = !0;
        }
        return Object.keys(a);
      }, f = function(r, o, a) {
        var i = {}, m = new Uint8Array(r, o, 10);
        if (i.fileIdentifierString = String.fromCharCode.apply(null, m), i.fileIdentifierString.trim() !== "CntZImage")
          throw "Unexpected file identifier string: " + i.fileIdentifierString;
        o += 10;
        var n = new DataView(r, o, 24);
        if (i.fileVersion = n.getInt32(0, !0), i.imageType = n.getInt32(4, !0), i.height = n.getUint32(8, !0), i.width = n.getUint32(12, !0), i.maxZError = n.getFloat64(16, !0), o += 24, !a)
          if (n = new DataView(r, o, 16), i.mask = {}, i.mask.numBlocksY = n.getUint32(0, !0), i.mask.numBlocksX = n.getUint32(4, !0), i.mask.numBytes = n.getUint32(8, !0), i.mask.maxValue = n.getFloat32(12, !0), o += 16, i.mask.numBytes > 0) {
            var t = new Uint8Array(Math.ceil(i.width * i.height / 8));
            n = new DataView(r, o, i.mask.numBytes);
            var v = n.getInt16(0, !0), u = 2, h = 0;
            do {
              if (v > 0)
                for (; v--; )
                  t[h++] = n.getUint8(u++);
              else {
                var g = n.getUint8(u++);
                for (v = -v; v--; )
                  t[h++] = g;
              }
              v = n.getInt16(u, !0), u += 2;
            } while (u < i.mask.numBytes);
            if (v !== -32768 || h < t.length)
              throw "Unexpected end of mask RLE encoding";
            i.mask.bitset = t, o += i.mask.numBytes;
          } else i.mask.numBytes | i.mask.numBlocksY | i.mask.maxValue || (i.mask.bitset = new Uint8Array(Math.ceil(i.width * i.height / 8)));
        n = new DataView(r, o, 16), i.pixels = {}, i.pixels.numBlocksY = n.getUint32(0, !0), i.pixels.numBlocksX = n.getUint32(4, !0), i.pixels.numBytes = n.getUint32(8, !0), i.pixels.maxValue = n.getFloat32(12, !0), o += 16;
        var l = i.pixels.numBlocksX, s = i.pixels.numBlocksY, w = l + (i.width % l > 0 ? 1 : 0), x = s + (i.height % s > 0 ? 1 : 0);
        i.pixels.blocks = new Array(w * x);
        for (var D = 0, d = 0; d < x; d++)
          for (var M = 0; M < w; M++) {
            var k = 0, L = r.byteLength - o;
            n = new DataView(r, o, Math.min(10, L));
            var p = {};
            i.pixels.blocks[D++] = p;
            var c = n.getUint8(0);
            if (k++, p.encoding = c & 63, p.encoding > 3)
              throw "Invalid block encoding (" + p.encoding + ")";
            if (p.encoding === 2) {
              o++;
              continue;
            }
            if (c !== 0 && c !== 2) {
              if (c >>= 6, p.offsetType = c, c === 2)
                p.offset = n.getInt8(1), k++;
              else if (c === 1)
                p.offset = n.getInt16(1, !0), k += 2;
              else if (c === 0)
                p.offset = n.getFloat32(1, !0), k += 4;
              else
                throw "Invalid block offset type";
              if (p.encoding === 1)
                if (c = n.getUint8(k), k++, p.bitsPerPixel = c & 63, c >>= 6, p.numValidPixelsType = c, c === 2)
                  p.numValidPixels = n.getUint8(k), k++;
                else if (c === 1)
                  p.numValidPixels = n.getUint16(k, !0), k += 2;
                else if (c === 0)
                  p.numValidPixels = n.getUint32(k, !0), k += 4;
                else
                  throw "Invalid valid pixel count type";
            }
            if (o += k, p.encoding !== 3) {
              var U, I;
              if (p.encoding === 0) {
                var y = (i.pixels.numBytes - 1) / 4;
                if (y !== Math.floor(y))
                  throw "uncompressed block has invalid length";
                U = new ArrayBuffer(y * 4), I = new Uint8Array(U), I.set(new Uint8Array(r, o, y * 4));
                var T = new Float32Array(U);
                p.rawData = T, o += y * 4;
              } else if (p.encoding === 1) {
                var V = Math.ceil(p.numValidPixels * p.bitsPerPixel / 8), S = Math.ceil(V / 4);
                U = new ArrayBuffer(S * 4), I = new Uint8Array(U), I.set(new Uint8Array(r, o, V)), p.stuffedData = new Uint32Array(U), o += V;
              }
            }
          }
        return i.eofOffset = o, i;
      }, e = function(r, o, a, i, m, n, t) {
        var v = (1 << o) - 1, u = 0, h, g = 0, l, s, w = Math.ceil((t - i) / m), x = r.length * 4 - Math.ceil(o * a / 8);
        for (r[r.length - 1] <<= 8 * x, h = 0; h < a; h++) {
          if (g === 0 && (s = r[u++], g = 32), g >= o)
            l = s >>> g - o & v, g -= o;
          else {
            var D = o - g;
            l = (s & v) << D & v, s = r[u++], g = 32 - D, l += s >>> g;
          }
          n[h] = l < w ? i + l * m : t;
        }
        return n;
      };
      return C;
    }(), K = /* @__PURE__ */ function() {
      var C = {
        //methods ending with 2 are for the new byte order used by Lerc2.3 and above.
        //originalUnstuff is used to unpack Huffman code table. code is duplicated to unstuffx for performance reasons.
        unstuff: function(f, e, r, o, a, i, m, n) {
          var t = (1 << r) - 1, v = 0, u, h = 0, g, l, s, w, x = f.length * 4 - Math.ceil(r * o / 8);
          if (f[f.length - 1] <<= 8 * x, a)
            for (u = 0; u < o; u++)
              h === 0 && (l = f[v++], h = 32), h >= r ? (g = l >>> h - r & t, h -= r) : (s = r - h, g = (l & t) << s & t, l = f[v++], h = 32 - s, g += l >>> h), e[u] = a[g];
          else
            for (w = Math.ceil((n - i) / m), u = 0; u < o; u++)
              h === 0 && (l = f[v++], h = 32), h >= r ? (g = l >>> h - r & t, h -= r) : (s = r - h, g = (l & t) << s & t, l = f[v++], h = 32 - s, g += l >>> h), e[u] = g < w ? i + g * m : n;
        },
        unstuffLUT: function(f, e, r, o, a, i) {
          var m = (1 << e) - 1, n = 0, t = 0, v = 0, u = 0, h = 0, g, l = [], s = f.length * 4 - Math.ceil(e * r / 8);
          f[f.length - 1] <<= 8 * s;
          var w = Math.ceil((i - o) / a);
          for (t = 0; t < r; t++)
            u === 0 && (g = f[n++], u = 32), u >= e ? (h = g >>> u - e & m, u -= e) : (v = e - u, h = (g & m) << v & m, g = f[n++], u = 32 - v, h += g >>> u), l[t] = h < w ? o + h * a : i;
          return l.unshift(o), l;
        },
        unstuff2: function(f, e, r, o, a, i, m, n) {
          var t = (1 << r) - 1, v = 0, u, h = 0, g = 0, l, s, w;
          if (a)
            for (u = 0; u < o; u++)
              h === 0 && (s = f[v++], h = 32, g = 0), h >= r ? (l = s >>> g & t, h -= r, g += r) : (w = r - h, l = s >>> g & t, s = f[v++], h = 32 - w, l |= (s & (1 << w) - 1) << r - w, g = w), e[u] = a[l];
          else {
            var x = Math.ceil((n - i) / m);
            for (u = 0; u < o; u++)
              h === 0 && (s = f[v++], h = 32, g = 0), h >= r ? (l = s >>> g & t, h -= r, g += r) : (w = r - h, l = s >>> g & t, s = f[v++], h = 32 - w, l |= (s & (1 << w) - 1) << r - w, g = w), e[u] = l < x ? i + l * m : n;
          }
          return e;
        },
        unstuffLUT2: function(f, e, r, o, a, i) {
          var m = (1 << e) - 1, n = 0, t = 0, v = 0, u = 0, h = 0, g = 0, l, s = [], w = Math.ceil((i - o) / a);
          for (t = 0; t < r; t++)
            u === 0 && (l = f[n++], u = 32, g = 0), u >= e ? (h = l >>> g & m, u -= e, g += e) : (v = e - u, h = l >>> g & m, l = f[n++], u = 32 - v, h |= (l & (1 << v) - 1) << e - v, g = v), s[t] = h < w ? o + h * a : i;
          return s.unshift(o), s;
        },
        originalUnstuff: function(f, e, r, o) {
          var a = (1 << r) - 1, i = 0, m, n = 0, t, v, u, h = f.length * 4 - Math.ceil(r * o / 8);
          for (f[f.length - 1] <<= 8 * h, m = 0; m < o; m++)
            n === 0 && (v = f[i++], n = 32), n >= r ? (t = v >>> n - r & a, n -= r) : (u = r - n, t = (v & a) << u & a, v = f[i++], n = 32 - u, t += v >>> n), e[m] = t;
          return e;
        },
        originalUnstuff2: function(f, e, r, o) {
          var a = (1 << r) - 1, i = 0, m, n = 0, t = 0, v, u, h;
          for (m = 0; m < o; m++)
            n === 0 && (u = f[i++], n = 32, t = 0), n >= r ? (v = u >>> t & a, n -= r, t += r) : (h = r - n, v = u >>> t & a, u = f[i++], n = 32 - h, v |= (u & (1 << h) - 1) << r - h, t = h), e[m] = v;
          return e;
        }
      }, A = {
        HUFFMAN_LUT_BITS_MAX: 12,
        //use 2^12 lut, treat it like constant
        computeChecksumFletcher32: function(f) {
          for (var e = 65535, r = 65535, o = f.length, a = Math.floor(o / 2), i = 0; a; ) {
            var m = a >= 359 ? 359 : a;
            a -= m;
            do
              e += f[i++] << 8, r += e += f[i++];
            while (--m);
            e = (e & 65535) + (e >>> 16), r = (r & 65535) + (r >>> 16);
          }
          return o & 1 && (r += e += f[i] << 8), e = (e & 65535) + (e >>> 16), r = (r & 65535) + (r >>> 16), (r << 16 | e) >>> 0;
        },
        readHeaderInfo: function(f, e) {
          var r = e.ptr, o = new Uint8Array(f, r, 6), a = {};
          if (a.fileIdentifierString = String.fromCharCode.apply(null, o), a.fileIdentifierString.lastIndexOf("Lerc2", 0) !== 0)
            throw "Unexpected file identifier string (expect Lerc2 ): " + a.fileIdentifierString;
          r += 6;
          var i = new DataView(f, r, 8), m = i.getInt32(0, !0);
          a.fileVersion = m, r += 4, m >= 3 && (a.checksum = i.getUint32(4, !0), r += 4), i = new DataView(f, r, 12), a.height = i.getUint32(0, !0), a.width = i.getUint32(4, !0), r += 8, m >= 4 ? (a.numDims = i.getUint32(8, !0), r += 4) : a.numDims = 1, i = new DataView(f, r, 40), a.numValidPixel = i.getUint32(0, !0), a.microBlockSize = i.getInt32(4, !0), a.blobSize = i.getInt32(8, !0), a.imageType = i.getInt32(12, !0), a.maxZError = i.getFloat64(16, !0), a.zMin = i.getFloat64(24, !0), a.zMax = i.getFloat64(32, !0), r += 40, e.headerInfo = a, e.ptr = r;
          var n, t;
          if (m >= 3 && (t = m >= 4 ? 52 : 48, n = this.computeChecksumFletcher32(new Uint8Array(f, r - t, a.blobSize - 14)), n !== a.checksum))
            throw "Checksum failed.";
          return !0;
        },
        checkMinMaxRanges: function(f, e) {
          var r = e.headerInfo, o = this.getDataTypeArray(r.imageType), a = r.numDims * this.getDataTypeSize(r.imageType), i = this.readSubArray(f, e.ptr, o, a), m = this.readSubArray(f, e.ptr + a, o, a);
          e.ptr += 2 * a;
          var n, t = !0;
          for (n = 0; n < r.numDims; n++)
            if (i[n] !== m[n]) {
              t = !1;
              break;
            }
          return r.minValues = i, r.maxValues = m, t;
        },
        readSubArray: function(f, e, r, o) {
          var a;
          if (r === Uint8Array)
            a = new Uint8Array(f, e, o);
          else {
            var i = new ArrayBuffer(o), m = new Uint8Array(i);
            m.set(new Uint8Array(f, e, o)), a = new r(i);
          }
          return a;
        },
        readMask: function(f, e) {
          var r = e.ptr, o = e.headerInfo, a = o.width * o.height, i = o.numValidPixel, m = new DataView(f, r, 4), n = {};
          if (n.numBytes = m.getUint32(0, !0), r += 4, (i === 0 || a === i) && n.numBytes !== 0)
            throw "invalid mask";
          var t, v;
          if (i === 0)
            t = new Uint8Array(Math.ceil(a / 8)), n.bitset = t, v = new Uint8Array(a), e.pixels.resultMask = v, r += n.numBytes;
          else if (n.numBytes > 0) {
            t = new Uint8Array(Math.ceil(a / 8)), m = new DataView(f, r, n.numBytes);
            var u = m.getInt16(0, !0), h = 2, g = 0, l = 0;
            do {
              if (u > 0)
                for (; u--; )
                  t[g++] = m.getUint8(h++);
              else
                for (l = m.getUint8(h++), u = -u; u--; )
                  t[g++] = l;
              u = m.getInt16(h, !0), h += 2;
            } while (h < n.numBytes);
            if (u !== -32768 || g < t.length)
              throw "Unexpected end of mask RLE encoding";
            v = new Uint8Array(a);
            var s = 0, w = 0;
            for (w = 0; w < a; w++)
              w & 7 ? (s = t[w >> 3], s <<= w & 7) : s = t[w >> 3], s & 128 && (v[w] = 1);
            e.pixels.resultMask = v, n.bitset = t, r += n.numBytes;
          }
          return e.ptr = r, e.mask = n, !0;
        },
        readDataOneSweep: function(f, e, r, o) {
          var a = e.ptr, i = e.headerInfo, m = i.numDims, n = i.width * i.height, t = i.imageType, v = i.numValidPixel * A.getDataTypeSize(t) * m, u, h = e.pixels.resultMask;
          if (r === Uint8Array)
            u = new Uint8Array(f, a, v);
          else {
            var g = new ArrayBuffer(v), l = new Uint8Array(g);
            l.set(new Uint8Array(f, a, v)), u = new r(g);
          }
          if (u.length === n * m)
            o ? e.pixels.resultPixels = A.swapDimensionOrder(u, n, m, r, !0) : e.pixels.resultPixels = u;
          else {
            e.pixels.resultPixels = new r(n * m);
            var s = 0, w = 0, x = 0, D = 0;
            if (m > 1) {
              if (o) {
                for (w = 0; w < n; w++)
                  if (h[w])
                    for (D = w, x = 0; x < m; x++, D += n)
                      e.pixels.resultPixels[D] = u[s++];
              } else
                for (w = 0; w < n; w++)
                  if (h[w])
                    for (D = w * m, x = 0; x < m; x++)
                      e.pixels.resultPixels[D + x] = u[s++];
            } else
              for (w = 0; w < n; w++)
                h[w] && (e.pixels.resultPixels[w] = u[s++]);
          }
          return a += v, e.ptr = a, !0;
        },
        readHuffmanTree: function(f, e) {
          var r = this.HUFFMAN_LUT_BITS_MAX, o = new DataView(f, e.ptr, 16);
          e.ptr += 16;
          var a = o.getInt32(0, !0);
          if (a < 2)
            throw "unsupported Huffman version";
          var i = o.getInt32(4, !0), m = o.getInt32(8, !0), n = o.getInt32(12, !0);
          if (m >= n)
            return !1;
          var t = new Uint32Array(n - m);
          A.decodeBits(f, e, t);
          var v = [], u, h, g, l;
          for (u = m; u < n; u++)
            h = u - (u < i ? 0 : i), v[h] = { first: t[u - m], second: null };
          var s = f.byteLength - e.ptr, w = Math.ceil(s / 4), x = new ArrayBuffer(w * 4), D = new Uint8Array(x);
          D.set(new Uint8Array(f, e.ptr, s));
          var d = new Uint32Array(x), M = 0, k, L = 0;
          for (k = d[0], u = m; u < n; u++)
            h = u - (u < i ? 0 : i), l = v[h].first, l > 0 && (v[h].second = k << M >>> 32 - l, 32 - M >= l ? (M += l, M === 32 && (M = 0, L++, k = d[L])) : (M += l - 32, L++, k = d[L], v[h].second |= k >>> 32 - M));
          var p = 0, c = 0, U = new X();
          for (u = 0; u < v.length; u++)
            v[u] !== void 0 && (p = Math.max(p, v[u].first));
          p >= r ? c = r : c = p;
          var I = [], y, T, V, S, B, F;
          for (u = m; u < n; u++)
            if (h = u - (u < i ? 0 : i), l = v[h].first, l > 0)
              if (y = [l, h], l <= c)
                for (T = v[h].second << c - l, V = 1 << c - l, g = 0; g < V; g++)
                  I[T | g] = y;
              else
                for (T = v[h].second, F = U, S = l - 1; S >= 0; S--)
                  B = T >>> S & 1, B ? (F.right || (F.right = new X()), F = F.right) : (F.left || (F.left = new X()), F = F.left), S === 0 && !F.val && (F.val = y[1]);
          return {
            decodeLut: I,
            numBitsLUTQick: c,
            numBitsLUT: p,
            tree: U,
            stuffedData: d,
            srcPtr: L,
            bitPos: M
          };
        },
        readHuffman: function(f, e, r, o) {
          var a = e.headerInfo, i = a.numDims, m = e.headerInfo.height, n = e.headerInfo.width, t = n * m, v = this.readHuffmanTree(f, e), u = v.decodeLut, h = v.tree, g = v.stuffedData, l = v.srcPtr, s = v.bitPos, w = v.numBitsLUTQick, x = v.numBitsLUT, D = e.headerInfo.imageType === 0 ? 128 : 0, d, M, k, L = e.pixels.resultMask, p, c, U, I, y, T, V, S = 0;
          s > 0 && (l++, s = 0);
          var B = g[l], F = e.encodeMode === 1, j = new r(t * i), z = j, b;
          if (i < 2 || F) {
            for (b = 0; b < i; b++)
              if (i > 1 && (z = new r(j.buffer, t * b, t), S = 0), e.headerInfo.numValidPixel === n * m)
                for (T = 0, I = 0; I < m; I++)
                  for (y = 0; y < n; y++, T++) {
                    if (M = 0, p = B << s >>> 32 - w, c = p, 32 - s < w && (p |= g[l + 1] >>> 64 - s - w, c = p), u[c])
                      M = u[c][1], s += u[c][0];
                    else
                      for (p = B << s >>> 32 - x, c = p, 32 - s < x && (p |= g[l + 1] >>> 64 - s - x, c = p), d = h, V = 0; V < x; V++)
                        if (U = p >>> x - V - 1 & 1, d = U ? d.right : d.left, !(d.left || d.right)) {
                          M = d.val, s = s + V + 1;
                          break;
                        }
                    s >= 32 && (s -= 32, l++, B = g[l]), k = M - D, F ? (y > 0 ? k += S : I > 0 ? k += z[T - n] : k += S, k &= 255, z[T] = k, S = k) : z[T] = k;
                  }
              else
                for (T = 0, I = 0; I < m; I++)
                  for (y = 0; y < n; y++, T++)
                    if (L[T]) {
                      if (M = 0, p = B << s >>> 32 - w, c = p, 32 - s < w && (p |= g[l + 1] >>> 64 - s - w, c = p), u[c])
                        M = u[c][1], s += u[c][0];
                      else
                        for (p = B << s >>> 32 - x, c = p, 32 - s < x && (p |= g[l + 1] >>> 64 - s - x, c = p), d = h, V = 0; V < x; V++)
                          if (U = p >>> x - V - 1 & 1, d = U ? d.right : d.left, !(d.left || d.right)) {
                            M = d.val, s = s + V + 1;
                            break;
                          }
                      s >= 32 && (s -= 32, l++, B = g[l]), k = M - D, F ? (y > 0 && L[T - 1] ? k += S : I > 0 && L[T - n] ? k += z[T - n] : k += S, k &= 255, z[T] = k, S = k) : z[T] = k;
                    }
          } else
            for (T = 0, I = 0; I < m; I++)
              for (y = 0; y < n; y++)
                if (T = I * n + y, !L || L[T])
                  for (b = 0; b < i; b++, T += t) {
                    if (M = 0, p = B << s >>> 32 - w, c = p, 32 - s < w && (p |= g[l + 1] >>> 64 - s - w, c = p), u[c])
                      M = u[c][1], s += u[c][0];
                    else
                      for (p = B << s >>> 32 - x, c = p, 32 - s < x && (p |= g[l + 1] >>> 64 - s - x, c = p), d = h, V = 0; V < x; V++)
                        if (U = p >>> x - V - 1 & 1, d = U ? d.right : d.left, !(d.left || d.right)) {
                          M = d.val, s = s + V + 1;
                          break;
                        }
                    s >= 32 && (s -= 32, l++, B = g[l]), k = M - D, z[T] = k;
                  }
          e.ptr = e.ptr + (l + 1) * 4 + (s > 0 ? 4 : 0), e.pixels.resultPixels = j, i > 1 && !o && (e.pixels.resultPixels = A.swapDimensionOrder(j, t, i, r));
        },
        decodeBits: function(f, e, r, o, a) {
          {
            var i = e.headerInfo, m = i.fileVersion, n = 0, t = f.byteLength - e.ptr >= 5 ? 5 : f.byteLength - e.ptr, v = new DataView(f, e.ptr, t), u = v.getUint8(0);
            n++;
            var h = u >> 6, g = h === 0 ? 4 : 3 - h, l = (u & 32) > 0, s = u & 31, w = 0;
            if (g === 1)
              w = v.getUint8(n), n++;
            else if (g === 2)
              w = v.getUint16(n, !0), n += 2;
            else if (g === 4)
              w = v.getUint32(n, !0), n += 4;
            else
              throw "Invalid valid pixel count type";
            var x = 2 * i.maxZError, D, d, M, k, L, p, c, U, I, y = i.numDims > 1 ? i.maxValues[a] : i.zMax;
            if (l) {
              for (e.counter.lut++, U = v.getUint8(n), n++, k = Math.ceil((U - 1) * s / 8), L = Math.ceil(k / 4), d = new ArrayBuffer(L * 4), M = new Uint8Array(d), e.ptr += n, M.set(new Uint8Array(f, e.ptr, k)), c = new Uint32Array(d), e.ptr += k, I = 0; U - 1 >>> I; )
                I++;
              k = Math.ceil(w * I / 8), L = Math.ceil(k / 4), d = new ArrayBuffer(L * 4), M = new Uint8Array(d), M.set(new Uint8Array(f, e.ptr, k)), D = new Uint32Array(d), e.ptr += k, m >= 3 ? p = C.unstuffLUT2(c, s, U - 1, o, x, y) : p = C.unstuffLUT(c, s, U - 1, o, x, y), m >= 3 ? C.unstuff2(D, r, I, w, p) : C.unstuff(D, r, I, w, p);
            } else
              e.counter.bitstuffer++, I = s, e.ptr += n, I > 0 && (k = Math.ceil(w * I / 8), L = Math.ceil(k / 4), d = new ArrayBuffer(L * 4), M = new Uint8Array(d), M.set(new Uint8Array(f, e.ptr, k)), D = new Uint32Array(d), e.ptr += k, m >= 3 ? o == null ? C.originalUnstuff2(D, r, I, w) : C.unstuff2(D, r, I, w, !1, o, x, y) : o == null ? C.originalUnstuff(D, r, I, w) : C.unstuff(D, r, I, w, !1, o, x, y));
          }
        },
        readTiles: function(f, e, r, o) {
          var a = e.headerInfo, i = a.width, m = a.height, n = i * m, t = a.microBlockSize, v = a.imageType, u = A.getDataTypeSize(v), h = Math.ceil(i / t), g = Math.ceil(m / t);
          e.pixels.numBlocksY = g, e.pixels.numBlocksX = h, e.pixels.ptr = 0;
          var l = 0, s = 0, w = 0, x = 0, D = 0, d = 0, M = 0, k = 0, L = 0, p = 0, c = 0, U = 0, I = 0, y = 0, T = 0, V = 0, S, B, F, j, z, b, Q = new r(t * t), ne = m % t || t, ae = i % t || t, G, H, q = a.numDims, _, E = e.pixels.resultMask, O = e.pixels.resultPixels, te = a.fileVersion, ee = te >= 5 ? 14 : 15, Z, J = a.zMax, N;
          for (w = 0; w < g; w++)
            for (D = w !== g - 1 ? t : ne, x = 0; x < h; x++)
              for (d = x !== h - 1 ? t : ae, c = w * i * t + x * t, U = i - d, _ = 0; _ < q; _++) {
                if (q > 1 ? (N = O, c = w * i * t + x * t, O = new r(e.pixels.resultPixels.buffer, n * _ * u, n), J = a.maxValues[_]) : N = null, M = f.byteLength - e.ptr, S = new DataView(f, e.ptr, Math.min(10, M)), B = {}, V = 0, k = S.getUint8(0), V++, Z = a.fileVersion >= 5 ? k & 4 : 0, L = k >> 6 & 255, p = k >> 2 & ee, p !== (x * t >> 3 & ee) || Z && _ === 0)
                  throw "integrity issue";
                if (b = k & 3, b > 3)
                  throw e.ptr += V, "Invalid block encoding (" + b + ")";
                if (b === 2) {
                  if (Z)
                    if (E)
                      for (l = 0; l < D; l++)
                        for (s = 0; s < d; s++)
                          E[c] && (O[c] = N[c]), c++;
                    else
                      for (l = 0; l < D; l++)
                        for (s = 0; s < d; s++)
                          O[c] = N[c], c++;
                  e.counter.constant++, e.ptr += V;
                  continue;
                } else if (b === 0) {
                  if (Z)
                    throw "integrity issue";
                  if (e.counter.uncompressed++, e.ptr += V, I = D * d * u, y = f.byteLength - e.ptr, I = I < y ? I : y, F = new ArrayBuffer(I % u === 0 ? I : I + u - I % u), j = new Uint8Array(F), j.set(new Uint8Array(f, e.ptr, I)), z = new r(F), T = 0, E)
                    for (l = 0; l < D; l++) {
                      for (s = 0; s < d; s++)
                        E[c] && (O[c] = z[T++]), c++;
                      c += U;
                    }
                  else
                    for (l = 0; l < D; l++) {
                      for (s = 0; s < d; s++)
                        O[c++] = z[T++];
                      c += U;
                    }
                  e.ptr += T * u;
                } else if (G = A.getDataTypeUsed(Z && v < 6 ? 4 : v, L), H = A.getOnePixel(B, V, G, S), V += A.getDataTypeSize(G), b === 3)
                  if (e.ptr += V, e.counter.constantoffset++, E)
                    for (l = 0; l < D; l++) {
                      for (s = 0; s < d; s++)
                        E[c] && (O[c] = Z ? Math.min(J, N[c] + H) : H), c++;
                      c += U;
                    }
                  else
                    for (l = 0; l < D; l++) {
                      for (s = 0; s < d; s++)
                        O[c] = Z ? Math.min(J, N[c] + H) : H, c++;
                      c += U;
                    }
                else if (e.ptr += V, A.decodeBits(f, e, Q, H, _), V = 0, Z)
                  if (E)
                    for (l = 0; l < D; l++) {
                      for (s = 0; s < d; s++)
                        E[c] && (O[c] = Q[V++] + N[c]), c++;
                      c += U;
                    }
                  else
                    for (l = 0; l < D; l++) {
                      for (s = 0; s < d; s++)
                        O[c] = Q[V++] + N[c], c++;
                      c += U;
                    }
                else if (E)
                  for (l = 0; l < D; l++) {
                    for (s = 0; s < d; s++)
                      E[c] && (O[c] = Q[V++]), c++;
                    c += U;
                  }
                else
                  for (l = 0; l < D; l++) {
                    for (s = 0; s < d; s++)
                      O[c++] = Q[V++];
                    c += U;
                  }
              }
          q > 1 && !o && (e.pixels.resultPixels = A.swapDimensionOrder(e.pixels.resultPixels, n, q, r));
        },
        /*****************
        *  private methods (helper methods)
        *****************/
        formatFileInfo: function(f) {
          return {
            fileIdentifierString: f.headerInfo.fileIdentifierString,
            fileVersion: f.headerInfo.fileVersion,
            imageType: f.headerInfo.imageType,
            height: f.headerInfo.height,
            width: f.headerInfo.width,
            numValidPixel: f.headerInfo.numValidPixel,
            microBlockSize: f.headerInfo.microBlockSize,
            blobSize: f.headerInfo.blobSize,
            maxZError: f.headerInfo.maxZError,
            pixelType: A.getPixelType(f.headerInfo.imageType),
            eofOffset: f.eofOffset,
            mask: f.mask ? {
              numBytes: f.mask.numBytes
            } : null,
            pixels: {
              numBlocksX: f.pixels.numBlocksX,
              numBlocksY: f.pixels.numBlocksY,
              //"numBytes": data.pixels.numBytes,
              maxValue: f.headerInfo.zMax,
              minValue: f.headerInfo.zMin,
              noDataValue: f.noDataValue
            }
          };
        },
        constructConstantSurface: function(f, e) {
          var r = f.headerInfo.zMax, o = f.headerInfo.zMin, a = f.headerInfo.maxValues, i = f.headerInfo.numDims, m = f.headerInfo.height * f.headerInfo.width, n = 0, t = 0, v = 0, u = f.pixels.resultMask, h = f.pixels.resultPixels;
          if (u)
            if (i > 1) {
              if (e)
                for (n = 0; n < i; n++)
                  for (v = n * m, r = a[n], t = 0; t < m; t++)
                    u[t] && (h[v + t] = r);
              else
                for (t = 0; t < m; t++)
                  if (u[t])
                    for (v = t * i, n = 0; n < i; n++)
                      h[v + i] = a[n];
            } else
              for (t = 0; t < m; t++)
                u[t] && (h[t] = r);
          else if (i > 1 && o !== r)
            if (e)
              for (n = 0; n < i; n++)
                for (v = n * m, r = a[n], t = 0; t < m; t++)
                  h[v + t] = r;
            else
              for (t = 0; t < m; t++)
                for (v = t * i, n = 0; n < i; n++)
                  h[v + n] = a[n];
          else
            for (t = 0; t < m * i; t++)
              h[t] = r;
        },
        getDataTypeArray: function(f) {
          var e;
          switch (f) {
            case 0:
              e = Int8Array;
              break;
            case 1:
              e = Uint8Array;
              break;
            case 2:
              e = Int16Array;
              break;
            case 3:
              e = Uint16Array;
              break;
            case 4:
              e = Int32Array;
              break;
            case 5:
              e = Uint32Array;
              break;
            case 6:
              e = Float32Array;
              break;
            case 7:
              e = Float64Array;
              break;
            default:
              e = Float32Array;
          }
          return e;
        },
        getPixelType: function(f) {
          var e;
          switch (f) {
            case 0:
              e = "S8";
              break;
            case 1:
              e = "U8";
              break;
            case 2:
              e = "S16";
              break;
            case 3:
              e = "U16";
              break;
            case 4:
              e = "S32";
              break;
            case 5:
              e = "U32";
              break;
            case 6:
              e = "F32";
              break;
            case 7:
              e = "F64";
              break;
            default:
              e = "F32";
          }
          return e;
        },
        isValidPixelValue: function(f, e) {
          if (e == null)
            return !1;
          var r;
          switch (f) {
            case 0:
              r = e >= -128 && e <= 127;
              break;
            case 1:
              r = e >= 0 && e <= 255;
              break;
            case 2:
              r = e >= -32768 && e <= 32767;
              break;
            case 3:
              r = e >= 0 && e <= 65536;
              break;
            case 4:
              r = e >= -2147483648 && e <= 2147483647;
              break;
            case 5:
              r = e >= 0 && e <= 4294967296;
              break;
            case 6:
              r = e >= -34027999387901484e22 && e <= 34027999387901484e22;
              break;
            case 7:
              r = e >= -17976931348623157e292 && e <= 17976931348623157e292;
              break;
            default:
              r = !1;
          }
          return r;
        },
        getDataTypeSize: function(f) {
          var e = 0;
          switch (f) {
            case 0:
            case 1:
              e = 1;
              break;
            case 2:
            case 3:
              e = 2;
              break;
            case 4:
            case 5:
            case 6:
              e = 4;
              break;
            case 7:
              e = 8;
              break;
            default:
              e = f;
          }
          return e;
        },
        getDataTypeUsed: function(f, e) {
          var r = f;
          switch (f) {
            case 2:
            case 4:
              r = f - e;
              break;
            case 3:
            case 5:
              r = f - 2 * e;
              break;
            case 6:
              e === 0 ? r = f : e === 1 ? r = 2 : r = 1;
              break;
            case 7:
              e === 0 ? r = f : r = f - 2 * e + 1;
              break;
            default:
              r = f;
              break;
          }
          return r;
        },
        getOnePixel: function(f, e, r, o) {
          var a = 0;
          switch (r) {
            case 0:
              a = o.getInt8(e);
              break;
            case 1:
              a = o.getUint8(e);
              break;
            case 2:
              a = o.getInt16(e, !0);
              break;
            case 3:
              a = o.getUint16(e, !0);
              break;
            case 4:
              a = o.getInt32(e, !0);
              break;
            case 5:
              a = o.getUInt32(e, !0);
              break;
            case 6:
              a = o.getFloat32(e, !0);
              break;
            case 7:
              a = o.getFloat64(e, !0);
              break;
            default:
              throw "the decoder does not understand this pixel type";
          }
          return a;
        },
        swapDimensionOrder: function(f, e, r, o, a) {
          var i = 0, m = 0, n = 0, t = 0, v = f;
          if (r > 1)
            if (v = new o(e * r), a)
              for (i = 0; i < e; i++)
                for (t = i, n = 0; n < r; n++, t += e)
                  v[t] = f[m++];
            else
              for (i = 0; i < e; i++)
                for (t = i, n = 0; n < r; n++, t += e)
                  v[m++] = f[t];
          return v;
        }
      }, X = function(f, e, r) {
        this.val = f, this.left = e, this.right = r;
      }, R = {
        /*
        * ********removed options compared to LERC1. We can bring some of them back if needed.
         * removed pixel type. LERC2 is typed and doesn't require user to give pixel type
         * changed encodedMaskData to maskData. LERC2 's js version make it faster to use maskData directly.
         * removed returnMask. mask is used by LERC2 internally and is cost free. In case of user input mask, it's returned as well and has neglible cost.
         * removed nodatavalue. Because LERC2 pixels are typed, nodatavalue will sacrify a useful value for many types (8bit, 16bit) etc,
         *       user has to be knowledgable enough about raster and their data to avoid usability issues. so nodata value is simply removed now.
         *       We can add it back later if their's a clear requirement.
         * removed encodedMask. This option was not implemented in LercDecode. It can be done after decoding (less efficient)
         * removed computeUsedBitDepths.
         *
         *
         * response changes compared to LERC1
         * 1. encodedMaskData is not available
         * 2. noDataValue is optional (returns only if user's noDataValue is with in the valid data type range)
         * 3. maskData is always available
        */
        /*****************
        *  public properties
        ******************/
        //HUFFMAN_LUT_BITS_MAX: 12, //use 2^12 lut, not configurable
        /*****************
        *  public methods
        *****************/
        /**
         * Decode a LERC2 byte stream and return an object containing the pixel data and optional metadata.
         *
         * @param {ArrayBuffer} input The LERC input byte stream
         * @param {object} [options] options Decoding options
         * @param {number} [options.inputOffset] The number of bytes to skip in the input byte stream. A valid LERC file is expected at that position
         * @param {boolean} [options.returnFileInfo] If true, the return value will have a fileInfo property that contains metadata obtained from the LERC headers and the decoding process
         * @param {boolean} [options.returnPixelInterleavedDims]  If true, returned dimensions are pixel-interleaved, a.k.a [p1_dim0, p1_dim1, p1_dimn, p2_dim0...], default is [p1_dim0, p2_dim0, ..., p1_dim1, p2_dim1...]
         */
        decode: function(f, e) {
          e = e || {};
          var r = e.noDataValue, o = 0, a = {};
          if (a.ptr = e.inputOffset || 0, a.pixels = {}, !!A.readHeaderInfo(f, a)) {
            var i = a.headerInfo, m = i.fileVersion, n = A.getDataTypeArray(i.imageType);
            if (m > 5)
              throw "unsupported lerc version 2." + m;
            A.readMask(f, a), i.numValidPixel !== i.width * i.height && !a.pixels.resultMask && (a.pixels.resultMask = e.maskData);
            var t = i.width * i.height;
            a.pixels.resultPixels = new n(t * i.numDims), a.counter = {
              onesweep: 0,
              uncompressed: 0,
              lut: 0,
              bitstuffer: 0,
              constant: 0,
              constantoffset: 0
            };
            var v = !e.returnPixelInterleavedDims;
            if (i.numValidPixel !== 0)
              if (i.zMax === i.zMin)
                A.constructConstantSurface(a, v);
              else if (m >= 4 && A.checkMinMaxRanges(f, a))
                A.constructConstantSurface(a, v);
              else {
                var u = new DataView(f, a.ptr, 2), h = u.getUint8(0);
                if (a.ptr++, h)
                  A.readDataOneSweep(f, a, n, v);
                else if (m > 1 && i.imageType <= 1 && Math.abs(i.maxZError - 0.5) < 1e-5) {
                  var g = u.getUint8(1);
                  if (a.ptr++, a.encodeMode = g, g > 2 || m < 4 && g > 1)
                    throw "Invalid Huffman flag " + g;
                  g ? A.readHuffman(f, a, n, v) : A.readTiles(f, a, n, v);
                } else
                  A.readTiles(f, a, n, v);
              }
            a.eofOffset = a.ptr;
            var l;
            e.inputOffset ? (l = a.headerInfo.blobSize + e.inputOffset - a.ptr, Math.abs(l) >= 1 && (a.eofOffset = e.inputOffset + a.headerInfo.blobSize)) : (l = a.headerInfo.blobSize - a.ptr, Math.abs(l) >= 1 && (a.eofOffset = a.headerInfo.blobSize));
            var s = {
              width: i.width,
              height: i.height,
              pixelData: a.pixels.resultPixels,
              minValue: i.zMin,
              maxValue: i.zMax,
              validPixelCount: i.numValidPixel,
              dimCount: i.numDims,
              dimStats: {
                minValues: i.minValues,
                maxValues: i.maxValues
              },
              maskData: a.pixels.resultMask
              //noDataValue: noDataValue
            };
            if (a.pixels.resultMask && A.isValidPixelValue(i.imageType, r)) {
              var w = a.pixels.resultMask;
              for (o = 0; o < t; o++)
                w[o] || (s.pixelData[o] = r);
              s.noDataValue = r;
            }
            return a.noDataValue = r, e.returnFileInfo && (s.fileInfo = A.formatFileInfo(a)), s;
          }
        },
        getBandCount: function(f) {
          var e = 0, r = 0, o = {};
          for (o.ptr = 0, o.pixels = {}; r < f.byteLength - 58; )
            A.readHeaderInfo(f, o), r += o.headerInfo.blobSize, e++, o.ptr = r;
          return e;
        }
      };
      return R;
    }(), W = function() {
      var C = new ArrayBuffer(4), A = new Uint8Array(C), X = new Uint32Array(C);
      return X[0] = 1, A[0] === 1;
    }(), P = {
      /************wrapper**********************************************/
      /**
       * A wrapper for decoding both LERC1 and LERC2 byte streams capable of handling multiband pixel blocks for various pixel types.
       *
       * @alias module:Lerc
       * @param {ArrayBuffer} input The LERC input byte stream
       * @param {object} [options] The decoding options below are optional.
       * @param {number} [options.inputOffset] The number of bytes to skip in the input byte stream. A valid Lerc file is expected at that position.
       * @param {string} [options.pixelType] (LERC1 only) Default value is F32. Valid pixel types for input are U8/S8/S16/U16/S32/U32/F32.
       * @param {number} [options.noDataValue] (LERC1 only). It is recommended to use the returned mask instead of setting this value.
       * @param {boolean} [options.returnPixelInterleavedDims] (nDim LERC2 only) If true, returned dimensions are pixel-interleaved, a.k.a [p1_dim0, p1_dim1, p1_dimn, p2_dim0...], default is [p1_dim0, p2_dim0, ..., p1_dim1, p2_dim1...]
       * @returns {{width, height, pixels, pixelType, mask, statistics}}
         * @property {number} width Width of decoded image.
         * @property {number} height Height of decoded image.
         * @property {array} pixels [band1, band2, …] Each band is a typed array of width*height.
         * @property {string} pixelType The type of pixels represented in the output.
         * @property {mask} mask Typed array with a size of width*height, or null if all pixels are valid.
         * @property {array} statistics [statistics_band1, statistics_band2, …] Each element is a statistics object representing min and max values
      **/
      decode: function(C, A) {
        if (!W)
          throw "Big endian system is not supported.";
        A = A || {};
        var X = A.inputOffset || 0, R = new Uint8Array(C, X, 10), f = String.fromCharCode.apply(null, R), e, r;
        if (f.trim() === "CntZImage")
          e = Y, r = 1;
        else if (f.substring(0, 5) === "Lerc2")
          e = K, r = 2;
        else
          throw "Unexpected file identifier string: " + f;
        for (var o = 0, a = C.byteLength - 10, i, m = [], n, t, v = {
          width: 0,
          height: 0,
          pixels: [],
          pixelType: A.pixelType,
          mask: null,
          statistics: []
        }, u = 0; X < a; ) {
          var h = e.decode(C, {
            inputOffset: X,
            //for both lerc1 and lerc2
            encodedMaskData: i,
            //lerc1 only
            maskData: t,
            //lerc2 only
            returnMask: o === 0,
            //lerc1 only
            returnEncodedMask: o === 0,
            //lerc1 only
            returnFileInfo: !0,
            //for both lerc1 and lerc2
            returnPixelInterleavedDims: A.returnPixelInterleavedDims,
            //for ndim lerc2 only
            pixelType: A.pixelType || null,
            //lerc1 only
            noDataValue: A.noDataValue || null
            //lerc1 only
          });
          X = h.fileInfo.eofOffset, t = h.maskData, o === 0 && (i = h.encodedMaskData, v.width = h.width, v.height = h.height, v.dimCount = h.dimCount || 1, v.pixelType = h.pixelType || h.fileInfo.pixelType, v.mask = t), r > 1 && (t && m.push(t), h.fileInfo.mask && h.fileInfo.mask.numBytes > 0 && u++), o++, v.pixels.push(h.pixelData), v.statistics.push({
            minValue: h.minValue,
            maxValue: h.maxValue,
            noDataValue: h.noDataValue,
            dimStats: h.dimStats
          });
        }
        var g, l, s;
        if (r > 1 && u > 1) {
          for (s = v.width * v.height, v.bandMasks = m, t = new Uint8Array(s), t.set(m[0]), g = 1; g < m.length; g++)
            for (n = m[g], l = 0; l < s; l++)
              t[l] = t[l] & n[l];
          v.maskData = t;
        }
        return v;
      }
    };
    $.exports ? $.exports = P : this.Lerc = P;
  })();
})(ie);
var ue = ie.exports;
const ve = /* @__PURE__ */ le(ue);
class ge extends se {
  constructor(Y) {
    super(), this.planarConfiguration = typeof Y.PlanarConfiguration < "u" ? Y.PlanarConfiguration : 1, this.samplesPerPixel = typeof Y.SamplesPerPixel < "u" ? Y.SamplesPerPixel : 1, this.addCompression = Y.LercParameters[oe.AddCompression];
  }
  decodeBlock(Y) {
    switch (this.addCompression) {
      case re.None:
        break;
      case re.Deflate:
        Y = fe(new Uint8Array(Y)).buffer;
        break;
      default:
        throw new Error(`Unsupported LERC additional compression method identifier: ${this.addCompression}`);
    }
    return ve.decode(Y, { returnPixelInterleavedDims: this.planarConfiguration === 1 }).pixels[0].buffer;
  }
}
export {
  ge as default
};
