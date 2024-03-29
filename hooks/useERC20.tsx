import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fromWei } from 'web3-utils';
import { basePath, chain, confirmedBlocks } from '../constants/service';
import { safeToWei } from '../helpers/repayHelper';
import { useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { defaultCacheStaleTime, unlimited } from '../constants/constant';
import Moralis from 'moralis';
import { TCurrentUser } from 'contexts/userContext';
import { prepareWriteContract, writeContract } from '@wagmi/core';

export async function getDepositUnderlyingApproval(
	ERC20ContractAddress: string,
	HERC20ContractAddress: string,
	amount: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/ERC20.json`)).json();
	const options = await prepareWriteContract({
		// chain: chain,
		address: ERC20ContractAddress as `0x${string}`,
		functionName: 'approve',
		abi: ABI,
		args: [HERC20ContractAddress, safeToWei(amount, unit)]
	});
	const transaction = await writeContract(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
}

export async function getRepayLoanApproval(
	ERC20ContractAddress: string,
	HERC20ContractAddress: string,
	amount: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/ERC20.json`)).json();
	const options = await prepareWriteContract({
		// chain: chain,
		address: ERC20ContractAddress as `0x${string}`,
		functionName: 'approve',
		abi: ABI,
		args: [HERC20ContractAddress, safeToWei(amount, unit)]
	});
	const transaction = await writeContract(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
}

export interface getUnlimitedApprovalVariables {
	ERC20ContractAddress: string;
	contractAddress: string;
}

export async function getUnlimitedApproval({
	ERC20ContractAddress,
	contractAddress
}: getUnlimitedApprovalVariables) {
	const ABI = await (await fetch(`${basePath}/abi/ERC20.json`)).json();
	const options = await prepareWriteContract({
		// chain: chain,
		address: ERC20ContractAddress as `0x${string}`,
		functionName: 'approve',
		abi: ABI,
		args: [contractAddress, unlimited]
	});
	const transaction = await writeContract(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
}

export async function revokeApproval(ERC20ContractAddress: string, HERC20ContractAddress: string) {
	const ABI = await (await fetch(`${basePath}/abi/ERC20.json`)).json();
	const options = await prepareWriteContract({
		// chain: chain,
		address: ERC20ContractAddress as `0x${string}`,
		functionName: 'approve',
		abi: ABI,
		args: [HERC20ContractAddress, '0']
	});
	const transaction = await writeContract(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
}

export async function getAllowance(
	ERC20ContractAddress: string,
	contractAddress: string,
	userAddress: string
) {
	const ABI = await (await fetch(`${basePath}/abi/ERC20.json`)).json();
	const options = {
		chain: chain,
		address: ERC20ContractAddress,
		functionName: 'allowance',
		abi: ABI,
		params: { spender: contractAddress, owner: userAddress }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const results: any = response.result;
	return results;
}

export function useCheckApproval(
	ERC20ContractAddress: string,
	contractAddress: string,
	user: TCurrentUser | null,
	depositAmount: number,
	unit?: Unit
): [boolean, boolean] {
	const onSuccess = (data: string) => {
		return data;
	};
	const onError = (data: string) => {
		return '0';
	};
	const walletPublicKey: string = user?.address || '';
	const {
		data: amount,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.userApproval(walletPublicKey, ERC20ContractAddress, contractAddress),
		() => {
			if (walletPublicKey != '' && ERC20ContractAddress != '' && contractAddress != '') {
				return getAllowance(ERC20ContractAddress, contractAddress, walletPublicKey);
			} else {
				return '0';
			}
		},
		{
			onSuccess,
			onError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	const result = amount || '0';
	return [Number(fromWei(result, unit)) >= depositAmount, isLoading || isFetching];
}

export async function getUserBalance(
	ERC20ContractAddress: string,
	userAddress: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/ERC20.json`)).json();
	const options = {
		chain: chain,
		address: ERC20ContractAddress,
		functionName: 'balanceOf',
		abi: ABI,
		params: { account: userAddress }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	return fromWei(result, unit);
}

export function useGetUserBalance(
	ERC20ContractAddress: string,
	user: TCurrentUser | null,
	unit: Unit
): [string, boolean] {
	const onSuccess = (data: string) => {
		return data;
	};
	const onError = (data: string) => {
		return '0';
	};
	const walletPublicKey: string = user?.address || '';
	const {
		data: amount,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.userBalance(walletPublicKey, ERC20ContractAddress),
		() => {
			if (walletPublicKey != '' && ERC20ContractAddress != '') {
				return getUserBalance(ERC20ContractAddress, walletPublicKey, unit);
			} else {
				return '0';
			}
		},
		{
			onSuccess,
			onError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	return [amount || '0', isLoading || isFetching];
}
