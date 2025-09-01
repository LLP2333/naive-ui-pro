import axios from 'axios'
import { setupTokenInterceptor } from './request-interceptors'
import { setupResponseInterceptors } from './response-interceptors'

/**
 * 我们提供了 2 种全局错误处理方式
 * 方式一：可以在 axios 的 handleError 中返回 Promise.reject(error)，调用侧将会进入 catch 回调，并获取错误对象
 * 方式二：如果你决定使用 useProRequest 来作为请求工具，那么可以在 message-tip-after-request-finally-plugin 插件中实现
 */

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

/**
 * 请求前添加 token 的拦截器
 */
setupTokenInterceptor(http)

/**
 * 安装响应拦截器
 */
setupResponseInterceptors(http, {
  /**
   * 拆解服务端响应数据格式，成功时返回数据，失败时需要抛出错误消息
   * @param response axios 响应体
   * @returns 拆解后的数据
   * @throws 错误消息
   * @example
   * ```ts
   * (response) => response.data.success ? response.data.data : throw new Error(response.data.message)
   * ```
   */
  unwrapResponseData(response) {
    if (response.data != null) {
      // 格式: { code: number, data: any, message: string }
      if ('code' in response.data) {
        if (response.data.code !== 200) {
          throw new Error(response.data.message)
        }
        return response.data.data
      }
    }
    return response.data
  },

  /**
   * 全局错误处理，该函数的返回体将决定调用侧的 Promise 的状态
   * @param error axios 响应错误
   */
  handleError(error) {
    // 调用侧将会进入 then 回调并获取数据
    // return Promise.resolve({})

    // 调用侧将会进入 catch 回调，并获取错误对象
    return Promise.reject(error)
  },
})

export default http
