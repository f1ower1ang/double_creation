// utils/http.js 文件
import axios from 'axios'
// @ts-ignore
import * as auth from './auth'
import router from '@/router'
import Vue from 'vue'
import store from '@/store'

// axios 配置
export const defaultBaseUrl = 'http://47.112.243.214:9001'

const request = axios.create({
  baseURL: defaultBaseUrl,
  timeout: 15000
})

// 默认超时时间
axios.defaults.timeout = 15000
// 数据接口域名统一配置.env
axios.defaults.baseURL = defaultBaseUrl

// http request 拦截器
request.interceptors.request.use(
  (config) => {
    if (auth.getToken()) {
      config.headers['Token'] = auth.getToken()
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    const { path, meta } = router.history.current
    if (meta.auth && response.data.errCode === 401 && path !== '/login' && response.data.errMsg !== '旧密码输入不正确') {
      Vue.prototype.$Message.error('当前未登录，跳转登录页面进行登录')
      store.dispatch('user/removeUser')
      router.push(`/login?redirect=${path}`)
      return Promise.reject(response)
    }
    return response
  },
  (error) => {
    const path = router.history.current.path
    if (error.response.status === 401) {
      Vue.prototype.$Message.error('当前未登录，跳转登录页面进行登录')
      store.dispatch('user/removeUser')
      router.push(`/login?redirect=${path}`)
    }
    const data = error.response.data
    return Promise.reject(data || error)
  }
)

export default request

/**
 * get 请求方法
 * @param {string} url
 * @param {object} params
 * @param config
 */
export function get(url: string, params: object = {}, config: object = {}) {
  if (config) {
    Object.assign(config, { params })
  } else {
    config = { params }
  }
  return new Promise((resolve, reject) => {
    request
      .get(url, config)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * @desc put 请求方法
 * @param {string} url
 * @param {object} data
 * @param {object} config
 * @return
 * @time 2020/1/20
 */
export function put(url: string, data: object, config = {
  transformRequest: [
    function(fData: object, headers: any) {
      headers['Content-Type'] = 'application/json'
      return JSON.stringify(fData)
    }
  ]
}) {
  return new Promise((resolve, reject) => {
    request.put(url, data, config).then(
      (response) => {
        resolve(response.data)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

/**
 * post 请求方法，发送数据格式 json
 * @param {string} url
 * @param {object} data
 * @param config
 */
export function post(url: string, data: object = {}, config: any = {
  transformRequest: [
    function(fData: object, headers: any) {
      headers['Content-Type'] = 'application/json'
      return JSON.stringify(fData)
    }
  ]
}) {
  return new Promise((resolve, reject) => {
    request.post(url, data, config).then(
      (response) => {
        resolve(response.data)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

/**
 * patch 请求方法，发送数据格式 json
 * @param {string} url
 * @param {object} data
 */
export function patch(url: string, data: object = {}) {
  return new Promise((resolve, reject) => {
    request
      .patch(url, data, {
        transformRequest: [
          function(fData, headers) {
            headers['Content-Type'] = 'application/json'
            return JSON.stringify(fData)
          }
        ]
      })
      .then(
        (response) => {
          resolve(response.data)
        },
        (err) => {
          reject(err)
        }
      )
  })
}

export function del(url: string, data: object | null = null) {
  return new Promise((resolve, reject) => {
    request.delete(url, { data }).then(
      (response) => {
        resolve(response.data)
      },
      (err) => {
        reject(err)
      }
    )
  })
}
