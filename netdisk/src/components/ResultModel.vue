<template>
    <el-dialog :visible.sync="visible" :title="'分享文件：' + fileName" width="500px">
        <div class="share">
          <span>链接分享</span>
        </div>
      <div class="content">
        <div >
          <el-alert
            title="成功创建链接，访问者无需提取码可直接查看文件"
            type="success"
            show-icon
          ></el-alert>
        </div>
        <div style="margin-bottom: 20px; margin-top: 20px; margin-left: 20px;">
          <el-input  style="width: 300px; height: 20px;" :value="link" readonly></el-input>
        </div>
        <div v-if="code" style="margin-bottom: 20px; margin-left: 20px;">
          <span>提取码：</span>
          <el-input style="width: 100px;" :value="code" readonly></el-input>
        </div>
        <div style="margin-left: 20px;">
          <span>链接</span>
          <span style="color: #409eff;">{{ time }}</span>
          <span>天后失效</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="copyLink">复制链接及提取码</el-button>
      </div>
    </el-dialog>
  </template>

<script>
export default {
  data () {
    return {
    }
  },

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    code: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      required: true
    },
    time: {
      required: true
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    copyLink () {
      const fullText = `链接：${this.link} 提取码：${this.code}`
      navigator.clipboard.writeText(fullText).then(() => {
        this.$message({
          message: '复制成功！',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          message: '复制失败！',
          type: 'error'
        })
      })
    }
  }
}
</script>

  <style scoped>
  .el-alert {
  --el-alert-success-bg-color: #e6f7ff; /* 自定义背景颜色 */
  --el-alert-success-border-color: #91d5ff; /* 自定义边框颜色 */
  --el-alert-success-icon-color: #1890ff; /* 自定义图标颜色 */
  --el-alert-success-title-color: #096dd9; /* 自定义标题颜色 */
}
    .content {
    margin-top: 10px;
    background-color: #F2F4FA;
    height: 200px;
  }
    .share {
    width: 60px;
    height: 20px;
    color: #409EFF;
    border-bottom: 2px solid #409EFF;
  }
  .dialog-footer {
    text-align: center;
  }
  .dialog-footer .el-button {
    margin: 0 auto;
  }
  .content {
    margin-top: 10px;
  }
  </style>
