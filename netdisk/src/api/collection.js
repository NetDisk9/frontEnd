import request from '@/utils/request'

export const sendfile = (userFileId, signer, link, Authorization) => {
  return request.post('/file/collect/send', null, {
    headers: {
      Authorization
    },
    params: {
      userFileId, signer, link, Authorization
    }
  })
}
