<template>
  <el-col class="box-card">
    <el-card class="box-card" @click="cardClick()">
      <el-row>
        <i :class="cardClass" class="cardIcon"></i>
      </el-row>
      <el-row>
        <span class="cardTitle">{{cardTitle}}</span>
      </el-row>
    </el-card>
  </el-col>

</template>

<script>
export default {
  name: "DevelopCardButton",
  props:{
    title:{
      type: String,
      required: true
    },
    icon:{
      type: String,
      required: true
    },
  },
  data(){
    return{
      cardTitle: this.title,
      cardClass: this.icon,
    }
  },
  methods: {
    cardClick: function(){
      console.log("debug")
    }
  }
}
</script>

<style scoped>

  @import "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.14.0/devicon.min.css";

  .cardIcon{
    font-size: 8.5em;
  }

  .cardTitle{
    font-size: 1.5rem;
  }

  .box-card{
    height: 40vh;
    width: 40vh;
  }


</style>