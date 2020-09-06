import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';

Vue.use(VueRouter);

export default new VueRouter({
	mode: 'history',
	routes: [
		{ path: '/', name: "home", component: Home },
	]
});



// // 全局前置守卫
// router.beforeEach((to, from, next) => { })
// // 全局解析守卫
// router.beforeEach((to, from, next) => { })
// // 全局后置钩子
// router.afterEach((to, from) => { })