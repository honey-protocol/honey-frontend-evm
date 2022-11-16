import MoralisType from 'moralis-v1';
import { useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { defaultCacheStaleTime } from '../constants/constant';
import {
	ActiveCouponByCollectionQueryDocument,
	ActiveCouponQueryQuery,
	getBuiltGraphSDK
} from '../.graphclient';
import { getNFTDefaultImage, getNFTName } from '../helpers/collateralHelper';

const sdk = getBuiltGraphSDK();

export function useFetchCollaterals(
	user: MoralisType.User | null,
	HERC20ContractAddress: string
): [Array<collateral>, boolean] {
	const onSubgraphQuerySuccess = (data: ActiveCouponQueryQuery) => {
		return data;
	};
	const onSubGraphQueryError = () => {
		return null;
	};
	const walletPublicKey: string = user?.get('ethAddress') || '';
	const {
		data: collateralsFromSubgraph,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.listCollateral(HERC20ContractAddress),
		async () => {
			return await sdk.ActiveCouponByCollectionQuery({
				HERC20ContractAddress: HERC20ContractAddress.toLowerCase()
			});
		},
		{
			onSuccess: onSubgraphQuerySuccess,
			onError: onSubGraphQueryError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	const collateralList = collateralsFromSubgraph?.coupons?.map((collateralObj) => {
		const result: collateral = {
			id: `${getNFTName(collateralObj.hTokenAddr)}-${collateralObj.collateralID}`, //id will be name tokenId
			name: getNFTName(collateralObj.hTokenAddr),
			image: getNFTDefaultImage(collateralObj.hTokenAddr),
			couponId: collateralObj.couponID,
			tokenId: collateralObj.collateralID,
			ERC721ContractAddress: collateralObj.collateralTokenAddr,
			ERC20ContractAddress: collateralObj.underlyingTokenAddr,
			HERC20ContractAddress: collateralObj.hTokenAddr,
			loanAmount: collateralObj.amount
		};
		return result;
	});
	return [collateralList || [], isLoading || isFetching];
}
