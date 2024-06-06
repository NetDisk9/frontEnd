<template>
  <!-- 个人中心界面 -->
  <div>
    <div id="top-bar">
      <div style="height: 100%;">
        <div style="display: flex;  align-items: center; height: 100%;">
          <!-- <div id="avatar-preview" :style="{backgroundImage: 'url(' + avatarPreviewUrl + ')'}"></div> -->
          <div>
            <img src="../assets/logo2.png" style="padding-left: 30%; height: 80%;">
          </div>
        </div>
      </div>
    </div>
    <div id="divider"></div>
    <div id="content">
      <div id="area1" class="area">
      </div>
      <div id="gap"></div>
      <div id="area2" style="display: flex; flex-direction: column;">
        <div class="mid-top" style="width: 100%; height: 10%;">
          <div style="display: flex; align-items: center;">
            <div :style="{ backgroundImage: 'url(' + avatarPreviewUrl + ')' }" id="avatar-preview"></div>
            <div style="font-size: 30px;padding-left: 2%;padding-top: 1%;">{{ username }}</div>
          </div>
        </div>
        <div class="filelist" @contextmenu.prevent="showContextMenu">
          <div style="position: relative">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>
                <!-- 返回上一步 -->
                <i class="el-icon-arrow-left" style="margin-right: 10px; margin-left: 30px " @click="goBack"></i>
                <i class="el-icon-arrow-right"></i>
                <!-- 添加这个javascript:void(0)才能使点击后不进行跳转执行内嵌的@click -->
                <a href="javascript:void(0);" @click="allfile">全部文件</a>
              </el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in list" :key="index">
                <!-- 点击后可以拿到数组下标，删除下标之后的面包屑数组 -->
                <a href="javascript:void(0);" @click="navigateTo(index)">{{ item.fileName }}</a>
              </el-breadcrumb-item>
            </el-breadcrumb>
            <!--    工具栏-->
            <div style="margin: 20px 10% 20px 20px; display: flex; justify-content: right">
              <el-button type="primary" size="small" icon="el-icon-plus" @click="saveto">转存
              </el-button>
            </div>
            <!-- 表格区域 -->
            <el-table ref="table" v-if="isTableVisible" size="small" @selection-change="selectChange" :row-key="getKey"
                      :data="userTableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" style="width: 100%;">
              <!-- 复选框 -->
              <el-table-column align="center" type="selection" width="50" :reserve-selection="true"></el-table-column>
              <!-- 文件名 -->
              <el-table-column align="left" sortable prop="fileName" label="文件名" width="500">
                <template v-slot="{ row }">
                  <div :class="{ 'cut-row': isCut(row) }"  class="file-cell">
                    <img :src="getFileIcon(row.fileName)" class="file-icon" alt="file icon" />
                    <a id="filetext" href="javascript:void(0);" @click="openfile(row)">{{ row.fileName }}</a>
                  </div>
                </template>
              </el-table-column>
              <!-- 大小 -->
              <el-table-column align="center" sortable prop="fileSize" label="大小" min-width="120"></el-table-column>
              <!-- 修改时间 -->
              <el-table-column align="center" sortable prop="updateTime" label="最近修改时间" min-width="120"></el-table-column>
              <!-- <el-table-column align="center" sortable prop="userFileId" label="FileID" min-width="120"></el-table-column> -->
            </el-table>
            <!-- 分页组件 -->
            <el-pagination
              style="margin-left: 10px; margin-top: 20px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              background
              :page-sizes="[1, 3, 5, 10,15]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="userTableData.length">
            </el-pagination>
          </div>
        </div>
      </div>
      <div id="gap"></div>
      <div id="area1"></div>
    </div>
  </div>
