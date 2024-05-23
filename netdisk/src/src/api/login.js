import request from '@/utils/request'

// 登录接口
// 操作系统和设备名称是必须上传的数据
export const codeLogin = (deviceName, deviceOS, email, password, id, username) => {
  return request.post('/user/login', {
    deviceName,
    deviceOS,
    email,
    password,
    id,
    username
  })
}
// 封装邮箱登陆获取验证码的方法
export const getcode = (email, type) => {
  return request.get('/email/code', {
    params: {
      type: 'login',
      email
    }
  })
}

// 封装邮箱登陆方法
export const emailLogin = (deviceName, deviceOS, email, code) => {
  return request.post('/user/code/login', {
    deviceName,
    deviceOS,
    email,
    code
  })
}
