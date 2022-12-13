import MoralisType from 'moralis-v1';
import { MarketTablePosition, MarketTableRow } from '../types/markets';
import { useQueries, useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { defaultCacheStaleTime } from '../constants/constant';
import { getCouponData, getMarketData, getUserCoupons } from './useHtokenHelper';
import { getImageUrlFromMetaData } from '../helpers/NFThelper';
import { getMetaDataFromNFTId } from './useNFT';
import { LendTableRow } from '../types/lend';
import { generateMockHistoryData } from '../helpers/chartUtils';
import { TimestampPoint } from '../components/HoneyChart/types';
import { LiquidateTablePosition, LiquidateTableRow } from '../types/liquidate';
import { ActiveCouponQueryQuery, getBuiltGraphSDK } from '../.graphclient';
import { getNFTDefaultImage, getNFTName } from '../helpers/collateralHelper';
import { interestRateLend } from 'helpers/utils';

const defaultPosition: MarketTablePosition = {
	name: '',
	image: '',
	tokenId: '',
	couponId: '',
	debt: '',
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

export function useMarket(
	walletAddress: string | null,
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
	walletAddress: string,
	unit: Unit
): [MarketTablePosition[], boolean] {
	const onGetCouponsSuccess = (data: coupon[]) => {
		return data;
	};
	const onGetCouponsError = () => {
		return [] as coupon[];
	};
	const {
		data: couponList,
		isLoading: isLoadingCoupons,
		isFetching: isFetchingCoupons
	} = useQuery(
		queryKeys.listUserCoupons(HERC20ContractAddress, walletAddress),
		() => {
			if (walletAddress != '' && HERC20ContractAddress != '') {
				return getUserCoupons({
					htokenHelperContractAddress,
					HERC20ContractAddress,
					userAddress: walletAddress,
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

	const results = useQueries(
		coupons.map((coupon) => {
			return {
				queryKey: queryKeys.NFTDetail(ERC721ContractAddress, coupon.NFTId),
				queryFn: async () => {
					if (walletAddress != '' && ERC721ContractAddress != '') {
						try {
							const metaData = await getMetaDataFromNFTId(ERC721ContractAddress, coupon.NFTId);
							const result: MarketTablePosition = {
								name: metaData.name,
								image: getImageUrlFromMetaData(metaData.metadata || ''),
								tokenId: metaData.token_id,
								couponId: coupon.couponId,
								debt: '0',
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
					if (walletAddress != '' && HERC20ContractAddress != '') {
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
			isFetchingNFTDetail
	];
}

export function useLend(
	walletAddress: string,
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
	walletAddress: string,
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
	HERC20ContractAddress: string
): [LiquidateTablePosition[], boolean] {
	const sdk = getBuiltGraphSDK();
	const onSubgraphQuerySuccess = (data: ActiveCouponQueryQuery) => {
		return data;
	};
	const onSubGraphQueryError = () => {
		return null;
	};
	const {
		data: collateralsFromSubgraph,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.listCollateral(HERC20ContractAddress),
		async () => {
			if (HERC20ContractAddress != '') {
				return await sdk.ActiveCouponByCollectionQuery({
					HERC20ContractAddress: HERC20ContractAddress.toLowerCase()
				});
			} else {
				return [];
			}
		},
		{
			onSuccess: onSubgraphQuerySuccess,
			onError: onSubGraphQueryError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	const positionList = collateralsFromSubgraph?.coupons?.map((collateralObj) => {
		const result: LiquidateTablePosition = {
			name: getNFTName(collateralObj.hTokenAddr),
			image: getNFTDefaultImage(collateralObj.hTokenAddr),
			couponId: collateralObj.couponID,
			tokenId: collateralObj.collateralID,
			healthLvl: 0.5,
			untilLiquidation: 0.1,
			debt: collateralObj.amount,
			estimatedValue: 0.5
		};
		return result;
	});

	return [positionList || [], isLoading || isFetching];
}
