<template>
    <div class="email-login">
        <div class="test">
          <el-button @click="gohome" class="closebtn" icon="el-icon-close" circle></el-button>

<!-- 存放logo模块 -->
            <div class="img">
              <!-- 标语编写 -->
              <div class="write">
                记录每一份美好,<br>
                让美好永远陪伴!
              </div>
          </div>

      <el-form  ref="form" label-width="70px" :inline="true" class="login-container" :model="form" :rules="rules">
        <el-button @click="goaccount" class="method" ><h3>帐号登陆</h3></el-button>
        <el-button class="method "><h3 class="blue">邮箱登陆</h3></el-button>

        <el-form-item  label="" prop="email">
            <el-input  v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

          <el-form-item label="" prop="password">
              <el-input class="codeinput" v-model="form.password" placeholder="请输入验证码"></el-input>
          </el-form-item>

          <el-button :disabled="disable" @click="getcode" class="getcode">{{ text }}</el-button>
          <span class="enroll"><router-link to="/enroll">立即注册</router-link></span>
          <span class="forget"><a href="#/forget">忘记密码</a></span><br>
          <el-form-item>
              <el-button @click="submit('form')" class="login_button" type="primary"> 登 录 </el-button>
          </el-form-item>

      </el-form>
    </div>
    </div>

  </template>

<script>
// 将封装好的获取验证码方法导入
import { getcode, emailLogin } from '@/api/login'
export default {
  name: 'loginModel',
  data () {
    // 邮箱表单校验规则
    const validateemail = (rule, value, callback) => {
      // 若为空则提示请输入邮箱
      if (value === '') {
        callback(new Error('请输入邮箱'))
      }
      // 设置邮箱正则表达式
      if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        this.disable = false
        callback()
      }
    }
    return {
      form: {
        userName: '',
        password: ''
      },
      rules: {
        email: [
          { validator: validateemail, trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入正确的验证码',
            min: 6,
            max: 6

          }
        ]
      },
      // 来控制发送验证码按钮的状态
      disable: true,
      // 用于控制按键内的显示信息
      text: '发送验证码',
      // 用于设置剩余时间
      time: 60,
      deviceName: '浏览器',
      deviceOS: ''
    }
  },
  // 获取操作系统名称并进行赋值
  created () {
    const getOsInfo = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      let name = 'Unknown'
      let version = 'Unknown'
      if (userAgent.indexOf('win') > -1) {
        name = 'Windows'
        if (userAgent.indexOf('windows nt 5.0') > -1) {
          version = 'Windows 2000'
        } else if (
          userAgent.indexOf('windows nt 5.1') > -1 ||
      userAgent.indexOf('windows nt 5.2') > -1
        ) {
          version = 'Windows XP'
        } else if (userAgent.indexOf('windows nt 6.0') > -1) {
          version = 'Windows Vista'
        } else if (
          userAgent.indexOf('windows nt 6.1') > -1 ||
      userAgent.indexOf('windows 7') > -1
        ) {
          version = 'Windows 7'
        } else if (
          userAgent.indexOf('windows nt 6.2') > -1 ||
      userAgent.indexOf('windows 8') > -1
        ) {
          version = 'Windows 8'
        } else if (userAgent.indexOf('windows nt 6.3') > -1) {
          version = 'Windows 8.1'
        } else if (
          userAgent.indexOf('windows nt 6.2') > -1 ||
      userAgent.indexOf('windows nt 10.0') > -1
        ) {
          version = 'Windows 10'
        } else {
          version = 'Unknown'
        }
      } else if (userAgent.indexOf('iphone') > -1) {
        name = 'Iphone'
      } else if (userAgent.indexOf('mac') > -1) {
        name = 'Mac'
      } else if (
        userAgent.indexOf('x11') > -1 ||
    userAgent.indexOf('unix') > -1 ||
    userAgent.indexOf('sunname') > -1 ||
    userAgent.indexOf('bsd') > -1
      ) {
        name = 'Unix'
      } else if (userAgent.indexOf('linux') > -1) {
        if (userAgent.indexOf('android') > -1) {
          name = 'Android'
        } else {
          name = 'Linux'
        }
      } else {
        name = 'Unknown'
      }
      return { name, version }
    }
    this.deviceOS = getOsInfo().name
    // console.log(this.deviceOS)
    // console.log(this.deviceName)
  },
  methods: {
    goaccount () {
      this.$router.push('/account')
    },
    // 获取邮箱的方法
    async getcode () {
      const { data } = await getcode(this.form.email)
      console.log(data.code)
      // 只有当相应成功的时候才开始锁定按钮
      if (data.code === 200) {
        // alert('获取验证码成功')
        // 使用组件中的弹窗进行提示
        this.$message({
          message: '获取验证码成功',
          type: 'success',
          duration: 2000
        })
        const n = setInterval(() => {
          this.disable = true
          this.text = `${this.time}s后重新获取`
          this.time--
        }, 1000)
        setTimeout(() => {
          this.disable = false
          clearInterval(n)
          this.text = '发送验证码'
          this.time = 60
        }, 60000)
      } else {
        // 相应失败则弹出失败原因
        this.$message({
          message: data.message,
          type: 'error',
          duration: 2000
        })
      }
    },
    gohome () {
      this.$router.push('/home')
    },
    async submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 传参数的时候要注意封装的是怎么样的就要传怎么样的
          const res = await emailLogin(
            this.deviceName,
            this.deviceOS,
            this.form.email,
            this.form.password
          )
          console.log(res)
          if (res.data.code === 200) {
            // localStorage.setItem('tok', res.data.data)
            //  将token存入localstorage
            this.$store.commit('gettoken', res.data.data)
            // console.log(localStorage.getItem('tok'))
            this.$message({
              message: '登陆成功',
              type: 'success',
              duration: 2000
            })
            // 跳转到个人中心界面
            this.$router.push('/homeview')
          } else {
            this.$message({
              message: res.data.message,
              type: 'error',
              duration: 2000
            })
          }
        } else {
          this.$message({
            message: '表单数据不符合要求请重新填写！',
            type: 'error',
            duration: 2000
          })
          return false
        }
      })
    }
  }

}
</script>
  <style lang="less" scoped>
