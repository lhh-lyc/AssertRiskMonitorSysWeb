import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'
import qs from 'qs'
import { clearLoginInfo } from '@/utils'
import isPlainObject from 'lodash/isPlainObject'
import {commonkey, isBlank} from "@/utils/common";

const http = axios.create({
  baseURL: window.SITE_CONFIG['apiURL'],
  timeout: 1000 * 180,
  withCredentials: true
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN'
  config.headers['refresh_token'] = sessionStorage.getItem(commonkey.refreshTokenKey) || ''
  config.headers['Authorization'] = sessionStorage.getItem(commonkey.adminTokenKey) || ''
  config.headers['encUserId'] = sessionStorage.getItem(commonkey.adminEncUserIdKey) || ''
  config.headers['isAdmin'] = sessionStorage.getItem(commonkey.isAdminKey) || 0
  config.headers['Content-Type'] = 'application/json;charset=UTF-8'
  // 默认参数
  var defaults = {}
  // 防止缓存，GET请求默认带_t参数
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      ...{ '_t': new Date().getTime() }
    }
  }
  if (isPlainObject(config.params)) {
    config.params = {
      ...defaults,
      ...config.params
    }
  }
  if (isPlainObject(config.data)) {
    config.data = {
      ...defaults,
      ...config.data
    }
    if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
      config.data = qs.stringify(config.data)
    }
  }

  // headers中配置serialize为true开启序列化
  if (config.method === 'post' && config.headers.serialize) {
    config.data = serialize(config.data)
    delete JSON.stringify(config.data)
  }

  if (config.method === 'get') {
    config.paramsSerializer = function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data.code == 500) {
    // clearLoginInfo()
    // router.replace({ name: 'login' })
    return Promise.reject(response.data.msg)
  }
  if (!isBlank(response.headers.access_token)) {
    Cookies.set("access_token", response.headers.access_token);
  }
  if (!isBlank(response.headers.refresh_token)) {
    Cookies.set("refresh_token", response.headers.refresh_token);
  }
  return response
}, error => {
  console.error(error)
  return Promise.reject(error)
})

export default http
