import { rabbitMQConfig } from './configs/rabbitmq.config.js';
import { exportPlaylistConsumer } from './modules/interface/consumers/export-playlist.consumer.js';

const startServer = async () => {
  try {
    await rabbitMQConfig.connect();
    await exportPlaylistConsumer();
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

startServer();
