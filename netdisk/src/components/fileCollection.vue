<template>
    <!-- 个人中心界面 -->
    <div>

      <div id="content">
        <div id="area2" class="area">

          <div class="filelist" @contextmenu.prevent="showContextMenu">
            <div class="title">文件列表</div>

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

              <!-- 表格区域 -->
              <el-table ref="table" v-if="isTableVisible && showMume === 1" size="small" @selection-change="selectChange" :row-key="getKey"
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
              </el-table>

              <el-table ref="table" v-if="isTableVisible && showMume === 2" size="small" @selection-change="selectChange" :row-key="getKey"
                        :data="shareTableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" style="width: 100%;">
                <!-- 复选框 -->
                <el-table-column align="center" type="selection" width="50" :reserve-selection="true"></el-table-column>
                <!-- 文件名 -->
                <el-table-column align="left" sortable prop="fileName" label="文件名" width="500">
                  <template v-slot="{ row }">
                    <div :class="{ 'cut-row': isCut(row) }"  class="file-cell">
                      <img :src="getFileIcon(row.fileName)" class="file-icon" alt="file icon" />
                      <a id="filetext">{{ row.fileName }}</a>
                      <div class="hover-icons">
                        <img src="@/assets/share.png" @click="shareFile(row)" />
                        <img src="@/assets/download.png" @click="downloadFiles(row)" />
                        <el-dropdown @command="handleCommand">
                          <img src="@/assets/more.png" @click="$event.stopPropagation()" @click.native="showDropdown(row)" />
                          <el-dropdown-menu slot="dropdown">
                          <button class="dropdown-button" @click="copySelected">Copy</button>
                          <button class="dropdown-button" @click="cutSelected">Cut</button>
                          <button class="dropdown-button" @click="pasteClipboard">Paste</button>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <!-- 分享时间 -->
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
              <el-button @click="select" class="list" style="width: 100px;" type="primary" round>确认</el-button>

              <el-button class="list" style="width: 100px;" round>取消</el-button>
            </div>
          </div>
        </div>
        <!-- Context menu -->
        <el-dropdown ref="menu" :hide-on-click="false" :style="contextMenuStyle">
          <span class="el-dropdown-link" style="display: none;"></span>
          <el-dropdown-menu slot="dropdown">
            <button class="dropdown-button" @click="copySelected">Copy</button>
            <button class="dropdown-button" @click="cutSelected">Cut</button>
            <button class="dropdown-button" @click="pasteClipboard">Paste</button>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 。sync是updata isshare的语法糖用于监听这个isshare变化 -->
      <ShareCom :isshare.sync="isshare" :sharefileid="sharefileid" :sharefilename="sharefilename"></ShareCom>
      <Sendfile
      :visible.sync="resultModalVisible"
      :selectedFiles="selectedFiles"
      @close-result-modal="closeResultModal"
      @remove-file="handleRemoveFile"

></Sendfile>
    </div>
  </template>
