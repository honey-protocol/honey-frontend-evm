import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Moralis from 'moralis-v1';
import { fromWei } from 'web3-utils';
import { basePath, chain, confirmedBlocks } from '../constants/service';
import MoralisType from 'moralis-v1';
import { safeToWei } from '../helpers/repayHelper';
import { useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { defaultCacheStaleTime, unlimited } from '../constants/constant';

export async function getDepositUnderlyingApproval(
	ERC20ContractAddress: string,
	HERC20ContractAddress: string,
	amount: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/ERC20.json`)).json();
	const options = {
		chain: chain,
		contractAddress: ERC20ContractAddress,
		functionName: 'approve',
		abi: ABI,
		params: { spender: HERC20ContractAddress, amount: safeToWei(amount, unit) }
	};
	const transaction = await Moralis.executeFunction(options);
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
	const options = {
		chain: chain,
		contractAddress: ERC20ContractAddress,
		functionName: 'approve',
		abi: ABI,
		params: { spender: HERC20ContractAddress, amount: safeToWei(amount, unit) }
	};
	const transaction = await Moralis.executeFunction(options);
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
	const options = {
		chain: chain,
		contractAddress: ERC20ContractAddress,
		functionName: 'approve',
		abi: ABI,
		params: { spender: contractAddress, amount: unlimited }
	};
	const transaction = await Moralis.executeFunction(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
}

export async function revokeApproval(ERC20ContractAddress: string, HERC20ContractAddress: string) {
	const ABI = await (await fetch(`${basePath}/abi/ERC20.json`)).json();
	const options = {
		chain: chain,
		contractAddress: ERC20ContractAddress,
		functionName: 'approve',
		abi: ABI,
		params: { spender: HERC20ContractAddress, amount: '0' }
	};
	const transaction = await Moralis.executeFunction(options);
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
		function_name: 'allowance',
		abi: ABI,
		params: { spender: contractAddress, owner: userAddress }
	};

	// @ts-ignore
	return await Moralis.Web3API.native.runContractFunction(options);
}

export function useCheckUnlimitedApproval(
	ERC20ContractAddress: string,
	contractAddress: string,
	walletAddress: string
): [boolean, boolean] {
	const onSuccess = (data: string) => {
		return data;
	};
	const onError = (data: string) => {
		return '0';
	};
	const {
		data: amount,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.userApproval(walletAddress, ERC20ContractAddress, contractAddress),
		() => {
			if (walletAddress != '' && ERC20ContractAddress != '' && contractAddress != '') {
				return getAllowance(ERC20ContractAddress, contractAddress, walletAddress);
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
	return [result.length >= unlimited.length - 1, isLoading || isFetching];
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
		function_name: 'balanceOf',
		abi: ABI,
		params: { account: userAddress }
	};

	// @ts-ignore
	const result = await Moralis.Web3API.native.runContractFunction(options);
	return fromWei(result, unit);
}

export function useGetUserBalance(
	ERC20ContractAddress: string,
	walletAddress: string,
	unit: Unit
): [string, boolean] {
	const onSuccess = (data: string) => {
		return data;
	};
	const onError = (data: string) => {
		return '0';
	};
	const {
		data: amount,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.userBalance(walletAddress, ERC20ContractAddress),
		() => {
			if (walletAddress != '' && ERC20ContractAddress != '') {
				return getUserBalance(ERC20ContractAddress, walletAddress, unit);
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
