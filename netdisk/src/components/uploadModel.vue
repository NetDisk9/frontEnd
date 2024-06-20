<template>
  <div>
    <!-- 按钮用于打开文件上传弹窗 -->
    <el-button type="primary" @click="openDialog">上传文件</el-button>

    <!-- 文件上传弹窗 -->
    <el-dialog title="文件上传" :visible.sync="dialogVisible">
      <el-upload
        ref="upload"
        action="#"
        :multiple="true"
        :show-file-list="false"
        :auto-upload="false"
        :before-upload="beforeUpload"
        :on-change="handleFileChange"
      >
        <el-button slot="trigger" type="primary">选择文件</el-button>
        <el-button type="success" @click="submitUpload">开始上传</el-button>
      </el-upload>
      <el-progress v-if="uploading" :percentage="uploadPercentage"></el-progress>
      <div v-if="fileList.length > 0" class="file-list">
        <p>选中的文件:</p>
        <ul>
          <li v-for="file in fileList" :key="file.name">{{ file.name }}</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import SparkMD5 from 'spark-md5'

export default {
  data () {
    return {
      dialogVisible: false, // 控制弹窗显示
      chunksize: 2097152, // 2MB 分片大小
      uploading: false, // 上传状态
      uploadPercentage: 0, // 上传进度
      fileList: [], // 选中的文件列表
      fileStatuses: {}, // 每个文件的上传状态和信息
      authorizationToken: this.$store.state.usertoken
    }
  },
  methods: {
    // 打开弹窗
    openDialog () {
      this.dialogVisible = true
    },
    // 上传前计算文件MD5
    beforeUpload (file) {
      return this.calculateFileMd5(file).then(md5 => {
        console.log(`文件: ${file.name}, MD5: ${md5}`)
        this.$set(this.fileStatuses, file.name, {
          file,
          fileMd5: md5,
          totalChunks: Math.ceil(file.size / this.chunksize),
          uploadedChunks: 0,
          chunkMd5s: [],
          uploadedChunkIndexes: []
        })
        const chunks = this.splitFile(file)
        console.log(`文件: ${file.name}, 分片信息:`, chunks)
        chunks.forEach(chunkObj => {
          this.calculateChunkMd5(chunkObj.chunk).then(chunkMd5 => {
            console.log(`文件: ${file.name}, 分片索引: ${chunkObj.index}, 分片MD5: ${chunkMd5}`)
            this.fileStatuses[file.name].chunkMd5s[chunkObj.index] = chunkMd5
          })
        })
        return true
      })
    },
    // 计算文件MD5
    calculateFileMd5 (file) {
      return new Promise((resolve, reject) => {
        const chunkSize = this.chunksize // 每块大小为2MB
        const chunks = Math.ceil(file.size / chunkSize) // 总块数
        const spark = new SparkMD5.ArrayBuffer() // MD5计算器
        const fileReader = new FileReader() // 文件读取器
        let currentChunk = 0 // 当前块索引

        fileReader.onload = (e) => {
          spark.append(e.target.result) // 将数据追加到MD5计算器
          currentChunk++
          if (currentChunk < chunks) {
            loadNext() // 继续读取下一块
          } else {
            console.log(`文件 ${file.name} 的 MD5 计算完成`)
            resolve(spark.end()) // 所有块处理完毕，计算最终MD5值
          }
        }

        fileReader.onerror = () => {
          reject(new Error('MD5 计算失败'))
        }

        const loadNext = () => {
          const start = currentChunk * chunkSize // 当前块起始位置
          const end = Math.min(file.size, start + chunkSize) // 当前块结束位置
          console.log(`读取文件 ${file.name} 的分块: ${currentChunk}, 起始位置: ${start}, 结束位置: ${end}`)
          fileReader.readAsArrayBuffer(file.slice(start, end)) // 异步读取当前块
        }
        loadNext() // 开始读取第一个块
      })
    },

    // 处理文件选择
    handleFileChange (file, fileList) {
      this.fileList = fileList.map(f => f.raw)
      console.log('文件选择发生变化:', this.fileList)
      this.fileList.forEach(file => {
        this.beforeUpload(file)
      })
    },

    // 分割文件并返回分片文件的每个的数据以及索引
    splitFile (file) {
      const chunks = []
      let currentChunk = 0
      while (currentChunk < Math.ceil(file.size / this.chunksize)) {
        const start = currentChunk * this.chunksize
        const end = Math.min(file.size, start + this.chunksize)
        const chunk = file.slice(start, end)
        chunks.push({ chunk, index: currentChunk })
        console.log(`文件 ${file.name} 的分片索引: ${currentChunk}, 起始位置: ${start}, 结束位置: ${end}`)
        currentChunk++
      }
      return chunks
    },
    // 计算单个分片的MD5
    calculateChunkMd5 (chunk) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        const spark = new SparkMD5.ArrayBuffer()
        fileReader.onload = (e) => {
          spark.append(e.target.result)
          resolve(spark.end())
        }
        fileReader.onerror = () => {
          reject(new Error('分片MD5 计算失败'))
        }
        fileReader.readAsArrayBuffer(chunk)
      })
    },

    // 提交上传
    async submitUpload () {
      this.uploading = true
      this.uploadPercentage = 0

      for (const file of this.fileList) {
        const fileStatus = this.fileStatuses[file.name]
        const chunks = this.splitFile(file)
        for (const chunkObj of chunks) {
          const chunkMd5 = fileStatus.chunkMd5s[chunkObj.index]
          console.log(chunkMd5)
          const formData = new FormData()
          formData.append('chunk', chunkObj.chunk)

          await axios.post(`http://8.134.178.176:8080/file/upload?fileMd5=${fileStatus.fileMd5}&chunkIndex=${chunkObj.index}`, formData, {
            headers: {
              Authorization: `${this.authorizationToken}`,
              'Content-Type': 'multipart/form-data'
            }
          })
            .then(() => {
              fileStatus.uploadedChunks++
              fileStatus.uploadedChunkIndexes.push(chunkObj.index)
              this.uploadPercentage = Math.round((fileStatus.uploadedChunks / fileStatus.totalChunks) * 100)
              console.log(`文件: ${file.name}, 分片索引: ${chunkObj.index} 上传成功`)
            })
            .catch(error => {
              console.error(`文件: ${file.name}, 分片索引: ${chunkObj.index} 上传失败`, error)
            })
        }

        // 在所有分片上传成功后调用检查接口
        if (fileStatus.uploadedChunks === fileStatus.totalChunks) {
          await this.checkFileUpload(fileStatus)
        }
      }
      this.uploading = false
    },

    // 检查文件上传完整性
    async checkFileUpload (fileStatus) {
      const checkData = {
        fileMd5: fileStatus.fileMd5,
        filePath: `/uploads/${fileStatus.file.name}`, // 假设文件路径
        fileName: fileStatus.file.name,
        totalChunk: fileStatus.totalChunks
      }

      try {
        const response = await axios.post('http://8.134.178.176:8080/file/upload/check', checkData, {
          headers: {
            Authorization: `${this.authorizationToken}`,
            'Content-Type': 'application/json'
          }
        })
        if (response.data.success) {
          console.log(`文件: ${fileStatus.file.name} 上传检查成功`)
        } else {
          console.error(`文件: ${fileStatus.file.name} 上传检查失败`)
        }
      } catch (error) {
        console.error(`文件: ${fileStatus.file.name} 上传检查异常`, error)
      }
    }
  }
}
</script>

<style scoped>
.file-list {
  margin-top: 20px;
}
</style>
