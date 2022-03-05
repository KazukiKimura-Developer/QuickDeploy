<template>


  <div id="table">

    <div id="content">

      <div id="title">
        <h4 id="tabletitle">Management</h4>


        <el-button icon="el-icon-refresh" circle size="small" id="reloadbutton" @click="reload"></el-button>
        <el-link type="primary" @click="goBack">back</el-link>

      </div>


      <el-table
          :data="tableData"
          height="90vh"
          stripe
          style="width: 93vw"
          @row-click="handleClick">

        <el-table-column
            prop="logicalResourceId"
            label="リソースID">
        </el-table-column>
        <el-table-column
            prop="resourceType"
            label="リソースタイプ">
          <template slot-scope="scope">
            <span v-if="scope.row.resourceType=='AWS::RDS::DBInstance'"><el-link type="primary" @click="transitionPage('DBInstance', scope.row.physicalResourceId)">{{ scope.row.resourceType }}</el-link></span>
            <span v-else-if="scope.row.resourceType=='AWS::EC2::Instance'"><el-link type="primary" @click="transitionPage('EC2', scope.row.physicalResourceId)">{{ scope.row.resourceType }}</el-link></span>
            <span v-else-if="scope.row.resourceType=='AWS::Amplify::App'"><el-link type="primary" @click="transitionPage('Amplify', scope.row.physicalResourceId)">{{ scope.row.resourceType }}</el-link></span>
            <span v-else>{{ scope.row.resourceType }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="lastUpdatedTimestamp"
            label="作成日時">
        </el-table-column>
        <el-table-column
            prop="resourceStatus"
            label="STATUS">
          <template slot-scope="scope">
            <span v-if="scope.row.resourceStatus=='CREATE_COMPLETE'" style="color:#67C23A"><i class="el-icon-success"></i>{{ scope.row.resourceStatus }}</span>
            <span v-else-if="scope.row.resourceStatus=='CREATE_IN_PROGRESS'" style="color:#464ff3"><i class="el-icon-success"></i>{{ scope.row.resourceStatus }}</span>
            <span v-else-if="scope.row.resourceStatus=='CREATE_FAILED'" style="color:#F56C6C"><i class="el-icon-warning"></i>{{ scope.row.resourceStatus }}</span>
            <span v-else-if="scope.row.resourceStatus=='ROLLBACK_IN_PROGRESS'" style="color:#F56C6C"><i class="el-icon-warning"></i>{{ scope.row.resourceStatus }}</span>
            <span v-else-if="scope.row.resourceStatus=='ROLLBACK_FAILED'" style="color:#F56C6C"><i class="el-icon-warning"></i>{{ scope.row.resourceStatus }}</span>
            <span v-else-if="scope.row.resourceStatus=='ROLLBACK_COMPLETE'" style="color:#F56C6C"><i class="el-icon-warning"></i>{{ scope.row.resourceStatus }}</span>
            <span v-else-if="scope.row.resourceStatus=='DELETE_IN_PROGRESS'" style="color:#409EFF"><i class="el-icon-error"></i>{{ scope.row.resourceStatus }}</span>
            <span v-else-if="scope.row.resourceStatus=='DELETE_FAILED'" style="color:#F56C6C"><i class="el-icon-warning"></i>{{ scope.row.resourceStatus }}</span>
            <span v-else-if="scope.row.resourceStatus=='DELETE_COMPLETE'" style="color:#409EFF"><i class="el-icon-error"></i>{{ scope.row.resourceStatus }}</span>
            <span v-else>{{ scope.row.resourceStatus }}</span>
          </template>
        </el-table-column>
      </el-table>

    </div>


  </div>

</template>

<script>

import router from "../router";

const {ipcRenderer} = require('electron');

export default {
  name: "ManagementStackDetailPage",
  created() {
    this.stackId = this.$route.params.stackid.toString();
    this.getStackDetail()

  },
  data(){
    return {
      stackId: '',
      tableData: [],
    }
  },
  methods:{
    handleClick: function(val) {
      console.log(val)
    },
    getStackDetail: function (){
      const command = 'aws cloudformation list-stack-resources --stack-name ' + this.stackId
      ipcRenderer.invoke('aws-cli-command', command, null, '    ').then((data) => {
        const awsResources = JSON.parse(data.stdout).StackResourceSummaries
        for(const awsResource of awsResources){
          this.tableData.push({
            logicalResourceId: awsResource.LogicalResourceId,
            physicalResourceId: awsResource.PhysicalResourceId,
            resourceType: awsResource.ResourceType,
            lastUpdatedTimestamp: new Date(awsResource.LastUpdatedTimestamp).toLocaleString(),
            resourceStatus: awsResource.ResourceStatus
          })
        }
      });
    },
    transitionPage: function (name, id){
      router.push({name: name, params: { id: id}})
    },
    goBack(){
      this.$router.go(-1)
    },
    reload(){
      this.tableData.splice(0)
      this.getStackDetail()
    }
  }
}
</script>

<style scoped>

  #table{
    width: 100%;
  }

  #content{
    width: 93%;
    height: 80vh;
    margin: 0 auto;
  }

  #reloadbutton{
    margin-right: 30px;
    margin-left: 50px;
  }

  #tabletitle{
    display: inline;
  }


  #title{
    margin: 20px 0 0 0;
    text-align: center;

  }

</style>