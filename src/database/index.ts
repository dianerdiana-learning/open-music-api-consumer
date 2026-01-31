import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
import { env } from '../configs/env.config.js';

export class Database {
  private pool: Pool;

  constructor({
    host,
    port,
    user,
    password,
    database,
  }: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  }) {
    this.pool = new Pool({
      host,
      port,
      user,
      password,
      database,
    });
  }

  async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export const db = new Database({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
});
