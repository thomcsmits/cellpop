import { B as i } from "./index-DYh2V44F.js";
import "react";
class f extends i {
  decodeBlock(s) {
    const r = new DataView(s), n = [];
    for (let e = 0; e < s.byteLength; ++e) {
      let t = r.getInt8(e);
      if (t < 0) {
        const o = r.getUint8(e + 1);
        t = -t;
        for (let a = 0; a <= t; ++a)
          n.push(o);
        e += 1;
      } else {
        for (let o = 0; o <= t; ++o)
          n.push(r.getUint8(e + o + 1));
        e += t + 1;
      }
    }
    return new Uint8Array(n).buffer;
  }
}
export {
  f as default
};
