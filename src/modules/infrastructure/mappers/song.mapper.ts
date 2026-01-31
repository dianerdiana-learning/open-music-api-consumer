import { SongEntity } from '../../domain/entities/song.entity.js';

export interface SongRow {
  id: string;
  title: string;
  year: number;
  performer: string;
  genre: string;
  duration?: number | null | undefined;
  album_id?: string | null | undefined;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database row (snake_case) → entity (camelCase)
 */
export const mapSongRowToEntity = (row: SongRow): SongEntity => ({
  id: row.id,
  title: row.title,
  year: row.year,
  performer: row.performer,
  genre: row.genre,
  duration: row.duration,
  albumId: row.album_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * Convert entity (camelCase) → database row (snake_case)
 */
export const mapSongEntityToRow = (entity: SongEntity): SongRow => ({
  id: entity.id,
  title: entity.title,
  year: entity.year,
  performer: entity.performer,
  genre: entity.genre,
  duration: entity.duration,
  album_id: entity.albumId,
  created_at: entity.createdAt,
  updated_at: entity.updatedAt,
});
