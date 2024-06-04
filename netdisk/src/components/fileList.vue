<template>
  <!-- 个人中心界面 -->
  <div>

    <div id="top-bar">
      <div class="avatar">
        <div style="display: flex; justify-content: center; align-items: center;">
          <div id="avatar-preview" :style="{backgroundImage: 'url(' + avatarPreviewUrl + ')'}"></div>
          <router-link to="/homeview">
            <el-button type="warning" round style="margin-left: 30px; margin-top: 10px;font-size: 16px;font-weight: 600; background: linear-gradient(to right, #fdd835, #fda085); color: brown; border: none;;">个人中心</el-button>
          </router-link>
        </div>
      </div>
    </div>
    <div id="divider"></div>
    <div id="content">
      <div id="area1" class="area">
        <div style="padding-top: 10px;">
          <el-col :span="3">
            <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
              style="width: 150px;"
              @open="handleOpen"
              @close="handleClose">
              <el-menu-item index="1" style="font-size: 20px;">
                <i class="el-icon-folder-opened" style="font-size: 24px;"></i>
                <span style="font-size: 20px;">我的文件</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </div>
      </div>
      <div id="gap"></div>
      <div id="area3">
        <el-col :span="12">
          <el-menu
            style="width:180px;"
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-folder-opened"></i>
                <span style="font-size: 20px;">我的文件</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" style="font-size: 20px;" @click="getPics">
                  <div class="menu-item-content">
                    <i class="el-icon-picture"></i>
                    <span>图    片</span>
                  </div>
                </el-menu-item>
                <el-menu-item index="1-2" style="font-size: 20px; " @click="getDocs">
                  <div class="menu-item-content">
                    <i class="el-icon-document"></i>
                    <span>文    档</span>
                  </div>
                </el-menu-item>
                <el-menu-item index="1-3" style="font-size: 20px;" @click="getVideos">
                  <div class="menu-item-content">
                    <i class="el-icon-video-play"></i>
                    <span>视    频</span>
                  </div>
                </el-menu-item>
                <el-menu-item index="1-4" style="font-size: 20px;" @click="getMusics">
                  <div class="menu-item-content">
                    <i class="el-icon-headset"></i>
                    <span>音    频</span>
                  </div>
                </el-menu-item>
                <el-menu-item index="1-5" style="font-size: 20px;" @click="getZips">
                  <div class="menu-item-content">
                    <i class="el-icon-suitcase"></i>
                    <span>压 缩 包</span>
                  </div>
                </el-menu-item>
                <el-menu-item index="1-6" style="font-size: 20px;" @click="getOthers">
                  <div class="menu-item-content">
                    <i class="el-icon-more"></i>
                    <span>其    他</span>
                  </div>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </div>
      <div id="gap"></div>
      <div id="area2" class="area">
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
              <el-button type="primary" size="small" icon="el-icon-download" @click="downloadFiles"
                         :disabled="this.selectedRows.length === 0">下载
              </el-button>
              <el-button type="primary" size="small" icon="el-icon-share" @click="shareFiles"
                         :disabled="this.selectedRows.length === 0">分享
              </el-button>
              <el-button type="primary" size="small" icon="el-icon-delete" @click="deleteFiles"
                         :disabled="this.selectedRows.length === 0">删除
              </el-button>
              <el-button type="primary" size="small" icon="el-icon-edit" @click="showRenameDia"
                         :disabled="this.selectedRows.length !== 1">重命名
              </el-button>
              <el-button type="primary" size="small" icon="el-icon-move" @click="moveFiles"
                         :disabled="this.selectedRows.length === 0">移动
              </el-button>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="showNewDia"
                         :disabled="this.selectedRows.length !== 0">新建文件夹
              </el-button>
            </div>

            <MyModal :show="showRename" @close="showRename = false" style="z-index: 999">
              <div style="font-size:20px; margin: 0 0 10px 10%">重命名文件夹</div>
              <div style="display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 0 0 0 10%">
                  <div style="display: flex; width: auto; min-width: 80px">文件夹名：</div>
                  <el-input style="width: 80%;" v-model="newName" placeholder="请输入新文件夹名"
                            aria-required="true"></el-input>
                </div>
                <div style="display: flex; justify-content: center; margin: 20px 0 0 0">
                  <el-button @click="renameFile">确认</el-button>
                  <el-button @click="cancel">取消</el-button>
                </div>
              </div>
            </MyModal>

            <MyModal :show="showNew" @close="showNew = false" style="z-index: 999">
              <div style="font-size:20px; margin: 0 0 10px 10%">新建文件夹</div>
              <div style="display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 0 0 0 10%">
                  <div style="display: flex; width: auto; min-width: 80px">文件夹名：</div>
                  <el-input style="width: 80%;" v-model="newName" placeholder="请输入文件夹名" aria-required="true"></el-input>
                </div>
                <div style="display: flex; justify-content: center; margin: 20px 0 0 0">
                  <el-button @click="createDir">确认</el-button>
                  <el-button @click="cancel">取消</el-button>
                </div>
              </div>
            </MyModal>

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
  </div>
</template>
<script>
import { createDir, deleteFile, getFile, renameFile, forCates } from '@/api/file'
import MyModal from '@/components/myModal.vue'
import axios from 'axios'
export default {
  components: { MyModal },
  data () {
    return {
      // 面包屑渲染数据
      list: [],
      // 渲染文件列表数组
      userTableData: [],
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
      cutFiles: [] // Array to store IDs of cut files
    }
  },
  async created () {
    await this.allfile()
    this.getUserInfo()
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
    getUserInfo () {
      // console.log("sdffdf");
      fetch('http://8.134.178.176:8080/user/info', {
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
</style>
