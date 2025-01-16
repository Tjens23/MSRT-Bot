import { Role, GuildMember } from 'discord.js';
import 'dotenv/config';

/**
 * @param {GuildMember} member
 * @param {string} roleName
 * @returns {boolean}
 */

function hasRole(member: GuildMember, roleName: string): boolean {
	return member.roles.cache.some(
		(role: Role) =>
			role.name === roleName && !excludedRoleIds.includes(role.id)
	);
}

const excludedRoleIds = [
	'1023593575495258124',
	'1019122755125379102',
	'1298800303491121223',
	'1328509209075257395',
	'1100345108743856169',
	'1020714035156627467',
	'1140807638364467380',
];

export { hasRole };
