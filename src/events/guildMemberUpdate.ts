import { PartialGuildMember, GuildMember } from 'discord.js';
import { Event } from 'src/types/Event';
import { hasExcludedRole } from 'src/Utils/ignore_role';
import {
	getLogChannel,
	handleRoleChanges,
	isMemberInactive,
	kickInactiveMember,
} from 'src/Utils/Utils';

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

		const isExcluded = excludedRoleIds.some((roleId: string) =>
			hasExcludedRole(newMember, roleId)
		);

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
