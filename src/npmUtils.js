const {
  exec
} = require("child_process");
const chalk = require("chalk");
const ora = require('ora');
const fse = require('fs-extra');
const path = require("path");


function getNpmRegistry() {
  return new Promise((resolve, reject) => {
    let spinner = ora("获取当前 npm 仓库地址");
    spinner.start();
    exec("npm config get registry", (error, stdout, stderr) => {
      if (error) {
        spinner.fail(chalk.red("无法获取当前 npm 仓库地址"));
        console.error(error);
        reject(error);
        return;
      }
      if (stderr) console.error(stderr);
      if (stdout) {
        const oldUrl = stdout.replace(/[\u000D\u000A]/g, "");
        spinner.succeed(chalk.green("当前 npm 仓库地址为 ") + chalk.blue(oldUrl));
      }
      resolve();
      spinner.stop();
      spinner = null;
    });
  });
}
module.exports.getNpmRegistry = getNpmRegistry;


function setNpmRegistry(url) {
  return getNpmRegistry().then(() => {
    let json = require(path.join(__dirname, "../config/NPM_REGISTRY.js"));
    return Promise.resolve(json);
  }).then((json) => {
    if (json[url]) url = json[url];
    return;
  }).then(() => {
    return new Promise((resolve, reject) => {
      const spinner = ora("设置 npm 仓库地址");
      spinner.start();
      exec(`npm config set registry=${url}`, (error, stdout, stderr) => {
        if (error) {
          spinner.fail(chalk.red("设置 npm 仓库地址失败"));
          console.error(error);
          reject(error);
          return;
        }
        if (stderr) console.error(stderr);
        if (stdout) console.log(stdout);
        spinner.succeed(chalk.green("成功修改 npm 仓库地址为 ") + chalk.yellow(url));
        spinner.stop();
        resolve();
      });
    });
  });
}
module.exports.setNpmRegistry = setNpmRegistry;



/**
node
node-gyp
npm
git
python
java
ANDROID_HOME
JAVA_HOME
 */