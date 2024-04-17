<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 点击可以跳转到首页 这里首页就是用户管理页面 -->
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb><br>

    <!-- 下面栏目用于搜索功能 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
          <!-- 这里进行帐号是否正常进行筛选需要调用后期接口 -->
        <el-select size="small" v-model="formInline.isLock" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="N"></el-option>
          <el-option label="已锁定" value="Y"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="searchUserName" placeholder="输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="">
      <el-input size="small" v-model="searchUserEmail" placeholder="输入邮箱号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus"  @click="add" style="margin-left: 10px;">添加</el-button>
            <!-- 对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <!-- 输入框 -->
      <el-form :model="newUser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="newUser.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="newUser.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="newUser.userEmail" placeholder="请输入用户邮箱"></el-input>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-input v-model="newUser.userRealName" placeholder="管理员/普通用户"></el-input>
        </el-form-item>
      </el-form>

      <!-- 确定和取消按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </span>
    </el-dialog>
        <el-button size="small" type="primary" style="margin-left: 10px;">部门设置</el-button>
      </el-form-item>
    </el-form>

 <!-- 内容区域表格 -->
    <el-table size="small" @selection-change="selectChange"  :data="userTableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%;">
        <!-- <el-table-column align="center" type="selection" width="50">
        </el-table-column> -->

        <el-table-column label="用户名" prop="username">
  <template slot-scope="scope">
    <div v-if="!scope.row.editing" @dblclick="toggleEdit(scope.row)">
      {{ scope.row.username }}
    </div>
    <el-input v-else v-model="scope.row.username" @blur="saveChanges(scope.row)" clearable></el-input>
  </template>
</el-table-column>

        <el-table-column align="center" sortable prop="userId" label="用户ID" width="120">
        </el-table-column>

        <el-table-column align="center" sortable prop="email" label="邮件" min-width="120">
        </el-table-column>

        <el-table-column align="center" sortable prop="loginTime" label="最近登陆时间" min-width="120">
        </el-table-column>

        <el-table-column align="center" sortable prop="status" label="状态" min-width="120">
          <template slot-scope="scope">
            <!-- 进行判断状态的改变点击后会把islock转化为n或者y然后控制是否显示 -->
            <el-switch :value="scope.row.status === 0 ? nshow : fshow" active-color="#13ce66" inactive-color="#ff4949" @change="editType(scope.$index, scope.row)">
            </el-switch>
          </template>
        </el-table-column>

<!-- 修改用户类型 -->
          <el-table-column align="center" sortable prop="roleVO.roleName" label="用户类型" width="150">
  <template slot-scope="scope">
    <!-- 下拉框通过插槽绑定数据确认刚开始的值 -->
    <!-- 这个scoped.row必须存在代表着这一行的值 -->
    <!-- 这个row是整一行的数据就是包括username都有 -->
    <!-- v-model绑定的是用户的roleid这样子修改的时候就会把表格的roleid就会改变，就可以传递roleid给后端 -->
    <!-- 每次切换数据的时候这个roleid会发生变换，这时候我们需要传递到后端使rolename也发生变化 -->
    <el-select v-model="scope.row.roleVO.roleId" placeholder="请选择" @change="editUserRole(scope.row)">
      <!-- 根据每个管理员的权限进行修改 -->
      <el-option v-for="role in rolelist" :key="role.roleId" :label="role.roleName" :value="role.roleId"></el-option>
    </el-select>
  </template>
</el-table-column>

      <el-table-column label="操作" min-width="150" align="center" >
          <!-- 使用插槽解决了数据传输，因为表格内还放了一个按钮组件所以我们需要用到插槽进行组件中的数据传递-->
      <template slot-scope="scope">
          <!-- 这里scope.$index, scope.row两个数据就相当于当前行的索引以及当前行的数据，之后可以通过访问scope.row来访问这一行的所有数据 -->
        <el-button size="mini" type="success" @click="resetpwd(scope.$index, scope.row)">重置密码</el-button>
      </template>
    </el-table-column>
    </el-table><br>
     <!-- 分页组件 -->
   <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    background
    :page-sizes="[1,3,5,10]"
    :page-size="pagesize"
    layout="total, sizes,  prev, pager, next, jumper"
    :total="userTableData.length">
  </el-pagination>
  </div>
