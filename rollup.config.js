import replace from "rollup-plugin-replace";
import nodeResolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "es",
  },
  plugins: [
    replace({
      values: {
        DEBUG: false,
        TARGET: JSON.stringify("evergreen"),
      },
    }),
    nodeResolve(),
    terser({
      "parse": {
        "ecma": 8
      },
      "compress": {
        "ecma": 5,
        "inline": true,
        "reduce_funcs": false,
        "passes": 3,
        "comparisons": false
      },
      "output": {
        "ecma": 5,
        "comments": false
      },
      "toplevel": true,
      "mangle": {
        "safari10": true
      }
    }),
  ],
};
