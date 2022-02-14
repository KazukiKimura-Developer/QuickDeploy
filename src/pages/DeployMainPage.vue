<template>

  <div class="developMain" >

      <el-row type="flex" justify="space-around" id="first-row">

        <DevelopCardButton v-for="(cardItem, key) in cardItems1" @click.native="cardClick(key)" :key="key + '-firest'" :title=cardItem.name :icon=cardItem.icon />

      </el-row>

      <el-row type="flex" justify="space-around">
        <DevelopCardButton v-for="(cardItem, key) in cardItems2" @click.native="cardClick(key + 2)" :key="key + '-second'" :title=cardItem.name :icon=cardItem.icon />
      </el-row>

<!--    <DevelopCardButton v-for="(cardItem, key) in cardItems"  :key="key" :title=cardItem.name :icon=cardItem.icon />-->
  </div>


</template>

<script>

import DevelopCardButton from "../components/DevelopCardButton";
import {Rds} from "../cloudformation/Rds"


export default {
  name: "DeployMainPage",
  components: {DevelopCardButton},
  mounted() {

  },
  data(){
    return{

      cardItems1: [
            {name: 'Front', icon: 'devicon-javascript-plain'},
            {name: 'Server', icon: 'devicon-spring-plain-wordmark'},

      ],
      cardItems2: [
            {name: 'Database', icon: 'devicon-mysql-plain'},
            {name: 'Anything', icon: 'devicon-amazonwebservices-original'},
      ],


      routeToSettingName: ['frontSetting', 'serverSetting', 'databaseSetting', 'anythingSetting']
    }
  },
  methods:{




    cardClick: function(key){
      // const util = require('util');
      // const childProcess = require('child_process');
      // const exec = util.promisify(childProcess.exec);



      console.log(key)
      console.log(Rds.getRdsYamlFormat)
      const {ipcRenderer} = require('electron');
      // const yaml =  require('js-yaml')


      // const yamlBooks = yaml.dump(Rds.getRdsYamlFormat)

      ipcRenderer.invoke('file-save', JSON.stringify(Rds.geTestYamlFormat, null, '    '))
          .then((data) => {
            // キャンセルで閉じた
            if( data.status === undefined ){
              return(false);
            }
            // 保存できなかった
            if( ! data.status ){
              alert(`ファイルが開けませんでした\n${data.message}`);
              return(false);
            }

            // 保存できた
            this.$message('This is a message.');
          })
          .catch((err) => {
            alert(err);
          });




      // fs.writeFile('.sample.yaml', yamlBooks, 'utf8', (err => {
      //   if (err){
      //     console.log(err.message)
      //     process.exit(0)
      //   }
      // }))
    }

  }
}
</script>

<style scoped>

  .developMain{


  }

  #first-row{
    margin-top: 2vh;
    margin-bottom: 8vh;
  }



  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }





</style>