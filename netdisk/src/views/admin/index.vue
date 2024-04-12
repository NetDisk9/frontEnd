<template>
    <!-- 管理员页面架子 -->
    <div>
        <!-- 头部区域 -->
      <div id="top-bar">
        <div class="logo"></div>
      </div>
      <!-- 上下分割线 -->
      <div class="top"></div>

      <!-- 下方内容区域 -->
      <div id="content">
        <!-- 导航栏全部区域 -->
        <div id="area1" class="area">
            <!-- 存放导航区域 -->
            <el-menu
            default-active="2"
            class="el-menu-vertical-demo">
            <!-- 用户管理导航 -->
        <el-menu-item index="2">
        <i class="el-icon-user" ></i>
        <span slot="title">用户管理</span>
        </el-menu-item>
    </el-menu>
        </div>

        <!-- 内容显示区域用于存放路由出口 -->
        <div class="areacontent">
            <div id="area2">
             <!-- 存放路由出口 -->
             <router-view></router-view>
            </div>
        </div>
      </div>
    </div>
  </template>

<script>

export default {
  name: 'adminPage',
  data () {
    return {

    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

  <style scoped>
  body {
    margin: 0;
    padding: 0;
    background-color: white;
    font-family: Arial, sans-serif;
  }
  #top-bar {
    min-height: 65px;
    width: 100%;
    height: 65px;
    background-color: white;
  }

  .logo {
    width:160px ;
    height: 50px;
    margin-top: 10px;
    margin-left: 2%;
    margin-bottom: -2.35%;
    background-image: url('@/assets/logo2.png');
    background-size:100% 100% ;
  }
  #content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 100vh;
  background-color: #F2F4FA;

}
  #area1 {
    width: 14%;
    background-color: white;
  }
  #area2 {
    width: 90%;
    height: 90%;
    background-color: white;
  }

  .top{
    height: 20px;
    background-color: #F2F4FA;
  }
  .el-menu-vertical-demo{
    width: 100%;
  }
  .areacontent{
    width: 85%;
    height: 100vh;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;

  }
  .el-menu-item{
    text-align: center;
    font-size: large;
  }

  </style>
