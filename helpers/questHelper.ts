import { PublicKey } from '@solana/web3.js';

export const logQuest = async (txId: string) => {
	if (!txId) return;

	try {
		const response = await fetch(`http://3.215.249.148:3007/quests/v1/submit-quest/${txId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		});
		const result = await response.json();
		return result;
	} catch (error) {
		console.log({ error });
	}
};

export const getQuestsForAddress = async (addressPublicKey: PublicKey) => {
	const address = addressPublicKey.toString();
	try {
		const response = await fetch(`http://http//3.215.249.148:3007/quests/v1/quests/${address}`, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				'X-API-KEY': process.env.NEXT_PUBLIC_QUEST_API_KEY ?? ''
			}
		});
		const result = await response.json();
		return result;
	} catch (error) {
		console.log({ error });
	}
};

export const getAllQuests = async () => {
	try {
		const response = await fetch('http://3.215.249.148:3007/quests/v1/all/quests', {
			method: 'GET',
			headers: {
				accept: 'application/json',
				'X-API-KEY': process.env.NEXT_PUBLIC_QUEST_API_KEY ?? ''
			}
		});
		const result = await response.json();
		return result;
	} catch (error) {
		console.log({ error });
	}
};
