import Vue from "vue";
import router from "@/router";



const defaultRouteField = {
  name: "name",
  path: "path", // 非必填。默认是 /name
  component: "component",
}
/**
 * 此方法用于将具有"嵌套关系"的菜单 转换成 "单层结构"的路由列表
 * @param { Array } menu 菜单列表的数据
 * @param { {name:string, path:string, component:string}? } routeField 用于说明菜单数据的哪个字段作为路由的参数
 * @param { string } subMenuField 指定子菜单数组的字段。默认是 "children"
 */
export function transformMenuToRoutes(menu = [], routeField, subMenuField = "children") {
  if (!Array.isArray(menu) || menu.length === 0) return;
  if (typeof routeField !== "object") routeField = {};
  routeField = Object.assign(routeField, defaultRouteField);
  let routes = [];
  for (let item of menu) {
    if (Array.isArray(item[subMenuField]) && item[subMenuField].length > 0) {
      transformMenuToRoutes(item["children"], routeField)
    } else {
      let componentName = item[routeField.component];
      if (!componentName) continue;
      routes.push({
        path: routeField.path ? item[routeField.path] : ("/" + item[routeField.name]),
        name: item[routeField.name],
        meta: JSON.parse(JSON.stringify(item)),
        component: Vue.component(`route-${item[routeField.component]}`)
      });
    }
  }
  router.addRoutes(routes);
  router.options.routes.push(...routes);
}



/**
 * 此方法用于将从"嵌套菜单"中找到被选中项的"路径"
 * @param { Array } menu 菜单列表
 * @param { string } keyField 作为 key 的字段名
 * @param { string } subMenuField 作为子菜单数组的字段名
 */
export function getMenuPathKeys(menu = [], targetKey, keyField = "id", subMenuField = "children") {
  let result = null;
  for (let item of menu) {
    let _result = null;
    if (Array.isArray(item[subMenuField]) && item[subMenuField].length > 0) {
      _result = getMenuPathKeys(item[subMenuField], targetKey, keyField, subMenuField);
    } else if (item[keyField] === targetKey) {
      return true;
    }
    if (!_result) continue;
    if (!Array.isArray(_result)) _result = [];
    result = [];
    result.push(..._result, item[keyField]);
  }
  return result;
}