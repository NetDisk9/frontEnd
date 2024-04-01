<template>
  <div class="email-login">

      <div class="test">
<!-- 存放logo模块 -->
<el-button @click="gohome" class="closebtn" icon="el-icon-close" circle></el-button>

          <div class="img">
            <!-- 标语编写 -->
            <div class="write">
              记录每一份美好,<br>
              让美好永远陪伴!
            </div>
        </div>

    <el-form  ref="form" label-width="70px" :inline="true" class="login-container" :model="form" :rules="rules">
      <el-button class="method" ><h3 class="blue">帐号登陆</h3></el-button>
      <el-button class="method " @click="goaccount" ><h3>邮箱登陆</h3></el-button>
        <el-form-item label="" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入帐号"></el-input>
        </el-form-item>

        <el-form-item label="" prop="password">
            <el-input type="password" class="codeinput" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <span class="enroll"><router-link to="/enroll">立即注册</router-link></span>
        <span class="forget"><a href="">忘记密码</a></span><br>
        <el-form-item>
          <!-- 这里括号内需要引入的是表单名要加上单引号 -->
            <el-button @click="submit('form')" class="login_button" type="primary"> 登 录 </el-button>
        </el-form-item>

    </el-form>
  </div>
  </div>

</template>

<script>
// 将封装的登陆方法进行引入
import { codeLogin } from '@/api/login'
export default {

  name: 'loginModel',
  data () {
    // 进行检验数值进行赋值
    // 通过正则表达式进行数据的检验并进行赋值
    const validateaccount = (rule, value, callback) => {
      // 若为空则提示请输入邮箱
      if (value === '') {
        callback(new Error('请输入帐号'))
      } else if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        this.email = value
        this.id = ''
        this.username = ''
        callback()
      } else if (/^\d{8}$/.test(value)) {
        this.id = value
        this.email = ''
        this.usernaem = ''
        callback()
      } else if (/^(?![0-9]+$)[a-zA-Z0-9\u4e00-\u9fa5]{1,14}$/.test(value)) {
        this.username = value
        this.email = ''
        this.id = ''
        callback()
      } else {
        callback(new Error('输入数据不符合要求请重新输入'))
      }
    }
    return {
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          { validator: validateaccount, trigger: 'blur' }

        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入正确格式的密码',
            min: 8,
            max: 14

          }
        ]
      },
      // pc端只能浏览器登陆所以设定这个数值
      deviceName: '浏览器',
      // 将操作系统设定为变量
      deviceOS: '',
      // 设置三个参数最后进行判断输入的内容属于哪个
      id: '',
      email: '',
      username: ''
    }
  },
  // 获取设备名称
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
  },

  methods: {
    goaccount () {
      this.$router.push('/email')
    },
    gohome () {
      this.$router.push('/home')
    },
    // 若填入的数据不符合要求禁止提交
    async submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 调用封装好的帐号登陆方法
          const res = await codeLogin(
            this.deviceName,
            this.deviceOS,
            this.email,
            this.form.password,
            this.id,
            this.username
          )
          console.log(res)
          if (res.data.code === 200) {
            localStorage.setItem('tok', res.data.data)
            //  将token存入localstorage
            console.log(localStorage.getItem('tok'))
            this.$message({
              message: '登陆成功',
              type: 'success',
              duration: 2000
            })
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
            message: '表单数据不符合要求请重新填写',
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
  height: 960px;
  background-size: 100% 100%;
  // background-image: url(/Users/linmingyao/Documents/js的学习·/netdisk/src/img/bgc.png);
  // background-color: rgba(255, 255, 255, 0.5); /* 白色背景，透明度为 0.5 */
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/bgc.png') no-repeat 0% 20%/ cover;
;

}
.test{
width: 800px;
height: 400px;
margin: 0 auto;
background-color: #ffffff;
border-radius: 15px;
padding-top: 40px;
box-shadow: 0 0 25px #cac6c6;
position: absolute;
  left: 400px;
  top: 200px;

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
height: 300px;
width: 300px;
float: left;
background-image: url(@/assets/logo.png);
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
  margin-right: 100px;
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
