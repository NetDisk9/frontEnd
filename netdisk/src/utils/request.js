// 将axios进行封装
import axios from 'axios'
// 创建 axios 实例，将来对创建出来的实例，进行自定义配置
// 好处：不会污染原始的 axios 实例
const instance = axios.create({
  // 后端接口基地址
  baseURL: 'http://47.97.32.241:8080',
  //   设置最慢响应时间
  timeout: 5000
})
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 携带请求头
  // const usertoken = this.$store.usertoken
  // // 如果请求头存在就进行自动携带请求头
  // if (usertoken) {
  //   config.headers.Authorization = usertoken
  // }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// // 添加响应拦截器
// instance.interceptors.response.use(function (response) {
//   // 2xx 范围内的状态码都会触发该函数。
//   // 对响应数据做点什么 (默认axios会多包装一层data，需要响应拦截器中处理一下)
//   const res = response.data
//   if (res.status !== 200) {
//     // 给错误提示, Toast 默认是单例模式，后面的 Toast调用了，会将前一个 Toast 效果覆盖
//     // 同时只能存在一个 Toast
//     this.$message({
//       // 当响应码错误时发出警告
//       message: res.message,
//       type: 'error',
//       // 设置两秒后关闭
//       duration: 2000
//     }) // 抛出一个错误的promise
//     return Promise.reject(res.message)
//   } else {
//     this.$message({
//       // 当响应码错误时发出警告
//       message: res.message,
//       type: 'true',
//       // 设置两秒后关闭
//       duration: 2000
//     })
//   }
//   return res
// }, function (error) {
//   // 超出 2xx 范围的状态码都会触发该函数。
//   // 对响应错误做点什么
//   return Promise.reject(error)
// })
export default instance
