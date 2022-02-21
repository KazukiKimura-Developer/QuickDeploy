<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>Front</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="backToMain">Back</el-button>
    </div>

    <el-form :label-position="labelPosition"  :model="formLabelAlign">


      <el-form-item label="スタック名" align="left">
        <el-input v-model="formLabelAlign.stackName"></el-input>
      </el-form-item>

      <el-form-item label="アプリ名" align="left">
        <el-input v-model="formLabelAlign.appName"></el-input>
      </el-form-item>

      <el-form-item label="githubリポジトリ" align="left">
        <el-input v-model="formLabelAlign.repository"></el-input>
      </el-form-item>

      <el-form-item label="ブランチ名" align="left">
        <el-input v-model="formLabelAlign.branchName"></el-input>
      </el-form-item>



      <el-button type="primary" @click="createFront">作成</el-button>


    </el-form>



  </el-card>
</template>

<script>
import router from "../router";

export default {
  name: "DeployFrontSelectPage",
  data() {
    return{
      labelPosition: 'top',
      formLabelAlign: {
        stackName: '',
        appName: '',
        repository: '',
        branchName: ''
      }

    }
  },
  methods: {
    backToMain: function (){
      router.push({name: "DevelopMain"})
    },
  }
}
</script>

<style scoped>
  .box-card {
    width: 80%;
    margin: 0 auto;

  }

</style>