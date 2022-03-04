<template>

  <div id="table">

    <div id="content">

      <h4>Management</h4>

      <el-table
          :data="tableData"
          height="80vh"
          stripe
          style="width: 80vw"
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
        </el-table-column>
      </el-table>

    </div>


  </div>


</template>

<script>

const {ipcRenderer} = require('electron');

export default {
  name: "ManagementAWSPage",
  mounted() {
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
  data() {
    return {
      tableData: [],
    }
  },
  methods:{
    handleClick(val) {
      console.log(val)
    }
  }
}
</script>

<style scoped>

  #table{
    width: 100%;
  }

  #content{
    width: 90%;
    height: 80vh;
    margin: 0 auto;
  }

</style>