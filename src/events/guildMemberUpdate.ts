import {
	EmbedBuilder,
	GuildMember,
	PartialGuildMember,
	TextChannel,
} from 'discord.js';
import { Event } from '../types/Event';
const guildMemberUpdate: Event<'guildMemberUpdate'> = {
	name: 'guildMemberUpdate',
	once: false,
	async execute(
		oldMember: GuildMember | PartialGuildMember,
		newMember: GuildMember
	) {
		const channel = newMember.guild.channels.cache.find(
			(c) => c.name === 'botshit'
		) as TextChannel;

		if (!channel) return;

		const oldRoles = new Set(oldMember.roles.cache.keys());
		const newRoles = new Set(newMember.roles.cache.keys());

		const addedRoles = [...newRoles].filter(
			(roleId) => !oldRoles.has(roleId)
		);
		const removedRoles = [...oldRoles].filter(
			(roleId) => !newRoles.has(roleId)
		);

		if (addedRoles.length > 0) {
			for (const roleId of addedRoles) {
				const role = newMember.guild.roles.cache.get(roleId);
				console.log(role);
				const embed = new EmbedBuilder()
					.setTitle('Role Added')
					.setAuthor({
						name: newMember.user.tag,
						iconURL: newMember.user.displayAvatarURL(),
					})
					.setDescription(
						`Role <@&${roleId}> was added to ${newMember}`
					)
					.setFooter({ text: `Role ID: ${roleId}` })
					.setTimestamp();

				await channel.send({ embeds: [embed] });
			}
		}

		if (removedRoles.length > 0) {
			for (const roleId of removedRoles) {
				const role = newMember.guild.roles.cache.get(roleId);
				const embed = new EmbedBuilder()
					.setTitle('Role Removed')
					.setAuthor({
						name: newMember.user.tag,
						iconURL: newMember.user.displayAvatarURL(),
					})
					.setDescription(
						`Role <@&${roleId}> was removed from ${newMember}`
					)
					.setFooter({ text: `Role ID: ${roleId}` })
					.setTimestamp();

				await channel.send({ embeds: [embed] });
				console.log(role);
			}
		}
	},
};
export default guildMemberUpdate;
