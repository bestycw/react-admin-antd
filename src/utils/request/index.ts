import axiosRequest from './axios'
import fetchRequest from './fetch'
import getGlobalConfig from '@/config/GlobalConfig'

// 请求类型枚举
export enum RequestType {
  AXIOS = 'axios',
  FETCH = 'fetch'
}

// 获取配置的请求类型，默认使用 axios
const requestType = getGlobalConfig('RequestType') || RequestType.AXIOS

// 根据配置选择请求实例
const Request = requestType === RequestType.FETCH ? fetchRequest : axiosRequest

export {
  axiosRequest,
  fetchRequest
}

export default Request
