
/* ***** 以项目目录为根路径 ***** */

module.exports.COMMON_REJECT_FILES = [
  "./node_modules",
  "./vue.config.js",
  "./src/App.vue",
  "./src/views/home.js",
  "./.gitignore",
  "./.git"
];

module.exports.MOBILE_REJECT_FILES = [
  "./src/views/examples/commonView.vue"
]

module.exports.PC_REJECT_FILES = [
  "./src/components/examples",
  "./src/views/examples/qqList.vue"
]