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

    <el-form   ref="form" label-width="80px" :inline="true" class="login-container" :model="form" :rules="rules">
      <h1>欢迎注册</h1>
        <el-form-item  label="用户名" prop="userName">
            <el-input v-model="form.userName" placeholder="请设置用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="pass">
            <el-input show-password class="codeinput" v-model="form.pass" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPass">
            <el-input show-password class="codeinput" v-model="form.checkPass" placeholder="再次请输入密码"></el-input>
        </el-form-item>

        <el-form-item  label="邮箱" prop="email">
            <el-input  v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="emailcode">
            <el-input class="codeinput" v-model="form.emailcode" placeholder="请输入验证码"></el-input>
        </el-form-item>

        <el-button :disabled="disable" @click="getcode" class="getcode">{{ text }}</el-button>

        <el-form-item>
            <el-button  @click="submit('form')" class="login_button" type="primary"> 注 册 </el-button>
        </el-form-item>

    </el-form>
  </div>
  </div>

</template>

<script>
// 将封装的两个接口方法进行引入
import { enroll, getcode } from '@/api/enroll'
export default {
  name: 'enrollModel',
  data () {
    // 检验密码规则
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      }
      if (!/^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![!#$%^&*]+$)[\da-zA-z!#$%^&*]{8,16}$/.test(value)) {
        callback(new Error('需要包含大小写英文字母、数字、特殊字符，至少包含两种，长度为8到14个字符'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    // 再次确认密码规则
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateemail = (rule, value, callback) => {
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
    // 校验用户名的函数
    const validatename = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      }
      // 设置用户名正则表达式
      if (!/^(?![0-9]+$)[a-zA-Z0-9\u4e00-\u9fa5]{1,14}$/.test(value)) {
        callback(new Error('输入汉字、大小写英文字母和数字，长度不得超过14位，不得为纯数字'))
      } else {
        callback()
      }
    }

    return {
      form: {
        // 用户名
        userName: '',
        // 密码
        pass: '',
        // 邮箱
        email: '',
        // 邮箱验证码
        emailcode: '',
        // 确认密码
        checkPass: ''
      },
      rules: {
        userName: [
          { validator: validatename, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        emailcode: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入正确的邮箱验证码',
            // 验证码长度为6位
            min: 6,
            max: 6
          }],
        email: [
          { validator: validateemail, trigger: 'blur' }
        ]

      },
      // 来控制发送验证码按钮的状态
      disable: true,
      // 用于控制按键内的显示信息
      text: '发送验证码',
      // 用于设置剩余时间
      time: 60
    }
  },
  methods: {
    gohome () {
      this.$router.push('/account')
    },
    // 获取邮箱的方法
    async getcode () {
      const { data } = await getcode(this.form.email)
      console.log(data.code)
      // 只有当相应成功的时候才开始锁定按钮
      if (data.code === 200) {
        this.$message({
          message: '成功获取验证码！',
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
    async submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 传递参数记得要注意不要写成对象的形式
          const res = await enroll(
            this.form.userName,
            this.form.email,
            this.form.pass,
            this.form.emailcode
          )
          console.log(res)
          if (res.data.code === 200) {
            this.$message({
              message: '恭喜你，注册成功！',
              type: 'success',
              duration: 2000
            }) // 注册成功后跳转至登陆界面
            this.$router.push('/account')
          } else {
            this.$message({
              message: res.data.message,
              type: 'error',
              duration: 2000
            })
            return false
          }
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

  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(@/assets/bgc.png) no-repeat 0% 20%/ cover;
;
position: relative;
}
.test{
width: 800px;
height: 550px;
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
  margin-top: 70px;
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
    width: 220px;
    height: 50px;

  }
  .login_button {
    margin-top: 10px;
    margin-left: 60px;
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

.closebtn{
  border: none;
  position: absolute;
  right: 10px;
  top: 10px;
}
.el-form-item{
  margin-bottom: 25px;
}
h1{
  font-size: 32px;
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
h1{
  margin-left: 30px;
}
</style>
<style lang="less" scoped>
  /deep/ .el-form-item__error{
    padding-top: 0px;
    height: 30px;
}
</style>
