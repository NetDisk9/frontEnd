import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
// 引入持久化管理组件

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登陆成功后会把token存入vuex并实现持久化
    usertoken: ''
  },
  // 实现数据持久化
  plugins: [createPersistedState({
    // 默认存储在localstage
    reducer (val) {
      return {
        // 将token存储在store中
        // 将数据进行持久化
        usertoken: val.usertoken
      }
    }
  })],

  getters: {
  },
  mutations: {
    // 获取token得方法，登陆成功后会更新token
    gettoken (state, usertoken) {
      state.usertoken = usertoken
    }
  },
  actions: {
    // 用于异步操作然后将后端数据传输给vuex然后页面可以从vuex里面拿到数据
  },
  modules: {
  }
})
