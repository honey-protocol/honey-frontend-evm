import { collections } from '../constants/NFTCollections';

export function getNFTName(HERC20ContractAddress: string) {
	const collection = collections.find(
		(collection) => (collection.HERC20ContractAddress = HERC20ContractAddress)
	);
	return collection?.name || '';
}

export function getNFTDefaultImage(HERC20ContractAddress: string) {
	const collection = collections.find(
		(collection) => (collection.HERC20ContractAddress = HERC20ContractAddress)
	);
	return collection?.icon || '';
}
