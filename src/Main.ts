import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import loadEvents from './Utils/loadEvents';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

(async () => {
	await loadEvents(client);
})();

client.login(process.env.TOKEN);
