import mqtt, { MqttClient, IClientOptions, PacketCallback, IPublishPacket, IClientSubscribeOptions } from 'mqtt';
import { message } from 'antd';

export interface MQTTConfig extends IClientOptions {
  url: string;
  clientId?: string;
  username?: string;
  password?: string;
  clean?: boolean;
  keepalive?: number;
  reconnectPeriod?: number;
  connectTimeout?: number;
  will?: {
    topic: string;
    payload: string;
    qos?: 0 | 1 | 2;
    retain?: boolean;
  };
  onConnect?: () => void;
  onMessage?: (topic: string, payload: Buffer) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

export interface PublishOptions {
  qos?: 0 | 1 | 2;
  retain?: boolean;
  dup?: boolean;
}

export type SubscribeOptions = IClientSubscribeOptions;

export class MQTTRequest {
  private client: MqttClient | null = null;
  private config: MQTTConfig;
  private subscriptions: Map<string, (payload: Buffer) => void> = new Map();
  private reconnectCount = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 3;

  constructor(config: MQTTConfig) {
    this.config = {
      clientId: `mqtt_${Math.random().toString(16).slice(2, 10)}`,
      clean: true,
      keepalive: 60,
      reconnectPeriod: 3000,
      connectTimeout: 5000,
      ...config
    };
  }

  // 连接到 MQTT Broker
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.client = mqtt.connect(this.config.url, this.config);

        this.client.on('connect', () => {
          this.reconnectCount = 0;
          message.success('MQTT 已连接');
          this.config.onConnect?.();
          resolve();
        });

        this.client.on('message', (topic: string, payload: Buffer, packet: IPublishPacket) => {
          // 处理特定主题的订阅回调
          const handler = this.subscriptions.get(topic);
          if (handler) {
            handler(payload);
          }
          // 处理全局消息回调
          this.config.onMessage?.(topic, payload);
        });

        this.client.on('error', (error: Error) => {
          message.error('MQTT 发生错误');
          this.config.onError?.(error);
          reject(error);
        });

        this.client.on('close', () => {
          message.warning('MQTT 连接已断开');
          this.config.onClose?.();
          this.handleReconnect();
        });

        this.client.on('offline', () => {
          message.warning('MQTT 已离线');
        });

      } catch (error) {
        message.error('MQTT 连接失败');
        reject(error);
      }
    });
  }

  // 发布消息
  publish(topic: string, message: string | Buffer, options?: PublishOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.client.connected) {
        reject(new Error('MQTT 未连接'));
        return;
      }

      this.client.publish(topic, message, options, (error?: Error | undefined) => {
        if (error) {
        //   message.error('消息发布失败');
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  // 订阅主题
  subscribe(topic: string, options?: SubscribeOptions): Promise<void>;
  subscribe(topic: string, callback: (payload: Buffer) => void, options?: SubscribeOptions): Promise<void>;
  subscribe(
    topic: string,
    callbackOrOptions?: ((payload: Buffer) => void) | SubscribeOptions,
    maybeOptions?: SubscribeOptions
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.client.connected) {
        reject(new Error('MQTT 未连接'));
        return;
      }

      const options = typeof callbackOrOptions === 'function' ? maybeOptions : callbackOrOptions;
      const callback = typeof callbackOrOptions === 'function' ? callbackOrOptions : undefined;

      this.client.subscribe(topic, options || {}, (err: Error | null, granted) => {
        if (err) {
          message.error('主题订阅失败');
          reject(err);
        } else {
          if (callback) {
            this.subscriptions.set(topic, callback);
          }
          resolve();
        }
      });
    });
  }

  // 取消订阅
  unsubscribe(topic: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.client.connected) {
        reject(new Error('MQTT 未连接'));
        return;
      }

      this.client.unsubscribe(topic, (error?: Error) => {
        if (error) {
          message.error('取消订阅失败');
          reject(error);
        } else {
          this.subscriptions.delete(topic);
          resolve();
        }
      });
    });
  }

  // 断开连接
  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.client) {
        this.client.end(false, {}, () => {
          this.client = null;
          this.subscriptions.clear();
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // 重连机制
  private handleReconnect(): void {
    if (this.reconnectCount < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectCount++;
      message.info(`正在尝试第 ${this.reconnectCount} 次重连...`);
      setTimeout(() => {
        this.connect().catch(() => {
          if (this.reconnectCount >= this.MAX_RECONNECT_ATTEMPTS) {
            message.error('MQTT 重连失败，请检查网络连接');
          }
        });
      }, this.config.reconnectPeriod);
    }
  }

  // 检查连接状态
  isConnected(): boolean {
    return this.client?.connected || false;
  }

  // 获取当前客户端实例
  getClient(): MqttClient | null {
    return this.client;
  }
}

// 创建 MQTT 实例的工厂函数
export const createMQTT = (config: MQTTConfig): MQTTRequest => {
  return new MQTTRequest(config);
}; 