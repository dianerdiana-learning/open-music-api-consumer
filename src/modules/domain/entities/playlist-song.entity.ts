import { v7 as uuidv7 } from 'uuid';

export interface PlaylistSong {
  id: string;
  playlistId: string;
  songId: string;
  createdAt: string;
  updatedAt: string;
}

export class PlaylistSongEntity implements PlaylistSong {
  id: string;
  playlistId: string;
  songId: string;
  createdAt: string;
  updatedAt: string;

  constructor(playlistSong: PlaylistSong) {
    const { id, playlistId, songId, createdAt, updatedAt } = playlistSong;

    this.id = id;
    this.playlistId = playlistId;
    this.songId = songId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ playlistId, songId }: Omit<PlaylistSong, 'id' | 'createdAt' | 'updatedAt'>) {
    const timestamp = new Date().toISOString();
    return new PlaylistSongEntity({
      id: uuidv7(),
      playlistId,
      songId,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }
}
