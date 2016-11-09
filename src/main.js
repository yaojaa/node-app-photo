import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import LoginView from './components/Login.vue'
import aboutUs from './components/about_us.vue'
import eventPage from './components/eventsPage.vue'
import homeView from './components/homeView.vue'
import aticleView from './components/aticleView.vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.use(VueRouter)
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar },
  { path: '/Login', component: LoginView },
  { path: '/about_us', component: aboutUs },
  { path: '/event', component: eventPage },
  { path: '/', component: homeView },
  {
    path: '/subject/:id',
    name: 'subject',
    component: aticleView
  }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes // （缩写）相当于 routes: routes
})

// const app = new Vue({
//   router
// }).$mount('#app')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App }
})
