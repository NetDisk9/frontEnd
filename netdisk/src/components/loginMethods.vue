<template>
    <div class="loginBigBox">
      <h4 class="changGuiWords">常规登录</h4>
      <ul>
        <li v-for="(method, index) in loginMethods" :key="index">
          <div class="pic">
            <img src="/锁.png" alt="">
          </div>
          <div class="text">
            <h3 style="padding-left: 20px;padding-top: 2px;">{{ method.name }}</h3>
            <h5 style="color: #101010;padding-left: 20px;font-weight: lighter;">{{ method.description }}</h5>
          </div>
          <label class="switch small" :style="{ 'margin-left': method.switchMargin + 'px' }">
            <input type="checkbox" v-model="method.checked"  @change="changeLoginMethods(method, index)">
            <span class="slider" style="margin-left: 20px;"></span>
          </label>
        </li>
      </ul>
    </div>
  </template>

<script>
export default {
  data () {
    return {
      loginMethods: [
        { name: '邮箱密码登录', description: '可用邮箱+密码方式登录', checked: false, switchMargin: 5 },
        { name: '用户名密码登录', description: '可用用户名+密码方式登录', checked: false, switchMargin: -10 },
        { name: '邮箱验证码登录', description: '可用邮箱+验证码方式登录', checked: false, switchMargin: -8 }
      ],
      type: '000'
    }
  },
  methods: {
    fetchLoginMethods () {
      fetch('http://8.134.178.176:8080/user/login/method', {
        method: 'GET',
        headers: {
          Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTIwMTAwMjEsInVzZXJpZCI6IjE3NzI1MjY3NTYzNDI4ODIzMDYifQ.mJSxmUB_VFsH0Pi7qEp65Kn-csj8CZgo_GlqE4MTzDM' // Replace with actual token
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('获取登录方式失败')
          }
        })
        .then(data => {
          if (data && data.code === 200 && data.data && data.data.type) {
            const loginType = data.data.type
            this.type = loginType
            console.log(this.type)

            // Update loginMethods based on received data
            this.loginMethods.forEach((method, index) => {
              method.checked = loginType[index] === '1'
            })
          } else {
            throw new Error('未获取到有效的登录方式数据')
          }
        })
        .catch(error => {
          console.error('发生错误:', error.message)
          alert('获取登录方式失败，请重试！')
        })
    },

    changeLoginMethods (method, index) {
      // 更新type变量的值
      let newType = ''
      this.loginMethods.forEach((item, i) => {
        newType += item.checked ? '1' : '0'
      })
      this.type = newType
      console.log(this.type)

      // 构造请求配置
      const requestOptions = {
        method: 'PUT',
        headers: {
          Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTE1ODg0MTQsInVzZXJpZCI6IjE3NzI1MjY3NTYzNDI4ODIzMDYifQ.jhJ9vWRrDhnQtO7wtvUQxxx2fznesub_tCu8z6WrMLg' // 用实际的Authorization token替换
        },
        body: JSON.stringify({ type: this.type }) // 将queryParams替换为this.type
      }

      // 发送请求
      fetch('http://8.134.178.176:8080/user/login/method?type=' + this.type, requestOptions)
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('服务器错误')
          }
        })
        .then(data => {
          console.log(data) // 处理响应数据
        })
        .catch(error => {
          console.error('发生错误:', error.message) // 处理错误
        })
    }
  },
  mounted () {
    this.fetchLoginMethods()
  }
}
</script>

<style>
 .loginBigBox li{
  list-style: none;
  display: flex;
  border: 1px solid grey;
  width: 45%;
  margin-top: 20px;
  border-radius: 7%;
}

.loginBigBox ul{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px 20px 40px 20px;
}

.loginBigBox li .pic img{
  width: 80px; /* 设置图片宽度 */
  height: auto; /* 让高度按比例自动调整 */
  margin-top: 20px;
  margin-left: 10px;
}

.loginBox{
  width: 300px;
  height: 100px;
  border-radius:15%;
  border:2px solid red;
  display: flex;
}

.loginBigBox{
  margin: 50px auto ;
  width: 800px;
  height: 500px;
}

.changGuiWords{
    padding-top: 20px;
    padding-left: 30px;
    color: #101010;
    font-size: 20px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 100px;
  left: 20px;
  top: 50px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 50%;
  left: 0;
  right: 0;
  margin-top: -7px; /* 将滑块上移一半高度 */
  background-color: #ccc;
  transition: .4s;
  border-radius: 10px;
  height: 14px; /* 调整滑块的高度 */
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(14px);
}

/* 开关外观样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* 开关大小 */
.switch.small {
  width: 40px;
  height: 20px;
}

.switch.small .slider {
  width: 40px;
  height: 20px;
  border-radius: 20px;
}

.switch.small .slider:before {
  width: 16px;
  height: 16px;
  left: 2px;
  bottom: 2px;
}
body {
            margin: 0;
            padding: 0;
            background-color: white;
            font-family: Arial, sans-serif;
        }
        #top-bar {
            width: 100%;
            height: 7vh;
            background-color: white;
        }

        #divider {
            width: 100%;
            border-bottom: 2px solid black;
        }

        #logo {
            width: 15%;
            height: 80%;
            margin-left: 2%;
            margin-bottom: -2.35%;
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
</style>
