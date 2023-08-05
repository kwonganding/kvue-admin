/** 文件处理 */

import axios from '@/utils/request'

const FILE_UPLOAD_URL = '/upload'

export function upload(fileData) {
  const formData = new FormData()
  // 注意文件字段名和服务端配置一致
  formData.append('file', fileData)
  return axios.post(FILE_UPLOAD_URL, formData,
    {
      headers: { 'Content-type': 'multipart/form-data' }
    }
  )
}

export function proxyURL(url) {
  return url.startsWith('/') ? process.env.VUE_APP_BASE_API + url : url
}
