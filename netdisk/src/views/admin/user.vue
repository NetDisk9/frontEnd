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
          <el-input size="small" v-model="formInline.userName" placeholder="输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input size="small" v-model="formInline.userMobile" placeholder="输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="add">添加</el-button>
          <el-button size="small" type="primary">部门设置</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户表格的渲染 -->
      <!-- 这里的data绑定的是下面data中的usertabledata，后期这个usertabledata需要调用接口渲染 -->
      <!-- 下面使用了slice方法决定点击改变页面的时候渲染哪一部分数据，由我们点击的页面和每一页显示的页面条数有关 -->
      <el-table size="small" @selection-change="selectChange"  :data="userTableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%;">
        <el-table-column align="center" type="selection" width="50">
        </el-table-column>

        <el-table-column align="center" sortable prop="userName" label="用户名" width="120">
        </el-table-column>

        <el-table-column align="center" sortable prop="userId" label="用户ID" width="120">
        </el-table-column>

        <el-table-column align="center" sortable prop="userEmail" label="邮件" min-width="120">
        </el-table-column>

        <!-- 这里的最近登陆时间一般后端传递的是时间戳，所以可以使用方法进行转换成我们看的时间类型 -->
        <el-table-column align="center" sortable prop="editTime" label="最近登陆时间" min-width="120">
            <!-- 处理时间为使其可读性变高 -->
            <!-- 在methods中定义了一个转化时间戳为常规时间的函数在下面进行调用 -->
          <template slot-scope="scope">
            <div>{{ formatDate(scope.row.editTime) }}</div>
          </template>
        </el-table-column>

        <el-table-column align="center" sortable prop="isLock" label="状态" min-width="120">
          <template slot-scope="scope">
            <!-- 进行判断状态的改变点击后会把islock转化为n或者y然后控制是否显示 -->
            <el-switch :value="scope.row.isLock === 'N' ? nshow : fshow" active-color="#13ce66" inactive-color="#ff4949" @change="editType(scope.$index, scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column align="center" sortable prop="userRealName" label="用户类型" width="140">
  <template slot-scope="scope">
    <!-- 使用slot把roleid传送过来然后进行选择 -->
    <el-select v-model="scope.row.userRealName" placeholder="请选择" @change="editUserRole(scope.row)">
      <el-option label="普通用户" value="1"></el-option>
      <el-option label="管理员" value="2"></el-option>
      <!-- 其他选项 -->
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
    <!-- 分页 -->
    <!--
        @size-change //  pageSize 改变时会触发 每页条数
        @current-change //  currentPage 改变时会触发 当前页
        :current-page //  默认false
        background//  是否为分页按钮添加背景色
        :page-sizes // 每页显示个数选择器的选项设置 这是下拉框可以选择的，每选择一行，要展示多少内容 类似：[10, 20, 30, 40, 50, 100]
        page-sizes=显示当前行的条数
        layout // 组件布局，子组件名用逗号分隔
       :total // 总条目数,一般从展示列表的总数获取，这里我们从table中获取
       后期可以封装成组件，但是需要进行双向绑定
     -->
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
export default {
  name: 'userPage',
  data () {
    return {
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
      editForm: {
        // 用户id
        userId: '',
        // 用户名
        userName: '',
        // 用户身份
        userRealName: '',
        // 用户邮箱
        userEmail: ''
      },
      // 重置密码需要的参数后期点击重置密码需要token进行操作
      resetpsd: {
        userId: '',
        token: localStorage.getItem('logintoken')
      }

    }
  },
  created () {
    this.getdata(this.formInline)
  },

  methods: {

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
    // 处理时间戳函数
    formatDate (timestamp) {
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    search () {
      // 实现搜索功能
    },
    add () {
      // 实现添加功能
    },
    selectChange () {
      // 实现选择改变功能
    },
    editType (index, row) {
    // 根据当前状态切换开关值
      row.isLock = row.isLock === 'N' ? 'Y' : 'N'

      // 接下来你可以在这里执行一些其他的操作，比如保存修改后的数据到服务器

      // 如果你想要立即更新到服务器，可以调用一个保存数据的方法，例如：
      // this.saveData(row);

    // 你也可以在保存数据成功后更新视图，例如：
    // this.$message.success('状态修改成功');
    },

    // 如果你想要立即更新到服务器，可以添加一个保存数据的方法
    // saveData(row) {
    //   // 调用保存数据的接口，将修改后的数据发送给服务器
    //   // 这里是一个示例，具体实现根据你的需求和后端接口来确定
    //   saveDataToServer(row).then(() => {
    //     this.$message.success('状态修改成功');
    //   }).catch(error => {
    //     this.$message.error('保存数据失败：' + error.message);
    //     // 如果保存失败，可能需要将状态还原到之前的状态
    //     // 这取决于你的业务逻辑和用户体验需求
    //     row.isLock = row.isLock === 'N' ? 'Y' : 'N';
    //   });
    // },

    // 重置密码 index索引暂时用不到
    resetpwd (index, row) {
      // 后期需要用到用户id进行重置
      this.resetpsd.userId = row.userId
      this.$confirm('确定要重置密码吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
    //   这里是未来进行接口的封装需要使用到当行的数据进行传递操作
      // .then(() => {
      //   userPwd(this.resetpsd)
      //     .then(res => {
      //       if (res.success) {
      //         this.$message({
      //           type: 'success',
      //           message: '重置密码成功！'
      //         })
      //         this.getdata(this.formInline)
      //       } else {
      //         this.$message({
      //           type: 'info',
      //           message: res.msg
      //         })
      //       }
      //     })
      //     .catch(err => {
      //       this.loading = false
      //       this.$message.error('重置密码失败，请稍后再试！')
      //     })
      // })
      // .catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '取消重置密码！'
      //   })
      // })
    },
    getdata (parameter) {
      this.loading = true
      // 模拟数据开始
      const res = {
        code: 0,
        msg: null,
        count: 16,
        data: [
          {
            // 时间
            editTime: 1527411068000,
            // 用户id
            userId: 1,
            // 用户姓名
            userName: 'root',
            // 身份
            userRealName: '管理员',
            // 手机号
            userMobile: '138123456789',
            // 邮箱
            userEmail: '111@qq.com',
            // 帐号状态
            isLock: 'N'
          },
          {
            editTime: 1527410579000,
            userId: 3,
            userName: 'zengzhuo',
            userRealName: '普通用户',
            userMobile: '18616988966',
            userEmail: '222@qq.com',
            isLock: 'N'
          },
          {
            // 时间
            editTime: 1527411068000,
            // 用户id
            userId: 1,
            // 用户姓名
            userName: 'root',
            // 身份
            userRealName: '管理员',
            // 手机号
            userMobile: '138123456789',
            // 邮箱
            userEmail: '111@qq.com',
            // 帐号状态
            isLock: 'N'
          },
          {
            editTime: 1527410579000,
            userId: 3,
            userName: 'zengzhuo',
            userRealName: '普通用户',
            userMobile: '18616988966',
            userEmail: '222@qq.com',
            isLock: 'N'
          }, {
            // 时间
            editTime: 1527411068000,
            // 用户id
            userId: 1,
            // 用户姓名
            userName: 'root',
            // 身份
            userRealName: '管理员',
            // 手机号
            userMobile: '138123456789',
            // 邮箱
            userEmail: '111@qq.com',
            // 帐号状态
            isLock: 'N'
          },
          {
            editTime: 1527410579000,
            userId: 3,
            userName: 'zengzhuo',
            userRealName: '普通用户',
            userMobile: '18616988966',
            userEmail: '222@qq.com',
            isLock: 'N'
          }, {
            // 时间
            editTime: 1527411068000,
            // 用户id
            userId: 1,
            // 用户姓名
            userName: 'root',
            // 身份
            userRealName: '管理员',
            // 手机号
            userMobile: '138123456789',
            // 邮箱
            userEmail: '111@qq.com',
            // 帐号状态
            isLock: 'N'
          },
          {
            editTime: 1527410579000,
            userId: 3,
            userName: 'zengzhuo',
            userRealName: '普通用户',
            userMobile: '18616988966',
            userEmail: '222@qq.com',
            isLock: 'N'
          }, {
            // 时间
            editTime: 1527411068000,
            // 用户id
            userId: 1,
            // 用户姓名
            userName: 'root',
            // 身份
            userRealName: '管理员',
            // 手机号
            userMobile: '138123456789',
            // 邮箱
            userEmail: '111@qq.com',
            // 帐号状态
            isLock: 'N'
          },
          {
            editTime: 1527410579000,
            userId: 3,
            userName: 'zengzhuo',
            userRealName: '普通用户',
            userMobile: '18616988966',
            userEmail: '222@qq.com',
            isLock: 'N'
          }, {
            // 时间
            editTime: 1527411068000,
            // 用户id
            userId: 1,
            // 用户姓名
            userName: 'root',
            // 身份
            userRealName: '管理员',
            // 手机号
            userMobile: '138123456789',
            // 邮箱
            userEmail: '111@qq.com',
            // 帐号状态
            isLock: 'N'
          },
          {
            editTime: 1527410579000,
            userId: 3,
            userName: 'zengzhuo',
            userRealName: '普通用户',
            userMobile: '18616988966',
            userEmail: '222@qq.com',
            isLock: 'N'
          }, {
            // 时间
            editTime: 1527411068000,
            // 用户id
            userId: 1,
            // 用户姓名
            userName: 'root',
            // 身份
            userRealName: '管理员',
            // 手机号
            userMobile: '138123456789',
            // 邮箱
            userEmail: '111@qq.com',
            // 帐号状态
            isLock: 'N'
          },
          {
            editTime: 1527410579000,
            userId: 3,
            userName: 'zengzhuo',
            userRealName: '普通用户',
            userMobile: '18616988966',
            userEmail: '222@qq.com',
            isLock: 'N'
          }, {
            // 时间
            editTime: 1527411068000,
            // 用户id
            userId: 1,
            // 用户姓名
            userName: 'root',
            // 身份
            userRealName: '管理员',
            // 手机号
            userMobile: '138123456789',
            // 邮箱
            userEmail: '111@qq.com',
            // 帐号状态
            isLock: 'N'
          },
          {
            editTime: 1527410579000,
            userId: 3,
            userName: 'zengzhuo',
            userRealName: '普通用户',
            userMobile: '18616988966',
            userEmail: '222@qq.com',
            isLock: 'N'
          },
          {
            editTime: 1527410579000,
            userId: 3,
            userName: 'zengzhuo',
            userRealName: '普通用户',
            userMobile: '18616988966',
            userEmail: '222@qq.com',
            isLock: 'N'
          },
          {
            editTime: 1527410579000,
            userId: 3,
            userName: 'zengzhuo',
            userRealName: '普通用户',
            userMobile: '18616988966',
            userEmail: '222@qq.com',
            isLock: 'N'
          }
        ]
      }
      this.loading = false
      //   将数组中的数据渲染给表格绑定的数据
      this.userTableData = res.data
      //   // 分页赋值
      //   this.pageparm.currentPage = this.formInline.page
      //   this.pageparm.pageSize = this.formInline.limit
      //   this.pageparm.total = res.count
      // 模拟数据结束

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      // 获取用户列表
      // userList(parameter).then(res => {
      //   this.loading = false
      //   if (res.success == false) {
      //     this.$message({
      //       type: 'info',
      //       message: res.msg
      //     })
      //   } else {
      //     this.userData = res.data
      //     // 分页赋值
      //     this.pageparm.currentPage = this.formInline.page
      //     this.pageparm.pageSize = this.formInline.limit
      //     this.pageparm.total = res.count
      //   }
      // })
    }
  }
}
</script >

  <style scoped>
.cell{
    text-align: center;
}
  </style>
