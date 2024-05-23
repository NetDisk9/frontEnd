import request from '@/utils/request'

// 展示文件信息
export const getFiledetail = (Authorization, userFileId) => {
  return request.get('/file/info', {
    headers: {
      Authorization: `Bearer ${Authorization}`
    },
    params: {
      userFileId
    }
  })
}

// 获取文件列表
export const getFile = (Authorization, page, pageSize, pid) => {
  return request.get('/file/list', {
    headers: {
      Authorization
    },
    params: {
      // 写死先进行测试
      page,
      pageSize,
      pid
    }
  })
}
