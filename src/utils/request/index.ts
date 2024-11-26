import { AxiosRequest } from './axios';
import { FetchRequest } from './fetch';
import { WebSocketRequest, type WebSocketConfig, WebSocketState } from './websocket';

// 创建默认实例
const request = new AxiosRequest();
const fetchRequest = new FetchRequest();

// WebSocket 工厂函数
const createWebSocket = (config: WebSocketConfig) => new WebSocketRequest(config);

// 统一导出
export {
  // 类
  AxiosRequest,
  FetchRequest,
  WebSocketRequest,
  
  // 实例
  request,
  fetchRequest,
  createWebSocket,
};

// 类型导出
export type { WebSocketConfig };
export { WebSocketState };

// 默认导出 axios 实例
export default request;
