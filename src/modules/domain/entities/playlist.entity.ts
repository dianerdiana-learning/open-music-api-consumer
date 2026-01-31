import { v7 as uuidv7 } from 'uuid';

export interface Playlist {
  id: string;
  name: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export class PlaylistEntity implements Playlist {
  id: string;
  name: string;
  owner: string;
  createdAt: string;
  updatedAt: string;

  constructor(props: Playlist) {
    const { id, name, owner, createdAt, updatedAt } = props;

    this.id = id;
    this.name = name;
    this.owner = owner;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ name, owner }: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>) {
    const timestamp = new Date().toISOString();
    return new PlaylistEntity({
      id: uuidv7(),
      name,
      owner,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }
}
