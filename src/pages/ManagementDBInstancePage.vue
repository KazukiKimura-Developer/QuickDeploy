<template>
  <div id="content">


    <el-descriptions title="RDS" direction="vertical" :column="3" border id="rdsinfo">

      <template #extra>
        <el-button icon="el-icon-refresh" circle size="small" id="reloadbutton" @click="reload"></el-button>
        <el-link type="primary" @click="goBack">back</el-link>
      </template>

      <el-descriptions-item label="インスタンスID">{{ instanceInfo.DBInstanceIdentifier }}</el-descriptions-item>
      <el-descriptions-item label="インスタンスクラス">{{ instanceInfo.DBInstanceClass }}</el-descriptions-item>
      <el-descriptions-item label="AvailabilityZone">{{ instanceInfo.AvailabilityZone }}</el-descriptions-item>
      <el-descriptions-item label="パブリックアクセス">{{ instanceInfo.PubliclyAccessible.toString() }}</el-descriptions-item>
      <el-descriptions-item label="ストレージタイプ">{{ instanceInfo.StorageType }}</el-descriptions-item>
      <el-descriptions-item label="STATE" >{{ instanceInfo.DBInstanceStatus }}</el-descriptions-item>
      <el-descriptions-item label="マルチAZ">{{ instanceInfo.MultiAZ.toString() }}</el-descriptions-item>
      <el-descriptions-item label="DBエンジン">{{ instanceInfo.Engine }}</el-descriptions-item>
      <el-descriptions-item label="エンジンバージョン">{{ instanceInfo.EngineVersion }}</el-descriptions-item>
      <el-descriptions-item label="ポート番号">{{ instanceInfo.Endpoint.Port }}</el-descriptions-item>
      <el-descriptions-item label="データベース名">{{ instanceInfo.DBName }}</el-descriptions-item>
      <el-descriptions-item label="マスターユーザー名">{{ instanceInfo.MasterUsername }}</el-descriptions-item>
      <el-descriptions-item label="エンドポイント">{{ instanceInfo.Endpoint.Address }}</el-descriptions-item>




    </el-descriptions>

  </div>
</template>

<script>

const {ipcRenderer} = require('electron');

export default {
  name: "ManagementDBInstancePage",
  created() {
    this.dbId = this.$route.params.id.toString();
    this.getDescribeDBInstance()
  },
  data(){
    return{
      dbId: ''
    }
  },
  methods:{
    getDescribeDBInstance: function(){
      const command = 'aws rds describe-db-instances --db-instance-identifier ' + this.dbId
      ipcRenderer.invoke('aws-cli-command', command, null, '    ').then((data) => {
        this.instanceInfo = JSON.parse(data.stdout).DBInstances[0]
        console.log(this.instanceInfo)
        // }
      });
    },
    goBack(){
      this.$router.go(-1)
    },
    reload(){
      this.getStackDetail()
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