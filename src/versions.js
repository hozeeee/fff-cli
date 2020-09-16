const chalk = require("chalk");
const ora = require('ora');
const {
  execPromise
} = require("./utils");


const COMMAND_LIST = [{
    name: "fff-cli",
    command: "fff-cli -V",
    filter: (stdout) => stdout.replace(/[\u000D\u000A]/g, " ")
  }, {
    name: "Node.js",
    command: "node -v",
    filter: (stdout) => stdout.replace(/[\u000D\u000A]/g, " ")
  },
  {
    name: "npm",
    command: "npm -v",
    filter: (stdout) => stdout.replace(/[\u000D\u000A]/g, " ")
  },
  {
    name: "cnpm",
    command: "cnpm -v",
    filter: (stdout) => stdout.replace(/^.*(cnpm@\d+\.\d+\.\d+).*$/gms, "$1")
  },
  {
    name: "yarn",
    command: "yarn --version",
    filter: (stdout) => stdout.replace(/[\u000D\u000A]/g, " ")
  },
  {
    name: "git",
    command: "git --version",
    filter: (stdout) => stdout.replace(/[\u000D\u000A]/g, " ").replace(/git version /g, "")
  },
  {
    name: "python",
    command: "python -V",
    filter: (stdout) => stdout.replace(/[\u000D\u000A]/g, " ").replace(/Python /g, "")
  },
  {
    name: "java",
    command: "java -version",
    filter: (stdout) => stdout.replace(/[\u000D\u000A]/g, " ")
  },
  {
    name: "JAVA_HOME",
    command: "set JAVA_HOME",
    filter: (stdout) => stdout.replace(/[\u000D\u000A]/g, " ")
  },
  {
    name: "ANDROID_HOME",
    command: "set ANDROID_HOME",
    filter: (stdout) => stdout.replace(/[\u000D\u000A]/g, " ")
  },
]

module.exports.getVersions = async function () {
  const spinner = ora("正在获取版本号...");
  spinner.start();
  let result = [];
  for (let item of COMMAND_LIST) {
    await execPromise(item.command).then(({
      stderr,
      stdout
    }) => {
      let filter = item.filter || (val => val);
      let res = filter(stdout || stderr);
      result.push({
        name: item.name,
        result: res
      });
    }).catch(() => {
      result.push({
        name: item.name,
        result: "(无法获取)"
      });
    });
  }
  spinner.succeed(chalk.green("版本号如下："));
  for (let item of result) {
    console.log(chalk.blue(`${item.name}: %s`), chalk.yellow(item.result));
  }
}