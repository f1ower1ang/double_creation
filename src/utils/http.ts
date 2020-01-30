// utils/http.js 文件
import axios from 'axios'

// axios 配置
export const defaultBaseUrl = 'http://175.24.130.223:9000'
// 默认超时时间
axios.defaults.timeout = 15000
// 数据接口域名统一配置.env
axios.defaults.baseURL = '/api'

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    if (localStorage.token) {
      config.headers['token'] = localStorage.token
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
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.token = null
    }
    const data = error.response.data
    return Promise.reject(data || error)
  }
)

export default axios

/**
 * get 请求方法
 * @param {string} url
 * @param {object} params
 */
export function get(url: string, params: object = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
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
export function put(
  url: string,
  data: object,
  config = {
    transformRequest: [
      function(fData: object, headers: any) {
        headers['Content-Type'] = 'application/json'
        return JSON.stringify(fData)
      }
    ]
  }
) {
  return new Promise((resolve, reject) => {
    axios.put(url, data, config).then(
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
export function post(
  url: string,
  data: object = {},
  config: any = {
    transformRequest: [
      function(fData: object, headers: any) {
        headers['Content-Type'] = 'application/json'
        return JSON.stringify(fData)
      }
    ]
  }
) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, config).then(
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
    axios
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

export function del(url: string, data: object) {
  return new Promise((resolve, reject) => {
    axios.delete(url, { data }).then(
      (response) => {
        resolve(response.data)
      },
      (err) => {
        reject(err)
      }
    )
  })
}
