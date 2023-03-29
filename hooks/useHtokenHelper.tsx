import { basePath, chain } from '../constants/service';
import { fromWei, Unit } from 'web3-utils';
import { useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { defaultCacheStaleTime } from '../constants/constant';
import Moralis from 'moralis';
import { TCurrentUser } from 'contexts/userContext';

export async function getUserSupplyBalance(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	address: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getAvailableUnderlyingForUser',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress, _account: address }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	const supplyBalance = fromWei(result, unit);
	return supplyBalance;
}

export async function getTotalSupplyBalance(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getAvailableUnderlying',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	const supplyBalance = fromWei(result, unit);
	return supplyBalance;
}

export async function getAllCollateral(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	start: string,
	end: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getAllCollateralPerHToken',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress, _startTokenId: start, _endTokenId: end }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const results: any = response.result;
	const loans = results.map((result: any) => {
		const [id, active, owner, collateralId, borrowAmount, interestPerToken] = result;
		const userLoan: loan = {
			HERC20ContractAddress: HERC20ContractAddress,
			NFTId: collateralId,
			borrowAmount: borrowAmount,
			active: active == 2,
			couponId: id,
			owner: owner
		};
		return userLoan;
	});
	return loans.filter((loan: any) => loan.active && loan.borrowAmount != '0');
}

export function useGetTotalUnderlyingBalance(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
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
		queryKeys.totalSupply(HERC20ContractAddress),
		() => {
			if (htokenHelperContractAddress != '' && HERC20ContractAddress != '') {
				return getTotalSupplyBalance(htokenHelperContractAddress, HERC20ContractAddress, unit);
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

export function useGetUserUnderlyingBalance(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
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
		queryKeys.userTotalSupply(walletPublicKey, HERC20ContractAddress),
		() => {
			if (
				walletPublicKey != '' &&
				htokenHelperContractAddress != '' &&
				HERC20ContractAddress != ''
			) {
				return getUserSupplyBalance(
					htokenHelperContractAddress,
					HERC20ContractAddress,
					walletPublicKey,
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

//todo refactor the rest of service with 10^4 precision
export async function getNFTPriceInUSD(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getFloorPriceInUSD',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	const nftPrice = fromWei(result, unit);
	return nftPrice;
}

export function useGetNFTPriceInUSD(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
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
		queryKeys.nftPriceInUSD(HERC20ContractAddress),
		() => getNFTPriceInUSD(htokenHelperContractAddress, HERC20ContractAddress, unit),
		{
			onSuccess,
			onError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);

	return [amount || '0', isLoading || isFetching];
}

export async function getNFTPrice(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string
) {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getFloorPriceInUnderlying',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	const returnValue: nftPrice = {
		HERC20ContractAddress: HERC20ContractAddress,
		price: parseInt(result) / 10000.0
	};
	return returnValue;
}

export async function getAssets(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getAssets',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	const totalBorrow = result[0] as string;
	const totalReserve = result[1] as string;
	const deposit = result[2] as string;
	const activeCoupons = result[3] as Array<any>;
	const resultAsset: asset = {
		totalBorrow: fromWei(totalBorrow, unit),
		totalReserve: fromWei(totalReserve, unit),
		totalDeposit: fromWei(deposit, unit),
		numOfCoupons: activeCoupons.length
	};
	return resultAsset;
}

export async function getUnderlyingPriceInUSD(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string
) {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getUnderlyingPriceInUSD',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	return parseInt(result) / 10000.0;
}

export function useGetUnderlyingPriceInUSD(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string
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
		queryKeys.underlyingPriceInUSD(HERC20ContractAddress),
		() => {
			if (htokenHelperContractAddress != '' && HERC20ContractAddress != '') {
				return getUnderlyingPriceInUSD(htokenHelperContractAddress, HERC20ContractAddress);
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
	const result = amount || 0;

	return [result, isLoading || isFetching];
}

export async function getMaxBorrowableAmount(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	hivemindContractAddress: string
) {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getMaxBorrowableAmountInUnderlying',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress, _controller: hivemindContractAddress }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	return parseInt(result) / 10000.0;
}

export function useGetMaxBorrowableAmount(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	hivemindContractAddress: string
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
		queryKeys.maxBorrow(HERC20ContractAddress),
		() => {
			if (
				htokenHelperContractAddress != '' &&
				HERC20ContractAddress != '' &&
				hivemindContractAddress != ''
			) {
				return getMaxBorrowableAmount(
					htokenHelperContractAddress,
					HERC20ContractAddress,
					hivemindContractAddress
				);
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

export function useGetNFTPrice(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string
): [nftPrice, boolean] {
	const defaultValue: nftPrice = {
		HERC20ContractAddress: '',
		price: 0
	};
	const onSuccess = (data: nftPrice) => {
		return data;
	};
	const onError = (data: string) => {
		return defaultValue;
	};

	const {
		data: amount,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.nftPrice(HERC20ContractAddress),
		() => {
			return getNFTPrice(htokenHelperContractAddress, HERC20ContractAddress);
		},
		{
			onSuccess,
			onError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);

	return [amount || defaultValue, isLoading || isFetching];
}

export async function getActiveCoupons(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getActiveCoupons',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress, _hasDebt: true }
	};
	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const results: any = response.result;
	const coupons = results.map((result: any) => {
		const [id, active, owner, collateralId, borrowAmount, debtShares] = result;
		const userCoupon: coupon = {
			NFTId: collateralId,
			borrowAmount: fromWei(borrowAmount, unit),
			active: active == 2,
			debtShares: fromWei(debtShares, unit),
			couponId: id
		};
		return userCoupon;
	});
	return coupons;
}

export interface getUserCouponsVariables {
	htokenHelperContractAddress: string;
	HERC20ContractAddress: string;
	userAddress: string;
	unit: Unit;
}

export const getUserCoupons = async ({
	htokenHelperContractAddress,
	HERC20ContractAddress,
	userAddress,
	unit
}: getUserCouponsVariables) => {
	console.log('get coupon called');
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getUserCoupons',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress, _user: userAddress }
	};
	console.log('called', chain);
	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const results: any = response.result;
	const coupons = results.map((result: any) => {
		const [id, active, owner, collateralId, borrowAmount, debtShares] = result;
		const userCoupon: coupon = {
			NFTId: collateralId,
			borrowAmount: fromWei(borrowAmount, unit),
			active: active == 2,
			debtShares: fromWei(debtShares, unit),
			couponId: id
		};
		return userCoupon;
	});

	console.log({ coupons });
	return coupons.filter((coupon: any) => coupon.active);
};

export function useGetUserCoupons(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	user: TCurrentUser | null,
	unit: Unit
): [Array<coupon>, boolean] {
	const onSuccess = (data: coupon[]) => {
		return data;
	};
	const onError = () => {
		return [] as coupon[];
	};
	const walletPublicKey: string = user?.address || '';
	const {
		data: coupons,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.listUserCoupons(HERC20ContractAddress, walletPublicKey),
		() => {
			if (walletPublicKey != '') {
				return getUserCoupons({
					htokenHelperContractAddress,
					HERC20ContractAddress,
					userAddress: walletPublicKey,
					unit
				});
			} else {
				return [] as Array<coupon>;
			}
		},
		{
			onSuccess,
			onError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	return [coupons || [], isLoading || isFetching];
}

export interface marketData {
	HERC20ContractAddress: string;
	interestRate: number;
	supplied: string;
	available: string;
}

export async function getMarketData(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getFrontendMarketData',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	const interestRate = result[0] as number;
	const supplied = result[1] as string;
	const available = result[2] as string;
	const resultData: marketData = {
		HERC20ContractAddress: HERC20ContractAddress,
		interestRate: interestRate / 1000.0,
		supplied: fromWei(supplied, unit),
		available: fromWei(available, unit)
	};

	return resultData;
}

interface couponData {
	debt: string;
	allowance: string;
	NFTPrice: number;
}

export async function getCouponData(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	couponId: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getFrontendCouponData',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress, _couponId: couponId }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	const debt = result[0] as string;
	const allowance = result[1] as string;
	const NFTPrice = result[2] as string;
	const resultData: couponData = {
		debt: fromWei(debt, unit),
		allowance: fromWei(allowance, unit),
		NFTPrice: parseInt(NFTPrice) / 10000.0
	};

	return resultData;
}

interface liquidationData {
	liquidationThreshold: string;
	totalDebt: string;
	tvl: number;
}

export async function getLiquidationData(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	unit: Unit
) {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getFrontendLiquidationData',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	const liquidationThreshold = result[0] as string;
	const totalDebt = result[1] as string;
	const tvl = result[2] as number;
	const resultData: liquidationData = {
		liquidationThreshold: fromWei(liquidationThreshold, unit),
		totalDebt: fromWei(totalDebt, unit),
		tvl: tvl / 10000.0
	};

	return resultData;
}

export const getBorrowFee = async (
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	unit: Unit
) => {
	const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json();
	const options = {
		chain: chain,
		address: htokenHelperContractAddress,
		functionName: 'getMarketBorrowFee',
		abi: ABI,
		params: { _hToken: HERC20ContractAddress, _referred: true }
	};

	// @ts-ignore
	const response = await Moralis.EvmApi.utils.runContractFunction(options);
	const result: any = response.result;
	return fromWei(result, unit);
};

export function useGetMarketBorrowFee(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	unit: Unit
): [number, boolean] {
	const defaultValue = 0.02;
	const onSuccess = (data: number) => {
		return data;
	};
	const onError = (data: string) => {
		return defaultValue;
	};

	const {
		data: amount,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.borrowFee(HERC20ContractAddress),
		() => {
			return getBorrowFee(htokenHelperContractAddress, HERC20ContractAddress, unit);
		},
		{
			onSuccess,
			onError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);

	return [Number(amount) || defaultValue, isLoading || isFetching];
}
