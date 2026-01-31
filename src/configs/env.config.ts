import 'dotenv/config';

export const env = {
  db: {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'dcd_open_music',
  },
  rabbitmq: {
    server: process.env.RABBITMQ_SERVER || 'http://localhost:15672',
  },
  mail: {
    user: process.env.SMTP_USER || 'user@example.com',
    password: process.env.SMTP_PASSWORD || '',
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
  },
};
