import {
	EmbedBuilder,
	GuildMember,
	PartialGuildMember,
	TextChannel,
} from 'discord.js';
import { hasExcludedRole, excludedRoleIds } from '../Utils/ignore_role';
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

		for (const roleId of addedRoles) {
			const role = newMember.guild.roles.cache.get(roleId);
			if (role) {
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

		for (const roleId of removedRoles) {
			const role = newMember.guild.roles.cache.get(roleId);
			if (role) {
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
			}
		}

		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

		const isExcluded = excludedRoleIds.some((roleId: string) =>
			hasExcludedRole(newMember, roleId)
		);

		if (
			!isExcluded &&
			newMember.joinedAt &&
			newMember.joinedAt < oneMonthAgo
		) {
			await newMember.kick(
				'Inactive for more than 1 month without required role.'
			);
			const kickEmbed = new EmbedBuilder()
				.setTitle('Member Kicked')
				.setAuthor({
					name: newMember.user.tag,
					iconURL: newMember.user.displayAvatarURL(),
				})
				.setDescription(
					`Member ${newMember} was kicked for being inactive for more than 1 month without required role.`
				)
				.setTimestamp();

			await channel.send({ embeds: [kickEmbed] });
		}
	},
};

export default guildMemberUpdate;
