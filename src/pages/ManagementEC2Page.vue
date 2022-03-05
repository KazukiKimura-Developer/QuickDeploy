<template>
  <div>
    <p>EC2のページだよ</p>
  </div>
</template>

<script>
export default {
  name: "ManagementEC2Page",
  created() {
    this.ec2Id = this.$route.params.id.toString();
  },
  data(){
    return{
      ec2Id: ''
    }
  }
}
</script>

<style scoped>

</style>