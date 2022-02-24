<template>

  <div>

    <el-dialog
        title="作成中"
        :visible.sync="dialogVisible"
        width="30%">

      <i class="el-icon-loading" v-if="isCreated"></i>
      <i class="el-icon-success" v-else></i>


      <span v-if="isCreated">フロントエンド構築中です。しばらくお待ちください。</span>
      <span v-else>構築が完了しました。</span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

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

  </div>

</template>

<script>
import router from "../router";
import {CloudFormation} from "../cloudformation/CloudFormation";
const {ipcRenderer} = require('electron');

export default {
  name: "DeployFrontSelectPage",
  data() {
    return{
      labelPosition: 'top',
      dialogVisible: false,
      formLabelAlign: {
        stackName: '',
        appName: '',
        repository: '',
        branchName: ''
      },
      isCreated: true,
      intervalKey: null,

    }
  },
  methods: {
    backToMain: function (){
      router.push({name: "DevelopMain"})
    },

    createFront: function (){


      ipcRenderer.invoke('file-save', JSON.stringify(CloudFormation.getAmplifyYamlFormat(this.formLabelAlign.appName, this.formLabelAlign.repository,this.formLabelAlign.branchName), null, '    '))
          .then((data) => {
            if( data.status === undefined ){
              return(false);
            }
            // 保存できなかった
            if( !data.status ){
              alert(`ファイル保存できません。\n${data.message}`);
              return(false);
            }

            // 保存できた

            const command = 'aws cloudformation create-stack ' +
                '--stack-name ' + this.formLabelAlign.stackName +
                ' --template-body file://aws/sample.json'

            ipcRenderer.invoke('aws-cli-command', command, null, '    ').then(() => {
              this.intervalKey = setInterval(this.requestStackInformation, 3000)
              this.dialogVisible = true



            });

          })
          .catch((err) => {
            alert(err);
          });
    },

    requestStackInformation: function (){
      const command = 'aws cloudformation describe-stacks ' +
          '--stack-name ' + this.formLabelAlign.stackName
      ipcRenderer.invoke('aws-cli-command', command, null, '    ').then((data) => {
        const outputResult = JSON.parse(data.stdout).Stacks[0].Outputs
        console.log(outputResult)
        if(typeof outputResult !== "undefined"){
          this.isCreated = false
          const appId = outputResult[0].OutputValue

          ipcRenderer.invoke('aws-cli-webhooks', appId, this.formLabelAlign.branchName, null, '    ').then((flag) => {
            if(flag){
              console.log(flag)
            }
          })


          clearInterval(this.intervalKey)

        }
      })
    }

  }
}
</script>

<style scoped>
  .box-card {
    width: 80%;
    margin: 0 auto;

  }

  .el-icon-success{
    color: #67C23A;
  }

</style>