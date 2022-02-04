<template>



  <el-card class="box-card">
    <div v-for="o in 4" :key="o" class="text item">
      {{'List item ' + o }}
    </div>
  </el-card>


</template>

<script>
export default {
  name: "DeployMainPage"
}
</script>

<style scoped>

  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
  }

</style>