</template>
<script>
import { getrole } from '@/api/admin'
export default {
  name: 'userPage',
  data () {
    return {
      dialogVisible: false, // 控制对话框显示状态
      newUser: { // 新用户信息对象
        userName: '',
        userId: '',
        userEmail: ''
      },
      // 修改权限列表
      rolelist: [],
      // 模拟用户数据存储
      userTableData: [],
      // 初始页
      currentPage: 1,
      // 每一页的总条数 这里我默认设置成10条每一个页面
      pagesize: 10,
      nshow: true, // switch开启
      fshow: false, // switch关闭

      //   下面是frominline数据
      formInline: {
        page: 1,
        limit: 10,
        deptId: '',
        userName: '',
        userMobile: '',
        isLock: ''
      },
      searchUserName: '',
      searchUserEmail: '',

      editForm: {
      // 用户id
        userId: '',
        // 用户名
        userName: '',
        // 用户身份
        userRealName: '',
        // 用户邮箱
        userEmail: ''
      }
      // 重置密码需要的参数后期点击重置密码需要token进行操作
      // resetpsd: {
      //   userId: '',
      //   token: localStorage.getItem('logintoken')
      // }

    }
  },
  async created () {
    // this.getdataTest(this.formInline) // 测试版本，写死数据
    // this.getdata(this.formInline)   //上线版本，从后端拿数据
    const Authorization = this.$store.state.usertoken
    this.getData() // 上线版本，从后端拿数据
    // 获取可修改权限类型
    const { data } = await getrole(Authorization)
    // console.log(Authorization)
    this.rolelist = data.data
    console.log(this.rolelist)
    // const userId = '1772526756342882306'
    // this.changepassword(userId)
    // const res2 = await changeRole(userId, roleId, Authorization)
    // console.log(666, res2)
    // const res3 = await resetPassword(Authorization, userId)
    // console.log(5555, res3)
  },

  methods: {
    toggleEdit (row) {
    // 动态添加 editing 属性
      this.$set(row, 'editing', true)
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size
      console.log(this.pagesize) // 每页下拉显示数据
    },
    // 这是点击页码后会传递新页码
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },
    // // 处理时间戳函数
    // formatDate (timestamp) {
    //   const date = new Date(timestamp)
    //   const year = date.getFullYear()
    //   const month = (date.getMonth() + 1).toString().padStart(2, '0')
    //   const day = date.getDate().toString().padStart(2, '0')
    //   const hours = date.getHours().toString().padStart(2, '0')
    //   const minutes = date.getMinutes().toString().padStart(2, '0')
    //   const seconds = date.getSeconds().toString().padStart(2, '0')
    //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    // },

    // computed: {
    // // 根据搜索条件过滤后的用户数据
    //   filteredUserTableData () {
    //     const { isLock, userName, userMobile } = this.formInline

    //     // 过滤条件：帐号状态、用户名、手机号都符合搜索框中的值才会显示
    //     return this.userTableData.filter(user => {
    //       const isLockMatch = !isLock || user.isLock === isLock
    //       const userNameMatch = !userName || user.userName.includes(userName)
    //       const userMobileMatch = !userMobile || user.userMobile.includes(userMobile)
    //       return isLockMatch && userNameMatch && userMobileMatch
    //     })
    //   }
    // },
    selectChange () {},
    // 修改用户名失去焦点后保存函数，并对输入框的数值进行检验
    saveChanges (row) {
      // 验证用户名格式
      const username = row.username.trim() // 删除可能存在的首尾空格
      const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,14}$/ // 匹配汉字、大小写英文字母和数字，长度不超过14位
      const pureNumberRegex = /^\d+$/ // 纯数字的正则表达式

      if (!username) {
        this.$message.error('用户名不能为空')
        return
      }

      if (!usernameRegex.test(username)) {
        this.$message.error('用户名格式错误')
        return
      }

      if (pureNumberRegex.test(username)) {
        this.$message.error('用户名不能为纯数字')
        return
      }

      this.$delete(row, 'editing')
      this.changeInfo(row.status, row.userId, username)
    },

    // 切换用户状态函数
    editType (index, row) {
    // 根据当前状态切换状态值
      row.status = row.status === 0 ? 1 : 0
      // 在这里可以添加发送请求更新用户状态的逻辑
      this.changeInfo(row.status, row.userId)
      console.log(row)
    },
    resetpwd (index, row) {
    // 后期需要用到用户id进行重置
      // this.resetpsd.userId = row.userId
      this.$confirm('确定要重置密码吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changepassword(row.userId)
        this.$message({
          type: 'success',
          message: '重置成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
      })
    },
    // 显示添加用户对话框
    add () {
      this.dialogVisible = true
      // 清空新用户信息
      this.newUser = {
        userName: '',
        userId: '',
        userEmail: '',
        userRealName: ''
      }
    },
    // 添加用户
    async addUser () {
      try {
      // 将新用户信息添加到表格数据中
        this.userTableData.push({
          userName: this.newUser.userName,
          userId: this.newUser.userId,
          userEmail: this.newUser.userEmail,
          editTime: new Date(), // 可以自行定义新增用户的编辑时间
          userRealName: this.userRealName,
          isLock: 'N'
        })

        // 关闭对话框
        this.dialogVisible = false

        // 发送添加用户请求
        const addResponse = await fetch('http://8.134.178.176:8080/admin/add/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.$store.usertoken
          },
          body: JSON.stringify({
            // eslint-disable-next-line no-undef
            userName: this.newUser.userName,
            userId: this.newUser.userId,
            userEmail: this.newUser.userEmail,
            editTime: new Date(), // 可以自行定义新增用户的编辑时间
            userRealName: '普通用户',
            isLock: 'N'
          })
        })

        if (addResponse.ok) {
          const addData = await addResponse.json()
          console.log('Add user response:', addData)
        } else {
          throw new Error('Failed to add user')
        }
      } catch (error) {
        console.error('Error adding user:', error)
        // 清空新用户信息
        this.newUser = {
          userName: '',
          userId: '',
          userEmail: '',
          userRealName: '',
          isLock: 'N'
        }
      }
    },

    // 搜索函数
    search () {
    // 在搜索前调用 fetchDataReal 方法获取最新数据
      this.getData().then(() => {
      // 根据输入的用户名和邮箱号进行搜索过滤
        const filteredUsers = this.userTableData.filter(user =>
          (user.userName.toLowerCase().includes(this.searchUserName.toLowerCase()) || this.searchUserName === '') &&
          (user.userEmail.toLowerCase().includes(this.searchUserEmail.toLowerCase()) || this.searchUserEmail === '')
        )

        // 更新表格数据为搜索结果
        this.userTableData = filteredUsers
      })
    },

    // 获取用户数据列表
    getData () {
      // 调用用户信息 API 获取基本用户数据
      fetch('http://8.134.178.176:8080/admin/list?page=1&pageSize=10', {
        method: 'POST',
        headers: {
          Authorization: this.$store.state.usertoken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
        .then(_response => { // 将 response 改为 _response
          if (!_response.ok) {
            throw new Error('网络请求失败')
          }
          return _response.json()
        })
        .then(userData => {
          // 在这里处理响应数据
          console.log(userData)
          // 从后端获取数据并赋值给表格数组
          this.userTableData = userData.data.list
          console.log(this.userTableData)
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '权限不足！'
          })
          console.error('获取用户数据时出错:', error)
        })
    },
    // 更新用户身份（实现）
    changeRole (userId, roleId) {
      fetch(`http://8.134.178.176:8080/admin/role/update?userId=${userId}&roleId=${roleId}`, {
        method: 'PUT',
        headers: {
          // 从vuex获取token
          Authorization: this.$store.state.usertoken,
          'Content-Type': 'application/json'
        },
        // 请求体设置为空
        body: JSON.stringify({})
      })
        .then(_response => { // 将 response 改为 _response
          if (!_response.ok) {
            throw new Error('网络请求失败')
          }
          return _response.json()
        })
        .then(userData => {
          // 在这里处理响应数据
          this.$message({
            type: 'success',
            message: '修改身份成功'
          })
          console.log(666, userData)
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '修改身份失败'
          })
          console.error('获取用户数据时出错:', error)
        })
    },
    // 修改用户状态（实现）
    changeInfo (status, userId, userName = null) {
      const requestBody = {
        status: status,
        userId: userId
      }

      // 如果用户名存在，则添加到请求体中
      if (userName !== null) {
        requestBody.username = userName
      }

      fetch('http://8.134.178.176:8080/admin/info/update', {
        method: 'PUT',
        headers: {
          Authorization: this.$store.state.usertoken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('网络请求失败')
          }
          return response.json()
        })
        .then(userData => {
          this.$message({
            type: 'success',
            message: '修改成功！'
          })
          console.log(userData)
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '修改状态失败'
          })
          console.error('修改用户信息时出错:', error)
        })
    },

    // 重置密码接口封装
    changepassword (userId) {
      fetch(`http://8.134.178.176:8080/admin/update?userId=${userId}`, {
        method: 'PUT',
        headers: {
          // 从vuex获取token
          Authorization: this.$store.state.usertoken,
          'Content-Type': 'application/json'
        },
        // 请求体设置为空
        body: JSON.stringify({})
      })
        .then(_response => { // 将 response 改为 _response
          if (!_response.ok) {
            throw new Error('网络请求失败')
          }
          return _response.json()
        })
        .then(userData => {
          // 在这里处理响应数据
          console.log(555, userData)
        })
        .catch(error => {
          console.error('获取用户数据时出错:', error)
        })
    },
    // 编写修改用户类型点击事件
    editUserRole (row) {
      console.log(row.userId, row.roleVO.roleId)
      this.changeRole(row.userId, row.roleVO.roleId)
    }
  }

}
</script >

<style scoped>
.cell{
  text-align: center;
}
</style>
