import {
	EmbedBuilder,
	GuildMember,
	PartialGuildMember,
	TextChannel,
	VoiceState,
} from 'discord.js';
/**
 * Finds the logging channel in the guild.
 */
export const getLogChannel = (
	newMember: GuildMember,
	channelName: string
): TextChannel | undefined => {
	return newMember.guild.channels.cache.find(
		(c) => c.name === channelName
	) as TextChannel;
};

/**
 * Sends a role change notification to the channel.
 */
export const notifyRoleChange = async (
	channel: TextChannel,
	member: GuildMember,
	roleId: string,
	action: 'added' | 'removed'
) => {
	const role = member.guild.roles.cache.get(roleId);
	if (role) {
		const embed = new EmbedBuilder()
			.setTitle(`Role ${action === 'added' ? 'Added' : 'Removed'}`)
			.setAuthor({
				name: member.user.tag,
				iconURL: member.user.displayAvatarURL(),
			})
			.setDescription(`Role <@&${roleId}> was ${action} for ${member}`)
			.setFooter({ text: `Role ID: ${roleId}` })
			.setTimestamp();

		await channel.send({ embeds: [embed] });
	}
};

/**
 * Handles role changes for the member.
 */
export const handleRoleChanges = async (
	oldMember: GuildMember | PartialGuildMember,
	newMember: GuildMember,
	channel: TextChannel
) => {
	const oldRoles = new Set(oldMember.roles.cache.keys());
	const newRoles = new Set(newMember.roles.cache.keys());

	const addedRoles = [...newRoles].filter((roleId) => !oldRoles.has(roleId));
	const removedRoles = [...oldRoles].filter(
		(roleId) => !newRoles.has(roleId)
	);

	for (const roleId of addedRoles) {
		await notifyRoleChange(channel, newMember, roleId, 'added');
	}

	for (const roleId of removedRoles) {
		await notifyRoleChange(channel, newMember, roleId, 'removed');
	}
};

/**
 * Fetches the last message timestamp for a member by iterating through text channels.
 */
export const getLastMessageTime = async (
	newMember: GuildMember
): Promise<number> => {
	let lastMessageTime = 0;

	for (const [, guildChannel] of newMember.guild.channels.cache) {
		if (guildChannel.isTextBased()) {
			const messages = await guildChannel.messages.fetch({
				limit: 100,
			});
			const memberMessage = messages.find(
				(msg) => msg.author.id === newMember.id
			);
			if (memberMessage) {
				lastMessageTime = Math.max(
					lastMessageTime,
					memberMessage.createdTimestamp
				);
			}
		}
	}

	return lastMessageTime;
};

/**
 * Checks if a member meets the inactivity criteria.
 */
export const isMemberInactive = async (
	newMember: GuildMember,
	oneMonthAgo: Date
): Promise<boolean> => {
	const lastMessageTime = await getLastMessageTime(newMember);
	const isInactiveByMessages =
		lastMessageTime === 0 || lastMessageTime < oneMonthAgo.getTime();

	const voiceState: VoiceState | undefined =
		newMember.guild.voiceStates.cache.get(newMember.id);
	const isInactiveByVoice = !voiceState?.channelId;

	return isInactiveByMessages && isInactiveByVoice;
};

/**
 * Kicks the member for inactivity and notifies the channel.
 */
export const kickInactiveMember = async (
	newMember: GuildMember,
	channel: TextChannel
) => {
	await newMember
		.kick('Inactive for more than 1 month without required activity.')
		.then(() => {
			channel.send(
				`Member ${newMember.user.tag} was kicked for inactivity.`
			);
		})
		.catch((e) => {
			channel.send('Failed to kick member. Error: ' + e);
		});

	const kickEmbed = new EmbedBuilder()
		.setTitle('Member Kicked')
		.setAuthor({
			name: newMember.user.tag,
			iconURL: newMember.user.displayAvatarURL(),
		})
		.setDescription(
			`Member ${newMember} was kicked for being inactive for more than 1 month with no messages or voice activity.`
		)
		.setTimestamp();

	await channel.send({ embeds: [kickEmbed] });
};
