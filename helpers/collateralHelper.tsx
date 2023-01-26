import { collections } from '../constants/NFTCollections';

export function getNFTName(HERC20ContractAddress: string) {
	const collection = collections.find(
		(collection) =>
			collection.HERC20ContractAddress.toLowerCase() == HERC20ContractAddress.toLowerCase()
	);
	return collection?.name || '';
}

export function getNFTDefaultImage(HERC20ContractAddress: string) {
	const collection = collections.find(
		(collection) =>
			collection.HERC20ContractAddress.toLowerCase() == HERC20ContractAddress.toLowerCase()
	);
	return collection?.icon || '';
}

export function getCollateralUnit(HERC20ContractAddress: string) {
	const collection = collections.find(
		(collection) =>
			collection.HERC20ContractAddress.toLowerCase() == HERC20ContractAddress.toLowerCase()
	);
	return collection?.unit;
}

export function getERC20Name(HERC20ContractAddress: string) {
	const collection = collections.find(
		(collection) =>
			collection.HERC20ContractAddress.toLowerCase() == HERC20ContractAddress.toLowerCase()
	);
	return collection?.erc20Name || '';
}
