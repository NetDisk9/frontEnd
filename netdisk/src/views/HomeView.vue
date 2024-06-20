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
<!--            LYX-->
            <li><a @click="changeShow(0)" :class="{selected: selectedLink === 0}">个人中心</a></li>
            <li><a @click="changeShow(1)" :class="{selected: selectedLink === 1}">更改密码</a></li>
            <li><a @click="changeShow(2)" :class="{selected: selectedLink === 2}">登录记录</a></li>
            <li><a @click="changeShow(3)" :class="{selected: selectedLink === 3}">登录设备</a></li>
            <li><a @click="changeShow(4)" :class="{selected: selectedLink === 4}">登录方式</a></li>
            <li><a @click="changeShow(5)" :class="{selected: selectedLink === 5}">会员中心</a></li>

          </ul>
        </nav>
      </div>
      <div id="gap"></div>
      <div id="area2" class="area">
        <div v-if="show === 0">
        <el-button type="primary" @click="() => {this.$router.push('/file')}" style="margin-top: 200px">我的文件</el-button>
        </div>
        <div v-if="show===2" style="overflow: auto">
          <EnterHistory/>
        </div>
        <div v-if="show===3" style="overflow: auto">
          <Devices/>
        </div>
        <div v-if="show===1" style="overflow: auto">
          <changeCode/>
        </div>
        <div v-if="show===4" style="overflow: auto">
          <loginMethods/>
        </div>
        <div v-if="show===5" style="overflow: auto">
          <vipCenter/>
        </div>
      </div>
      <div id="gap"></div>
      <div id="area3">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 20px 5px 20px 20px">
         <!--          LYX-->
         <div style="display: flex; justify-content: center; align-items: center;">
            <div id="avatar-preview" :style="{backgroundImage: 'url(' + avatarPreviewUrl + ')'}" @click="triggerAvatarChange"/>
            <input type="file" id="avatar-input" @change="handleAvatarChange">
<!--            LYX-->
        </div>

        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="display: flex; justify-content: center; align-items:center; width: 100%" >
           <!--            LYX-->
           <div id="nickname" @click="handleNicknameEdit" style="display: flex; justify-content: center; margin-left: 20px">昵称</div>
<!--            LYX-->
          </div>
          <div id="user-id" style="display: flex">user_id</div>
        </div>
      </div>
      <input type="file" id="avatar-input" accept="image/*">
    </div>
  </div>
  </div>
</template>

<script>
import Devices from '@/components/devices.vue'
import EnterHistory from '@/components/EnterHistory.vue'
import loginMethods from '@/components/loginMethods.vue'
import changeCode from '@/components/changeCode.vue'
import vipCenter from '@/components/vipCenter.vue'
export default {
  components: {
    Devices,
    EnterHistory,
    changeCode,
    loginMethods,
    vipCenter
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
    triggerAvatarChange () {
      document.getElementById('avatar-input').click()
    },
    changeShow (index) {
      this.show = index
      this.selectedLink = index
    },
    getUserInfo () {
      // console.log("sdffdf");
      fetch('http://47.97.32.241:8080/user/info', {
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
            document.getElementById('user-id').innerText = `User ID: ${userInfo.userId}`
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
      fetch('http://47.97.32.241:8080/user/update', {
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
  min-height: 65px;
  width: 100%;
  height: 65px;
  background-color: white;
}
#divider {
  width: 100%;
  border-bottom: 12px solid #ecedf3;

}
.logo {
  width:160px ;
  height: 50px;
  margin-top: 10px;
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
  background: #ecedf3;

}
.area {
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}
/*LYX*/
#area1 {
  min-width: 180px;
  width: 230px;
  background-color: white;
  border-radius: 5px;
}
#area2 {
  flex: 1;
  width: 100%;
  background-color: white;
  border-radius: 5px;
}
#area3 {
  width: 250px;
  min-width: 160px;
  background-color: white;
  border-radius: 5px;
}
#gap {
  width: 12px;
  background-color: #ecedf3;
}
/*LYX*/
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
nav ul li:nth-child(6) a {
  background-image: url('@/assets/会员中心.png');
}
#avatar-preview {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #ccc;
  background-size: cover;
  background-position: center;
  position: relative;
  left: 0;
  bottom: 0;
}
.upload-container {
  display: flex;
  margin-left: auto;
}
#avatar-upload {
  color: #2881F6;
  cursor: pointer;
  width: 32px;
}
#nickname {
  color: black;
  font-size: 20px;
  font-weight: bold;
  width: 40px;
}

#nickname-edit {
  color: #2881F6;
  cursor: pointer;
  text-decoration: none;
}

#user-id {
  margin: 10px;
  color: black;
  font-size: 16px;
  font-weight: bold;
  position: relative;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  width: auto;
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
/* LYX */
nav ul li a.selected {
  color: #2196f3;
}
</style>
