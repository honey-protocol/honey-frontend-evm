import { fromWei, Unit } from 'web3-utils';
import { basePath, chain, confirmedBlocks } from '../constants/service';
import { safeToWei } from '../helpers/repayHelper';
import { useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { blackHole, defaultCacheStaleTime } from '../constants/constant';
import Moralis from 'moralis';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { logQuest, secondRequestWaitTime } from 'helpers/questHelper';

export async function depositNFTCollateral(HERC20ContractAddress: string, NFTTokenId: string) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = await prepareWriteContract({
		// chain: chain,
		address: HERC20ContractAddress as `0x${string}`,
		functionName: 'depositCollateral',
		abi: ABI,
		args: [[NFTTokenId]]
	});
	const transaction = await writeContract(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
	logQuest(receipt.transactionHash);
	//Call log quest again cause of an error on the api
	setTimeout(() => {
		logQuest(receipt.transactionHash);
	}, 2000);
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
	const options = await prepareWriteContract({
		// chain: chain,
		address: HERC20ContractAddress as `0x${string}`,
		functionName: 'borrow',
		abi: ABI,
		args: [safeToWei(amount, unit), NFTTokenId]
	});
	const transaction = await writeContract(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	logQuest(receipt.transactionHash);
	//Call log quest again cause of an error on the api
	setTimeout(() => {
		logQuest(receipt.transactionHash);
	}, secondRequestWaitTime);
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
	const options = await prepareWriteContract({
		// chain: chain,
		address: HERC20ContractAddress as `0x${string}`,
		functionName: 'depositUnderlying',
		abi: ABI,
		args: [safeToWei(amount, unit), blackHole]
	});
	const transaction = await writeContract(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);

	logQuest(receipt.transactionHash);
	//Call log quest again cause of an error on the api
	setTimeout(() => {
		logQuest(receipt.transactionHash);
	}, secondRequestWaitTime);
}

export async function withdrawUnderlying(
	HERC20ContractAddress: string,
	amount: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = await prepareWriteContract({
		// chain: chain,
		address: HERC20ContractAddress as `0x${string}`,
		functionName: 'withdraw',
		abi: ABI,
		args: [safeToWei(amount, unit)]
	});
	const transaction = await writeContract(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);

	// logQuest(receipt.transactionHash);
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
		functionName: 'getDebtForCollateral',
		abi: ABI,
		params: { _collateralId: NFTTokenId }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	return fromWei(result, unit);
}

export async function repayBorrow(
	HERC20ContractAddress: string,
	NFTTokenId: string,
	amount: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = await prepareWriteContract({
		// chain: chain,
		address: HERC20ContractAddress as `0x${string}`,
		functionName: 'repayBorrow',
		abi: ABI,
		args: [safeToWei(amount, unit), NFTTokenId, blackHole]
	});
	const transaction = await writeContract(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
	// logQuest(receipt.transactionHash);
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
	const options = await prepareWriteContract({
		// chain: chain,
		address: HERC20ContractAddress as `0x${string}`,
		functionName: 'withdrawCollateral',
		abi: ABI,
		args: [[NFTTokenId]]
	});
	const transaction = await writeContract(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	// logQuest(receipt.transactionHash);
	console.log(receipt);
}

export async function getBorrowBalance(HERC20ContractAddress: string, address: string, unit: Unit) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = {
		chain: chain,
		address: HERC20ContractAddress,
		functionName: 'getAccountSnapshot',
		abi: ABI,
		params: { _account: address }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	const borrowBalance = fromWei(result[1], unit);
	return borrowBalance;
}

export async function getTotalBorrow(HERC20ContractAddress: string, unit: Unit) {
	const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json();
	const options = {
		chain: chain,
		address: HERC20ContractAddress,
		functionName: 'totalBorrows',
		abi: ABI,
		params: {}
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	return fromWei(result, unit);
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
		functionName: 'totalReserves',
		abi: ABI,
		params: {}
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	const totalReserve = fromWei(result, unit);
	return totalReserve;
}
