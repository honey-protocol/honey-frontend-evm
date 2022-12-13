import { basePath, chain } from '../constants/service';
import Moralis from 'moralis-v1';
import { fromWei } from 'web3-utils';
import MoralisType from 'moralis-v1';
import { useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { defaultCacheStaleTime } from '../constants/constant';

export async function getMaxBorrowFromNFT(
	hivemindContractAddress: string,
	HERC20ContractAddress: string,
	ERC721ContractAddress: string,
	userAddress: string,
	NFTTokenId: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/hivemind.json`)).json();
	const options = {
		chain: chain,
		address: hivemindContractAddress,
		function_name: 'getHypotheticalAccountLiquidity',
		abi: ABI,
		params: {
			_account: userAddress,
			_hToken: HERC20ContractAddress,
			_collection: ERC721ContractAddress,
			_collateralId: NFTTokenId,
			_redeemTokens: '0',
			_borrowAmount: '0'
		}
	};
	// @ts-ignore
	const result: any = await Moralis.Web3API.native.runContractFunction(options);
	return fromWei(result['liquidityTillLTV'], unit);
}

export function useGetMaxBorrowAmountFromNFT(
	hivemindContractAddress: string,
	HERC20ContractAddress: string,
	ERC721ContractAddress: string,
	walletAddress: string,
	NFTId: string,
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
		queryKeys.maxBorrowFromNFT(HERC20ContractAddress, ERC721ContractAddress, walletAddress, NFTId),
		() => {
			if (
				NFTId != '' &&
				walletAddress != '' &&
				hivemindContractAddress != '' &&
				HERC20ContractAddress != '' &&
				ERC721ContractAddress != ''
			) {
				return getMaxBorrowFromNFT(
					hivemindContractAddress,
					HERC20ContractAddress,
					ERC721ContractAddress,
					walletAddress,
					NFTId,
					unit
				);
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

export async function getCollateralFactor(
	hivemindContractAddress: string,
	HERC20ContractAddress: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/hivemind.json`)).json();
	const options = {
		chain: chain,
		address: hivemindContractAddress,
		function_name: 'getCollateralFactor',
		abi: ABI,
		params: {
			_hToken: HERC20ContractAddress
		}
	};
	// @ts-ignore
	const result: any = await Moralis.Web3API.native.runContractFunction(options);
	return parseFloat(fromWei(result, unit));
}

export function useGetCollateralFactor(
	hivemindContractAddress: string,
	HERC20ContractAddress: string,
	unit: Unit
): [number, boolean] {
	const onSuccess = (data: number) => {
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
		queryKeys.collateralFactor(HERC20ContractAddress),
		() => {
			if (hivemindContractAddress != '' && HERC20ContractAddress != '') {
				return getCollateralFactor(hivemindContractAddress, HERC20ContractAddress, unit);
			} else {
				return 0;
			}
		},
		{
			onSuccess,
			onError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	return [amount || 0, isLoading || isFetching];
}
