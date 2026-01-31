import { db } from '@/database/index.js';
import type { PlaylistSongEntity } from '../../domain/entities/playlist-song.entity.js';
import {
  mapPlaylistSongRowToEntity,
  type PlaylistSongRow,
} from '../mappers/playlist-song.mapper.js';

export const playlistSongRepository = {
  save: async (playlistSong: PlaylistSongEntity): Promise<void> => {
    await db.query<PlaylistSongRow>(
      `INSERT INTO playlist_songs (id, playlist_id, song_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE
         SET
          playlist_id = EXCLUDED.playlist_id,
          song_id = EXCLUDED.song_id,
          updated_at = EXCLUDED.updated_at
         RETURNING *
         `,
      [
        playlistSong.id,
        playlistSong.playlistId,
        playlistSong.songId,
        playlistSong.createdAt,
        playlistSong.updatedAt,
      ],
    );
  },

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

  delete: async (playlistId: string, songId: string): Promise<boolean> => {
    await db.query(`DELETE FROM playlist_songs WHERE playlist_id=$1 AND song_id=$2 RETURNING *`, [
      playlistId,
      songId,
    ]);

    return true;
  },
};
