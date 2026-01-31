import { v7 as uuidv7 } from 'uuid';

export interface Song {
  id: string;
  title: string;
  year: number;
  genre: string;
  performer: string;
  duration?: number | null | undefined;
  albumId?: string | null | undefined;
  createdAt: string;
  updatedAt: string;
}

export class SongEntity implements Song {
  id: string;
  title: string;
  year: number;
  performer: string;
  genre: string;
  duration?: number | null | undefined;
  albumId?: string | null | undefined;
  createdAt: string;
  updatedAt: string;

  constructor({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId,
    createdAt,
    updatedAt,
  }: Song) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.performer = performer;
    this.genre = genre;
    this.duration = duration;
    this.albumId = albumId;

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(payload: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) {
    const timestamp = new Date().toISOString();
    const id = uuidv7();

    return new SongEntity({
      ...payload,
      id,
      year: Number(payload.year),
      duration: payload.duration ?? Number(payload.duration),
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }
}
