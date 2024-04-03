<template>
    <div class="middleBox">
                <div class="contentmima">
                    <h2>请设置新密码</h2>
                    <h3>原密码</h3>
                    <input type="password" id="original-password" placeholder="请输入" v-model="originalPassword">
                    <h3>新密码</h3>
                    <input type="password" id="new-password" placeholder="8-14位，字母/数字/标点符号至少2种" v-model="newPassword">
                    <h3>确认密码</h3>
                    <input type="password" id="confirm-password" placeholder="请确认密码" v-model="confirmPassword">
                    <br>
                    <button id="submit-button" :disabled="!allInputsFilled" @click="submitForm">确定</button>
                </div>
            </div>
    </template>

<script>
export default {
  data () {
    return {
      originalPassword: '',
      newPassword: '',
      confirmPassword: '',
      usertoken: ''
    }
  },
  computed: {
    // 计算属性用来检查所有输入框是否都有内容
    allInputsFilled () {
      return this.originalPassword !== '' && this.newPassword !== '' && this.confirmPassword !== ''
    }
  },
  methods: {
    changeCode () {
      const requestBodyForCode = {
        oldPassword: this.originalPassword,
        newPassword: this.newPassword
      }

      fetch('http://8.134.178.176:8080/user/update/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.$store.state.usertoken
        },
        body: JSON.stringify(requestBodyForCode)
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('服务器错误')
          }
        })
        .then(response => {
          if (response.code === 200) {
            console.log('更新密码成功:', response)
            alert('密码更新成功！请重新登录！')
            window.location.href = 'http://8.134.178.176:8080/user/login'
          } else if (response.code === 403) {
            throw new Error('用户名或密码错误')
          } else if (response.code === 421) {
            throw new Error('密码错误次数过多')
          } else {
            throw new Error('服务器错误')
          }
        })
        .catch(error => {
          console.error('更新密码失败:', error.message)
          alert('密码更新失败，请重试！\n' + error.message)
        })
    },
    submitForm () {
      // 检查新密码和确认密码是否匹配
      if (this.newPassword !== this.confirmPassword) {
        alert('新密码和确认密码不匹配，请重新输入！')
        return
      }
      // 执行密码更新操作
      this.changeCode()
    }
  }
}
</script>

    <style>
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

      /* 按钮样式 */
      .middleBox button {
        width: 260px;
        height: 50px;
        border: 2px solid #6eb6ff;
        background-color: #6eb6ff;
        border-radius: 25px;
        color: white;
        font-size: 18px;
        font-weight: bold;
        margin-top: 20px;
        transition: background-color 0.3s, border-color 0.3s; /* 添加过渡效果 */
        cursor: pointer; /* 将鼠标样式设置为手掌状 */
    }

    .middleBox button:hover {
        background-color: #4b8fe4; /* 鼠标悬停时的深色背景 */
        border-color: #4b8fe4; /* 鼠标悬停时的深色边框 */
    }

    .middleBox button:disabled:hover {
        cursor: not-allowed;
    }

      .middleBox .contentmima input{
        width: 350px;
        height: 50px;
        border: 2px solid black;
        background-color: #fff;
        outline: none;
        border-radius: 25px;
        text-indent: 15px;
        font-size: 18px;
        margin: 5px 0;
      }</style>
