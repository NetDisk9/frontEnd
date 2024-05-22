<template>
  <div>
    <!-- 使用本地图像作为按钮 -->
    <a href="http://localhost:8080/index#/vip">
      <img class="local-icon" src="@/assets/续费SVIP.png" alt="续费SVIP">
    </a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    redirectToVIPPage () {
      // 使用编程式导航跳转到 VIP 页面
      this.$router.push('/index#/vip')
    }
  }
}
</script>

<style scoped>
.local-icon {
  /* 调整图标的大小 */
  width: 218px;
  height: 68px;
}
</style>
