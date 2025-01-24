import { PartialGuildMember, GuildMember } from 'discord.js';
import { Event } from '../types/Event';
import { hasExcludedRole } from '../Utils/ignore_role';
import {
	getLogChannel,
	handleRoleChanges,
	isMemberInactive,
	kickInactiveMember,
} from '../Utils/Utils';

const guildMemberUpdate: Event<'guildMemberUpdate'> = {
	name: 'guildMemberUpdate',
	once: false,
	async execute(
		oldMember: GuildMember | PartialGuildMember,
		newMember: GuildMember
	) {
		const channel = getLogChannel(newMember, 'botshit');
		if (!channel) return;
		const excludedRoleIds: string[] = [];

		await handleRoleChanges(oldMember, newMember, channel);

		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

		const twoWeeksAgo = new Date();
		twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

		const isExcluded = excludedRoleIds.some((roleId: string) =>
			hasExcludedRole(newMember, roleId)
		);

		if (
			!isExcluded &&
			newMember.joinedAt &&
			newMember.joinedAt < oneMonthAgo &&
			(await isMemberInactive(newMember, oneMonthAgo))
		) {
			await newMember
				.send(
					`You have been inactive for 2 weeks in ${newMember.guild.name}. Please engage in the server to avoid being kicked for inactivity.`
				)
				.catch((e) => {
					channel.send('Failed to send DM to member. Error: ' + e);
				});
		}
		if (
			!isExcluded &&
			newMember.joinedAt &&
			newMember.joinedAt < oneMonthAgo &&
			(await isMemberInactive(newMember, oneMonthAgo))
		) {
			await kickInactiveMember(newMember, channel);
		}
	},
};

export default guildMemberUpdate;
