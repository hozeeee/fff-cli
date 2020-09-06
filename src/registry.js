const { exec } = require("child_process");
const chalk = require("chalk");
const ora = require('ora');

// 只提供静态方法
function Registry() { }


Registry.setter = function (url) {
  console.log();
  return new Promise((resolve, reject) => {
    const spinner = ora("获取当前 npm 仓库地址");
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
      spinner.stop();
      setTimeout(() => {
        resolve();
      }, 500);
    })
  }).then(() => {
    console.log()
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
        if (stdout) spinner.succeed(chalk.green("成功设置 npm 仓库地址为 ") + chalk.blue(url));
        spinner.stop();
        resolve();
      });
    });
  });
}


module.exports = Registry;
