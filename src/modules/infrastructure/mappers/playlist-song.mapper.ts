import { PlaylistSongEntity } from '../../domain/entities/playlist-song.entity.js';

export interface PlaylistSongRow {
  id: string;
  playlist_id: string;
  song_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database row (snake_case) → entity (camelCase)
 */
export const mapPlaylistSongRowToEntity = (row: PlaylistSongRow): PlaylistSongEntity => {
  return new PlaylistSongEntity({
    id: row.id,
    playlistId: row.playlist_id,
    songId: row.song_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
};

/**
 * Convert entity (camelCase) → database row (snake_case)
 */
export const mapPlaylistSongEntityToRow = (entity: PlaylistSongEntity): PlaylistSongRow => {
  return {
    id: entity.id,
    playlist_id: entity.playlistId,
    song_id: entity.songId,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
};
