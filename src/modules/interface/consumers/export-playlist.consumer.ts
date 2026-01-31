import { rabbitMQConfig } from '@/configs/rabbitmq.config.js';
import { exportPlaylistListener } from '@/modules/application/listeners/export-playlist.listener.js';
import { QUEUES } from '@/shared/constants/queues.constant.js';

export const exportPlaylistConsumer = async () => {
  try {
    await rabbitMQConfig.connect();

    const channel = rabbitMQConfig.getConsumerChannel();
    await channel.assertQueue(QUEUES.exportPlaylistSong, { durable: true });

    channel.prefetch(1);
    console.log(`[Consumer] Waiting for messages in ${QUEUES.exportPlaylistSong}.`);

    channel.consume(
      QUEUES.exportPlaylistSong,
      (message) => exportPlaylistListener(message, channel),
      {
        noAck: false,
      },
    );
  } catch (error) {
    console.error('[Consumer] Error starting consumer:', error);
  }
};
