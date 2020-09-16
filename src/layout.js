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

  /**
    mobile
   ╭───────────────────╮
   │      header       │
   ├───────────────────┤
   │                   │
   │                   │
   │                   │
   │       view        │
   │                   │
   │                   │
   │                   │
   ╰───────────────────╯
   */
  console.log("mobile" + ":");
  console.log(chalk.yellow("   ╭───────────────────╮"));
  console.log(chalk.yellow("   │      ") + "header" + chalk.yellow("       │"));
  console.log(chalk.yellow("   ├───────────────────┤"));
  console.log(chalk.yellow("   │                   │"));
  console.log(chalk.yellow("   │                   │"));
  console.log(chalk.yellow("   │                   │"));
  console.log(chalk.yellow("   │       ") + "view" + chalk.yellow("        │"));
  console.log(chalk.yellow("   │                   │"));
  console.log(chalk.yellow("   │                   │"));
  console.log(chalk.yellow("   │                   │"));
  console.log(chalk.yellow("   ╰───────────────────╯"));

}

// 获取对应的模式的参数
Layout.getParams = function (type, {
  needHeader,
  needFooter,
  minWidth,
  minHeight
}) {
  let result = {
    needHeader: true,
    needFooter: false,
    needAside: true,
    isGrail: false,
    isMobile: false,
    minWidth,
    minHeight
  };
  if (typeof needHeader !== "boolean") needHeader = result.needHeader;
  if (typeof needFooter !== "boolean") needFooter = result.needFooter;
  switch (type) {
    case "default-no-aside":
      result.needAside = false;
      break;
    case "default-footer":
      result.needFooter = true;
      break;
    case "grail":
      result.needFooter = true;
      result.needAside = false;
      result.isGrail = true;
      break;
    case "mobile":
      result.needAside = false;
      result.isMobile = true;
      result.minWidth = "unset";
      result.minHeight = "unset";
      break;

    case "default":
    default:
      null;
  }
  result.needHeader = needHeader;
  if (!needFooter) result.needFooter = needFooter;
  return result;
}

module.exports = Layout;