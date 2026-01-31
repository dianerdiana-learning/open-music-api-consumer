import { PlaylistEntity } from '../../domain/entities/playlist.entity.js';

export interface PlaylistRow {
  id: string;
  name: string;
  owner: string;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database row (snake_case) → entity (camelCase)
 */
export const mapPlaylistRowToEntity = (row: PlaylistRow): PlaylistEntity => ({
  id: row.id,
  name: row.name,
  owner: row.owner,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * Convert entity (camelCase) → database row (snake_case)
 */
export const mapPlaylistEntityToRow = (entity: PlaylistEntity): PlaylistRow => {
  return {
    id: entity.id,
    name: entity.name,
    owner: entity.owner,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
};
