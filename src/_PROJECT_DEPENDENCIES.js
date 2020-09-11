module.exports.dependencies = {
  "ant-design-vue": "^1.6.5",
  "axios": "^0.20.0",
  "core-js": "^3.6.5",
  "dayjs": "^1.8.35",
  "perfect-scrollbar": "^1.5.0",
  "vue": "^2.6.11",
  "vue-router": "^3.4.3",
  "vuex": "^3.5.1"
}

module.exports.devDependencies = {
  "@vue/cli-plugin-babel": "~4.5.0",
  "@vue/cli-plugin-eslint": "~4.5.0",
  "@vue/cli-service": "~4.5.0",
  "babel-eslint": "^10.1.0",
  "babel-plugin-import": "^1.13.0",
  "cross-env": "^7.0.2",
  "eslint": "^6.7.2",
  "eslint-plugin-vue": "^6.2.2",
  "filemanager-webpack-plugin": "^2.0.5",
  "less": "^3.12.2",
  "less-loader": "^7.0.1",
  "vue-template-compiler": "^2.6.11"
}

// 用于对上面两部分的依赖添加 描述
module.exports.dependenciesDescript = {
  "ant-design-vue": "UI框架(已配置按需加载)",
  "less": "css于处理(不用sass是因为安装太苛刻)",
  "dayjs": "日期插件，可用于日期格式化",
  "perfect-scrollbar": "美化滚动条样式"
}