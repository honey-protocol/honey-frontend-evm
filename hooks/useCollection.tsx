import MoralisType from 'moralis-v1';
import { MarketTablePosition, MarketTableRow } from '../types/markets';
import { useQueries, useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { defaultCacheStaleTime } from '../constants/constant';
import { getUserCoupons } from './useHerc20';
import { getImageUrlFromMetaData } from '../helpers/NFThelper';
import { getMetaDataFromNFTId } from './useNFT';
import { LendTableRow } from '../types/lend';
import { generateMockHistoryData } from '../helpers/chartUtils';
import { TimestampPoint } from '../components/HoneyChart/types';
import { LiquidateTablePosition, LiquidateTableRow } from '../types/liquidate';
import { ActiveCouponQueryQuery, getBuiltGraphSDK } from '../.graphclient';
import { getNFTDefaultImage, getNFTName } from '../helpers/collateralHelper';

const defaultPosition: MarketTablePosition = {
	name: '',
	image: '',
	tokenId: '',
	couponId: ''
};

export function useMarket(
	user: MoralisType.User | null,
	collections: collection[]
): MarketTableRow[] {
	const result = collections.map((collection) => {
		const market: MarketTableRow = {
			key: collection.HERC20ContractAddress,
			name: `${collection.name}/${collection.erc20Name}`,
			icon: collection.icon,
			erc20Icon: collection.erc20Icon,
			rate: 0.1,
			debt: 0,
			allowance: 0,
			available: 0,
			value: 0
		};
		return market;
	});
	return result;
}

export function usePositions(
	HERC20ContractAddress: string,
	ERC721ContractAddress: string,
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
				return getUserCoupons({ HERC20ContractAddress, userAddress: walletPublicKey, unit });
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
					if (walletPublicKey != '' && ERC721ContractAddress != '') {
						try {
							const metaData = await getMetaDataFromNFTId(ERC721ContractAddress, coupon.NFTId);
							const result: MarketTablePosition = {
								// id: `${metaData.name}-${metaData.token_id}`, //id will be name-tokenId
								name: metaData.name,
								image: getImageUrlFromMetaData(metaData.metadata || ''),
								tokenId: metaData.token_id,
								couponId: coupon.couponId,
								debt: Number(coupon.borrowAmount)
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
	const isLoadingPosition = results.some((query) => query.isLoading);
	const isFetchingPosition = results.some((query) => query.isFetching);
	const positions = results
		.map((result) => result.data || defaultPosition)
		.filter((position) => position.image != '');

	return [
		positions,
		isLoadingPosition || isFetchingPosition || isLoadingCoupons || isFetchingCoupons
	];

	return [
		positions,
		isLoadingPosition || isFetchingPosition || isLoadingCoupons || isFetchingCoupons
	];
}

export function useLend(user: MoralisType.User | null, collections: collection[]): LendTableRow[] {
	const result = collections.map((collection) => {
		const market: LendTableRow = {
			key: collection.HERC20ContractAddress,
			name: `${collection.name}/${collection.erc20Name}`,
			icon: collection.icon,
			erc20Icon: collection.erc20Icon,
			interest: 1,
			available: 0,
			value: 0,
			stats: []
		};
		return market;
	});
	return result;
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
