import type { Channel, ConsumeMessage } from 'amqplib';

import { emailWorker } from '@/workers/email.worker.js';

import { playlistSongRepository } from '@/modules/infrastructure/repositories/playlist-song.repository.js';
import { playlistRepository } from '@/modules/infrastructure/repositories/playlist.repository.js';
import { songRepository } from '@/modules/infrastructure/repositories/song.repository.js';

import { NotFoundError } from '@/shared/errors/app-error.js';

export const exportPlaylistListener = async (message: ConsumeMessage | null, channel: Channel) => {
  try {
    if (message) {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString()) as {
        playlistId: string;
        targetEmail: string;
      };

      const playlist = await playlistRepository.findById(playlistId);

      if (!playlist) throw new NotFoundError('Playlist is not found');

      const playlistSongs = await playlistSongRepository.findAllByPlaylistIdsOrSongIds([
        playlistId,
      ]);

      const songIds = [...new Set(playlistSongs.map((ps) => ps.songId))];
      const songs = songIds.length ? await songRepository.findByIds(songIds) : [];

      const messageContent = {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs,
        },
      };

      const result = await emailWorker.sendMail(targetEmail, JSON.stringify(messageContent));
      console.log(`[Nodemailer]: Message sent to ${targetEmail} with id ${result.messageId}`);

      channel.ack(message);
    }
  } catch (error) {
    console.log(error);

    if (message) {
      channel.nack(message, false, false);
    }
  }
};
