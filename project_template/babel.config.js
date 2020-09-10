module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // ant-design-vue 按需加载的配置
    [
      "import",
      {
        libraryName: "ant-design-vue",
        libraryDirectory: "es",
        style: true
      }
    ]
  ]
}