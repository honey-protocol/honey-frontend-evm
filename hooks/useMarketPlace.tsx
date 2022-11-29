import MoralisType from 'moralis-v1';
import { useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { blackHole, defaultCacheStaleTime } from '../constants/constant';
import { fromWei, toWei, Unit } from 'web3-utils';
import { basePath, chain, confirmedBlocks } from '../constants/service';
import Moralis from 'moralis-v1';
import { Bid, BidInfo } from '../types/liquidate';

//we are going to let liquidation related function to return value with mantissa so we can do
//high precision math in the front end
export async function getCollectionBids(
	marketContractAddress: string,
	HERC20ContractAddress: string
): Promise<BidInfo> {
	const ABI = await (await fetch(`${basePath}/abi/marketPlace.json`)).json();
	const options = {
		chain: chain,
		address: marketContractAddress,
		function_name: 'viewAuctionCollection',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress }
	};

	// @ts-ignore
	const result: Array = await Moralis.Web3API.native.runContractFunction(options);
	const highestBidder: string = result[1];
	const highestBid = result[2] as string;
	const bidders: Array<string> = result[3];
	const bids: Array<string> = result[4];
	const unlockTime: Array<number> = result[5];
	const bidResult = bidders.map(function (bidder: any, i: number) {
		const bid: Bid = {
			bid: bids[i],
			bidder: bidder,
			unlockTimeStamp: unlockTime[i]
		};
		return bid;
	});
	const filteredBidResult = bidResult.filter((bid) => bid.bidder != blackHole);
	const collectionBids: BidInfo = {
		highestBidder: highestBidder == blackHole ? '' : highestBidder,
		highestBid: highestBidder == blackHole ? '0' : highestBid,
		bids: filteredBidResult
	};
	return collectionBids;
}

export function useGetCollectionBids(
	marketContractAddress: string,
	HERC20ContractAddress: string
): [BidInfo, boolean] {
	const defaultCollectionBids: BidInfo = {
		highestBidder: '',
		highestBid: '0',
		bids: []
	};
	const onSuccess = (data: BidInfo) => {
		return data;
	};
	const onError = () => {
		return defaultCollectionBids;
	};
	const {
		data: collectionBids,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.listCollectionBids(marketContractAddress, HERC20ContractAddress),
		() => {
			if (HERC20ContractAddress != '' && marketContractAddress != '') {
				return getCollectionBids(marketContractAddress, HERC20ContractAddress);
			} else {
				return defaultCollectionBids;
			}
		},
		{
			onSuccess,
			onError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	return [collectionBids || defaultCollectionBids, isLoading || isFetching];
}

export interface bidCollectionVariables {
	marketContractAddress: string;
	HERC20ContractAddress: string;
	amount: string;
	unit: Unit;
}

export const bidCollection = async ({
	marketContractAddress: marketContractAddress,
	HERC20ContractAddress: HERC20ContractAddress,
	amount: amount,
	unit: unit
}: bidCollectionVariables) => {
	const ABI = await (await fetch(`${basePath}/abi/marketPlace.json`)).json();
	const options = {
		chain: chain,
		contractAddress: marketContractAddress,
		functionName: 'bidCollection',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress, _amount: toWei(amount, unit) }
	};
	const transaction = await Moralis.executeFunction(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
};

export interface cancelCollectionBidVariables {
	marketContractAddress: string;
	HERC20ContractAddress: string;
}

export const cancelCollectionBid = async ({
	marketContractAddress: marketContractAddress,
	HERC20ContractAddress: HERC20ContractAddress
}: cancelCollectionBidVariables) => {
	const ABI = await (await fetch(`${basePath}/abi/marketPlace.json`)).json();
	const options = {
		chain: chain,
		contractAddress: marketContractAddress,
		functionName: 'cancelBidCollection',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress }
	};
	const transaction = await Moralis.executeFunction(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
};

export async function getCollectionMinimumBid(
	marketContractAddress: string,
	HERC20ContractAddress: string
) {
	const ABI = await (await fetch(`${basePath}/abi/marketPlace.json`)).json();
	const options = {
		chain: chain,
		address: marketContractAddress,
		function_name: 'viewMinimumNextBidCollection',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress }
	};

	// @ts-ignore
	const result: Array = await Moralis.Web3API.native.runContractFunction(options);
	return result;
}

export function useGetCollectionMinimumBid(
	marketContractAddress: string,
	HERC20ContractAddress: string
): [string, boolean] {
	const onSuccess = (data: string) => {
		return data;
	};
	const onError = () => {
		return '0';
	};
	const {
		data: minimumBid,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.listCollectionMinimumBid(marketContractAddress, HERC20ContractAddress),
		() => {
			if (HERC20ContractAddress != '' && marketContractAddress != '') {
				return getCollectionMinimumBid(marketContractAddress, HERC20ContractAddress);
			} else {
				return '';
			}
		},
		{
			onSuccess,
			onError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	return [minimumBid || '', isLoading || isFetching];
}

export async function getAvailableRefund(
	marketContractAddress: string,
	ERC20ContractAddress: string,
	userAddress: string
) {
	const ABI = await (await fetch(`${basePath}/abi/marketPlace.json`)).json();
	const options = {
		chain: chain,
		address: marketContractAddress,
		function_name: 'viewAvailableRefund',
		abi: ABI,
		params: { _token: ERC20ContractAddress, _user: userAddress }
	};

	// @ts-ignore
	const result: Array = await Moralis.Web3API.native.runContractFunction(options);
	return result;
}

export function useGetAvailableRefund(
	marketContractAddress: string,
	ERC20ContractAddress: string,
	userAddress: string
): [string, boolean] {
	const onSuccess = (data: string) => {
		return data;
	};
	const onError = () => {
		return '0';
	};
	const {
		data: refund,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.userRefund(userAddress, ERC20ContractAddress),
		() => {
			if (ERC20ContractAddress != '' && userAddress != '') {
				return getAvailableRefund(marketContractAddress, ERC20ContractAddress, userAddress);
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
	return [refund || '0', isLoading || isFetching];
}

export interface withdrawRefundVariables {
	marketContractAddress: string;
	ERC20ContractAddress: string;
}

export const withdrawRefund = async ({
	marketContractAddress: marketContractAddress,
	ERC20ContractAddress: ERC20ContractAddress
}: withdrawRefundVariables) => {
	const ABI = await (await fetch(`${basePath}/abi/marketPlace.json`)).json();
	const options = {
		chain: chain,
		contractAddress: marketContractAddress,
		functionName: 'withdrawRefund',
		abi: ABI,
		params: { _token: ERC20ContractAddress }
	};
	const transaction = await Moralis.executeFunction(options);
	console.log(`transaction hash: ${transaction.hash}`);

	// @ts-ignore
	const receipt = await transaction.wait(confirmedBlocks);
	console.log(receipt);
};
