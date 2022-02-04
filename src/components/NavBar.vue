<template>
  <el-row class="tac">
    <el-col :span="6">
      <h5>Default colors</h5>
      <el-menu
          default-active="index"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose">
        <el-menu-item @click="sendToPage(1)" index="1">
          <i class="el-icon-coin"></i>
          <span>デプロイ</span>
        </el-menu-item>
        <el-menu-item @click="sendToPage(2)" index="2">
          <i class="el-icon-menu"></i>
          <span>管理</span>
        </el-menu-item>
        <el-menu-item @click="sendToPage(3)" index="3">
          <i class="el-icon-setting"></i>
          <span>設定</span>
        </el-menu-item>
      </el-menu>
    </el-col>

  </el-row>


</template>

<script>
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
    }
  }
}
</script>

<style scoped>


</style>