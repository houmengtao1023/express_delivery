const BASE_URL = 'http://localhost:8088/api'

const TIMEOUT = 10000

function buildUrl(path) {
  if (!path) return BASE_URL
  if (/^https?:\/\//i.test(path)) return path
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

function request(options = {}) {
  const { url, method = 'GET', data, header, showLoading = false, silent = false } = options

  return new Promise((resolve, reject) => {
    if (showLoading) {
      uni.showLoading({ title: '加载中', mask: true })
    }
    uni.request({
      url: buildUrl(url),
      method,
      data,
      timeout: TIMEOUT,
      header: {
        'Content-Type': 'application/json;charset=utf-8',
        ...(header || {})
      },
      success: (res) => {
        const status = res.statusCode || 0
        if (status < 200 || status >= 300) {
          if (!silent) uni.showToast({ title: `网络异常(${status})`, icon: 'none' })
          reject(new Error(`HTTP_${status}`))
          return
        }
        const body = res.data || {}
        if (typeof body === 'object' && 'code' in body) {
          if (body.code === 0) {
            resolve(body.data)
          } else {
            if (!silent) uni.showToast({ title: body.msg || '请求失败', icon: 'none' })
            reject(new Error(body.msg || 'BIZ_ERROR'))
          }
        } else {
          resolve(body)
        }
      },
      fail: (err) => {
        if (!silent) uni.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      },
      complete: () => {
        if (showLoading) uni.hideLoading()
      }
    })
  })
}

export default {
  request,
  get(url, data, opts = {}) {
    return request({ ...opts, url, method: 'GET', data })
  },
  post(url, data, opts = {}) {
    return request({ ...opts, url, method: 'POST', data })
  },
  put(url, data, opts = {}) {
    return request({ ...opts, url, method: 'PUT', data })
  },
  del(url, data, opts = {}) {
    return request({ ...opts, url, method: 'DELETE', data })
  }
}

export { BASE_URL }