</template>
<script>
import { getshareFile, createDir, deleteFile, getFile, renameFile, forCates } from '@/api/file'
import axios from 'axios'
export default {
  data () {
    return {
    // 面包屑渲染数据
      list: [],
      username: '未知用户', // 默认显示 "未知用户"
      // 渲染文件列表数组
      userTableData: [],
      // 分页组件初始页面
      currentPage: 1,
      // 每一页的总条数 这里我默认设置成10条每一个页面
      pagesize: 15,
      token: this.$store.state.usertoken,
      // 复选框数据
      selectedRows: [],
      selectedFileIds: [], // 存储选中文件的 ID
      // 添加一个加载状态防止在未渲染前多次点击
      isLoading: false,
      isTableVisible: true,
      showNew: false,
      showRename: false,
      newName: '',
      // Context menu position
      contextMenuStyle: {
        top: '0px',
        left: '0px',
        position: 'absolute',
        display: 'none'
      },
      clipboard: {
        action: '', // 'copy' or 'cut'
        files: [] // Array of filenames
      },
      avatarPreviewUrl: '', // 初始化为默认值或空字符串
      // New data property to track the clicked row
      clickedRow: null,
      cutFiles: [] // Array to store IDs of cut files
    }
  },
  async created () {
    console.log(this.$route.params.surl)
    this.getshareMessage()
    await this.allfile()
  // this.getUserInfo()
  },
  methods: {
  // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange (size) {
      this.pagesize = size
      console.log(this.pagesize) // 每页下拉显示数据
    },
    // 这是点击页码后会传递新页码
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },
    // 根据文件名获取图标路径
    getFileIcon (fileName) {
    // 文件图标
      if (fileName.indexOf('.') === -1) { return require('@/assets/file.png') }
      const extension = fileName.split('.').pop().toLowerCase()
      switch (extension) {
        case 'txt':
          return require('@/assets/txt.png')
        case 'jpg':
        case 'jpeg':
          return require('@/assets/img.png')
        case 'png':
          return require('@/assets/png.png')
        case 'gif':
          return require('@/assets/gif.png')
        case 'pdf':
          return require('@/assets/pdf.png')
        case 'exe':
          return require('@/assets/exe.png')
        case 'mp3':
          return require('@/assets/mp3.png')
        case 'mp4':
          return require('@/assets/mp4.png')
        case 'flac':
          return require('@/assets/music.png')
        case 'ppt':
          return require('@/assets/ppt.png')
        case 'zip':
          return require('@/assets/zip.png')
        default:
          return require('@/assets/default.png')
      }
    },
    async openfile (row) {
    // 添加了节流功能只触发第一次
    // 如果还没有执行完成会直接return
      if (this.isLoading) return
      this.isLoading = true
      try {
        const res = await getshareFile(this.token, 1, 100, this.$route.params.surl, row.userFileId)
        this.selectedRows = []
        this.clearTableSelection()
        if (res.data.code === 200) {
          this.userTableData = res.data.data.list
          this.list.push(row)
        }
      } catch (error) {
        this.$message({
          message: '打开文件夹失败！',
          type: 'error',
          duration: 2000
        })
      } finally {
      // 执行完成后设置为false可以再次点击
        this.isLoading = false
      }
    },
    // 获取所有文件
    async allfile () {
    // 重新获取所有的文件
      const res = await getshareFile(this.token, 1, 100, this.$route.params.surl)
      this.userTableData = res.data.data.list
      this.userTableData.forEach(item => {
        console.log(item)
      })
      this.list = [] // 清空面包屑导航
    },
    async getPics () {
      const res = await forCates(this.token, 1, 100, 1000)
      this.userTableData = res.data.data.list
      this.list = []
      console.log(res)
    },
    async getDocs () {
      const res = await forCates(this.token, 1, 100, 3000)
      this.userTableData = res.data.data.list
      this.list = []
      console.log(res)
    },
    async getVideos () {
      const res = await forCates(this.token, 1, 100, 2000)
      this.userTableData = res.data.data.list
      this.list = []
      console.log(res)
    },
    async getMusics () {
      const res = await forCates(this.token, 1, 100, 4000)
      this.userTableData = res.data.data.list
      this.list = []
      console.log(res)
    },
    async getZips () {
      const res = await forCates(this.token, 1, 100, 5000)
      this.userTableData = res.data.data.list
      this.list = []
      console.log(res)
    },
    async getOthers () {
      const res = await forCates(this.token, 1, 100, 6000)
      this.userTableData = res.data.data.list
      this.list = []
      console.log(res)
    },
    getshareMessage () {
      console.log('已发送请求')
      fetch('http://8.134.178.176:8080/file/share/info?link=' + this.$route.params.surl, {
        method: 'GET',
        headers: {
          Authorization: this.$store.state.usertoken
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('获取用户信息失败')
          }
        })
        .then(data => {
          if (data && data.code === 200 && data.data) {
            const userInfo = data.data
            // console.log(userInfo)
            // console.log(this)// 调试 this 的值
            this.username = userInfo.username
            // document.getElementById('avatar-preview').style.backgroundImage = `url(${userInfo.avatar})`
            this.avatarPreviewUrl = userInfo.avatar
          // console.log('头像url:' + userInfo.avatar)
          } else {
          // console.error(data.code)
          }
        })
        .catch(error => {
          console.error('发生错误:', error.message)
        // alert('获取用户信息失败，请重试！')
        })
    },
    // 返回上一级文件夹
    async goBack () {
      this.clearTableSelection()
      // 进行添加节流以及返回失败进行提示
      if (this.isLoading) return
      this.isLoading = true
      try {
        if (this.list.length === 0) {
        // 当前已在根目录
          await this.allfile()
        } else {
        // 移除最后一个面包屑导航项
          this.list.pop()
          // 获取上一级目录的文件，如果数组中还有上一级文件就获取上一级文件的id，然后进行渲染，如果去除掉最后一层后渲染函数没有长度了就直接渲染全部文件
          const parentId = this.list.length > 0 ? this.list[this.list.length - 1].userFileId : null
          const res = await getshareFile(this.token, 1, 100, this.$route.params.surl, parentId)
          this.userTableData = res.data.data.list
        }
      } catch (error) {
        this.$message({
          message: '返回失败！',
          type: 'error',
          duration: 2000
        })
      } finally {
      // 执行完成后设置为false可以再次点击
        this.isLoading = false
      }
    },
    // 导航到指定层级的文件夹
    async navigateTo (index) {
      this.clearTableSelection()
      // 首先先获取目标文件的id
      const targetFolder = this.list[index]
      // 删除目标文件后面的所有面包屑
      this.list = this.list.slice(0, index + 1)
      // 根据目标文件的id进行页面的渲染
      const res = await getFile(this.token, 1, 100, targetFolder.userFileId)
      this.userTableData = res.data.data.list
      this.selectedRows = []
    },
    // 复选框改变的时候进行更新复选框数组中的数值
    selectChange (selection) {
      this.selectedFileIds = selection.map(item => item.userFileId)
      // this.selectedRows = selection
      // console.log('Selected Rows:', this.selectedRows)
      console.log(this.selectedFileIds)
    },
    // 重命名文件
    async renameFile () {
      const userFileId = this.selectedRows[0].userFileId
      const newName = this.newName
      const res = await renameFile(this.token, userFileId, newName)
      console.log(res)
      if (res.data.code === 200) {
      // 重命名成功后重新获取文件列表
        const res = await getFile(this.token, 1, 100, this.list.length === 0 ? null : this.list[this.list.length - 1].userFileId)
        this.userTableData = res.data.data.list
      }
      this.showRename = false
      this.newName = ''
      this.selectedRows = []
      this.clearTableSelection()
    },
    // 显示新建文件夹模态框 LYX
    showNewDia () {
      this.showNew = true
    },
    // 显示重命名文件夹模态框 LYX
    showRenameDia () {
      this.showRename = true
    },
    // 取消并关闭模态框 LYX
    cancel () {
      this.showNew = false
      this.showRename = false
    },
    // 创建文件夹 LYX
    async createDir () {
      console.log(this.token)
      this.showList()
      const pid = this.list.length > 0 ? this.list[this.list.length - 1].userFileId : null
      console.log(pid)
      const name = this.newName
      console.log(name)
      const res = await createDir(this.token, pid, name)
      console.log(res)
      if (res.data.code === 200) {
      // 创建文件夹成功后重新获取文件列表
        const res = await getFile(this.token, 1, 100, this.list.length === 0 ? null : this.list[this.list.length - 1].userFileId)
        this.userTableData = res.data.data.list
      }
      this.showNew = false
      this.newName = ''
      this.selectedRows = []
      this.clearTableSelection()
    },
    // 下载文件
    downloadFiles () {
      console.log('下载文件')
    },
    // 分享文件
    shareFiles () {
      console.log('分享文件')
    },
    // 移动文件
    moveFiles () {
      console.log('移动文件')
    },
    // 显示文件列表 LYX
    showList () {
      console.log(this.list)
    },
    // 获取文件夹id LYX
    getKey (row) {
      return row.userFileId
    },
    // 复制剪切粘贴下拉菜单 Liu Zijun
    // Show context menu at the mouse position
    showContextMenu (event, row) {
    // Prevent default row selection behavior
      event.stopPropagation()
      event.preventDefault()
      // Set clicked row for context menu
      this.clickedRow = row
      // Calculate context menu position relative to the document
      // Show context menu at the calculated position
      this.$refs.menu.show()
      this.$refs.menu.$el.style.left = `${event.clientX}px`
      this.$refs.menu.$el.style.top = `${event.clientY}px`
      this.$refs.menu.$el.style.display = 'block'
    },
    // 删除文件 LYX
    async deleteFiles () {
      const fileIds = this.selectedRows.map(row => row.userFileId)
      const res = await deleteFile(this.token, fileIds + '')
      console.log(res)
      if (res.data.code === 200) {
      // 删除成功后重新获取文件列表
        const res = await getFile(this.token, 1, 100, this.list[this.list.length - 1].userFileId)
        console.log(this.list[this.list.length - 1].fileName)
        this.userTableData = res.data.data.list
      }
      this.selectedRows = []
      this.clearTableSelection()
    },
    // 取消复选框 Liu Zijun
    clearTableSelection () {
      this.selectedRows = []
      this.$refs.table.clearSelection()
    },
    // 复制 Liu Zijun
    copySelected () {
      this.cutFiles = []
      this.clipboard.action = ''
      this.clipboard.files = [] // Store the userFileId of selected rows in the clipboard for cut action
      // Store the userFileId of selected rows in the clipboard
      this.clipboard.action = 'copy'
      this.clipboard.files = this.selectedRows.map(row => row.userFileId)
      console.log('Clipboard:', this.clipboard)
      console.log('Clipboard files:', this.clipboard.files)
      this.clearTableSelection()
    },
    // 剪切 Liu Zijun
    async cutSelected () {
      this.cutFiles = []
      this.clipboard.action = ''
      this.clipboard.files = [] // Store the userFileId of selected rows in the clipboard for cut action
      this.clipboard.action = 'cut'
      this.clipboard.files = this.selectedRows.map(row => row.userFileId)
      this.cutFiles = [...this.clipboard.files] // Store the cut file IDs
      console.log('Clipboard:', this.clipboard)
      console.log('Clipboard files:', this.clipboard.files)
      this.clearTableSelection()
    },
    // 标记正在剪切文件的函数 Liu Zijun
    // Method to check if a row is cut
    isCut (row) {
      return this.cutFiles.includes(row.userFileId)
    },
    // 粘贴 Liu Zijun
    // Paste files from clipboard
    async pasteClipboard () {
    // Ensure that exactly one file or folder is selected as the paste destination
    // if (this.selectedRows.length !== 1) {
    //   console.error('Please select exactly one file or folder to paste into.')
    //   return
    // }
    // const selectedFile = this.selectedRows[0]
    // console.log('isDir:', selectedFile.isDir)
    // // const pid = selectedFile.pid
      let pid
      if (this.selectedRows.length !== 0) {
        pid = this.selectedRows[0].isDir ? this.selectedRows[0].userFileId : this.selectedRows[0].pid
      } else {
        pid = this.list.length > 0 ? this.list[this.list.length - 1].userFileId : null
      }
      console.log('pid' + pid)
      // console.log('isDir:', selectedFile.isDir)
      this.clearTableSelection()
      const requestData = {
        userFileId: this.clipboard.files,
        pid: pid
      }
      axios.post('http://8.134.178.176:8080/file/copy?mode=1', requestData, {
        headers: { Authorization: this.$store.state.usertoken }
      })
        .then(response => {
          console.log('Paste successful:', response.data)
        // Optionally refresh the file list or provide feedback to the user
        // this.allfile()
        })
        .catch(error => {
          console.error('Paste failed:', error)
        })
      if (this.clipboard.action === 'cut') {
        const fileIds = this.clipboard.files
        console.log(fileIds)
        const res = await deleteFile(this.token, fileIds + '')
        console.log(res)
        if (res.data.code === 200) {
        // 删除成功后重新获取文件列表
          const res = await getFile(this.token, 1, 100, this.list[this.list.length - 1].userFileId)
          console.log(this.list[this.list.length - 1].fileName)
          this.userTableData = res.data.data.list
          console.log('Clipboard:', this.clipboard)
          console.log('Clipboard files:', this.clipboard.files)
        }
        this.clearTableSelection()
        this.cutFiles = []
      }
      this.clearTableSelection()
    },
    // Clear clipboard
    clearClipboard () {
      this.clipboard.action = ''
      this.clipboard.files = []
    },
    saveto () {
      const requestBody = {
        link: this.$route.params.surl,
        userFileIds: this.selectedFileIds
      }
      fetch('http://8.134.178.176:8080/file/transfer', {
        method: 'POST',
        headers: {
          Authorization: this.$store.state.usertoken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody) // 将请求体参数转换为 JSON 字符串并放入 body 中
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('获取用户信息失败')
              .catch(error => {
                console.error('发生错误:', error.message)
              // alert('获取用户信息失败，请重试！')
              })
          }
        })
        .then(data => {
          if (data && data.code === 200) {
            this.$message({
              message: '转存成功，正在跳转',
              type: 'success',
              duration: 2000
            })
            window.location.href = '/#/file'
          }
        })
        .catch(error => {
          console.error('发生错误:', error.message)
        // alert('获取用户信息失败，请重试！')
        })
    }
  }
}
</script>
<style>
.file-cell {
  display: flex;
  align-items: center;
}
.file-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
#filetext {
  text-decoration: none;
  color: black;
}
#filetext:hover {
  color: rgb(64, 158, 255);
}
.el-icon-arrow-left {
  font-weight: bold; /* 加粗 */
  transition: color 0.3s; /* 添加颜色渐变效果 */
}
.el-icon-arrow-left:hover {
  color: rgb(64, 158, 255);
}
.dropdown-button {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  background-color: #fff;
  border: none;
  cursor: pointer;
}
.dropdown-button:hover {
  background-color: #f5f5f5;
}
</style>
<style scoped>
body {
  margin: 0;
  padding: 0;
  background-color: white;
  font-family: Arial, sans-serif;
}
#top-bar {
  min-height: 30px;
  width: 100%;
  height: 80px;
  background-color: white;
}
#divider {
  width: 100%;
  border-bottom: 12px solid #ecedf3;
}
.logo {
  width:30px ;
  height: 30px;
  margin-top: 5px;
  margin-left: 40px;
  /* margin-bottom: -2.35%; */
  background-image: url('../assets/avatar.png');
  background-size:100% 100% ;
}
#content {
  width: 100%;
  display: flex;
  /* justify-content: space-between; */
  height: 100vh;
  background: #ecedf3;
}
.area {
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}
/*LYX*/
#area1 {
  min-width: 12%;
  width: 12%;
  background-color: #ecedf3;
  border-radius: 5px;
  border-color: black;
}
#area2 {
  flex: 1;
  width: 70%;
  background-color: white;
  border-radius: 5px;
  border-color: #ccc;
}
#area3 {
  width: 12%;
  min-width: 12%;
  background-color: white;
  border-radius: 5px;
}
#gap {
  width: 12px;
  background-color: #ecedf3;
}
.menu-item-content {
  display: flex;
  align-items: center;
}
.menu-item-content i {
  font-size: 24px; /* Adjust icon size if needed */
  margin-right: 10px; /* Space between icon and text */
}
.menu-item-text {
  font-size: 20px; /* Adjust text size */
  line-height: 1; /* Ensure text is vertically centered */
}
.filelist{
  margin-top: 20px;
  width: 1100px;
  height: 400px;
}
.cut-row {
  background-color: darkblue;
  color: white; /* Optional: Change text color for better contrast */
}
#avatar-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ccc;
  background-size: cover;
  background-position: center;
  position: relative;
  left: 0;
  bottom: 0;
  margin-left: 10%;
  margin-top: 10px;
}
</style>
