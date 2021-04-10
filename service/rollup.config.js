// rollup.config.js
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
export default {
  input: "index.js",
  output: {
    file: "../uniCloud-aliyun/cloudfunctions/demo-express/index.js",
    format: "cjs",
  },

  //   external: ["fs", "path", "events", "tty", "util", "os", "querystring","http","url"],
  plugins: [
    json(),
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs({
      ignore: ["conditional-runtime-dependency"], // 使用旧版本 rollup-plugin-commonjs 解决 dynamic require
    }),
    // terser(),
    //将适用于阿里云的package.json复制到云函数目录去
    copy({
      targets: [
        {
          src: "package_unicloud.json",
          dest: "../uniCloud-aliyun/cloudfunctions/demo-express/",
          rename: "package.json",
        },
      ],
    }),
  ],
};
