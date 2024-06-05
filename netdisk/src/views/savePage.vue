<template>
    <div class="savehome">
        <div class="bigleft" style="flex-direction: column">
            <div class="left-top" style="display: flex;">
                <div class="touxiang">
                    <div style="display: flex; justify-content: center; align-items: center;">
                        <div :style="{ backgroundImage: 'url(' + avatarPreviewUrl + ')' }" id="avatar-preview">
                        </div>
                    </div>
                </div>
                <div class="top-right">
                    <div style="font-size: 20px;">来自</div>
                    <div style="font-size: 30px;">{{ username }}</div>
                    <div style="font-size: 20px;">的分享</div>
                </div>
            </div>
            <div class="tiquma">
                <input class="QKKaIE" type="text" maxlength="20" placeholder="请输入提取码" v-model="codeInput" :disabled="isShareCancelled">
                <el-button type="primary" class="submitbtn" round @click="gosubmit" :disabled="isShareCancelled || isShareExpired" >文件提取</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'savePage',
  data () {
    return {
      username: '未知用户', // 默认显示 "未知用户"
      avatarPreviewUrl: '', // 初始化为默认值或空字符串
      codeInput: '', // 用于绑定输入框中的提取码
      isShareCancelled: false,
      isShareExpired: false
    }
  },
  computed: {
    surl () {
      return this.$route.params.surl
    }
  },
  async created () {
    this.getshareMessage()
    console.log(this.$route.params.surl)
  },
  methods: {
    // 检查链接是否过期
    formatDate (date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，所以需要加1
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    getshareMessage () {
      console.log('已发送请求')
      fetch('http://8.134.178.176:8080/file/share/info?link=' + this.$route.params.surl, {
        method: 'GET',
        headers: {
          Authorization: this.$store.state.usertoken
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('获取用户信息失败')
          }
        })
        .then(data => {
          if (data && data.code === 200 && data.data) {
            const userInfo = data.data
            // console.log(userInfo)
            // console.log(this)// 调试 this 的值
            this.username = userInfo.username
            // document.getElementById('avatar-preview').style.backgroundImage = `url(${userInfo.avatar})`
            this.avatarPreviewUrl = userInfo.avatar
            // console.log('头像url:' + userInfo.avatar)
            if (data.status === 1) {
              this.codeInput = '该分享已被取消'
              this.isShareCancelled = true
            }
            const currentTime = new Date()
            // const currentTime = new Date('Tue Jul 09 2024 17:09:55 GMT+0800 (中国标准时间)')
            const endTimeed = new Date(userInfo.endTime)
            console.log('当前时间' + currentTime)
            console.log('过期时间' + endTimeed)
            console.log(currentTime)
            if (currentTime > endTimeed) {
              console.log('该分享已过期')
              this.codeInput = '该分享链接已过期'
              this.isShareExpired = true
            }
          } else {
            // console.error(data.code)
          }
        })
        .catch(error => {
          console.error('发生错误:', error.message)
          // alert('获取用户信息失败，请重试！')
        })
    },
    gosubmit () {
      const url = `http://8.134.178.176:8080/file/share/code/check?link=${this.$route.params.surl}&code=${this.codeInput}`
      console.log(this.codeInput)
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: this.$store.state.usertoken
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json()
            // this.$router.push({ name: 'save', params: { surl: this.$route.params.surl } }).catch(err => err)
          } else {
            throw new Error('验证码错误')
              .catch(error => {
                console.error('发生错误:', error.message)
                // alert('获取用户信息失败，请重试！')
              })
          }
        })
        .then(data => {
          if (data && data.code === 200) {
            console.log(data.code)
            this.$message({
              message: '验证码正确，提取文件中',
              type: 'success',
              duration: 2000
            })
            this.$router.push({ name: 'save', params: { surl: this.$route.params.surl } }).catch(err => err)
          } else {
            console.log(data.code)
            this.$message({
              message: '验证码错误，请重新输入',
              type: 'error',
              duration: 2000
            })
          }
        })
        // .then(data => {
        //   if (data && data.code === 200 && data.data) {
        //     const userInfo = data.data
        //     // console.log(userInfo)
        //     document.getElementById('avatar-preview').style.backgroundImage = `url(${userInfo.avatar})`
        //     this.username = userInfo.username
        //   } else {
        //     // console.error(data.code)
        //   }
        // })
        .catch(error => {
          console.error('发生错误:', error.message)
          // alert('获取用户信息失败，请重试！')
        })
    }
  }
}
</script>
<style lang="less" scoped>
    .savehome{
        width: 100vw;
        height: 100vh;
        background-image: url(@/assets/savePage.png);
        background-size: 100% 100%;
        position: relative;
    }
    .submitbtn{
        border-radius: 60cap !important;
        font-size: 30px;
        box-shadow: 0 0 25px #cac6c6;
        width: 100%;
        height: 54px;
        font-size: 25px;
    }
    .bigleft{
        width: 40%;
        height: 100%;
        margin-left: 3%;
        // background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .left-top{
        width: 70%;
        height: 20%;
        padding-top: 40%;
    }
    .top-right{
        width: 60%;
        height: 60%;
        // background-color: black;
        // margin-left: 8%;
        // padding-top: 15%;
        margin-left: 5%;
    }
    .touxiang{
      width: 110px;
      height: 110px;
    }
    #avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #ccc;
  background-size: cover;
  background-position: center;
  position: relative;
  left: 0;
  bottom: 0;
//   margin-top: 200px;
}
.tiquma{
    width: 47%;
    height: 50%;
}
.QKKaIE {
    margin: 50px 0 29px;
    box-sizing: border-box;
    width: 100%;
    height: 54px;
    border: 2px solid rgba(0, 0, 0, .05);
    border-radius: 28px;
    border-color: rgb(65, 141, 255);
    font-size: 18px;
    text-align: center;
}
</style>
