<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 点击可以跳转到首页 这里首页就是用户管理页面 -->
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb><br>

    <!-- 下面栏目用于搜索功能 -->
    <!-- 下面栏目用于搜索功能 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
          <!-- 这里进行帐号是否正常进行筛选需要调用后期接口 -->
          <!-- 修改数值后触发事件进行筛选符合状态的数值 ，因为forminline不是从后端拿的数据所以初始状态为空，每次刷新传递给getdata的都是空值，点击修改后就会重新传递islock-->
        <el-select size="small" v-model="formInline.isLock" placeholder="请选择" @change="searchStatus()">
          <el-option label="全部" value=""></el-option>
          <!-- -->
          <el-option label="正常" value="0"></el-option>
          <el-option label="已锁定" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.username" placeholder="输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="">
      <el-input size="small" v-model="formInline.email" placeholder="输入邮箱号"></el-input>
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
          <el-input v-model="newUser.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="newUser.password" placeholder="请输入用户密码"></el-input>
        </el-form-item>
        <el-form-item label="角色ID">
        <el-input v-model="newUser.roleId" placeholder="请输入用户类型ID"></el-input>
         <!-- 显示角色列表 -->
         <div v-if="rolelist.length > 0">
            <label>选择用户类型：</label>
            <el-select v-model="newUser.roleId" placeholder="请选择用户类型">
              <el-option
                v-for="role in rolelist"
                :key="role.roleId"
                :label="role.roleName"
                :value="role.roleId"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>

      <!-- 确定和取消按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </span>
    </el-dialog>
     <!--  LYX -->
     <el-button size="small" type="primary" style="margin-left: 10px;" @click="showDialog">批量添加用户</el-button>
        <MyModal :show="showModal" @close="showModal = false">
          <div style="font-size:20px; margin: 0 0 10px 10%">批量添加用户</div>
          <div style="display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 0 0 0 10%">
              <div style="display: flex; align-items: center; margin: auto; width: 60%">
                <div style="display: flex; width: 35px">数量</div>
                <el-input style="width: 80%; padding: 0 10% 0 10%" v-model="createUserNum" placeholder="请输入数字"></el-input>
              </div>
              <div style="display: flex; padding: 0 10% 0 10%">
                <el-select v-model="selectedRoleId" style="width: 80%" placeholder="用户权限">
                  <el-option v-for="role in rolelist" :key="role.roleId" :label="role.roleName" :value="role.roleId">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div style="display: flex; justify-content: center; margin: 20px 0 0 0">
              <el-button @click="sendForExcel()">确认</el-button>
              <el-button @click="cancel()">取消</el-button>
            </div>
          </div>
        </MyModal>
        <!--  LYX -->
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
import MyModal from '@/components/myModal.vue'
import axios from 'axios'
export default {
  components: {
    MyModal
  },
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
        deptId: '',
        username: '',
        email: '',
        userMobile: '',
        isLock: ''
      },
      searchUserName: '',
      searchUserEmail: '',
      showModal: false, // LYX
      createUserNum: '', // LYX
      selectedRoleId: '', // LYX

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
  // 最好还是把所有接口函数声明为异步这样子可以防止阻塞，当然也可以先同步页面刷新然后再调用接口到后端进行修改，但是先渲染页面然后调用接口容易产生的问题是如果接口调用失败了但是页面修改完了就会产生错误
  // 异步渲染就是页面会先渲染其他部分，然后渲染完成后会获取最新数据然后响应式进行再次渲染
  async created () {
    // this.getdataTest(this.formInline) // 测试版本，写死数据
    // this.getdata(this.formInline)   //上线版本，从后端拿数据
    const Authorization = this.$store.state.usertoken
    // 不需要async因为不需要对返回值进行操作
    this.getData() // 上线版本，从后端拿数据
    // 获取可修改权限类型
    // getrole异步函数没有在里面对rolelist进行赋值所以需要使用await进行等待等异步执行完成下面再对rolelist进行赋值，不使用await的话会导致没拿到rolelist就进行渲染
    // async一般用于调用接口的异步函数，然后await要用在赋值的时候，有返回值需要接受的时候就需要使用await等待
    // 这下面如果不使用await的话就会先执行下面的同步代码，就会发现赋值是无效的，所以我门要添加await等待请求的数据到了之后再进行渲染
    const { data } = await getrole(Authorization)
    // console.log(Authorization)
    // 将后端的数据拿到传递给修改权限列表
    this.rolelist = data.data
    console.log(666, this.rolelist)
    // const userId = '1772526756342882306'
    // this.changepassword(userId)
    // const res2 = await changeRole(userId, roleId, Authorization)
    // console.log(666, res2)
    // const res3 = await resetPassword(Authorization, userId)
    // console.log(5555, res3)
  },

  methods: {
    searchStatus () {
      console.log(this.formInline.isLock)
      // 修改状态后会重新传递状态获取最新列表进行渲染，每次修改搜索的数据的时候都需要调用获取数据接口
      this.getData()
    },
    handleClose () {
      // 关闭对话框时重置表单
      this.dialogVisible = false
      this.newUser = {
        username: '',
        password: '',
        roleId: null
      }
    },

    // 显示添加用户对话框
    async add () {
      this.dialogVisible = true // 打开对话框
      // this.fetchRoleList() // 打开对话框时获取角色列表
      this.getData()
    },
    // 添加用户接口封装
    async addUser () {
      try {
        const oldPassword = this.newUser.password

        // 使用正则表达式替换特殊字符为对应的 URL 编码
        const newPassword = oldPassword.replace(/[@#$%*]/g, (match) => {
          // 将匹配到的特殊字符转换为对应的 16 进制编码
          return '%' + match.charCodeAt(0).toString(16).toUpperCase()
        })

        // 更新新的密码值
        this.newUser.password = newPassword

        // 获取需要的参数
        const { username, password, roleId } = this.newUser

        // 构建请求的 URL，将 username、password 和 roleId 都放置在路径中
        const url = `http://8.134.178.176:8080/admin/add/user?username=${username}&password=${password}&roleId=${roleId}`

        const response = await axios.post(
          url,
          {}, // 空的请求体，因为数据已经放置在路径中
          {
            headers: {
              Authorization: this.$store.state.usertoken
              // Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTMzOTgwMDcsInVzZXJpZCI6IjE3Njg1NDYwNDIyNDczMjM2NDkifQ.YrDG-g0DSO8k6l9hJNTVdyQb2WPNNZ0ScjPwTe0Xyvg'
            }
          }
        )
        // 处理响应
        if (response && response.data) {
          const responseData = response.data
          switch (response.status) {
            case 200:
              if (responseData.code === 200) {
                this.$message.success(responseData.message || '新增用户成功')
              } else {
                this.$message.error(responseData.message || '新增用户失败')
              }
              break
            case 422:
              if (responseData.code === 422 && responseData.errors) {
                // 遍历 errors 对象，显示具体的参数错误提示
                Object.keys(responseData.errors).forEach(field => {
                  const errorMessage = responseData.errors[field]
                  switch (field) {
                    case 'username':
                      this.$message.error(`用户名错误: ${errorMessage}`)
                      break
                    case 'password':
                      this.$message.error(`密码错误: ${errorMessage}`)
                      break
                      // 可以根据需要添加其他字段的处理
                    default:
                      this.$message.error(`参数错误: ${errorMessage}`)
                      break
                  }
                })
              } else {
                this.$message.error('请求失败：' + responseData.message)
              }
              break
            default:
              this.$message.error('请求失败：' + responseData.message)
              break
          }
        } else {
          this.$message.error('未收到有效的响应')
        }
      } catch (error) {
        console.error('新增用户请求出错:', error)
        this.$message.error('新增用户失败')
      }
    },
    // 搜索函数
    async search () {
      try {
        this.formInline.pageSize = 50 // 默认每页显示20条数据

        // 设置默认的分页参数
        const { page, pageSize } = this.formInline

        // 构建请求的 URL，将 page 和 pageSize 作为查询参数
        const url = `http://8.134.178.176:8080/admin/list?page=${page}&pageSize=${pageSize}`

        // 准备请求体，只包含除了 page 和 pageSize 之外的搜索条件
        const { username, email } = this.formInline
        const requestBody = {
          username: username,
          email: email
        }

        // 发送 POST 请求，将搜索条件放置在请求体中
        const response = await axios.post(url, requestBody, {
          headers: {
            Authorization: this.$store.state.usertoken
          }
        })

        // 处理响应结果
        if (response && response.data && response.data.code === 200) {
          const responseData = response.data.data
          this.userTableData = responseData.list // 更新用户列表数据
        } else {
          this.$message.error(response.data.message || '搜索失败')
        }
      } catch (error) {
        console.error('搜索用户失败:', error)
        this.$message.error('搜索用户失败')
      }
    },
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
    // 若不需要对异步函数后续的操作的话可以不添加async await，这里不添加async就会先执行前面两行代码，然后将请求放入异步，等待完成后就会刷新数据
    // 当然也可以全部当作异步函数加上async然后等待其他同步代码执行完成后就会执行这个事件内部的函数
    editType (index, row) {
    // 根据当前状态切换状态值
    // 这里正确的做法应该是先不要进行状态的修改在页面上而是点击后将状态取反传递给后端，然后执行成功后再重新获取更新一遍我们的用户列表数据这样就可以进行渲染了，但是如果数据一多会影响用户体验，并且如果先渲染可以增加页面流畅性
      row.status = row.status === 0 ? 1 : 0
      console.log(row)
      // 在这里可以添加发送请求更新用户状态的逻辑
      this.changeInfo(row.status, row.userId)
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

    // 获取用户数据列表
    getData () {
      // 构造请求体参数
      const requestBody = {
        status: this.formInline.isLock,
        roleId: this.roleId

      }

      // 调用用户信息 API 获取基本用户数据
      fetch('http://8.134.178.176:8080/admin/list?page=1&pageSize=100', {
        method: 'POST',
        headers: {
          Authorization: this.$store.state.usertoken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody) // 将请求体参数转换为 JSON 字符串并放入 body 中
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
          this.userTableData = userData.data.list.filter((item) => {
            // 筛选出非管理员用户进行渲染
            return item.roleVO.roleId !== '1481929310323883495'
          })
          console.log(this.userTableData)
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '权限不足！'
          })
          console.error('获取用户数据时出错:', error)
          // 权限不足的时候进行跳转用户界面
          this.$router.push('/homeview')
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
          // 修改身份成功后重新获取最新数据进行渲染
          this.getData()
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
      this.getData()
    },
    // 显示模态框 LYX
    showDialog () {
      this.showModal = true
    },
    // 取消批量添加
    cancel () {
      this.showModal = false
    },
    // 请求后端生成excel文件
    sendForExcel () {
      fetch(`http://8.134.178.176:8080/admin/add/all/user?count=${this.createUserNum}&roleId=${this.selectedRoleId}`, {
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
          return _response
        })
        .then(async userData => {
          // 在这里处理响应数据
          console.log(666, userData)
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          const blob = await userData.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = '用户信息.xlsx'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          this.showModal = false
        })
      this.showModal = false
    }
    // LYX
  }

}
</script >

<style scoped>
.cell{
  text-align: center;
}
</style>
