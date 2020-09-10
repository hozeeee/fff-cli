global.console.log('-------- process.env.NODE_ENV: ' + process.env.NODE_ENV + ' --------');
global.console.log('-------- process.env.TEST_ENV: ' + process.env.TEST_ENV + ' --------');

module.exports = {
  publicPath: './',

  devServer: {
    proxy: {
      // 代理配置参考
      "/dev": {
        target: "http://10.79.10.72:8848",
        changeOrigin: true,
        pathRewrite: {
          "^/dev": "/"
        }
      }
    }
  },

  // 多页面配置
  pages: {
    "index": {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html"
    },
    "example": {
      entry: "src/otherPages/ExamplePage/main.js",
      template: "public/index.html",
      filename: "example.html"
    },
  },

  configureWebpack: config => {},

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        }
      }
    }
  },

  // 包含运行时解析器
  runtimeCompiler: true
}