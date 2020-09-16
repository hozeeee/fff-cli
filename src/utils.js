const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const {
  exec
} = require('child_process');


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


const versionRegExp = /^(\d+)\.(\d+)\.(\d+)$/;
module.exports.compareVersion = function (v1, v2) {
  const match1 = versionRegExp.exec(v1);
  const match2 = versionRegExp.exec(v2);
  if (!match1 || !match2) throw '对比的版本号必须是 x.y.z 格式';
  for (let index of Array(3).fill().map((item, idx) => idx + 1)) {
    let tmp = match1[index] - match2[index];
    if (tmp === 0) continue;
    else return tmp;
  }
  return 0;
}


module.exports.execPromise = function (command){
  return new Promise((resolve,reject) => {
    exec(command, (error, stdout, stderr) => {
      if(error) reject(error);
      else resolve({ stdout, stderr });
    });
  });
}
