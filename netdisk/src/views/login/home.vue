<template>
<div class="home">
    <el-button type="primary" class="loginbtn" round @click="gologin">去登录</el-button>

</div>
</template>

<script>
export default {
  name: 'HomePage',
  data () {
    return {

    }
  },

  methods: {
    // 点击跳转登陆页面
    gologin () {
      this.$router.push('/account')
    }
  }

}
</script>

<style lang="less" scoped>
.home{
    width: 100%;
    height: 960px;
    background-image: url(@/assets/home.png);
    background-size: 100% 100%;
}
.loginbtn{
    position: absolute;
    top: 700px;
    left: 100px;
    width: 380px;
    height: 120px;
    border-radius: 60cap !important;
    font-size: 60px;
    box-shadow: 0 0 25px #cac6c6;

}
</style>
