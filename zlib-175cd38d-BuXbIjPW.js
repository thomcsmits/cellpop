import { z as n, u as o } from "./browser-122c4c35-DVZ3KnL6.js";
var a = Object.defineProperty, c = (r, e, t) => e in r ? a(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, l = (r, e, t) => (c(r, typeof e != "symbol" ? e + "" : e, t), t), i, d = (i = class {
  constructor(r = 1) {
    if (l(this, "level"), r < -1 || r > 9)
      throw new Error("Invalid zlib compression level, it should be between -1 and 9");
    this.level = r;
  }
  static fromConfig({ level: r }) {
    return new i(r);
  }
  encode(r) {
    return n(r, { level: this.level });
  }
  decode(r) {
    return o(r);
  }
}, l(i, "codecId", "zlib"), i), u = d;
export {
  u as default
};