<script>
import ShareCom from './ShareCom.vue'
import Sendfile from './sendfile.vue'
import {
  createDir,
  deleteFile,
  getFile,
  renameFile,
  forCates,
  getShareFile,
  getDownloadFile,
  cancelShare
} from '@/api/file'
import axios from 'axios'
export default {
  components: { ShareCom, Sendfile },
  data () {
    return {
      resultModalVisible: false,
      selectedFiles: [],
      // 面包屑渲染数据
      list: [],
      // 渲染文件列表数组
      userTableData: [],
      // 渲染分享列表数组
      shareTableData: [],
      // 分页组件初始页面
      currentPage: 1,
      // 每一页的总条数 这里我默认设置成10条每一个页面
      pagesize: 15,
      token: this.$store.state.usertoken,
      // 复选框数据
      selectedRows: [],
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
      // New data property to track the clicked row
      clickedRow: null,
      cutFiles: [], // Array to store IDs of cut files
      showMume: 1,
      // 分享的文件名和文件id
      sharefileid: '',
      sharefilename: '',
      isshare: false
    }
  },
  async created () {
    await this.allfile()
    await this.getShareHistory()
    this.getUserInfo()
  },
  methods: {
    // 删除复选框数据
    handleRemoveFile (index) {
      this.selectedFiles.splice(index, 1)
    },
    // 关闭子组件
    closeResultModal () {
      this.resultModalVisible = false
    },
    // 选择复选框数据
    select () {
      this.selectedFiles = this.selectedRows
      let hasNullFileId = false

      // 检查是否有 fileId 为 null 的文件
      this.selectedFiles.forEach((value) => {
        if (value.userFileId === null) {
          hasNullFileId = true
        }
      })

      // 如果有 fileId 为 null 的文件，弹出提示并返回
      if (hasNullFileId) {
        this.$message({
          message: '选中的文件中有无效文件，请重新选择！',
          type: 'warning',
          duration: 2000
        })
        this.$refs.table.clearSelection()
        return
      }

      // 如果没有选中文件，弹出提示并返回
      if (this.selectedFiles.length === 0) {
        this.$message({
          message: '请选择需要发送的文件！',
          type: 'warning',
          duration: 2000
        })
        return
      }

      // 正常情况下，处理选中的文件
      console.log(this.selectedFiles)
      this.resultModalVisible = true
      this.$refs.table.clearSelection()
    },
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
        const res = await getFile(this.token, 1, 100, row.userFileId)
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
      const res = await getFile(this.token, 1, 100)
      this.userTableData = res.data.data.list
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
          const res = await getFile(this.token, 1, 100, parentId)
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
    // 获取分享记录
    async getShareHistory () {
      const res = await getShareFile(this.token, 1, 100)
      this.shareTableData = res.data.data.list
      this.list = []
      console.log(res)
      for (let i = 0; i < this.shareTableData.length; i++) {
        this.shareTableData[i].count += '次'
        this.shareTableData[i].status = 0

        let begin, end
        // eslint-disable-next-line prefer-const
        begin = new Date(this.shareTableData[i].begTime)
        // eslint-disable-next-line prefer-const
        end = new Date(this.shareTableData[i].endTime)

        if (end - begin < 0) {
          this.shareTableData[i].available = '已失效'
        }

        const gapTime = (end - begin) / 1000
        if (gapTime > 60 * 60 * 24) {
          // 转化为天数
          this.shareTableData[i].available = Math.floor(gapTime / (60 * 60 * 24)) + '天后失效'
        } else {
          // 转化为小时数
          this.shareTableData[i].available = Math.floor(gapTime / (60 * 60)) + '小时后失效'
          this.shareTableData[i].status = 1
        }
      }
    },
    // 获取转存记录
    async getDownloadHistory () {
      const res = await getDownloadFile(this.token, 1, 100)
      this.shareTableData = res.data.data.list
      this.list = []
      console.log(res)
      console.log(this.shareTableData)
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
      this.selectedRows = selection
      console.log('Selected Rows:', this.selectedRows)
    },
    // 重命名文件
    async renameFile () {
      const userFileId = this.selectedRows[0].userFileId
      let newName = this.newName
      if (this.selectedRows[0].fileName.contain('.')) {
        const suffix = this.selectedRows[0].fileName.split('.').pop()
        newName = this.newName + '.' + suffix
      }
      console.log(newName)
      const res = await renameFile(this.token, userFileId, newName)
      console.log(res)
      if (res.data.code === 200) {
        // 重命名成功后重新获取文件列表
        const res = await getFile(this.token, 1, 100, this.list.length === 0 ? null : this.list[this.list.length - 1].userFileId)
        this.userTableData = res.data.data.list
      } else if (res.data.code === 444) {
        const newname = res.data.data
        await renameFile(this.token, userFileId, newname)
        const result = await getFile(this.token, 1, 100, this.list.length === 0 ? null : this.list[this.list.length - 1].userFileId)
        this.userTableData = result.data.data.list
        this.$message({
          message: '文件名已存在，重命名为' + newname,
          type: 'warning',
          duration: 2000
        })
      }
      this.showRename = false
      this.newName = ''
      this.selectedRows = []
      this.clearTableSelection()
      await this.allfile()
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
      } else if (res.data.code === 444) {
        const newname = res.data.data
        await createDir(this.token, pid, newname)
        const result = await getFile(this.token, 1, 100, this.list.length === 0 ? null : this.list[this.list.length - 1].userFileId)
        this.userTableData = result.data.data.list
        this.$message({
          message: '文件夹名已存在，重命名为' + newname,
          type: 'warning',
          duration: 2000
        })
      }
      this.showNew = false
      this.newName = ''
      this.selectedRows = []
      this.clearTableSelection()
    },
    // 下载文件
    async downloadFiles () {
      for (const file of this.selectedRows) {
        if (file.fileSize > 20 * 1024 * 1024) { // Check if file size is greater than 20MB
          this.$message({
            message: '文件大于20MB，请使用客户端下载',
            type: 'warning',
            duration: 2000
          })
          continue
        }
        try {
          const response = await axios({
            url: 'http://47.97.32.241:8080/file/download',
            method: 'GET',
            responseType: 'blob', // Important for downloading files
            params: {
              userFileId: file.userFileId
            },
            headers: {
              Authorization: this.$store.state.usertoken
            }
          })
          const blob = new Blob([response.data])
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = file.fileName
          link.click()
        } catch (error) {
          this.$message({
            message: '下载文件失败，请重试',
            type: 'error',
            duration: 2000
          })
        }
      }
    },
    // 分享文件'
    shareFiles (row) {
      console.log(row.fileName, row.userFileId)
      this.sharefileid = row.userFileId
      this.sharefilename = row.fileName
      this.isshare = true
      console.log(this.isshare)
    },
    // 复选框分享文件
    shareFile () {
      console.log(this.selectedRows[0].fileName)
      this.sharefileid = this.selectedRows[0].userFileId
      this.sharefilename = this.selectedRows[0].fileName
      this.isshare = true
    }, // 移动文件
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
      axios.post('http://47.97.32.241:8080/file/copy?mode=1', requestData, {
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
    getUserInfo () {
      // console.log("sdffdf");
      fetch('http://47.97.32.241:8080/user/info', {
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
            document.getElementById('avatar-preview').style.backgroundImage = `url(${userInfo.avatar})`
          } else {
            // console.error(data.code)
          }
        })
        .catch(error => {
          console.error('发生错误:', error.message)
          // alert('获取用户信息失败，请重试！')
        })
    },
    // 复制分享链接 LYX
    copyShare () {
      // 获取选中的分享记录
      const link = this.selectedRows[0].link
      // 将分享链接复制到剪贴板
      try {
        navigator.clipboard.writeText(link)
        this.$message({
          message: '分享链接已复制到剪贴板！',
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        this.$message({
          message: '复制分享链接失败！',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 删除分享记录 LYX
    async deleteShare () {
      const shareIds = this.selectedRows.map(row => row.shareId)
      for (const id of shareIds) {
        const res = await cancelShare(this.token, id + '')
        if (res.data.code === 200) {
          this.$message({
            message: '分享记录删除成功！',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$message({
            message: '分享记录删除失败！',
            type: 'error',
            duration: 2000
          })
        }
      }
      this.getShareHistory()
    }
  }
}
</script>
  <style scoped>
  .list{
    float: right;
    margin-right: 20px;
    margin-top: 10px;
  }
  .title{
    height: 50px;
    margin-left: 3%;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 3px; /* 调整文字间距 */

  }
  .file-cell {
    display: flex;
    align-items: center;
    position: relative;
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

  .file-cell:hover .hover-icons {
    display: flex;
  }

  .hover-icons {
    display: none;
    position: absolute;
    right: -12px;
    gap: 10px;
  }

  .hover-icons img {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .cut-row {
    background-color: darkblue;
    color: white; /* Optional: Change text color for better contrast */
  }

  #avatar-preview {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #ccc;
    background-size: cover;
    background-position: center;
    position: relative;
    left: 0;
    bottom: 0;
    margin-left: 30px;
    margin-top: 10px;
  }

  .highlight {
    color: red;
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
    height: 50px;
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
    background-color: white;
    border-radius: 5px;
  }
  #area2 {
    flex: 1;
    width: 100%;
    background-color: white;
    border-radius: 5px;
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

  el-menu, .el-menu {
    border: 0;
  }

  el-menu-item {
    width: 180px;
    padding: 40px 0;
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
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #ccc;
    background-size: cover;
    background-position: center;
    position: relative;
    left: 0;
    bottom: 0;
    margin-left: 30px;
    margin-top: 10px;
  }
  .highlight {
    color: red;
  }
  .cut-row {
    background-color: darkblue;
    color: white; /* Optional: Change text color for better contrast */
  }
  #avatar-preview {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #ccc;
    background-size: cover;
    background-position: center;
    position: relative;
    left: 0;
    bottom: 0;
    margin-left: 30px;
    margin-top: 10px;
  }
  .highlight {
    color: red;
  }
  </style>
