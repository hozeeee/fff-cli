// const memFs = require('mem-fs');
// const editor = require('mem-fs-editor');
// const inquirer = require('inquirer');
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const fse = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const gitDownloader = require('download-git-repo');
const { table: tableCreater } = require("table");
const { renderFile, compareVersion } = require('./utils');
const { TEMPLATE_GIT_REPOSITORY } = require("../config/CONSTANTS");
const { pcDependencies, pcDevDependencies, mobileDependencies, mobileDevDependencies, dependenciesDescript } = require("../config/PROJECT_DEPENDENCIES");
const { COMMON_REJECT_FILES, PC_REJECT_FILES, MOBILE_REJECT_FILES } = require("../config/REJECT_FILES");


// 初始化参数
function Project(options) {
  this.config = Object.assign({}, options);
}

Project.prototype.create = function () {
  this.checkNodeJsVersion().then(() => {
    return this.checkMyCliVersion();
  }).then(()=>{
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


Project.prototype.checkMyCliVersion = function (){
  return fse.readJson(path.join(__dirname, "../package.json")).then(packageObj=>{
    const currentVersion = packageObj.version;
    console.log(chalk.green("当前 fff-cli 版本为 ") + chalk.blue(currentVersion));
    return Promise.resolve(currentVersion);
  }).then(currentVersion=>{
    return new Promise((resolve) => {
      const spinner = ora("获取最新 fff-cli 最新版本号");
      spinner.start();
      exec("npm view fff-cli version", (error, stdout, stderr) => {
        if (error) {
          spinner.fail(chalk.yellow("无法获取最新 fff-cli 版本号"));
          console.error(error);
          resolve();
          return;
        }
        if (stderr) console.error(stderr);
        if (stdout) {
          const lastVersion = stdout.replace(/[\u000D\u000A]/g, "");
          let tmp = compareVersion(currentVersion,lastVersion);
          if(tmp < 0) spinner.warn(chalk.yellow(`建议升级到最新版本(${lastVersion})，否则可能导致创建失败`));
          else spinner.succeed(chalk.green("当前 fff-cli 版本已是最新版"));
        }
        resolve();
        spinner.stop();
      });
    });
  })
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
  const { projectName, projectPath, layout, multiPage } = this.config;
  // 模板文件
  const ejsFiles = [
    {source: "./src/App.ejs", target: "./src/App.vue"},
    {source: "./src/main.ejs", target: "./src/main.js"},
    {source: "./vue.config.ejs", target: "./vue.config.js"},
    {source: "./src/views/home.ejs", target: "./src/views/home.vue"},
    {source: "./src/router/route.component.config.ejs", target: "./src/router/route.component.config.js"},
    {source: "./src/router/index.ejs", target: "./src/router/index.js"}
  ];
  const spinner = ora("构建项目文件");
  (() => {
    return new Promise((resolve, reject) => {
      try {
        spinner.start();
        // 删除多余文件
        let delFilePaths = [...COMMON_REJECT_FILES];
        if (!layout.needHeader) delFilePaths.push("./src/header");
        if (!layout.needFooter) delFilePaths.push("./src/footer");
        if (!layout.needAside) delFilePaths.push("./src/aside");
        if (!multiPage) delFilePaths.push("./src/otherPages");
        if(layout.isMobile) delFilePaths.push(...MOBILE_REJECT_FILES);
        else delFilePaths.push(...PC_REJECT_FILES);
        delFilePaths = delFilePaths.map(i => path.join(projectPath, i));
        resolve(delFilePaths);
      } catch (e) {
        reject(e);
      }
    })
  })().then((delFilePaths) => {
    return Promise.all(delFilePaths.map(path => fse.remove(path)))
  }).then(() => {
    return Promise.all(ejsFiles.map(i => {
      const inputFile = path.join(projectPath, i.source);
      const outputFile = path.join(projectPath, i.target);
      return renderFile(inputFile, outputFile, { ...layout, multiPage });
    }));
  }).then(() => {
    // 删除 .ejs 文件
    return Promise.all(ejsFiles.map(i => path.join(projectPath, i.source)).map(path => fse.remove(path)));
  }).then(() => {
    // 修改 package.json
    return fse.readJson(path.join(projectPath, "./package.json"));
  }).then(packageObj => {
    packageObj = packageObj || {}
    packageObj.name = projectName;
    let dependencies, devDependencies;
    if(layout.isMobile) {
      dependencies = mobileDependencies;
      devDependencies = mobileDevDependencies;
    } else {
      dependencies = pcDependencies;
      devDependencies = pcDevDependencies;
    }
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
    return Promise.reject(err);
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
      // console.log(`${stderr}${stdout}`);
      resolve();
    });
  });
}


Project.prototype.printDependencies = function () {
  const { layout } = this.config;
  let dependencies, devDependencies;
  console.log("layout.isMobile", layout.isMobile);
  if(layout.isMobile) {
    dependencies = mobileDependencies;
    devDependencies = mobileDevDependencies;
  } else {
    dependencies = pcDependencies;
    devDependencies = pcDevDependencies;
  }
  console.log(chalk.green.bold("依赖列表如下："))
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