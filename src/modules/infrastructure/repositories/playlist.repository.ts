import { db } from '@/database/index.js';
import type { PlaylistEntity } from '../../domain/entities/playlist.entity.js';
import { mapPlaylistRowToEntity, type PlaylistRow } from '../mappers/playlist.mapper.js';

export const playlistRepository = {
  findById: async (playlistId: string): Promise<PlaylistEntity | null> => {
    const result = await db.query<PlaylistRow>(`SELECT * FROM playlists WHERE id=$1`, [playlistId]);

    const playlistRow = result.rows[0];
    if (!playlistRow) return null;

    return mapPlaylistRowToEntity(playlistRow);
  },
};
