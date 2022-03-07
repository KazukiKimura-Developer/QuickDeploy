<template>

  <div>

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
        <span> Database</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="backToMain">Back</el-button>
      </div>

      <el-form :label-position="labelPosition"  :model="formLabelAlign">
        <el-form-item label="スタック名" align="left">
          <el-input v-model="formLabelAlign.stackName"></el-input>
        </el-form-item>

        <el-form-item label="DBエンジン" align="left">
          <el-select v-model="enginevalue" placeholder="Select">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="データベース名" align="left">
          <el-input v-model="formLabelAlign.dbName"></el-input>
        </el-form-item>

        <el-form-item label="マスターユーザー名" align="left">
          <el-input v-model="formLabelAlign.masterUserName"></el-input>
        </el-form-item>

        <el-form-item label="マスターユーザーパスワード" align="left">
          <el-input v-model="formLabelAlign.masterUserPassword"></el-input>
        </el-form-item>

        <el-button type="primary" @click="createDatabase">作成</el-button>


      </el-form>



    </el-card>


  </div>





<!--    <h2>Database</h2>-->





</template>

<script>
import router from "../router";
import {CloudFormation} from "../cloudformation/CloudFormation";


export default {
  name: "DeployDatabaseSelectPage",
  data() {
    return {
      options: [{
        label: 'Amazon Aurora',
        value: 'aurora'
      }, {
        label: 'MariaDB',
        value: 'mariadb'
      }, {
        label: 'MySQL',
        value: 'mysql'
      }, {
        label: 'Oracle',
        value: 'oracle-ee'
      }, {
        label: 'PostgreSQL',
        value: 'postgres'
      }, {
        label: 'SQL Server',
        value: 'sqlserver-ee'
      }],
      enginevalue: '',
      labelPosition: 'top',
      formLabelAlign: {
        stackName: '',
        dbName: '',
        masterUserName: '',
        masterUserPassword: ''
      },
      dialogVisible: false,
    }
  },
  methods: {
    backToMain: function (){
      router.push({name: "DevelopMain"})
    },
    createDatabase: function (){
      const {ipcRenderer} = require('electron');



      ipcRenderer.invoke('file-save', JSON.stringify(CloudFormation.getRdsYamlFormat(this.enginevalue, this.formLabelAlign.dbName, this.formLabelAlign.masterUserName,this.formLabelAlign.masterUserPassword), null, '    '))
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

            console.log(command)

            ipcRenderer.invoke('aws-cli-command', command, null, '    ').then((data) => {
              console.log(data)
              this.dialogVisible = true
            });

          })
          .catch((err) => {
            alert(err);
          });
    },
    transitionManagement: function (){
      this.dialogVisible = false
      router.push({name: "Management"})
    },
  }
}
</script>

<style scoped>

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 80%;
    margin: 0 auto;

  }

  .el-icon-success{
    color: #67C23A;
  }

</style>