import { db } from '@/database/index.js';
import type { PlaylistEntity } from '../../domain/entities/playlist.entity.js';
import { mapPlaylistRowToEntity, type PlaylistRow } from '../mappers/playlist.mapper.js';

export const playlistRepository = {
  save: async (playlist: PlaylistEntity): Promise<void> => {
    await db.query<PlaylistRow>(
      `INSERT INTO playlists (id, name, owner, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE
         SET
          name = EXCLUDED.name,
          owner = EXCLUDED.owner,
          updated_at = EXCLUDED.updated_at
         RETURNING *
         `,
      [playlist.id, playlist.name, playlist.owner, playlist.createdAt, playlist.updatedAt],
    );
  },

  findAll: async (userId: string, playlistIds?: string[]): Promise<PlaylistEntity[]> => {
    const conditions = [`owner = $1`];
    const params: any = [userId];

    if (playlistIds) {
      params.push(playlistIds);
      conditions.push(`id = ANY($${params.length}::text[])`);
    }

    let query = `SELECT * FROM playlists`;

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' OR ');
    }

    const result = await db.query<PlaylistRow>(query, params);
    return result.rows.map((row) => mapPlaylistRowToEntity(row));
  },

  findById: async (playlistId: string): Promise<PlaylistEntity | null> => {
    const result = await db.query<PlaylistRow>(`SELECT * FROM playlists WHERE id=$1`, [playlistId]);

    const playlistRow = result.rows[0];
    if (!playlistRow) return null;

    return mapPlaylistRowToEntity(playlistRow);
  },

  delete: async (playlist: PlaylistEntity): Promise<boolean> => {
    await db.query(`DELETE FROM playlists WHERE id=$1 RETURNING *`, [playlist.id]);

    return true;
  },
};
