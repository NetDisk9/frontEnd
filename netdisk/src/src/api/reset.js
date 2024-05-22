import request from '@/utils/request'

// LYX
// 封装校验验证码接口
export const check = (code, email) => {
  return request.get('/email/code/check', {
    params: {
      code,
      type: 'reset',
      email
    }
  })
}

// LYX
// 封装忘记密码方法
export const forgetPWD = (email, code, newPassword) => {
  return request.post('/user/forget/password', {
    email,
    code,
    newPassword
  })
}

// 封装获取验证码的方法
export const getcode = (email, type) => {
  return request.get('/email/code', {
    params: {
      type: 'reset',
      email
    }
  })
}
