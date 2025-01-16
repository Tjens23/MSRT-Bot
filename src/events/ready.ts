import { Client } from 'discord.js';
import { Event } from '../types/Event';
const ready: Event<'ready'> = {
	name: 'ready',
	once: true,
	execute(client: Client) {
		console.log(client.user!.tag + ' is online and ready');
	},
};
export default ready;
