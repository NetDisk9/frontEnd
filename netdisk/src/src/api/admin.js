import request from '@/utils/request'

// 封装获取列表数据接口
export const getList = (page, pageSize, Authorization) => {
  return request.post('/admin/list', null, {
    headers: {
      Authorization
    },
    params: {
      page,
      pageSize
    }
  })
}

export const changeRole = (userId, roleId, Authorization) => {
  return request.put(`/admin/role/update?userId=${userId}&roleId=${roleId}`, {}, {
    headers: {
      Authorization: Authorization
    }
  })
}

// 获取修改列表接口
export const getrole = (Authorization) => {
  return request.get('/admin/role/list/option', {
    headers: {
      Authorization
    }
  })
}

// 重置用户密码接口
export const resetPassword = (userId, Authorization) => {
  return request.put('/admin/update', {}, {
    headers: {
      Authorization
    },
    params: {
      userId
    }
  })
}
