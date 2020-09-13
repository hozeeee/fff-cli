// const memFs = require('mem-fs');
// const editor = require('mem-fs-editor');
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
// 从 git 仓库下载代码
const gitDownloader = require('download-git-repo');
// 控制台输出表格
const { table: tableCreater } = require("table");
// 自己的代码
const { renderFile } = require('./utils');
const { TEMPLATE_GIT_REPOSITORY, REJECT_FILES } = require("./_CONSTANTS");
const { dependencies, devDependencies, dependenciesDescript } = require("./_PROJECT_DEPENDENCIES");


// 初始化参数
function Project(options) {
  this.config = Object.assign({}, options);
}

Project.prototype.create = function () {
  this.checkNodeJsVersion().then(() => {
    return this.mkProjectDir();
  }).then(() => {
    return this.downloadGitTemplate();
  }).then(() => {
    return this.createProjectFiles();
  }).then(() => {
    return this.installPackage();
  }).then(() => {
    return this.printDependencies();
  }).then(() => {
    return this.printEndTips();
  }).catch(err => {
    // console.log(chalk.red(err))
  })
}


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


Project.prototype.mkProjectDir = function () {
  const { projectName } = this.config;
  const projectPath = path.join(process.cwd(), projectName);
  Object.assign(this.config, { projectPath });
  return new Promise((resolve, reject) => {
    const spinner = ora("创建项目");
    const { projectPath } = this.config;
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
    if (fs.existsSync(projectPath)) {
      reject();
      spinner.fail(chalk.red(`[${projectName}] 已存在，无法创建项目`));
      return;
    }
    // TODO: 可以给用户选择是否覆盖创建
    fs.mkdir(projectPath, err => {
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


Project.prototype.downloadGitTemplate = function () {
  const { projectPath } = this.config;
  const spinner = ora("正在下载模板，请稍等...");
  spinner.start();
  if (!projectPath) {
    console.log(chalk.red("项目路径无效"))
    return Promise.reject();
  }
  return new Promise((resolve, reject) => {
    gitDownloader(TEMPLATE_GIT_REPOSITORY, projectPath, { clone: true }, err => {
      if (err) {
        spinner.fail(chalk.red("模板下载失败，请检查网络"));
        console.error(err.message);
        reject();
        return;
      }
      spinner.succeed(chalk.green("模板下载成功"));
      resolve();
    });
  });
}


Project.prototype.createProjectFiles = function () {
  const { projectName, projectPath, layout, minWidth, minHeight, multiPage } = this.config;
  const spinner = ora("构建项目文件");
  (() => {
    return new Promise((resolve, reject) => {
      try {
        spinner.start();
        // 删除多余文件
        const delFilePaths = REJECT_FILES.map(i => path.join(projectPath, i));
        if (!layout.needHeader) delFilePaths.push(path.join(projectPath, "./src/header"));
        if (!layout.needFooter) delFilePaths.push(path.join(projectPath, "./src/footer"));
        if (!layout.needAside) delFilePaths.push(path.join(projectPath, "./src/aside"));
        if (!multiPage) delFilePaths.push(path.join(projectPath, "./src/otherPages"));
        resolve(delFilePaths);
      } catch (e) {
        reject(e);
      }
    })
  })().then((delFilePaths) => {
    return Promise.all(delFilePaths.map(path => fse.remove(path))).then(() => {
      // 生成 App.vue
      const inputFile = path.join(projectPath, "./src/App.ejs");
      const outputFile = path.join(projectPath, "./src/App.vue");
      return renderFile(inputFile, outputFile, { ...layout, minWidth, minHeight });
    })
  }).then(() => {
    // 生成 vue.config.js
    const inputFile = path.join(projectPath, "./vue.config.ejs");
    const outputFile = path.join(projectPath, "./vue.config.js");
    return renderFile(inputFile, outputFile, { multiPage });
  }).then(() => {
    // 删除 .ejs 文件
    const ejsFiles = ["./src/App.ejs", "./vue.config.ejs"];
    return Promise.all(ejsFiles.map(i => path.join(projectPath, i)).map(path => fse.remove(path)));
  }).then(() => {
    // 修改 package.json
    return fse.readJson(path.join(projectPath, "./package.json"));
  }).then(packageObj => {
    packageObj = packageObj || {}
    packageObj.name = projectName;
    packageObj.dependencies = dependencies;
    packageObj.devDependencies = devDependencies;
    return fse.writeJson(path.join(projectPath, "./package.json"), packageObj);
  }).then(() => {
    spinner.succeed(chalk.green("项目文件构建完成"));
    return Promise.resolve();
  }).catch(err => {
    spinner.fail(chalk.red("构建项目文件失败"));
    console.error(err);
    console.log(chalk.blue("操作建议："));
    console.log(chalk.blue("    - 重新安装 fff-cli"));
    console.log(chalk.blue("    - 检查当前账号是否具有写入权限"));
    console.log(chalk.blue("    - 更新 fff-cli 到最新版"));
    console.log(chalk.blue("    - 查看控制台打印的错误信息，找出原因"));
    throw err;
  })
}


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


Project.prototype.printDependencies = function () {
  console.log(chalk.green.bold("添加的依赖列表如下："))
  let tableData, output;
  console.log("dependencies:");
  tableData = [["包名", "版本", "描述"]];
  for (let key in dependencies) {
    tableData.push([key, dependencies[key], dependenciesDescript[key] || ""].map(i => chalk.green(i)))
  }
  output = tableCreater(tableData);
  console.log(chalk.blue(output));
  console.log("devDependencies:");
  tableData = [["包名", "版本", "描述"]];
  for (let key in devDependencies) {
    tableData.push([key, devDependencies[key], dependenciesDescript[key] || ""].map(i => chalk.green(i)))
  }
  output = tableCreater(tableData);
  console.log(chalk.blue(output));
  return Promise.resolve();
}


Project.prototype.printEndTips = function () {
  const { projectName } = this.config;
  console.log("请运行 %s 启动项目", chalk.yellow(`cd ${projectName} && npm run serve`));
}



module.exports = Project;