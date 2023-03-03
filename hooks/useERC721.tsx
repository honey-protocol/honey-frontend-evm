import React from 'react';
import Moralis from 'moralis-v1';
import { basePath, chain, confirmedBlocks } from '../constants/service';
import { fromWei } from 'web3-utils';
import MoralisV2 from 'moralis';

export default async function getDepositNFTApproval(
	ERC721ContractAddress: string,
	HERC20ContractAddress: string,
	NFTTokenId: string
) {
	const ABI = await (await fetch(`${basePath}/abi/ERC721.json`)).json();
	const options = {
		chain: chain,
		contractAddress: ERC721ContractAddress,
		functionName: 'approve',
		abi: ABI,
		params: { to: HERC20ContractAddress, tokenId: NFTTokenId }
	};
	const transaction = await Moralis.executeFunction(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
}

export async function getNFTApproved(ERC721ContractAddress: string, NFTTokenId: string) {
	const ABI = await (await fetch(`${basePath}/abi/ERC721.json`)).json();
	const options = {
		chain: chain,
		address: ERC721ContractAddress,
		functionName: 'getApproved',
		abi: ABI,
		params: { tokenId: NFTTokenId }
	};

	// @ts-ignore
	const response = await MoralisV2.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	return result;
}
