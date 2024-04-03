<template>
  <!-- 个人中心界面 -->
  <div>
  <div id="top-bar">
    <div class="logo"></div>
       </div>
    <div id="divider"></div>
    <div id="content">
      <div id="area1" class="area">
        <nav>
          <ul>
            <li><a @click="changeShow(0)">个人中心</a></li>
            <li><a @click="changeShow(3)">更改密码</a></li>
            <li><a @click="changeShow(1)">登录记录</a></li>
            <li><a @click="changeShow(2)">登录设备</a></li>
            <li><a @click="changeShow(4)">登录方式</a></li>
          </ul>
        </nav>
      </div>
      <div id="gap"></div>
      <div id="area2" class="area">
          <div v-if="show===1" style="overflow: auto">
            <EnterHistory/>
          </div>
          <div v-if="show===2" style="overflow: auto">
            <Devices/>
          </div>
          <div v-if="show===3" style="overflow: auto">
              <changeCode/>
          </div>
          <div v-if="show===4" style="overflow: auto">
              <loginMethods/>
          </div>
      </div>
      <div id="gap"></div>
      <div id="area3" class="area">
          <div id="avatar-preview" :style="{backgroundImage: 'url(' + avatarPreviewUrl + ')'}">
          <div class="upload-container">
            <label for="avatar-input" id="avatar-upload" @change="handleAvatarChange">修改</label>
            <input type="file" id="avatar-input" @change="handleAvatarChange">
          </div>
        </div>
        <div id="nickname">昵称</div>
        <div style="width: 50px" id="nickname-edit" @click="handleNicknameEdit">修改</div>
        <div id="user-id">user_id</div>
      </div>
      <input type="file" id="avatar-input" accept="image/*">
    </div>
  </div>
  </template>

