import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Moralis from 'moralis-v1';
import { fromWei, Unit } from 'web3-utils';
import { basePath, chain, confirmedBlocks } from '../constants/service';
import MoralisType from 'moralis-v1';
import { safeToWei } from '../helpers/repayHelper';
import { useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { blackHole, defaultCacheStaleTime } from '../constants/constant';

export async function depositNFTCollateral(HERC20ContractAddress: string, NFTTokenId: string) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = {
		chain: chain,
		contractAddress: HERC20ContractAddress,
		functionName: 'depositCollateral',
		abi: ABI,
		params: { _collateralIds: [NFTTokenId] }
	};
	const transaction = await Moralis.executeFunction(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
}

export interface borrowVariables {
	HERC20ContractAddress: string;
	NFTTokenId: string;
	amount: string;
	unit: Unit;
}

export const borrow = async ({
	HERC20ContractAddress: HERC20ContractAddress,
	NFTTokenId: NFTTokenId,
	amount: amount,
	unit: unit
}: borrowVariables) => {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = {
		chain: chain,
		contractAddress: HERC20ContractAddress,
		functionName: 'borrow',
		abi: ABI,
		params: { _borrowAmount: safeToWei(amount, unit), _collateralId: NFTTokenId }
	};
	const transaction = await Moralis.executeFunction(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
};

export interface depositVariables {
	HERC20ContractAddress: string;
	amount: string;
	unit: Unit;
}

export async function depositUnderlying({
	HERC20ContractAddress: HERC20ContractAddress,
	amount: amount,
	unit: unit
}: depositVariables) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = {
		chain: chain,
		contractAddress: HERC20ContractAddress,
		functionName: 'depositUnderlying',
		abi: ABI,
		params: { _amount: safeToWei(amount, unit), _to: blackHole }
	};
	const transaction = await Moralis.executeFunction(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
}

export async function withdrawUnderlying(
	HERC20ContractAddress: string,
	amount: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = {
		chain: chain,
		contractAddress: HERC20ContractAddress,
		functionName: 'withdraw',
		abi: ABI,
		params: { _amount: safeToWei(amount, unit) }
	};
	const transaction = await Moralis.executeFunction(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
}

export async function getBorrowFromCollateral(
	HERC20ContractAddress: string,
	NFTTokenId: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = {
		chain: chain,
		address: HERC20ContractAddress,
		function_name: 'getDebtForCollateral',
		abi: ABI,
		params: { _collateralId: NFTTokenId }
	};

	// @ts-ignore
	const result = await Moralis.Web3API.native.runContractFunction(options);
	return fromWei(result.toString(), unit);
}

export async function repayBorrow(
	HERC20ContractAddress: string,
	NFTTokenId: string,
	amount: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = {
		chain: chain,
		contractAddress: HERC20ContractAddress,
		functionName: 'repayBorrow',
		abi: ABI,
		params: { _repayAmount: safeToWei(amount, unit), _collateralId: NFTTokenId, _to: blackHole }
	};
	const transaction = await Moralis.executeFunction(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
}

export interface withdrawCollateralVariables {
	HERC20ContractAddress: string;
	NFTTokenId: string;
}

export async function withdrawCollateral({
	HERC20ContractAddress,
	NFTTokenId
}: withdrawCollateralVariables) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = {
		chain: chain,
		contractAddress: HERC20ContractAddress,
		functionName: 'withdrawCollateral',
		abi: ABI,
		params: { _collateralIds: [NFTTokenId] }
	};
	const transaction = await Moralis.executeFunction(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
}

export async function getBorrowBalance(HERC20ContractAddress: string, address: string, unit: Unit) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = {
		chain: chain,
		address: HERC20ContractAddress,
		function_name: 'getAccountSnapshot',
		abi: ABI,
		params: { _account: address }
	};

	// @ts-ignore
	const result: any = await Moralis.Web3API.native.runContractFunction(options);
	const borrowBalance = fromWei(result[1], unit);
	return borrowBalance;
}

export async function getTotalBorrow(HERC20ContractAddress: string, unit: Unit) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = {
		chain: chain,
		address: HERC20ContractAddress,
		function_name: 'totalBorrows',
		abi: ABI,
		params: {}
	};

	// @ts-ignore
	const result = await Moralis.Web3API.native.runContractFunction(options);
	return fromWei(result.toString(), unit);
}

export function useGetTotalBorrow(HERC20ContractAddress: string, unit: Unit): [string, boolean] {
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
		queryKeys.totalBorrow(HERC20ContractAddress),
		() => {
			if (HERC20ContractAddress != '') {
				return getTotalBorrow(HERC20ContractAddress, unit);
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

export async function getTotalReserves(HERC20ContractAddress: string, unit: Unit) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = {
		chain: chain,
		address: HERC20ContractAddress,
		function_name: 'totalReserves',
		abi: ABI,
		params: {}
	};

	// @ts-ignore
	const result = await Moralis.Web3API.native.runContractFunction(options);
	const totalReserve = fromWei(result.toString(), unit);
	return totalReserve;
}
