import amqp, { type Channel, type ChannelModel } from 'amqplib';
import { env } from './env.config.js';

class RabbitMQConfig {
  private connection: ChannelModel | null = null;
  private producerChannel: Channel | null = null;
  private consumerChannel: Channel | null = null;

  private reconnectTimeout?: NodeJS.Timeout | undefined;
  private isConnecting: boolean = false;

  async connect(): Promise<void> {
    if (this.connection || this.isConnecting) return;
    this.isConnecting = true;
    console.log('[RabbitMQ] Attempting to connect...');

    try {
      this.connection = await amqp.connect(env.rabbitmq.server);

      this.connection.on('close', (err) => {
        if (err) {
          console.error('[RabbitMQ] Connection closed unexpectedly. Reconnecting...', err);
        } else {
          console.log('[RabbitMQ] Connection closed gracefully.');
        }

        if (this.connection !== null) {
          this.cleanup();
          this.reconnect();
        }
      });

      this.connection.on('error', (err) => {
        console.error('[RabbitMQ] Connection error:', err);
      });

      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      this.producerChannel.on('error', (err) => {
        console.error('[RabbitMQ] Producer Channel error:', err);
      });

      this.consumerChannel.on('error', (err) => {
        console.error('[RabbitMQ] Consumer Channel error:', err);
      });

      console.log('[RabbitMQ] Connected successfully.');
      this.isConnecting = false;
    } catch (err) {
      console.error('[RabbitMQ] Failed to connect:', err);
      this.isConnecting = false;
      this.reconnect();
    }
  }

  async getChannel() {
    if (!this.connection) {
      await this.connect();
    }

    const channel = await this.connection?.createChannel();

    return channel;
  }

  private reconnect(delay = 5000): void {
    if (this.reconnectTimeout) return;

    console.log(`[RabbitMQ] Reconnecting in ${delay / 1000} seconds...`);
    this.reconnectTimeout = setTimeout(async () => {
      this.reconnectTimeout = undefined;
      await this.connect();
    }, delay);
  }

  private cleanup(): void {
    this.connection = null;
    this.producerChannel = null;
    this.consumerChannel = null;
  }

  getProducerChannel(): Channel {
    if (!this.producerChannel) {
      throw new Error('[RabbitMQ] Producer channel not initialized. Check connection status.');
    }
    return this.producerChannel;
  }

  getConsumerChannel(): Channel {
    if (!this.consumerChannel) {
      throw new Error('[RabbitMQ] Consumer channel not initialized. Check connection status.');
    }
    return this.consumerChannel;
  }

  async close(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = undefined;
    }

    try {
      await this.producerChannel?.close();
      await this.consumerChannel?.close();
      await this.connection?.close();

      console.log('[RabbitMQ] Gracefully closed.');
    } catch (error) {
      console.error('[RabbitMQ] Error while closing connection/channels:', error);
    } finally {
      this.cleanup();
    }
  }
}

export const rabbitMQConfig = new RabbitMQConfig();
