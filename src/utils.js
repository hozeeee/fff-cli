
const fs = require("fs");
const path = require("path");
const ejs = require("ejs"); // 模板引擎
const { exec } = require('child_process');
const ora = require('ora');


// 使用 ejs 输出内容
module.exports.renderFile = function (inputFile, outputFile, args, options) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(inputFile, args, options, (err, str) => {
      if (err) return reject(err);
      fs.writeFile(outputFile, str, 'utf8', err => {
        if (err) return reject(err);
        resolve(str);
      });
    });
  })
}


module.exports.getCssLengthValue = function (str) {
  str = String(str);
  if (str === "unset") return str;
  if (/^\d+((px)|(rem)|(em)|(vw)|(vh))?$/.test(str)) {
    if (RegExp.$1) return str;
    return `${str}px`
  }
  return null;
}

