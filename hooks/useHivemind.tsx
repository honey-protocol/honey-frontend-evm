import { basePath, chain } from '../constants/service';
import { fromWei } from 'web3-utils';
import { useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { defaultCacheStaleTime } from '../constants/constant';
import Moralis from 'moralis';
import { TCurrentUser } from 'contexts/userContext';

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
		functionName: 'getHypotheticalAccountLiquidity',
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
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	return fromWei(result['liquidityTillLTV'], unit);
}

export function useGetMaxBorrowAmountFromNFT(
	hivemindContractAddress: string,
	HERC20ContractAddress: string,
	ERC721ContractAddress: string,
	user: TCurrentUser | null,
	NFTId: string,
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
		queryKeys.maxBorrowFromNFT(
			HERC20ContractAddress,
			ERC721ContractAddress,
			walletPublicKey,
			NFTId
		),
		() => {
			if (
				NFTId != '' &&
				walletPublicKey != '' &&
				hivemindContractAddress != '' &&
				HERC20ContractAddress != '' &&
				ERC721ContractAddress != ''
			) {
				return getMaxBorrowFromNFT(
					hivemindContractAddress,
					HERC20ContractAddress,
					ERC721ContractAddress,
					walletPublicKey,
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
		functionName: 'getMarketData',
		abi: ABI,
		params: {
			_hToken: HERC20ContractAddress
		}
	};
	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	return parseFloat(fromWei(result[2], unit));
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
		return 0;
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
