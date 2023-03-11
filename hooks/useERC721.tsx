import React from 'react';
import { basePath, chain, confirmedBlocks } from '../constants/service';
import { fromWei } from 'web3-utils';
import Moralis from 'moralis';
import { prepareWriteContract, writeContract } from '@wagmi/core';

export default async function getDepositNFTApproval(
	ERC721ContractAddress: string,
	HERC20ContractAddress: string,
	NFTTokenId: string
) {
	const ABI = await (await fetch(`${basePath}/abi/ERC721.json`)).json();
	const options = await prepareWriteContract({
		// chainId: chain,
		address: ERC721ContractAddress as `0x${string}`,
		functionName: 'approve',
		abi: ABI,
		args: [HERC20ContractAddress, NFTTokenId]
	});
	const transaction = await writeContract(options);
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
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	return result;
}
