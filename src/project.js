const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
// 提供选择或输入的界面
const inquirer = require('inquirer');
// 封装了原生 fs 模块
const fse = require('fs-extra');
// 在控制台输出五颜六色的文字
const chalk = require('chalk');
// 提供"loading"显示的控制台输出
const ora = require('ora');
// 如果需要从 git 仓库获取模板，需要如下几个依赖包
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const gitDownloader = require('download-git-repo');
// 自己的代码
const { renderFile } = require('./utils');


// 初始化参数
function Project(options) {
  this.config = Object.assign({}, options);
}

Project.prototype.create = function () {
  this.checkNodeJsVersion().then(() => {
    return this.mkProjectDir();
  }).then(() => {
    return this.createProjectFiles();
  }).then(() => {
    // return this.installPackage();
  }).then(() => {
    //
  }).then(() => {
    //
  }).then(() => {
    //
  }).then(() => {
    //
  }).then(() => {
    //
  }).catch(err => {
    // console.log(chalk.red(err))
  })
}


// 检查 NodeJs 版本
Project.prototype.checkNodeJsVersion = function () {
  return new Promise((resolve, reject) => {
    const spinner = ora("检测当前 Node.js 版本");
    spinner.start();
    exec("node -v", (error, stdout, stderr) => {
      if (error) {
        spinner.fail(chalk.red("无法获取 Node.js 版本号"));
        console.error(error);
        reject(error);
        return;
      }
      if (stderr) console.error(stderr);
      if (stdout) {
        const version = stdout;
        const temp = version.replace("v", "").split(".");
        if (temp[0] < 10) spinner.warn(chalk.yellow("建议升级到 10 或以上版本"));
        else spinner.succeed(chalk.green("当前 Node.js 版本为 ") + chalk.blue(stdout.replace(/[\u000D\u000A]/g, "")));
      }
      resolve(stdout);
      spinner.stop();
    });
  });
}

// 检查 npm 版本

// 创建项目文件夹
Project.prototype.mkProjectDir = function () {
  return new Promise((resolve, reject) => {
    const spinner = ora("创建项目");
    const { projectName } = this.config;
    spinner.start();
    // 检测项目名是否合法
    if (!projectName) {
      reject();
      spinner.fail(chalk.red("项目名为空"));
      return;
    }
    if (!(/^[A-Za-z][-\w]*/).test(projectName)) {
      spinner.fail(chalk.red(`[${projectName}] 项目名不合法 (仅支持 数字、字母、-、_ 组成的项目名，且首字母只能是字母)`));
      return;
    }
    // 判断文件夹是否存在
    if (fs.existsSync(projectName)) {
      reject();
      spinner.fail(chalk.red(`[${projectName}] 已存在，无法创建项目`));
      return;
    }
    // TODO: 可以给用户选择是否覆盖创建
    fs.mkdir(projectName, err => {
      if (err) {
        reject();
        spinner.fail(chalk.red(`[${projectName}] 无法创建`));
        console.error(err);
        return;
      }
      resolve();
      spinner.succeed(chalk.green(`项目 [${projectName}] 创建成功`));
    });
  });
};

// 构建项目文件
Project.prototype.createProjectFiles = function () {
  const spinner = ora("构建项目文件");
  spinner.start();
  const { projectName, layout, needRouter, minWidth, minHeight } = this.config;
  const tempFilesPath = path.join(__dirname, "../project_template");
  const projectPath = path.join(process.cwd(), projectName);
  // 复制所有模板文件
  const copyIgnore = ["node_modules", "main.js", "App.vue", ".ejs"];
  return fse.copy(tempFilesPath, projectPath, {
    filter: (fileNmae) => !copyIgnore.some(i => fileNmae.includes(i))
  }).then(() => {
    // 删除多余文件
    const delFiles = [];
    if (!layout.needHeader) delFiles.push(path.join(projectPath, "./src/header"));
    if (!layout.needFooter) delFiles.push(path.join(projectPath, "./src/footer"));
    if (!layout.needAside) delFiles.push(path.join(projectPath, "./src/aside"));
    if (!needRouter) delFiles.push(path.join(projectPath, "./src/router"));
    return Promise.all(delFiles.map(path => fse.remove(path)));
  }).then(() => {
    // 生成 App.vue
    const inputFile = path.join(tempFilesPath, "./src/App.ejs");
    const outputFile = path.join(projectPath, "./src/App.vue");
    return renderFile(inputFile, outputFile, { ...layout, minWidth, minHeight });
  }).then(() => {
    // 生成 main.js
    const inputFile = path.join(tempFilesPath, "./src/main.ejs");
    const outputFile = path.join(projectPath, "./src/main.js");
    return renderFile(inputFile, outputFile, { needRouter });
  }).then(() => {
    // 修改 package.json
    return fse.readJson(path.join(projectPath, "./package.json"));
  }).then(packageObj => {
    packageObj = packageObj || {}
    packageObj.name = projectName;
    if (!needRouter) delete packageObj.dependencies["vue-router"];
    return fse.writeJson(path.join(projectPath, "./package.json"), packageObj);
  }).then(() => {
    spinner.succeed(chalk.green("项目文件构建完成"));
    return;
  }).catch(err => {
    spinner.fail(chalk.red("构建项目文件失败"));
    console.error(err);
    console.log(chalk.blue("操作建议："));
    console.log(chalk.blue("    - 重新安装 fff-cli"));
    console.log(chalk.blue("    - 检查当前账号是否具有写入权限"));
    console.log(chalk.blue("    - 查看控制台打印的错误信息，找出原因"));
    throw err;
  })
}

// 安装依赖
Project.prototype.installPackage = function () {
  const { projectName } = this.config;
  const projectPath = path.join(process.cwd(), projectName);
  const spinner = ora("安装依赖");
  spinner.start();
  return new Promise((resolve, reject) => {
    exec(`cd ${projectPath} && npm install`, (error, stdout, stderr) => {
      if (error) {
        spinner.fail(chalk.red("安装项目依赖失败，请自行重新安装！"));
        console.error(error);
        reject(error);
        return;
      }
      spinner.succeed(chalk.green("安装依赖成功"));
      console.log(`${stderr}${stdout}`);
      resolve();
    });
  });
}






module.exports = Project;