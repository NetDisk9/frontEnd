<template>
  <div class="container">
    <div class="title">登录设备管理</div>
    <div class="container_tips">
      <div class="tips">以下是所有登录设备列表</div>
    </div>
    <div class="container_table">
      <table>
        <tr>
          <th>设备名称</th><th>设备系统</th><th>验证通过时间</th>
        </tr>
        <tr v-for="(item, index) in devices" :key="index">
          <td v-if="item">{{ item.deviceName }}</td>
          <td v-if="item">{{ item.deviceOS }}</td>
          <td v-if="item">{{ item.loginTime }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeviceModel',
  data () {
    return {
      devices: []
    }
  },
  methods: {
    // 从8.134.178.176:8080/user/device获取数据
    getDevices () {
      fetch('http://8.134.178.176:8080/user/device', {
        method: 'GET',
        headers: { Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTE2NTk4NDIsInVzZXJpZCI6IjE3Njg1NDYwNDIyNDczMjM2NDkifQ.RFVrImZocfRh-9eROnAWrgIIsRzJvhN9L4CD5yumxOA' }
      })
        .then(res => {
          return res.json()
        })
        .then(data => {
          if (data.code === 200) {
            console.log(data.data)
            this.devices = data.data
            console.log(this.devices)
          } else {
            console.log(Response.status)
            console.error('Failed to get devices')
            console.log(Response.status)
          }
        })
        .catch(err => {
          console.log()

          console.error(err)
        })
    }
  },
  mounted () {
    this.getDevices()
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
  max-height: 700px;
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

.container_table {
  width: 895px;
  height: 700px;
  font-family: Arial, sans-serif;
  position: relative;
  /* left: 50px; */
  margin-top: 20px;
  overflow: hidden;
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
