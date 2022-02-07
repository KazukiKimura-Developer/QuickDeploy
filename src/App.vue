<template>
  <div id="app">
    <el-row>
      <el-col :span="6">
        <h2>Quick Deploy</h2>
        <NavBar/>
      </el-col>
      <el-col :span="18" id="main">
        <router-view/>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  import NavBar from "./components/NavBar";
  export default {
    components: {NavBar}
  }


</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
