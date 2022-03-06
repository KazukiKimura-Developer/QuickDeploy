import Vue from 'vue'
import VueRouter from 'vue-router'
import DeployMainPage from "../pages/DeployMainPage.vue";
import DeployDatabaseSelectPage from "../pages/DeployDatabaseSelectPage";
import DeployFrontSelectPage from "../pages/DeployFrontSelectPage";
import DeployServerSelectPage from "../pages/DeployServerSelectPage";
import ManagementAWSPage from "../pages/ManagementAWSPage";
import ManagementStackDetailPage from "../pages/ManagementStackDetailPage";
import ManagementEC2Page from "../pages/ManagementEC2Page";
import ManagementDBInstancePage from "../pages/ManagementDBInstancePage";
import ManagementAmplifyPage from "../pages/ManagementAmplifyPage";

Vue.use(VueRouter)

const routes = [
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
  },
  {
    path: '/management/stack:stackid',
    name: 'StackDetail',
    component: ManagementStackDetailPage
  },
  {
    path: '/ec2:id',
    name: 'EC2',
    component: ManagementEC2Page
  },
  {
    path: '/dbinstance:id',
    name: 'DBInstance',
    component: ManagementDBInstancePage
  },
  {
    path: '/amplify:id',
    name: 'Amplify',
    component: ManagementAmplifyPage
  }
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
