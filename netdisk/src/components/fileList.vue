<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <!-- 返回上一步 -->
        <i  class="el-icon-arrow-left" style="margin-right: 10px; margin-left: 30px " @click="goBack"></i>
        <i  class="el-icon-arrow-right"  ></i>
        <!-- 添加这个javascript:void(0)才能使点击后不进行跳转执行内嵌的@click -->
        <a href="javascript:void(0);" @click="allfile">全部文件</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in list" :key="index">
        <a  href="javascript:void(0);" @click="navigateTo(index)">{{ item.fileName }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格区域 -->
    <el-table size="small" @selection-change="selectChange" :data="userTableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" style="width: 100%;">
      <!-- 复选框 -->
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <!-- 文件名 -->
      <el-table-column align="left" sortable prop="fileName" label="文件名" width="500">
        <template v-slot="{ row }">
          <div class="file-cell">
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      background
      :page-sizes="[1, 3, 5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="userTableData.length">
    </el-pagination>
  </div>
</template>

<script>
import { getFile } from '@/api/file'
export default {
  data () {
    return {
      // 面包屑渲染数据
      list: [],
      // 渲染文件列表数组
      userTableData: [],
      // 分页组件初始页面
      currentPage: 1,
      // 每一页的总条数 这里我默认设置成10条每一个页面
      pagesize: 10,
      token: this.$store.state.usertoken,
      // 复选框数据
      selectedRows: []
    }
  },
  async created () {
    this.allfile()
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
      const extension = fileName.split('.').pop().toLowerCase()
      switch (extension) {
        case 'txt':
          return require('@/assets/txt.png')
        case 'jpg':
        case 'jpeg':
          return require('@/assets/img.png')
        case 'pdf':
          return require('@/assets/pdf.png')
        case 'mp3':
          return require('@/assets/mp3.png')
        case 'mp4':
          return require('@/assets/video.png')
          // 文件夹没有后缀名
        default:
          return require('@/assets/file.png')
      }
    },
    async openfile (row) {
      const res = await getFile(this.token, 1, 100, row.userFileId)
      if (res.data.code === 200) {
        this.userTableData = res.data.data.list
        this.list.push(row)
      }
    },
    // 获取所有文件
    async allfile () {
      // 重新获取所有的文件
      const res = await getFile(this.token, 1, 100)
      this.userTableData = res.data.data.list
      this.list = [] // 清空面包屑导航
    },
    // 返回上一级文件夹
    async goBack () {
      if (this.list.length === 0) {
        // 当前已在根目录
        this.allfile()
      } else {
        // 移除最后一个面包屑导航项
        this.list.pop()
        // 获取上一级目录的文件，如果数组中还有上一级文件就获取上一级文件的id，然后进行渲染，如果去除掉最后一层后渲染函数没有长度了就直接渲染全部文件
        const parentId = this.list.length > 0 ? this.list[this.list.length - 1].userFileId : null
        const res = await getFile(this.token, 1, 100, parentId)
        this.userTableData = res.data.data.list
      }
    },
    // 导航到指定层级的文件夹
    async navigateTo (index) {
      // 首先先获取目标文件的id
      const targetFolder = this.list[index]
      // 删除目标文件后面的所有面包屑
      this.list = this.list.slice(0, index + 1)
      // 根据目标文件的id进行页面的渲染
      const res = await getFile(this.token, 1, 100, targetFolder.userFileId)
      this.userTableData = res.data.data.list
    },
    // 复选框改变的时候进行更新复选框数组中的数值
    selectChange (selection) {
      this.selectedRows = selection
      console.log('Selected Rows:', selection)
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

</style>
