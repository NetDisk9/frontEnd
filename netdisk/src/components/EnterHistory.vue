<template>
  <div class="container">
    <div class="title">登录记录</div>
    <div class="container_tips">
      <div class="tips">{{ username }}，以下是您最近三个月的登录记录，如存在异常登录记录请尽快</div>
      <div class="changeKey">修改密码</div>
    </div>

    <div class="container_table">
      <table>
        <tr>
<!--          <th>登录方式</th>-->
          <th>设备名称</th>
          <th>设备系统</th>
          <th>登录地址</th>
          <th>登录时间</th>
          <th>ip地址</th>
        </tr>
        <tr v-for="(item, index) in loginHistory" :key="index">
<!--          <td>{{ item.loginType }}</td>-->
          <td>{{ item.deviceName }}</td>
          <td>{{ item.deviceOS }}</td>
          <td>{{ item.loginAddress }}</td>
          <td>{{ item.loginTime }}</td>
          <td>{{ item.loginIp }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      username: '',
      loginHistory: [{}]
    }
  },
  methods: {
    getLoginHistory () {
      fetch('http://8.134.178.176:8080/user/info/login', {
        method: 'GET',
        headers: { Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTE2NTk4NDIsInVzZXJpZCI6IjE3Njg1NDYwNDIyNDczMjM2NDkifQ.RFVrImZocfRh-9eROnAWrgIIsRzJvhN9L4CD5yumxOA' }
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('获取用户信息失败')
          }
        })
        .then(data => {
          if (data.code === 200) {
            this.loginHistory = data.data
            console.log(this.loginHistory)
          } else {
            console.log(Response.status)
            console.error('Failed to get history')
            console.log(Response.status)
          }
        })
    },
    getUserName () {
      fetch('http://8.134.178.176:8080/user/info', {
        method: 'GET',
        headers: { Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTE2NTk4NDIsInVzZXJpZCI6IjE3Njg1NDYwNDIyNDczMjM2NDkifQ.RFVrImZocfRh-9eROnAWrgIIsRzJvhN9L4CD5yumxOA' }
      })
        .then(res => {
          return res.json()
        })
        .then(data => {
          if (data.code === 200) {
            this.username = data.data.username
          } else {
            console.error('Failed to get username')
            console.log(Response.status)
          }
        })
    }
  },
  mounted () {
    this.getLoginHistory()
    this.getUserName()
  }

}
</script>

<style scoped>
div {
  margin: 0 auto;
  border: 0;
  padding: 0;
}

body {
  margin: 0 auto;
  border: 0;
  padding: 0;
}

html {
  margin: 0 auto;
  border: 0;
  padding: 0;
}

.container {
  width: 990px;
  height: 700px;
}

.title {
  font-size: 55px;
  color: #333;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: left;
  position: relative;
  left: 50px;
}

.container_tips {
  margin: 0 0 30px 0;
  position: relative;
  left: 50px;
}

.tips {
  display: inline-block;
  font-size: 16px;
}

.changeKey {
  display: inline-block;
  font-size: 16px;
  color: #165DFF;
  margin: 0 0 0 10px;
}

.container_table {
  width: 895px;
  height: 700px;
  font-family: Arial, sans-serif;
  position: relative;
  /* left: 50px; */
  margin-top: 20px;
  overflow: auto;
  border-radius: 5px;
  border: 1px solid #d8d8d8;
}
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  width: 20%;
  padding: 10px 0 10px 25px;
  text-align: left;
  border-bottom: 1px solid #d8d8d8;
  font-size: 16px;
}

th {
  background-color: #f2f2f2;
}

tr {
  background-color: #ffffff;
}
</style>
