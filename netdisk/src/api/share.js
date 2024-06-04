import request from '@/utils/request'
// 分享接口
export const createShare = (Authorization, time, userFileId, code) => {
  return request.post('/file/share/create', null, {
    headers: {
      Authorization
    },
    params: {
      time,
      userFileId,
      code

    }
  })
}
