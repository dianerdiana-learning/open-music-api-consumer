import { db } from '@/database/index.js';
import { SongEntity } from '../../domain/entities/song.entity.js';
import { mapSongRowToEntity, type SongRow } from '../mappers/song.mapper.js';

const tableName = 'songs';

export const songRepository = {
  findByIds: async (ids: string[]): Promise<SongEntity[]> => {
    const result = await db.query<SongRow>(
      `SELECT * FROM ${tableName} WHERE id = ANY($1::text[])`,
      [ids],
    );
    return result.rows.map((songRow) => mapSongRowToEntity(songRow));
  },
};
