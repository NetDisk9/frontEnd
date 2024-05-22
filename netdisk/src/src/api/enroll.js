import request from '@/utils/request'

// 先进行封装获取验证码接口
export const getcode = (email, type) => {
  return request.get('/email/code', {
    params: {
      type: 'register',
      email
    }
  })
}
// 封装注册接口函数
export const enroll = (username, email, password, code) => {
  return request.post('/user/register', {
    username,
    email,
    password,
    code
  })
}
