/** 文件处理 */

import axios from '@/utils/request'

const FILE_UPLOAD_URL = '/upload'

/**
 * 文件上传
 * @param {raw} fileData 文件数据
 * @returns Promise
 */
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

/**
 * 获取文件代理地址，用于开发模式下跨域代理文件地址
 * @param {string} url
 * @returns
 */
export function proxyURL(url) {
  return url.startsWith('/') ? process.env.VUE_APP_BASE_API + url : url
}
