<template>
  <div id="content">

<!--    <a @click="$router.back()">back</a>-->

    <el-descriptions title="EC2" direction="vertical" :column="3" border id="ec2info">

      <template #extra>
        <el-button icon="el-icon-refresh" circle size="small" id="reloadbutton" @click="reload"></el-button>
        <el-link type="primary" @click="goBack">back</el-link>
      </template>

      <el-descriptions-item label="インスタンスID">{{ instanceInfo.InstanceId }}</el-descriptions-item>
      <el-descriptions-item label="イメージID">{{ instanceInfo.ImageId }}</el-descriptions-item>
      <el-descriptions-item label="プラットフォーム" >{{ instanceInfo.PlatformDetails }}</el-descriptions-item>
      <el-descriptions-item label="AvailabilityZone">{{ instanceInfo.Placement.AvailabilityZone }}</el-descriptions-item>
      <el-descriptions-item label="インスタンスタイプ">{{ instanceInfo.InstanceType }}</el-descriptions-item>
      <el-descriptions-item label="キーペア">{{ instanceInfo.KeyName }}</el-descriptions-item>
      <el-descriptions-item label="STATE" >{{ instanceInfo.State.Name }}</el-descriptions-item>
      <el-descriptions-item label="プライベートIPアドレス">{{ instanceInfo.PrivateIpAddress }}</el-descriptions-item>
      <el-descriptions-item label="プライベートDNS">{{ instanceInfo.PrivateDnsName }}</el-descriptions-item>
      <el-descriptions-item label="パブリックIPアドレス">{{ instanceInfo.PublicIpAddress }}</el-descriptions-item>
      <el-descriptions-item label="パブリックDNS">{{ instanceInfo.PublicDnsName }}</el-descriptions-item>


    </el-descriptions>

  </div>

</template>

<script>
const {ipcRenderer} = require('electron');


export default {
  name: "ManagementEC2Page",
  created() {
    this.ec2Id = this.$route.params.id.toString();
    this.getDescribeEC2Instance()

  },
  data(){
    return{
      ec2Id: '',
      instanceInfo: {}
    }
  },
  methods:{
    getDescribeEC2Instance: function (){
      const command = 'aws ec2 describe-instances --instance-ids ' + this.ec2Id
      ipcRenderer.invoke('aws-cli-command', command, null, '    ').then((data) => {
        this.instanceInfo = JSON.parse(data.stdout).Reservations[0].Instances[0]
        console.log(this.instanceInfo)
        // const awsResources = JSON.parse(data.stdout).StackResourceSummaries
        // for(const awsResource of awsResources){
        //   this.tableData.push({
        //     logicalResourceId: awsResource.LogicalResourceId,
        //     physicalResourceId: awsResource.PhysicalResourceId,
        //     resourceType: awsResource.ResourceType,
        //     lastUpdatedTimestamp: new Date(awsResource.LastUpdatedTimestamp).toLocaleString(),
        //     resourceStatus: awsResource.ResourceStatus
        //   })
        // }
      });

    },
    goBack(){
      this.$router.go(-1)
    },
    reload(){
      this.getDescribeEC2Instance()
    }
  }

}
</script>

<style scoped>
  #content{
    width: 100%;
  }

  #ec2info{
    margin: 5% auto 0 auto;
    width: 80%;
  }

  #reloadbutton{
    margin-right: 30px;
  }

</style>