<template>
    <div>
      <el-dialog width="500px" :visible.sync="visible" :title="'分享文件：' + fileName">
        <div class="share">
          <span>链接分享</span>
        </div>
        <div class="content">
          <div>
            <div class="checkbox-style">
              <div class="title">有效期：</div>
              <el-radio v-model="validity" label="1天">1天</el-radio>
              <el-radio v-model="validity" label="7天">7天</el-radio>
              <el-radio v-model="validity" label="30天">30天</el-radio>
              <el-radio v-model="validity" label="永久有效">永久有效</el-radio>
            </div>
          </div>
          <!-- 选项框区域 -->
          <span style="float: left;margin-top: 20px;">提取码：</span>
          <div class="select">
            <div style="margin-top: 20px;">
              <el-checkbox v-model="hasCode">有提取码</el-checkbox>
              <!-- 如果有提取码就显示 -->
              <div v-if="hasCode" style="margin-top: 10px;">
                <el-checkbox v-model="autoGenerateCode">系统随机生成提取码</el-checkbox>
                <el-input
                  v-if="!autoGenerateCode"
                  v-model="customCode"
                  placeholder="请输入4位提取码（仅支持数字和英文字母）"
                  style="margin-top: 10px; width: 300px;"
                  :maxlength="4"
                  @input="validateCode"
                ></el-input>
                <div v-if="codeError" class="error">{{ codeError }}</div>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <el-checkbox v-model="autoFillCode">分享链接自动填写提取码</el-checkbox>
            </div>
          </div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button round type="primary" @click="createLink">创建链接</el-button>
        </div>
      </el-dialog>

      <result-modal
        :visible.sync="resultModalVisible"
        :link="generatedLink"
        :code="generatedCode"
        :file-name="fileName"
        :time="time"
      ></result-modal>
    </div>
  </template>

<script>
import ResultModal from './ResultModel.vue'
import { createShare } from '@/api/share'

export default {
  components: {
    ResultModal
  },
  data () {
    return {
      visible: true,
      // 选择有效期默认7天
      validity: '7天',
      // 文件名
      fileName: '文件夹1',
      // 是否有提取码
      hasCode: true,
      autoGenerateCode: true,
      customCode: '',
      autoFillCode: true,
      codeError: '',
      resultModalVisible: false,
      generatedLink: '',
      generatedCode: '',
      token: this.$store.state.usertoken,
      userFileid: '1784258377565794305',
      time: 7
    }
  },
  watch: {
    customCode (value) {
      this.validateCode(value)
    }
  },
  methods: {
    async createLink () {
      // 确定有效期的值
      let validityValue
      switch (this.validity) {
        case '1天':
          validityValue = 1
          break
        case '7天':
          validityValue = 7
          break
        case '30天':
          validityValue = 30
          break
        case '永久有效':
          validityValue = -1
          break
      }
      //   进行提取码的判断如果是自动生成就设置成null
      if (this.autoGenerateCode === true) {
        this.customCode = null
      }
      // 调用分享接口
      try {
        const res = await createShare(this.token, validityValue, this.userFileid, this.customCode)
        console.log(res.data)
        // 如果调用成功进行对应数据的赋值并且传递给子组件
        if (res && res.data) {
          this.generatedLink = 'http://localhost:8080/#/share/' + res.data.data.link
          this.generatedCode = res.data.data.code
          this.time = validityValue
          this.resultModalVisible = true
          this.visible = false
          console.log(this.time)
        }
      } catch (error) {
        this.$message({
          message: '创建分享链接失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 校验输入框函数
    validateCode (value) {
      const regex = /^[a-zA-Z0-9]{4}$/
      if (value && !regex.test(value)) {
        this.codeError = '提取码必须是4位数字或字母'
      } else {
        this.codeError = ''
      }
    }
  }
}
</script>

  <style scoped>
  .select {
    margin-left: 80px;
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
  /* 标题样式 */
  .title {
    display: inline-block;
    margin-right: 20px;
  }
  .dialog-footer {
    text-align: center;
  }
  .dialog-footer .el-button {
    /* 按钮居中 */
    margin: 0 auto;
  }
  .checkbox-style .el-radio {
    display: inline-block;
    margin-right: 20px;
    line-height: 1.5;
  }
  .checkbox-style .el-radio__label {
    display: flex;
    align-items: center;
  }
  .checkbox-style .el-radio__input.is-checked .el-radio__inner {
    background-color: #409EFF;
    border-color: #409EFF;
  }
  .checkbox-style .el-radio__input .el-radio__inner {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .checkbox-style .el-radio__input .el-radio__inner::after {
    display: none;
  }
  .error {
    color: red;
    margin-top: 5px;
  }
  </style>
