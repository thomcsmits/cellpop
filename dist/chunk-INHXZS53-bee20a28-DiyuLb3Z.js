var C = /* @__PURE__ */ (() => {
  for (var a = new Uint8Array(128), r = 0; r < 64; r++)
    a[r < 26 ? r + 65 : r < 52 ? r + 71 : r < 62 ? r - 4 : r * 4 - 205] = r;
  return (t) => {
    for (var o = t.length, v = new Uint8Array((o - (t[o - 1] == "=") - (t[o - 2] == "=")) * 3 / 4 | 0), n = 0, e = 0; n < o; ) {
      var d = a[t.charCodeAt(n++)], A = a[t.charCodeAt(n++)], h = a[t.charCodeAt(n++)], y = a[t.charCodeAt(n++)];
      v[e++] = d << 2 | A >> 4, v[e++] = A << 4 | h >> 2, v[e++] = h << 6 | y;
    }
    return v;
  };
})();
export {
  C as _
};
