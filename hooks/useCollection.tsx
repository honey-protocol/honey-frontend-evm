import MoralisType from 'moralis-v1';
import { MarketTablePosition, MarketTableRow } from '../types/markets';
import { useQueries, useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { defaultCacheStaleTime } from '../constants/constant';
import {
	getActiveCoupons,
	getCouponData,
	getMarketData,
	getNFTPrice,
	getUserCoupons
} from './useHtokenHelper';
import { getImageUrlFromMetaData } from '../helpers/NFThelper';
import { getMetaDataFromNFTId } from './useNFT';
import { LendTableRow } from '../types/lend';
import { generateMockHistoryData } from '../helpers/chartUtils';
import { TimestampPoint } from '../components/HoneyChart/types';
import { LiquidateTablePosition, LiquidateTableRow } from '../types/liquidate';
import { ActiveCouponQueryQuery, getBuiltGraphSDK } from '../.graphclient';
import { getNFTDefaultImage, getNFTName } from '../helpers/collateralHelper';
import { interestRateLend } from 'helpers/utils';
import { getCollateralFactor } from './useHivemind';

const defaultPosition: MarketTablePosition = {
	name: '',
	image: '',
	tokenId: '',
	couponId: '',
	debt: '',
	healthLvl: 0,
	allowance: '',
	value: 0
};

const defaultMarketData: MarketTableRow = {
	key: '',
	name: '',
	icon: '',
	erc20Icon: '',
	rate: 0,
	available: 0,
	supplied: 0
};

const defaultLiquidateTablePosition: LiquidateTablePosition = {
	name: '',
	image: '',
	couponId: '',
	tokenId: '',
	healthLvl: 0,
	untilLiquidation: 0,
	debt: 0,
	estimatedValue: 0
};

export function useMarket(
	user: MoralisType.User | null,
	collections: collection[],
	htokenHelperContractAddress: string
): [MarketTableRow[], boolean] {
	const results = useQueries(
		collections.map((collection) => {
			return {
				queryKey: queryKeys.marketData(collection.HERC20ContractAddress),
				queryFn: async () => {
					if (htokenHelperContractAddress != '' || collection.HERC20ContractAddress != '') {
						try {
							const marketData = await getMarketData(
								htokenHelperContractAddress,
								collection.HERC20ContractAddress,
								collection.unit
							);
							const result: MarketTableRow = {
								key: collection.HERC20ContractAddress,
								name: `${collection.name}/${collection.erc20Name}`,
								icon: collection.icon,
								erc20Icon: collection.erc20Icon,
								rate: marketData.interestRate,
								available: parseFloat(marketData.available),
								supplied: parseFloat(marketData.supplied)
							};
							return result;
						} catch (e) {
							console.error('Error fetching market data with error');
							console.error(e);
							const result: MarketTableRow = {
								key: collection.HERC20ContractAddress,
								name: `${collection.name}/${collection.erc20Name}`,
								icon: collection.icon,
								erc20Icon: collection.erc20Icon,
								rate: 0,
								available: 0,
								supplied: 0
							};
							return result;
						}
					} else {
						return defaultMarketData;
					}
				},
				staleTime: defaultCacheStaleTime,
				retry: false
			};
		})
	);
	const marketResult = results
		.map((result) => result.data || defaultMarketData)
		.filter((data) => data.name != '');
	const isLoadingMarketData = results.some((query) => query.isLoading);
	const isFetchingMarketData = results.some((query) => query.isFetching);
	return [marketResult, isLoadingMarketData || isFetchingMarketData];
}

export function usePositions(
	htokenHelperContractAddress: string,
	HERC20ContractAddress: string,
	ERC721ContractAddress: string,
	hivemindContractAddress: string,
	user: MoralisType.User | null,
	unit: Unit
): [MarketTablePosition[], boolean] {
	const onGetCouponsSuccess = (data: coupon[]) => {
		return data;
	};
	const onGetCouponsError = () => {
		return [] as coupon[];
	};
	const walletPublicKey: string = user?.get('ethAddress') || '';
	const {
		data: couponList,
		isLoading: isLoadingCoupons,
		isFetching: isFetchingCoupons
	} = useQuery(
		queryKeys.listUserCoupons(HERC20ContractAddress, walletPublicKey),
		() => {
			if (walletPublicKey != '' && HERC20ContractAddress != '') {
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
			onSuccess: onGetCouponsSuccess,
			onError: onGetCouponsError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);

	const coupons = couponList || [];

	const onGetCollateralFactorSuccess = (data: number) => {
		return data;
	};
	const onGetCollateralFactorError = (data: string) => {
		return 0;
	};
	const {
		data: collateralFactorResult,
		isLoading: isLoadingCollateralFactor,
		isFetching: isFetchingCollateralFactor
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
			onSuccess: onGetCollateralFactorSuccess,
			onError: onGetCollateralFactorError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	const collateralFactor = collateralFactorResult || 0;
	const onGetNFTPriceSuccess = (data: number) => {
		return data;
	};
	const onGetNFTPriceError = (data: string) => {
		return 0;
	};

	const {
		data: nftPriceResult,
		isLoading: isLoadingNFTPrice,
		isFetching: isFetchingNFTPrice
	} = useQuery(
		queryKeys.nftPrice(HERC20ContractAddress),
		() => {
			if (htokenHelperContractAddress != '' && HERC20ContractAddress != '') {
				return getNFTPrice(htokenHelperContractAddress, HERC20ContractAddress);
			} else {
				return 0;
			}
		},
		{
			onSuccess: onGetNFTPriceSuccess,
			onError: onGetNFTPriceError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	const nftPrice = nftPriceResult || 0;

	const results = useQueries(
		coupons.map((coupon) => {
			return {
				queryKey: queryKeys.marketNFTDetail(ERC721ContractAddress, coupon.NFTId),
				queryFn: async () => {
					if (walletPublicKey != '' && ERC721ContractAddress != '') {
						try {
							const metaData = await getMetaDataFromNFTId(ERC721ContractAddress, coupon.NFTId);
							const result: MarketTablePosition = {
								name: metaData.name,
								image: getImageUrlFromMetaData(metaData.metadata || ''),
								tokenId: metaData.token_id,
								couponId: coupon.couponId,
								debt: '0',
								healthLvl: 0,
								allowance: '0',
								value: 0
							};
							return result;
						} catch (e) {
							console.error('Error fetching market position with error');
							console.error(e);
							return defaultPosition;
						}
					} else {
						return defaultPosition;
					}
				},
				staleTime: defaultCacheStaleTime,
				retry: false,
				enabled: coupons.length > 0
			};
		})
	);
	const nftDetails = results
		.map((result) => result.data || defaultPosition)
		.filter((position) => position.image != '');
	const couponDatas = useQueries(
		nftDetails.map((nftDetail) => {
			return {
				queryKey: queryKeys.couponData(HERC20ContractAddress, nftDetail.couponId),
				queryFn: async () => {
					if (walletPublicKey != '' && HERC20ContractAddress != '') {
						try {
							const couponData = await getCouponData(
								htokenHelperContractAddress,
								HERC20ContractAddress,
								nftDetail.couponId,
								unit
							);
							const result: MarketTablePosition = {
								name: nftDetail.name,
								image: nftDetail.image,
								tokenId: nftDetail.tokenId,
								couponId: nftDetail.couponId,
								debt: couponData.debt,
								healthLvl:
									((nftPrice - parseFloat(couponData.debt) / collateralFactor) / nftPrice) * 100,
								allowance: couponData.allowance,
								value: couponData.NFTPrice
							};
							return result;
						} catch (e) {
							console.error('Error fetching market position with error');
							console.error(e);
							return defaultPosition;
						}
					} else {
						return defaultPosition;
					}
				},
				staleTime: defaultCacheStaleTime,
				retry: false,
				enabled: results.length > 0
			};
		})
	);
	const positions = couponDatas
		.map((result) => result.data || defaultPosition)
		.filter((position) => position.image != '');

	const isLoadingNFTDetail = results.some((query) => query.isLoading);
	const isFetchingNFTDetail = results.some((query) => query.isFetching);
	const isLoadingPosition = couponDatas.some((query) => query.isLoading);
	const isFetchingPosition = couponDatas.some((query) => query.isFetching);

	return [
		positions,
		isLoadingPosition ||
			isFetchingPosition ||
			isLoadingCoupons ||
			isFetchingCoupons ||
			isLoadingNFTDetail ||
			isFetchingNFTDetail ||
			isLoadingCollateralFactor ||
			isFetchingCollateralFactor ||
			isLoadingNFTPrice ||
			isFetchingNFTPrice
	];
}

export function useLend(
	user: MoralisType.User | null,
	collections: collection[],
	htokenHelperContractAddress: string
): [LendTableRow[], boolean] {
	const results = useQueries(
		collections.map((collection) => {
			return {
				queryKey: queryKeys.lendData(collection.HERC20ContractAddress),
				queryFn: async () => {
					if (htokenHelperContractAddress != '' || collection.HERC20ContractAddress != '') {
						try {
							const marketData = await getMarketData(
								htokenHelperContractAddress,
								collection.HERC20ContractAddress,
								collection.unit
							);
							const result: LendTableRow = {
								key: collection.HERC20ContractAddress,
								name: `${collection.name}/${collection.erc20Name}`,
								icon: collection.icon,
								erc20Icon: collection.erc20Icon,
								available: parseFloat(marketData.available),
								supplied: parseFloat(marketData.supplied),
								rate: interestRateLend(
									marketData.interestRate,
									marketData.supplied,
									marketData.available
								)
							};
							return result;
						} catch (e) {
							console.error('Error fetching market data with error');
							console.error(e);
							const result: LendTableRow = {
								key: collection.HERC20ContractAddress,
								name: `${collection.name}/${collection.erc20Name}`,
								icon: collection.icon,
								erc20Icon: collection.erc20Icon,
								rate: 0,
								available: 0,
								supplied: 0
							};
							return result;
						}
					} else {
						return defaultMarketData;
					}
				},
				staleTime: defaultCacheStaleTime,
				retry: false
			};
		})
	);
	const marketResult = results
		.map((result) => result.data || defaultMarketData)
		.filter((data) => data.name != '');
	const isLoadingMarketData = results.some((query) => query.isLoading);
	const isFetchingMarketData = results.some((query) => query.isFetching);
	return [marketResult, isLoadingMarketData || isFetchingMarketData];
}

//todo add graph later
export function useLendPositions(): [Array<TimestampPoint>, boolean] {
	const from = new Date().setFullYear(new Date().getFullYear() - 1).valueOf();
	const to = new Date().valueOf();
	return [generateMockHistoryData(from, to), false];
}

export function useLiquidation(
	user: MoralisType.User | null,
	collections: collection[]
): LiquidateTableRow[] {
	const result = collections.map((collection) => {
		const liquidateTableRow: LiquidateTableRow = {
			key: collection.HERC20ContractAddress,
			name: `${collection.name}/${collection.erc20Name}`,
			icon: collection.icon,
			erc20Icon: collection.erc20Icon,
			risk: 0.1,
			liqThreshold: 0.75,
			totalDebt: 30,
			tvl: 15
		};
		return liquidateTableRow;
	});
	return result;
}

export function useLiquidationPositions(
	htokenHelperContractAddress: string,
	hivemindContractAddress: string,
	HERC20ContractAddress: string,
	unit: Unit
): [LiquidateTablePosition[], boolean] {
	const onGetCollateralFactorSuccess = (data: number) => {
		return data;
	};
	const onGetCollateralFactorError = (data: string) => {
		return 0;
	};
	const {
		data: collateralFactorResult,
		isLoading: isLoadingCollateralFactor,
		isFetching: isFetchingCollateralFactor
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
			onSuccess: onGetCollateralFactorSuccess,
			onError: onGetCollateralFactorError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	const collateralFactor = collateralFactorResult || 0;
	const onGetNFTPriceSuccess = (data: number) => {
		return data;
	};
	const onGetNFTPriceError = (data: string) => {
		return 0;
	};
	const onGetActiveCouponsSuccess = (data: coupon[]) => {
		return data;
	};
	const onGetActiveCouponsError = (data: string) => {
		return [];
	};
	const {
		data: nftPriceResult,
		isLoading: isLoadingNFTPrice,
		isFetching: isFetchingNFTPrice
	} = useQuery(
		queryKeys.nftPrice(HERC20ContractAddress),
		() => {
			if (htokenHelperContractAddress != '' && HERC20ContractAddress != '') {
				return getNFTPrice(htokenHelperContractAddress, HERC20ContractAddress);
			} else {
				return 0;
			}
		},
		{
			onSuccess: onGetNFTPriceSuccess,
			onError: onGetNFTPriceError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	const nftPrice = nftPriceResult || 0;
	const {
		data: collaterals,
		isLoading: isLoadingCollaterals,
		isFetching: isFetchingCollaterals
	} = useQuery(
		queryKeys.listCollateral(HERC20ContractAddress),
		async () => {
			if (HERC20ContractAddress != '' && htokenHelperContractAddress != '') {
				return await getActiveCoupons(htokenHelperContractAddress, HERC20ContractAddress, unit);
			} else {
				return [] as Array<coupon>;
			}
		},
		{
			onSuccess: onGetActiveCouponsSuccess,
			onError: onGetActiveCouponsError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	const positionList = collaterals?.map((collateralObj: coupon) => {
		const userDebt = parseFloat(collateralObj.borrowAmount);
		const liquidationPrice = userDebt / collateralFactor;
		const result: LiquidateTablePosition = {
			name: getNFTName(HERC20ContractAddress),
			image: getNFTDefaultImage(HERC20ContractAddress),
			couponId: collateralObj.couponId,
			tokenId: collateralObj.NFTId,
			healthLvl: ((nftPrice - userDebt / collateralFactor) / nftPrice) * 100,
			untilLiquidation: nftPrice - liquidationPrice,
			debt: userDebt,
			estimatedValue: nftPrice
		};
		return result;
	});

	return [
		positionList || [],
		isLoadingNFTPrice ||
			isFetchingNFTPrice ||
			isLoadingCollaterals ||
			isFetchingCollaterals ||
			isLoadingCollateralFactor ||
			isFetchingCollateralFactor
	];
}
