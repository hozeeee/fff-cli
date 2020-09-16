
# fff-cli

fff-cli 主要用于生成配置好的前端项目，是基于 vue\cli@4+ 构建项目的基础上再配置。

此外，还计划将一些可能会用到的命令整合到里面，例如，设置 npm 的仓库地址、检测环境软件的版本等。

欢迎到 [GitHub](https://github.com/hozeeee/fff-cli) 上给我一个小星星哦~

如果有什么好的建议，或者 Bug ，欢迎给我 [Issues](https://github.com/hozeeee/fff-cli/issues) 。

### 安装

```
npm install fff-cli -g
```

### 使用

```
fff-cli <command> [options]
```

例子：

```
fff-cli create my_demo
```

更多命令请使用 `-h` 参数：

```
fff-cli -h
```

### 创建项目

```
fff-cli create my_demo
```

使用 `-l` 参数可以指定布局方式，默认是以"左菜单+头部+内容"的布局：

```
default:
   ╭─────────────────────────────────────╮
   │               header                │
   ├───────┬─────────────────────────────┤
   │       │                             │
   │       │                             │
   │ aside │           view              │
   │       │                             │
   │       │                             │
   ╰───────┴─────────────────────────────╯
```

更多可用布局，可使用 `layout` 命令查看：

```
fff-cli layout
```

如果构建**移动端项目**，请使用 `--layout mobile` ：

```
mobile:
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
```

移动端项目，除了布局不一样，添加的依赖与 PC 端的也有所不同。

### npm 工具

```
fff-cli npm-tools [options]
```

例如，查看和修改 npm 仓库。

获取当前全局设置的 npm 仓库地址：

```
fff-cli npm-tools --get-registry
```

或者快速设置为淘宝镜像源：

```
fff-cli npm-tools --set-registry taobao
```

### 其他软件版本读取

```
fff-cli versions
```

运行后可获取部分(我指定的)软件的版本号。

```
fff-cli: 1.0.0
Node.js: v10.20.1  
npm: 6.14.8 
cnpm: cnpm@6.0.0
yarn: 1.22.4 
git: 2.20.1.windows.1 
python: 2.7.6  
java: java version "1.8.0_212"  Java(TM) SE Runtime Environment (build 1.8.0_212-b10)  Java HotSpot(TM) 64-Bit Server VM (build 25.212-b10, mixed mode)  
JAVA_HOME: JAVA_HOME=C:\Program Files\Java\jdk1.8.0_212  
ANDROID_HOME: ANDROID_HOME=C:\Users\asus\AppData\Local\Android\Sdk 
```
