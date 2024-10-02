import { g as o, a } from "./browser-122c4c35-DVZ3KnL6.js";
var l = Object.defineProperty, c = (r, e, t) => e in r ? l(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, n = (r, e, t) => (c(r, typeof e != "symbol" ? e + "" : e, t), t), i, d = (i = class {
  constructor(r = 1) {
    if (n(this, "level"), r < 0 || r > 9)
      throw new Error("Invalid gzip compression level, it should be between 0 and 9");
    this.level = r;
  }
  static fromConfig({ level: r }) {
    return new i(r);
  }
  encode(r) {
    return o(r, { level: this.level });
  }
  decode(r) {
    return a(r);
  }
}, n(i, "codecId", "gzip"), i), s = d;
export {
  s as default
};
