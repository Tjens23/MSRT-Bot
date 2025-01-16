import { ClientEvents } from 'discord.js';
export interface Event<k extends keyof ClientEvents> {
	name: k;
	once: boolean;
	execute: (...args: ClientEvents[k]) => void | Promise<void>;
}
