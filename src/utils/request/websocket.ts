import { message } from 'antd';

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  heartbeatMessage?: string | object;
}

export class WebSocketRequest {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectCount = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private manualClose = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectAttempts: 3,
      reconnectInterval: 3000,
      heartbeatInterval: 30000,
      heartbeatMessage: 'ping',
      ...config
    };
  }

  // 连接 WebSocket
  connect(): void {
    try {
      this.ws = new WebSocket(this.config.url, this.config.protocols);
      this.addEventListeners();
    } catch (error) {
      message.error('WebSocket 连接失败');
      this.handleReconnect();
    }
  }

  // 添加事件监听器
  private addEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = (event: Event) => {
      this.reconnectCount = 0;
      this.startHeartbeat();
      this.config.onOpen?.(event);
      message.success('WebSocket 已连接');
    };

    this.ws.onmessage = (event: MessageEvent) => {
      // 如果收到的是心跳响应，不触发 onMessage
      if (event.data === 'pong') return;
      this.config.onMessage?.(event);
    };

    this.ws.onerror = (event: Event) => {
      this.config.onError?.(event);
      message.error('WebSocket 发生错误');
    };

    this.ws.onclose = (event: CloseEvent) => {
      this.stopHeartbeat();
      this.config.onClose?.(event);
      
      if (!this.manualClose) {
        message.warning('WebSocket 连接已断开');
        this.handleReconnect();
      }
    };
  }

  // 发送消息
  send(data: string | object): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      message.error('WebSocket 未连接');
      return;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
    } catch (error) {
      message.error('消息发送失败');
    }
  }

  // 关闭连接
  close(): void {
    this.manualClose = true;
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // 重新连接
  private handleReconnect(): void {
    if (
      this.reconnectCount < (this.config.reconnectAttempts || 3) &&
      !this.manualClose
    ) {
      this.reconnectTimer = setTimeout(() => {
        this.reconnectCount++;
        message.info(`正在尝试第 ${this.reconnectCount} 次重连...`);
        this.connect();
      }, this.config.reconnectInterval);
    } else if (!this.manualClose) {
      message.error('WebSocket 重连失败，请检查网络连接');
    }
  }

  // 开始心跳
  private startHeartbeat(): void {
    if (this.config.heartbeatInterval && this.config.heartbeatMessage) {
      this.heartbeatTimer = setInterval(() => {
        this.send(this.config.heartbeatMessage!);
      }, this.config.heartbeatInterval);
    }
  }

  // 停止心跳
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 获取连接状态
  getState(): number {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }

  // 检查是否已连接
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// WebSocket 状态常量
export const WebSocketState = {
  CONNECTING: WebSocket.CONNECTING,
  OPEN: WebSocket.OPEN,
  CLOSING: WebSocket.CLOSING,
  CLOSED: WebSocket.CLOSED
};

// 创建 WebSocket 实例的工厂函数
export const createWebSocket = (config: WebSocketConfig): WebSocketRequest => {
  return new WebSocketRequest(config);
}; 