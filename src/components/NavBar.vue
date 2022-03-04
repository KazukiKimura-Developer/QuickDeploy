<template>
  <div>


    <el-menu
        default-active="index"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose">
      <el-menu-item index="1" @click="transitionDisplay('DevelopMain')">

        <i class="el-icon-coin"></i>
        <span>デプロイ</span>

      </el-menu-item>
      <el-menu-item @click="transitionDisplay('Management')" index="2">
        <i class="el-icon-menu"></i>
        <span>管理</span>
      </el-menu-item>
      <el-menu-item @click="transitionDisplay('Home')" index="3">
        <i class="el-icon-setting"></i>
        <span>設定</span>
      </el-menu-item>
    </el-menu>

  </div>



</template>

<script>
import router from "../router";

export default {
  name: "NavBar",
  data() {
    return {
      index: 1
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    sendToPage(page){
      console.log(page)
    },
    transitionDisplay(routeName){
      router.push({name: routeName})
    }
  }
}
</script>

<style scoped>


</style>