require('dotenv').config();
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require("@discordjs/voice");
const { Client, GatewayIntentBits } = require('discord.js');
const api = require('./myinstantsapi');

// Configure seu token aqui
const token = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  // Verifica se alguém entrou na chamada
  if (!oldState.channelId && newState.channelId) {
    try {
      const connection = joinVoiceChannel(
        {
          channelId: newState.channel.id,
          guildId: newState.guild.id,
          adapterCreator: newState.guild.voiceAdapterCreator
        });
      const player = createAudioPlayer();
      connection.subscribe(player);
      const audioUrl = await api.getSong(); //await api.getSong(); // Obtém a URL do áudio
      const resource = createAudioResource(audioUrl);
      player.play(resource);

      console.log('Playing audio!');

      player.on(AudioPlayerStatus.Idle, () => {
        console.log('Audio playback finished.');
        connection.disconnect();
      });
    } catch (error) {
      console.error(error);
    }
  }
});

client.login(token);

