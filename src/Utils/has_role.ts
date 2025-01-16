export const hasRankRole = async (member: {
	roles: { name: string }[];
}): Promise<boolean> => {
	const ranks = [
		'PVT',
		'PFC',
		'LCpl',
		'Cpl',
		'Sgt',
		'SSgt',
		'GySgt',
		'MSgt',
		'1st Sgt',
		'MGySgt',
		'SgtMaj',
		'SMMC',
		'WO',
		'CWO2',
		'CWO3',
		'CWO4',
		'CWO5',
		'2ndLt',
		'1stLt',
		'Capt',
		'Maj',
		'LtCol',
	];

	for (const role of member.roles) {
		for (const rank of ranks) {
			if (role.name.includes(rank)) {
				return true;
			}
		}
	}
	return false;
};
