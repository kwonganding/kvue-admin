/*
- 0：默认值，表示正常
- 4001：授权token无效，请重新登录
- 4002：授权token过期
- 其他：都为异常错误
 */



/**
 * 响应数据标准结构，支持链式操作
 */
class ResponseData {
  /**
 * 响应数据标准结构
 * @param {object} data 返回的数据data
 * @param {string} message 消息message
 */
  constructor(data = null, message = null) {
    this.code = 0
    this.message = message ?? ''
    if (data) this.data = data
  }

  /**
   * @param {number} code 响应编码，0表示正常，其它皆为异常
   * @returns 返回ResponseData对象，方便链式调用
   */
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

    /**
   * @param {object} error 异常错误内容
   * @returns 返回ResponseData对象，方便链式调用
   */
  setError = function(error) {
    if (error) {
      this.message = error
      this.code = 4000
    }
    return this
  }
}

module.exports = ResponseData

// responseData = {
//   code: 0,
//   message: '',
//   data: {
//     list: [],
//     total: 100
//   }
// }

// let query = {
//   pageIndex: 1,
//   pageSize: 2,
//   orderBy: 'id',
//   sortOrder: 'ASC', // DESC
// }