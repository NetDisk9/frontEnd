<template>
    <div>
      <!-- 关闭按钮需要父子间的信息传递 -->
      <el-dialog
        :visible.sync="visible"
        title="发送文件"
        width="40%"
        :before-close="handleClose">
        <div>
          <div style="margin-bottom: 10px;">已选文件</div>
          <el-table :data="selectedFiles">
            <!-- 文件名 -->
            <el-table-column width="300px" align="left" label="文件名" prop="fileName">
              <template v-slot="{ row }">
                <div class="file-cell">
                  <img :src="getFileIcon(row.fileName)" class="file-icon" alt="file icon" />
                  <a id="filetext" href="javascript:void(0);">{{ row.fileName }}</a>
                </div>
              </template>
            </el-table-column>
            <!-- 文件大小 -->
            <el-table-column align="center" prop="fileSize" label="大小" min-width="100px"></el-table-column>
            <!-- 删除操作 -->
            <el-table-column align="center" label="操作" width="100">
              <template v-slot="{ $index }">
                <el-button type="text" size="small" @click="removeRow($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="signature-section" style="margin-top: 20px;">
            <span class="signature-label">署名：</span>
            <el-input class="short-input" v-model="userSign" placeholder="署名：" disabled></el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button style="width: 100px;" round @click="handleClosed">取消</el-button>
          <el-button style="width: 100px;" round type="primary" @click="sendFile">发送文件</el-button>
        </span>
      </el-dialog>
    </div>
  </template>

<script>
import { sendfile } from '@/api/collection'

export default {
  props: {
    selectedFiles: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      userSign: '121*****129'
    }
  },
  methods: {
    handleClosed () {
      this.$emit('close-result-modal')
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    async sendFile () {
      if (this.selectedFiles.length === 0) {
        this.$message({
          message: '请选择需要发送的文件！',
          type: 'warning',
          duration: 2000
        })
        return
      }

      // const link = 'i4f14sulguazk5z9scqz'
      let successCount = 0
      let errorCount = 0

      for (let i = 0; i < this.selectedFiles.length; i++) {
        try {
          const res = await sendfile(this.selectedFiles[i].userFileId, 'lm', this.$route.params.surl, this.$store.state.usertoken)
          if (res.data.code === 200) {
            successCount++
          } else {
            errorCount++
            this.$message({
              message: res.data.message,
              type: 'error',
              duration: 2000
            })
          }
        } catch (error) {
          errorCount++
          this.$message({
            message: '发送文件时出错，请稍后重试。',
            type: 'error',
            duration: 2000
          })
        }
      }

      if (successCount > 0) {
        this.$message({
          message: `${successCount} 个文件发送成功！`,
          type: 'success',
          duration: 2000
        })
      }

      if (errorCount === 0) {
        this.dialogVisible = false
      }
    },
    removeRow (index) {
      this.$emit('remove-file', index)
    },
    getFileIcon (fileName) {
      if (fileName.indexOf('.') === -1) {
        return require('@/assets/file.png')
      }
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
    }
  }
}
</script>

  <style scoped>
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

  /* 隐藏表格中的列分割线 */
  .el-table__body-wrapper table {
    border-collapse: separate;
    border-spacing: 0 0;
  }
  .el-table {
    border: none;
  }

  /* 署名部分样式 */
  .signature-section {
    display: flex;
    align-items: center;
  }

  .signature-label {
    font-size: 16px;
    width: 50px; /* 调整署名标签的宽度 */
  }

  .short-input {
    width: 150px; /* 调整输入框的宽度 */
  }
  </style>
