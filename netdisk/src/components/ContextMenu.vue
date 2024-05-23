<template>
    <el-dropdown ref="dropdown" trigger="contextmenu" @command="handleCommand" :visible-arrow="false">
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="open">打开</el-dropdown-item>
        <el-dropdown-item command="download">下载</el-dropdown-item>
        <el-dropdown-item command="delete">删除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </template>

<script>
export default {
  methods: {
    handleCommand (command) {
      this.$emit('command', command)
    }
  }
}
</script>
