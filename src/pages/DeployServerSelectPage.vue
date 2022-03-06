<template>

  <div>

<!--    <el-dialog-->
<!--        title="作成中"-->
<!--        :visible.sync="dialogVisible"-->
<!--        width="30%">-->

<!--      <i class="el-icon-loading" v-if="isCreated"></i>-->
<!--      <i class="el-icon-success" v-else></i>-->


<!--      <span v-if="isCreated">-->
<!--        フロントエンド構築中です。しばらくお待ちください。-->

<!--      </span>-->
<!--      <span v-else>-->
<!--        構築が完了しました。<br>-->
<!--         {{formLabelAlign.branchName}}.{{ deployUrl }}-->
<!--      </span>-->

<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button @click="deleteStack" v-if="isCreated">中止</el-button>-->
<!--        <el-button type="primary" @click="dialogVisible = false" v-else>閉じる</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->


    <el-dialog
        title="作成中"
        :visible.sync="dialogVisible"
        width="30%">

      <i class="el-icon-success"></i>

      <span>
        インスタンス準備中
      </span>


      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="transitionManagement">管理画面を見る</el-button>
        <el-button  @click="dialogVisible = false">閉じる</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Server</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="backToMain">Back</el-button>
      </div>

      <el-form :label-position="labelPosition"  :model="formLabelAlign">


        <el-form-item label="スタック名" align="left">
          <el-input v-model="formLabelAlign.stackName"></el-input>
        </el-form-item>

        <el-form-item label="サーバー名" align="left">
          <el-input v-model="formLabelAlign.appName"></el-input>
        </el-form-item>

        <el-form-item label="フレームワーク" align="left">
          <el-select v-model="enginevalue" placeholder="Select">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="バージョン" align="left">
          <el-select v-model="version" placeholder="Select">
            <el-option
                v-for="item in version_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="hogehoge" align="left">
          <el-input v-model="formLabelAlign.branchName"></el-input>
        </el-form-item>

        <el-button type="primary" @click="createFront">作成</el-button>


      </el-form>



    </el-card>

  </div>

</template>

<script>
import {CloudFormation} from "../cloudformation/CloudFormation";
import router from "../router";

const {ipcRenderer} = require('electron');

export default {
  name: "DeployServerSelectPage",
  data() {
    return{
      options: [{
        label: 'Ruby on Rails',
        value: 'ruby'
      }, {
        label: 'Spring Boot',
        value: 'spring'
      }, {
        label: 'Django',
        value: 'django'
      }, {
        label: 'flask',
        value: 'flask'
      }, {
        label: 'Laravel',
        value: 'laravel'
      }
      ],
      version_options: [{
        label: '1.8',
        value: 'java1.8'
      }, {
        label: '8',
        value: 'java8'
      }, {
        label: '11',
        value: 'java11'
      }, {
        label: '17',
        value: 'java17'
      }
      ],
      labelPosition: 'top',
      dialogVisible: false,
      formLabelAlign: {
        stackName: '',
        appName: '',
        repository: '',
        branchName: ''
      },
      version: '',
      enginevalue: '',
      isCreated: true,
      intervalKey: null,
      stackId: '',
      deployUrl: ''

    }
  },
  mounted() {
    this.createDatabase()
  },
  methods: {
    createDatabase: function (){
      ipcRenderer.invoke('file-save', JSON.stringify(CloudFormation.geTestYamlFormat, null, '    '))
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
                '--stack-name stack'+
                ' --template-body file://aws/sample.json'

            ipcRenderer.invoke('aws-cli-command', command, null, '    ').then(() => {
              this.dialogVisible = true

            });

          })
          .catch((err) => {
            alert(err);
          });
    },
    backToMain: function (){
      router.push({name: "DevelopMain"})
    },

    transitionManagement: function (){
      this.dialogVisible = false
      router.push({name: "Management"})
    },

    deleteStack: function (){
      if(!this.formLabelAlign.stackName){
        const command = 'aws cloudformation delete-stack ' +
            '--stack-name ' + this.formLabelAlign.stackName
        ipcRenderer.invoke('aws-cli-command', command, null, '    ')
      }


      this.dialogVisible = false
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
          this.deployUrl = outputResult[1].OutputValue

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