.email-login{
  width: 100%;
  height: 100vh;
  background-size: 100% 100%;
  // background-image: url(/Users/linmingyao/Documents/js的学习·/netdisk/src/img/bgc.png);
  // background-color: rgba(255, 255, 255, 0.5); /* 白色背景，透明度为 0.5 */
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/bgc.png') no-repeat 0% 20%/ cover;
;
position: relative;
}
.test{
width: 800px;
height: 400px;
background-color: #ffffff;
border-radius: 15px;
padding-top: 40px;
box-shadow: 0 0 25px #cac6c6;
position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  margin: auto auto;

}
.write{
  width: 150px;
  margin-top: 250px;
  margin: 250px auto;
  letter-spacing: 3px;
  text-align: center;
  color: #cac6c6;
}
.state{
  width: 300px;
  height: 400px;
  background-color: green;
  float: left;
}
.img{
  margin-left: 30px;
  background-image: url(@/assets/logo.png);

  height: 300px;
  width: 300px;
  float: left;
  background-size: 100% 100%;
}
  .login-container {
    float: right;
    margin-bottom: 40px;
    margin-right: 30px;
    width: 420px;
    // border:1px solid #eaeaea;
    background-color: #ffffff;
    box-sizing: border-box;
    .method{
      border: 0px;
      padding: 0;
      text-align: center;
      line-height: 30px;
      margin-bottom: 30px;
      width: 100px;
      height: 60px;
      .blue{
        display: inline-block;
        border-bottom: 2px solid rgb(123, 123, 209);

      }
    }
    .login_title {
      text-align: center;
      margin-bottom: 40px;
      color: #505458;
    }
    .el-input {
      width: 270px;
      height: 50px;

    }
    .login_button {
      margin-top: 10px;
      margin-left: 10px;
      width: 250px;
    }
    .login_register {
      width: 70px;
      height: 40px;
      text-align: center;
      margin-top: 10px;
    }
  }
  .enroll{
    float: left;
    margin-left: 10px;
    margin-top: 10px;
    a{
      color: blue;
      text-decoration: none;
      font-size: small;
    }
  }
  .forget{
    float: right;
    margin-top: 10px;
    margin-right: 160px;
    a{
      color: blue;
      text-decoration: none;
      font-size: small;
    }

  }
.getcode{
    padding: 0;
    margin-left: 10px;
    height: 40px;
    width: 100px;
    font-size: small;
    background-color: rgba(0, 0, 255, 0.738);
    color: white;
}
.closebtn{
  border: none;
  position: absolute;
  right: 10px;
  top: 10px;
}
  </style>
