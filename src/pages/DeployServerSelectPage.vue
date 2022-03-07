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
        :visible.sync="dialogVisible">

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

        <el-form-item label="フレームワーク" align="left">
          <el-select v-model="formLabelAlign.framework" placeholder="Select">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="DBエンジン" align="left">
          <el-select v-model="formLabelAlign.engineValue" placeholder="Select">
            <el-option
                v-for="item in dbEngin"
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



<!--        <el-form-item label="バージョン" align="left">-->
<!--          <el-select v-model="version" placeholder="Select">-->
<!--            <el-option-->
<!--                v-for="item in version_options"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->


        <el-button type="primary" @click="createDatabase">作成</el-button>


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
      dbEngin: [{
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
      labelPosition: 'top',
      dialogVisible: false,
      formLabelAlign: {
        stackName: '',
        dbName: '',
        masterUserName: '',
        masterUserPassword: '',
        engineValue: '',
        framework: '',
      },
      version: '',
      isCreated: true,
      intervalKey: null,
      stackId: '',
      deployUrl: '',

      springBootCommand: [
        "#!/bin/bash\n",
        "sudo yum update -y\n",
        "sudo yum install -y java-1.8.0-openjdk-devel.x86_64\n",
        "sudo wget http://repos.fedorapeople.org/repos/dchen/apache-maven/epel-apache-maven.repo -O /etc/yum.repos.d/epel-apache-maven.repo\n",
        "sudo sed -i s/\\$releasever/6/g /etc/yum.repos.d/epel-apache-maven.repo\n",
        "sudo yum install -y apache-maven\n",
      ]

    }
  },
  methods: {
    createDatabase: function (){
      ipcRenderer.invoke('file-save', JSON.stringify(CloudFormation.geEC2YamlFormat(this.formLabelAlign, this.springBootCommand), null, '    '))
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