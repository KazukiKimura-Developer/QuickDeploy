import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import DeployMainPage from "../pages/DeployMainPage.vue";
import DeployDatabaseSelectPage from "../pages/DeployDatabaseSelectPage";
import DeployFrontSelectPage from "../pages/DeployFrontSelectPage";
import DeployServerSelectPage from "../pages/DeployServerSelectPage";
import ManagementAWSPage from "../pages/ManagementAWSPage";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/develop',
    name: 'DevelopMain',
    component: DeployMainPage
  },
  {
    path: '/database',
    name: 'Database',
    component: DeployDatabaseSelectPage
  },{
    path: '/front',
    name: 'Front',
    component: DeployFrontSelectPage
  },{
    path: '/server',
    name: 'Server',
    component: DeployServerSelectPage
  },{
    path: '/management',
    name: 'Management',
    component: ManagementAWSPage
  }


]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
