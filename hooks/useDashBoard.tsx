import { TimestampPoint } from '../components/HoneyChart/types';
import { generateMockHistoryData } from '../helpers/chartUtils';
import { CollectionPosition } from '../components/HoneyPositionsSlider/types';
import { BorrowUserPosition, LendUserPosition } from '../components/HoneyCardsGrid/types';
import {
	ActiveCouponQueryQuery,
	getBuiltGraphSDK,
	UnderlyingByUserQueryQuery
} from '../.graphclient';
import { useQueries, useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { defaultCacheStaleTime } from '../constants/constant';
import {
	getCollateralUnit,
	getERC20Name,
	getNFTDefaultImage,
	getNFTName
} from '../helpers/collateralHelper';
import { fromWei } from 'web3-utils';
import { getMarketData, getNFTPrice, marketData } from './useHtokenHelper';
import { getContractsByHTokenAddr } from '../helpers/generalHelper';
import { TCurrentUser } from 'contexts/userContext';

const sdk = getBuiltGraphSDK();

//todo implement later
export function useGetSliderPositions(): [Array<CollectionPosition>, boolean] {
	const mockData: CollectionPosition[] = [];

	for (let i = 0; i < 30; i++) {
		mockData.push({
			name: `Any name loooong #${i}`,
			value: Math.random() * 10000,
			difference: Math.random(),
			image: '/nfts/honeyEyes.png'
		});
	}
	return [mockData, false];
}

export function useBorrowUserPositions(
	user: TCurrentUser | null
): [Array<BorrowUserPosition>, boolean] {
	const walletPublicKey: string = user?.address || '';
	const defaultValue: nftPrice = {
		HERC20ContractAddress: '',
		price: 0
	};
	const onSubgraphQuerySuccess = (data: ActiveCouponQueryQuery) => {
		return data;
	};
	const onSubGraphQueryError = () => {
		return null;
	};
	const {
		data: collateralsFromSubgraph,
		isLoading: isLoadingCollaterals,
		isFetching: isFetchingCollaterals
	} = useQuery(
		queryKeys.listUserCollateral(walletPublicKey),
		async () => {
			return await sdk.ActiveCouponByUserQuery({
				userAddress: walletPublicKey.toLowerCase()
			});
		},
		{
			onSuccess: onSubgraphQuerySuccess,
			onError: onSubGraphQueryError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	const preparedPositions = collateralsFromSubgraph?.coupons?.map((collateralObj) => {
		const result: BorrowUserPosition = {
			name: `${getNFTName(collateralObj.hTokenAddr)}#${collateralObj.collateralID}`,
			image: getNFTDefaultImage(collateralObj.hTokenAddr),
			couponId: collateralObj.couponID,
			tokenId: collateralObj.collateralID,
			HERC20ContractAddr: collateralObj.hTokenAddr,
			erc20Name: getERC20Name(collateralObj.hTokenAddr),
			debt: fromWei(collateralObj.amount, getCollateralUnit(collateralObj.hTokenAddr)),
			value: 0
		};
		return result;
	});
	const positions = preparedPositions || [];
	const uniqueMarket: Array<string> = [
		...new Set(positions.map((item) => item.HERC20ContractAddr))
	];
	const nftPricesQueries = useQueries(
		uniqueMarket.map((HERC20ContractAddress) => {
			const { htokenHelperContractAddress } = getContractsByHTokenAddr(HERC20ContractAddress);
			return {
				queryKey: queryKeys.nftPrice(HERC20ContractAddress),
				queryFn: async () => {
					if (HERC20ContractAddress != '') {
						try {
							return getNFTPrice(htokenHelperContractAddress, HERC20ContractAddress);
						} catch (e) {
							console.error('Error fetching nft price');
							console.error(e);
							const result: nftPrice = {
								HERC20ContractAddress: HERC20ContractAddress,
								price: 0
							};
							return result;
						}
					} else {
						return defaultValue;
					}
				},
				staleTime: defaultCacheStaleTime,
				retry: false,
				enabled: uniqueMarket.length > 0
			};
		})
	);
	const nftPrices = nftPricesQueries
		.map((result) => result.data || defaultValue)
		.filter((position) => position.HERC20ContractAddress != '');
	const resultPosition = positions.map((position) => {
		const nftPrice = nftPrices.filter(
			(price) =>
				price.HERC20ContractAddress.toLowerCase() == position.HERC20ContractAddr.toLowerCase()
		);
		position.value = nftPrice && nftPrice.length > 0 ? nftPrice[0].price : 0;
		return position;
	});
	const isLoadingNFTPrices = nftPricesQueries.some((query) => query.isLoading);
	const isFetchingNFTPrices = nftPricesQueries.some((query) => query.isFetching);
	return [
		resultPosition,
		isLoadingCollaterals || isFetchingCollaterals || isLoadingNFTPrices || isFetchingNFTPrices
	];
}

//todo implement later
export function useLendUserPositions(
	user: TCurrentUser | null
): [Array<LendUserPosition>, boolean] {
	const walletPublicKey: string = user?.address || '';
	const defaultMarket: marketData = {
		HERC20ContractAddress: '',
		borrowInterestRate: '0',
		supplyInterestRate: '0',
		supplied: '0',
		available: '0'
	};
	const onSubgraphQuerySuccess = (data: UnderlyingByUserQueryQuery) => {
		return data;
	};
	const onSubGraphQueryError = () => {
		return null;
	};
	const {
		data: underlyingsFromSubgraph,
		isLoading: isLoadingUnderlyings,
		isFetching: isFetchingUnderlyings
	} = useQuery(
		queryKeys.listUserUnderlying(walletPublicKey),
		async () => {
			return await sdk.UnderlyingByUserQuery({
				userAddress: walletPublicKey.toLowerCase()
			});
		},
		{
			onSuccess: onSubgraphQuerySuccess,
			onError: onSubGraphQueryError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	const lendUserPositions = underlyingsFromSubgraph?.userUnderlyings?.map((underlyingObj) => {
		const result: LendUserPosition = {
			name: `${getNFTName(underlyingObj.hTokenAddr)}/${getERC20Name(underlyingObj.hTokenAddr)}`,
			deposit: fromWei(underlyingObj.amount, getCollateralUnit(underlyingObj.hTokenAddr)),
			supplied: 0,
			rate: 0,
			available: 0,
			image: getNFTDefaultImage(underlyingObj.hTokenAddr),
			id: underlyingObj.hTokenAddr
		};
		return result;
	});
	const positions = lendUserPositions || [];
	const uniqueMarket: Array<string> = [...new Set(positions.map((item) => item.id))];
	const lendDataQueries = useQueries(
		uniqueMarket.map((HERC20ContractAddress) => {
			const { htokenHelperContractAddress, unit } = getContractsByHTokenAddr(HERC20ContractAddress);
			return {
				queryKey: queryKeys.lendData(HERC20ContractAddress),
				queryFn: async () => {
					if (htokenHelperContractAddress != '' || HERC20ContractAddress != '') {
						try {
							const result = await getMarketData(
								htokenHelperContractAddress,
								HERC20ContractAddress,
								unit
							);
							return result;
						} catch (e) {
							console.error('Error fetching market data with error');
							console.error(e);
							const result: marketData = {
								HERC20ContractAddress: HERC20ContractAddress,
								borrowInterestRate: '0',
								supplyInterestRate: '0',
								supplied: '0',
								available: '0'
							};
							return result;
						}
					} else {
						return defaultMarket;
					}
				},
				staleTime: defaultCacheStaleTime,
				retry: false
			};
		})
	);
	const lendDatas = lendDataQueries
		.map((result) => result.data || defaultMarket)
		.filter((data) => data.HERC20ContractAddress != '');
	const resultPositions = positions.map((position) => {
		const lendData = lendDatas.filter(
			(data) => data.HERC20ContractAddress.toLowerCase() == position.id.toLowerCase()
		);
		if (lendData && lendData.length > 0) {
			const data = lendData[0];
			position.supplied = parseFloat(data.supplied);
			position.available = parseFloat(data.available);
			position.rate = parseFloat(data.supplyInterestRate);
		}
		return position;
	});

	const isLoadingLendData = lendDataQueries.some((query) => query.isLoading);
	const isFetchingLendData = lendDataQueries.some((query) => query.isFetching);

	return [
		resultPositions,
		isLoadingUnderlyings || isFetchingUnderlyings || isLoadingLendData || isFetchingLendData
	];
}

//todo implement later
export function useGetUserExposureData(): [Array<TimestampPoint>, boolean] {
	const from = new Date().setFullYear(new Date().getFullYear() - 1).valueOf();
	const to = new Date().valueOf();
	return [generateMockHistoryData(from, to, 10000), false];
}

//todo implement later
export function useGetUserExposure(): [number, boolean] {
	const userExposure = 4129.1;
	return [userExposure, false];
}