<script>
import Devices from '@/components/devices.vue'
import EnterHistory from '@/components/EnterHistory.vue'
import loginMethods from '@/components/loginMethods.vue'
import changeCode from '@/components/changeCode.vue'
export default {
  components: {
    Devices,
    EnterHistory,
    changeCode,
    loginMethods
  },
  data () {
    return {
      show: 0,
      avatarPreviewUrl: '', // 添加一个变量来存储预览头像的 URL
      userInfo: {
        avatar: '',
        username: '',
        id: '',
        // 获取用户token
        usertoken: ''
      },
      newNickname: '',
      userId: '123456',
      selectedLink: 0
    }
  },
  // 创建页面的时候就进行token得获取
  created () {
    console.log(this.$store.state.usertoken)
    this.usertoken = this.$store.state.usertoken
  },
  methods: {
    changeShow (index) {
      this.show = index
    },
    getUserInfo () {
      // console.log("sdffdf");
      fetch('http://8.134.178.176:8080/user/info', {
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
            console.log(userInfo)
            document.getElementById('avatar-preview').style.backgroundImage = `url(${userInfo.avatar})`
            document.getElementById('nickname').innerText = userInfo.username
            document.getElementById('user-id').innerText = `User ID: ${userInfo.id}`
          } else {
            console.error(data.code)
            console.error('获取用户信息失败或者响应不符合预期')
          }
        })
        .catch(error => {
          console.error('发生错误:', error.message)
          alert('获取用户信息失败，请重试！')
        })
    },
    handleAvatarChange (event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const image = new Image()
          image.onload = () => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            const size = Math.min(image.width, image.height)
            canvas.width = 100
            canvas.height = 100
            context.drawImage(image, (image.width - size) / 2, (image.height - size) / 2, size, size, 0, 0, 100, 100)
            const dataURL = canvas.toDataURL('image/png')
            this.avatarPreviewUrl = dataURL // 将预览头像的 URL 设置到组件的变量中
          }
          image.src = e.target.result
        }
        reader.readAsDataURL(file)
        this.simulateUpload(file)
      }
    },
    handleNicknameEdit () {
      const newNickname = prompt('请输入新的昵称：', this.userInfo.username)
      if (newNickname !== null) {
        this.userInfo.username = newNickname
        this.updateNickname(newNickname)
      }
    },
    updateNickname (newNickname) {
      const requestBody = {
        nickname: newNickname
      }
      fetch('http://8.134.178.176:8080/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.$store.state.usertoken
        },
        body: JSON.stringify(requestBody)
      })
        .then(function (response) {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('服务器错误')
          }
        })
        .then(function (data) {
          console.log('Update successful:', data)
        })
        .catch(function (error) {
          console.error('Update failed:', error.message)
          alert('更新失败，请重试！')
        })
    },
    handleLinkClick (index) {
      this.selectedLink = index
    }
  },
  mounted () {
    this.getUserInfo()
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
    width: 100%;
    height: 70px;
    background-color: white;
  }
  #divider {
    width: 100%;
    border-bottom: 2px solid black;
  }
  .logo {
    width:170px ;
    height: 70px;
    margin-left: 2%;
    margin-bottom: -2.35%;
    background-image: url('../assets/logo2.png');
    background-size:100% 100% ;
  }
  #content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 100vh;
  }
  .area {
    height: 100%;
    display: flex;
    justify-content: center;
    position: relative;
  }
  #area1 {
    width: 14%;
    background-color: white;
  }
  #area2 {
    width: 64%;
    background-color: white;
  }
  #area3 {
    width: 18%;
    background-color: white;
  }
  #gap {
    width: 3%;
    background-color: #F2F4FA;
  }
  nav ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
  nav ul li a {
    display: block;
    padding: 13px;
    padding-left: 40px;
    padding-top: 27px;
    color: #4E5969;
    text-decoration: none;
    font-size: 20px;
    font-weight: bold;
    margin-right: 5px;
    background-size: 25px;
    background-repeat: no-repeat;
    background-position: -2px 28px ;
  }
  /* Define different icons for each navigation item */
  nav ul li:nth-child(1) a {
    background-image: url('@/assets/个人中心.png');
  }
  nav ul li:nth-child(2) a {
    background-image: url('@/assets/更改密码.png');
  }
  nav ul li:nth-child(3) a {
    background-image: url('@/assets/登陆记录.png');
  }
  nav ul li:nth-child(4) a {
    background-image: url('@/assets/登录设备.png');
  }
  nav ul li:nth-child(5) a {
    background-image: url('@/assets/登录方式.png');
  }
  #avatar-preview {
    width: 85%;
    height: 13%;
    border-radius: 50%;
    background-color: #ccc;
    background-size: cover;
    background-position: center;
    position: relative;
    bottom: -5%;
    right: -28%;
  }
  #avatar-preview .upload-container {
    position: relative;
    right: -100%;
    bottom: -80%;
    display: flex;
    align-items: center;
  }
  #avatar-upload {
    color: #2881F6;
    cursor: pointer;
    margin-right: 5px;
  }
  #nickname {
    position: relative;
    width: 38%;
    bottom: -21%;
    right: 0%;
    color: black;
    font-size: 20px;
    font-weight: bold;
  }
  #nickname-edit {
    position: relative;
    width: 29%;
    bottom: -21.465%;
    right: -6%;
    color: #2881F6;
    cursor: pointer;
    text-decoration: none;
  }
  #user-id {
    position: relative;
    width: 58%;
    bottom: -27%;
    right: 34%;
    color: black;
    font-size: 16px;
    font-weight: bold;
  }
  #avatar-input {
    display: none; /* Hide the file input */
  }
  nav ul li a.selected {
    color: blue; /* 改变选中链接的文本颜色 */
  }
  /* 在选中链接下方添加小箭头 */
  nav ul li a.selected::after {
    content: ""; /* 添加伪元素 */
    display: block; /* 将伪元素设为块级元素 */
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid blue; /* 小箭头颜色与选中链接文本颜色相同 */
    position: absolute;
    bottom: -8px; /* 控制小箭头距离链接的距离 */
    left: 50%; /* 将小箭头水平居中 */
    transform: translateX(-50%); /* 将小箭头水平居中 */
    content: '';
  }
  .middleBox {
    margin: 50px auto;
    width: 60%;
    height: 600px;
    /* background-color: #f2f2f2; */
    /* border: 2px solid red; */
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    margin-right: 250px;
  }
  /* 内容样式 */
  .contentmima {
    padding-left: 5%;
  }
  /* 标题样式 */
  h2 {
    margin-top: 20px;
    margin-bottom: 10px;
    color: #333;
  }
  h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    color: #333;
    font-weight: lighter;
  }
  </style>
