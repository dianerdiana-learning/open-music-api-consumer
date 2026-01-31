import { db } from '@/database/index.js';
import type { PlaylistSongEntity } from '../../domain/entities/playlist-song.entity.js';
import {
  mapPlaylistSongRowToEntity,
  type PlaylistSongRow,
} from '../mappers/playlist-song.mapper.js';

export const playlistSongRepository = {
  findAllByPlaylistIdsOrSongIds: async (
    playlistIds?: string[],
    songIds?: string[],
  ): Promise<PlaylistSongEntity[]> => {
    const conditions = [];
    const params = [];

    if (playlistIds && playlistIds.length > 0) {
      params.push(playlistIds);
      conditions.push(`playlist_id = ANY($${params.length}::text[])`);
    }

    if (songIds && songIds.length > 0) {
      params.push(songIds);
      conditions.push(`song_id = ANY($${params.length}::text[])`);
    }

    let query = `SELECT * FROM playlist_songs`;

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' OR ');
    }

    const result = await db.query<PlaylistSongRow>(query, params);
    return result.rows.map((row) => mapPlaylistSongRowToEntity(row));
  },
};
