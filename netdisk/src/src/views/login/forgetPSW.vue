<template>
  <div style="display: flex; flex-direction: column">
    <div class="image">
      <img src="../../assets/logo2.png" height="70" width="182*5/7" style="margin: 10px 0 0 20px"/></div>

    <div class="gap" style="height: 10px; background: #f8f9fb"></div>
    <div style="display: flex; margin: 20px 200px">
      <div class="mainContain">
        <div style="font-size: 30px; margin: 20px 0 30px 0">找回密码</div>
        <div>
          <div v-show="show">
            <el-form ref="form1" :model="user" :rules="rules">
              <el-form-item label="" prop="email">
                <el-input v-model="user.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <div>
                <div style="display: flex; justify-content: space-between ">
                  <el-form-item label="" prop="code" style="width: 90%">
                    <el-input v-model="user.code" placeholder="请输入验证码" style="width: 90%"></el-input>
                  </el-form-item>
                  <div>
                    <el-button :disabled="disable" @click="getcode" class="getcode">{{ text }}</el-button>
                  </div>
                </div>
                <div>
                  <el-button @click="next('form1')" class="next_button" type="primary">下一步</el-button>
                </div>
              </div>
            </el-form>
          </div>
          <div v-show="!show">
            <el-form ref="form" :model="user" :rules="rules">
              <el-form-item label="" prop="newPassword">
                <el-input type="password" v-model="user.newPassword" placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item label="" prop="confirmPassword">
                <el-input type="password" v-model="user.confirmPassword" placeholder="请再次输入新密码"></el-input>
              </el-form-item>
              <div>
                <el-button @click="submit('form')" class="next_button" type="primary">下一步</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { check, forgetPWD, getcode } from '@/api/reset'

export default {
  name: 'forgetPSW',
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
    // 检验密码规则
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      }
      if (!/^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![!#$%^&*]+$)[\da-zA-z!#$%^&*]{8,16}$/.test(value)) {
        callback(new Error('需要包含大小写英文字母、数字、特殊字符，至少包含两种，长度为8到14个字符'))
      } else {
        if (this.user.confirmPassword !== '') {
          this.$refs.form.validateField('confirmPassword')
        }
        callback()
      }
    }
    // 再次确认密码规则
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.user.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      show: 1,
      user: {
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        email: [
          { validator: validateemail, trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入正确的验证码',
            min: 6,
            max: 6
          }
        ],
        newPassword: [
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            validator: validatePass2,
            trigger: 'blur'
          }
        ]
      },
      disable: true,
      text: '发送验证码',
      time: 60
    }
  },
  methods: {
    async getcode () {
      const { data } = await getcode(this.user.email)
      console.log(data)
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
      console.log(this.user)
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 传参数的时候要注意封装的是怎么样的就要传怎么样的
          const res = await forgetPWD(
            this.user.email,
            this.user.code,
            this.user.newPassword
          )
          console.log(res)
          if (res.data.code === 200) {
            this.$message({
              message: '修改密码成功',
              type: 'success',
              duration: 2000
            })
            this.$router.push('/home')
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
    },
    async next (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await check(this.user.code, this.user.email)
          console.log(res)
          if (res.data.code === 200) {
            this.show = 0
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

<style scoped>
.mainContain {
  width: 420px;
  background-color: #ffffff;
  box-sizing: border-box;
}

el-button {
  width: 100%;
  height: 40px;
  padding: 0;
  line-height: 40px;
  font-size: 20px;
}
</style>
