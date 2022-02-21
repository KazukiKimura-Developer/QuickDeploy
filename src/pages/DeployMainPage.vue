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
import {CloudFormation} from "../cloudformation/CloudFormation"
import router from "../router";


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



      routeToSettingName: ['frontSetting', 'serverSetting', 'Database', 'anythingSetting']
    }
  },
  methods:{

    cardClick: function(key) {

      console.log(key)
      router.push({name: this.routeToSettingName[key]})



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