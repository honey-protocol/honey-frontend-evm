import MoralisType from 'moralis-v1';
import { TimestampPoint } from '../components/HoneyChart/types';
import { generateMockHistoryData } from '../helpers/chartUtils';
import { CollectionPosition } from '../components/HoneyPositionsSlider/types';
import { BorrowUserPosition, LendUserPosition } from '../components/HoneyCardsGrid/types';
import { ActiveCouponQueryQuery, getBuiltGraphSDK } from '../.graphclient';
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
import { getMetaDataFromNFTId } from './useNFT';
import { MarketTablePosition } from '../types/markets';
import { getImageUrlFromMetaData } from '../helpers/NFThelper';
import { getNFTPrice } from './useHtokenHelper';
import { getContractsByHTokenAddr } from '../helpers/generalHelper';

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

//todo convert to usd and use real nft price
export function useBorrowUserPositions(
	user: MoralisType.User | null
): [Array<BorrowUserPosition>, boolean] {
	const walletPublicKey: string = user?.get('ethAddress') || '';
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
	const nftPricesQuries = useQueries(
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
	const nftPrices = nftPricesQuries
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
	return [resultPosition, isLoadingCollaterals || isFetchingCollaterals];
}

//todo implement later
export function useLendUserPositions(): [Array<LendUserPosition>, boolean] {
	const preparedPositions: LendUserPosition[] = [];
	for (let i = 0; i < 20; i++) {
		preparedPositions.push({
			name: `Any user position #${i + 1000}`,
			deposit: Math.random() * 1000,
			value: Math.random() * 1000,
			ir: Math.random(),
			available: Math.random() * 1000,
			imageUrl: '/nfts/gecko.jpg',
			id: i.toString() + '_lend'
		});
	}
	return [preparedPositions, false];
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
