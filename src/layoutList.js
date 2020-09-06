const chalk = require('chalk');



function Layout(options) {
  this.config = Object.assign({}, options);
}


// 可用布局方式
Layout.prototype.showList = function () {
  console.log("可选的布局方式有：");
  console.log();

  /**
    default
   ╭─────────────────────────────────────╮
   │               header                │
   ├───────┬─────────────────────────────┤
   │       │                             │
   │       │                             │
   │ aside │           view              │
   │       │                             │
   │       │                             │
   ╰───────┴─────────────────────────────╯
   */
  console.log(chalk.green("default") + ":");
  console.log(chalk.yellow("   ╭─────────────────────────────────────╮"));
  console.log(chalk.yellow("   │               ") + "header" + chalk.yellow("                │"));
  console.log(chalk.yellow("   ├───────┬─────────────────────────────┤"));
  console.log(chalk.yellow("   │       │                             │"));
  console.log(chalk.yellow("   │       │                             │"));
  console.log(chalk.yellow("   │ ") + "aside" + chalk.yellow(" │           ") + "view" + chalk.yellow("              │"));
  console.log(chalk.yellow("   │       │                             │"));
  console.log(chalk.yellow("   │       │                             │"));
  console.log(chalk.yellow("   ╰───────┴─────────────────────────────╯"));

  /**
    default-no-aside
   ╭─────────────────────────────────────╮
   │               header                │
   ├─────────────────────────────────────┤
   │                                     │
   │                                     │
   │                view                 │
   │                                     │
   │                                     │
   ╰─────────────────────────────────────╯
   */
  console.log("default-no-aside" + ":");
  console.log(chalk.yellow("   ╭─────────────────────────────────────╮"));
  console.log(chalk.yellow("   │               ") + "header" + chalk.yellow("                │"));
  console.log(chalk.yellow("   ├─────────────────────────────────────┤"));
  console.log(chalk.yellow("   │                                     │"));
  console.log(chalk.yellow("   │                                     │"));
  console.log(chalk.yellow("   │                ") + "view" + chalk.yellow("                 │"));
  console.log(chalk.yellow("   │                                     │"));
  console.log(chalk.yellow("   │                                     │"));
  console.log(chalk.yellow("   ╰─────────────────────────────────────╯"));

  /**
    default-footer
   ╭─────────────────────────────────────╮
   │               header                │
   ├───────┬─────────────────────────────┤
   │       │                             │
   │       │                             │
   │ aside │           view              │
   │       │                             │
   │       │                             │
   ├───────┴─────────────────────────────┤
   │               footer                │
   ╰─────────────────────────────────────╯
   */
  console.log("default-footer" + ":");
  console.log(chalk.yellow("   ╭─────────────────────────────────────╮"));
  console.log(chalk.yellow("   │               ") + "header" + chalk.yellow("                │"));
  console.log(chalk.yellow("   ├───────┬─────────────────────────────┤"));
  console.log(chalk.yellow("   │       │                             │"));
  console.log(chalk.yellow("   │       │                             │"));
  console.log(chalk.yellow("   │ ") + "aside" + chalk.yellow(" │           ") + "view" + chalk.yellow("              │"));
  console.log(chalk.yellow("   │       │                             │"));
  console.log(chalk.yellow("   │       │                             │"));
  console.log(chalk.yellow("   ├───────┴─────────────────────────────┤"));
  console.log(chalk.yellow("   │               ") + "footer" + chalk.yellow("                │"));
  console.log(chalk.yellow("   ╰─────────────────────────────────────╯"));

  /**
    grail
   ╭─────────────────────────────────────╮
   │               header                │
   ├───────┬─────────────────────┬───────┤
   │       │                     |       │
   │       │                     |       │
   │ empty │        view         | empty │
   │       │                     |       │
   │       │                     |       │
   ├───────┴─────────────────────┴───────┤
   │               footer                │
   ╰─────────────────────────────────────╯
   */
  console.log("grail" + ":");
  console.log(chalk.yellow("   ╭─────────────────────────────────────╮"));
  console.log(chalk.yellow("   │               ") + "header" + chalk.yellow("                │"));
  console.log(chalk.yellow("   ├───────┬─────────────────────┬───────┤"));
  console.log(chalk.yellow("   │       │                     |       │"));
  console.log(chalk.yellow("   │       │                     |       │"));
  console.log(chalk.yellow("   │ ") + "empty" + chalk.yellow(" │        ") + "view" + chalk.yellow("         | ") + "empty" + chalk.yellow(" │"));
  console.log(chalk.yellow("   │       │                     |       │"));
  console.log(chalk.yellow("   │       │                     |       │"));
  console.log(chalk.yellow("   ├───────┴─────────────────────┴───────┤"));
  console.log(chalk.yellow("   │               ") + "footer" + chalk.yellow("                │"));
  console.log(chalk.yellow("   ╰─────────────────────────────────────╯"));

}

// 获取对应的模式的参数
Layout.getParams = function (type) {
  switch (type) {
    case "default-no-aside": return {
      needHeader: true,
      needFooter: false,
      needCenterLeft: true,
      needAside: true,
      needCenterRight: false
    }
    case "default-footer": return {
      needHeader: true,
      needFooter: true,
      needCenterLeft: true,
      needAside: true,
      needCenterRight: false
    }
    case "grail": return {
      needHeader: true,
      needFooter: true,
      needCenterLeft: true,
      needAside: false,
      needCenterRight: true
    }


    default: return {
      needHeader: true,
      needFooter: false,
      needCenterLeft: true,
      needAside: true,
      needCenterRight: false
    }
  }
}


module.exports = Layout;
