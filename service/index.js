"use strict";
const uniCloudExpress = require("unicloud-expressjs");
const app = require("./src/app");
const server = uniCloudExpress.createServer(app);
exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log("event : ", event);
  //返回数据给客户端
  try {
    let result = await uniCloudExpress.proxy(server, event, context);
    return result;
  } catch (err) {
    console.error(err);
    return {
      error: true,
    };
  }
};
