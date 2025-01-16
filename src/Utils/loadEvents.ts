import { Client, ClientEvents } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { Event } from '../types/Event';

const loadEvents = (client: Client): void => {
	const eventsPath = path.join(__dirname, '../events');
	const eventFiles = fs
		.readdirSync(eventsPath)
		.filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

	for (const file of eventFiles) {
		try {
			const eventModule = require(`${eventsPath}/${file}`);
			const event = eventModule.default as Event<keyof ClientEvents>;

			if (!event) {
				console.warn(`No event exported from ${file}`);
				continue;
			}

			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args));
			} else {
				client.on(event.name, (...args) => event.execute(...args));
			}
		} catch (error) {
			console.error(`Failed to load event ${file}:`, error);
		}
	}

	console.log(`Loaded ${eventFiles.length} events.`);
};

export default loadEvents;
