<template>

  <div id="table">

    <div id="content">

      <div id="title">
        <h4 id="tabletitle">Stacks</h4>

        <el-button icon="el-icon-refresh" circle size="small" id="reloadbutton" @click="reload"></el-button>

      </div>

      <el-table
          :data="tableData"
          height="80vh"
          stripe
          style="width: 93vw"
          @row-click="handleClick">
        <el-table-column
            prop="stackName"
            label="スタック名">
        </el-table-column>
        <el-table-column
            prop="creationTime"
            label="作成日時">
        </el-table-column>
        <el-table-column
            prop="status"
            label="STATUS">

          <template slot-scope="scope">
            <span v-if="scope.row.status=='CREATE_COMPLETE'" style="color:#67C23A"><i class="el-icon-success"></i>{{ scope.row.status }}</span>
            <span v-else-if="scope.row.status=='CREATE_IN_PROGRESS'" style="color:#464ff3"><i class="el-icon-success"></i>{{ scope.row.status }}</span>
            <span v-else-if="scope.row.status=='CREATE_FAILED'" style="color:#F56C6C"><i class="el-icon-warning"></i>{{ scope.row.status }}</span>
            <span v-else-if="scope.row.status=='ROLLBACK_IN_PROGRESS'" style="color:#F56C6C"><i class="el-icon-warning"></i>{{ scope.row.status }}</span>
            <span v-else-if="scope.row.status=='ROLLBACK_FAILED'" style="color:#F56C6C"><i class="el-icon-warning"></i>{{ scope.row.status }}</span>
            <span v-else-if="scope.row.status=='ROLLBACK_COMPLETE'" style="color:#F56C6C"><i class="el-icon-warning"></i>{{ scope.row.status }}</span>
            <span v-else-if="scope.row.status=='DELETE_IN_PROGRESS'" style="color:#409EFF"><i class="el-icon-error"></i>{{ scope.row.status }}</span>
            <span v-else-if="scope.row.status=='DELETE_FAILED'" style="color:#F56C6C"><i class="el-icon-warning"></i>{{ scope.row.status }}</span>
            <span v-else-if="scope.row.status=='DELETE_COMPLETE'" style="color:#409EFF"><i class="el-icon-error"></i>{{ scope.row.status }}</span>
            <span v-else>{{ scope.row.status }}</span>
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
  name: "ManagementAWSPage",
  mounted() {
    this.getStacks()
  },
  data() {
    return {
      tableData: [],
    }
  },
  methods:{
    handleClick(val) {
      console.log(val.stackId)
      router.push({name: 'StackDetail', params: { stackid: val.stackId}})
    },
    goBack(){
      this.$router.back()
    },
    getStacks(){
      const command = 'aws cloudformation list-stacks'
      ipcRenderer.invoke('aws-cli-command', command, null, '    ').then((data) => {
        const stacks = JSON.parse(data.stdout).StackSummaries
        for(const stack of stacks){

          this.tableData.push({
            stackId: stack.StackId,
            stackName: stack.StackName,
            creationTime: new Date(stack.CreationTime).toLocaleString(),
            status: stack.StackStatus,
          })
        }
      });
    },
    reload(){
      this.tableData.splice(0)
      this.getStacks()
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