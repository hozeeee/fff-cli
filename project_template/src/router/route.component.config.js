import Vue from "vue";

// 路由用到的组件都在这里注册
const TAB_ROUTERs = [
  "home", // 首页
  
  "exampleView" // 示例组件
]


// 都是从 tab_components 文件夹获取对应的组件
for (let item of TAB_ROUTERs) {
  Vue.component(`route-${item}`, resolve => {
    import(`@/views/${item}`).then(component => {
      resolve(component);
    }).catch(() => {});
  })
}



// 说明：将路由组件的注册抽离出来，是为了方便路由的配置，以及路由与菜单栏的配合。