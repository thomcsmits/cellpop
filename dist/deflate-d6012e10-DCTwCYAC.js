import { i as r } from "./pako.esm-68f84e2a-DFzjKZhZ.js";
import { B as o } from "./index-DYh2V44F.js";
import "react";
class d extends o {
  decodeBlock(e) {
    return r(new Uint8Array(e)).buffer;
  }
}
export {
  d as default
};
