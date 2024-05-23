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
      pid,
      status: 0
    }
  })
}

// 删除文件
export const deleteFile = (Authorization, fileIds) => {
  return request.delete('/file/delete', {
    headers: {
      Authorization
    },
    params: {
      fileIds: fileIds
    }
  })
}

// 重命名文件
export const renameFile = (Authorization, userFileId, fileName) => {
  return request.put(`/file/rename?userFileId=${userFileId}&name=${fileName}`, {}, {
    headers: {
      Authorization
    }
  })
}

// 新建文件夹
export const createDir = (Authorization, pid, fileName) => {
  return request.post('/file/dir/create', null, {
    headers: {
      Authorization
    },
    params: {
      pid: pid,
      name: fileName
    }
  })
}

// 根据路径获取文件
export const getFileByPath = (Authorization, path) => {
  return request.get('/file/list/path', {
    headers: {
      Authorization
    },
    params: {
      path: path,
      page: 1,
      pageSize: 10,
      status: 0
    }
  })
}

export const forCates = (Authorization, page, pageSize, category) => {
  console.log('categoty')
  return request.get('/file/list', {
    headers: {
      Authorization
    },
    params: {
      // 写死先进行测试
      page,
      pageSize,
      category
    }
  })
}
