

/**
 * 响应数据标准结构
 */
class ResponseData {
  /**
 * 响应数据标准结构
 * @param {number} code 响应编码
 * @param {any} error 异常错误
 */
  constructor(code = 0, error = null) {
    this.setCode(code)
    if (error) {
      this.message = error
      this.code = code > 0 ? code : 4000
    }
  }

  setCode = function(code) {
    this.code = code
    switch (code) {
      case 4001:
        this.message = '授权token无效，请重新登录！'
        break;
      case 4002:
        this.message = '授权token已过期，请重新登录！'
        break;
    }
    return this
  }

  setError = function(error) {
    this.message = error
    this.code = 4000
  }
}

module.exports = ResponseData