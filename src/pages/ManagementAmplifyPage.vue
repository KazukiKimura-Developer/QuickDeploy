<template>
  <div id="content">


    <el-descriptions title="RDS" direction="vertical" :column="3" border id="rdsinfo">

      <template #extra>
        <el-button icon="el-icon-refresh" circle size="small" id="reloadbutton" @click="reload"></el-button>
        <el-link type="primary" @click="goBack">back</el-link>
      </template>

      <el-descriptions-item label="アプリID">{{ app.appId }}</el-descriptions-item>

      <el-descriptions-item label="ドメイン">
        <el-link type="primary" @click="openBrowser(deployUrl)" target="_blank" rel="noopener noreferrer">
          {{ deployUrl }}
        </el-link>
      </el-descriptions-item>
      <el-descriptions-item label="アプリ名">{{ app.name }}</el-descriptions-item>
      <el-descriptions-item label="プラットフォーム">{{ app.platform }}</el-descriptions-item>
      <el-descriptions-item label="リポジトリ">{{ app.repository }}</el-descriptions-item>
      <el-descriptions-item label="STATE" >
        <span v-if="job.status == 'PENDING'" style="color:#464ff3">{{ job.status }}</span>
        <span v-else-if="job.status == 'RUNNING'" style="color:#409EFF">{{ job.status }}</span>
        <span v-else-if="job.status == 'SUCCEED'" style="color:#67C23A">{{ job.status }}</span>
        <span v-else>{{ job.status }}</span>

      </el-descriptions-item>




    </el-descriptions>

  </div>

</template>

<script>
const {ipcRenderer} = require('electron');
const {shell} = require('electron');

export default {
  name: "ManagementAmplifyPage",
  created() {
    this.arnId = this.$route.params.id.toString();
    this.getAmplify()
  },
  data(){
    return{
      arnId: '',
      appId: '',
      branchName: '',
      app: {},
      job: {},
      deployUrl: ''
    }
  },
  methods:{
    getAmplify(){
      const command = 'aws amplify list-apps'
      ipcRenderer.invoke('aws-cli-command', command, null, '    ').then((data) => {
        const apps = JSON.parse(data.stdout).apps

        for(const app of apps){
          if(this.arnId == app.appArn){
            this.appId = app.appId
            this.branchName = app.tags.branch
            this.app = app
            this.deployUrl = 'https://' + this.branchName + '.' + app.defaultDomain
            break
          }
        }

        const command = 'aws amplify list-jobs --app-id '+ this.appId +' --branch-name ' + this.branchName
        ipcRenderer.invoke('aws-cli-command', command, null, '    ').then((data) => {
          this.job = JSON.parse(data.stdout).jobSummaries[0]
          console.log(this.job.status)
        });


      });
    },
    goBack(){
      this.$router.go(-1)
    },
    reload(){
      this.getAmplify()
    },
    openBrowser(url){
      shell.openExternal(url);
    }
  }
}
</script>

<style scoped>

  #content{
    width: 100%;
  }

  #rdsinfo{
    margin: 5% auto 0 auto;
    width: 80%;
  }

  #reloadbutton{
    margin-right: 30px;
  }

</style>