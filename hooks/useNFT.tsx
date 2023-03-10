import { chain } from '../constants/service';
import { getImageUrlFromMetaData } from '../helpers/NFThelper';
import { getNFTApproved } from './useERC721';
import { useQueries, useQuery } from 'react-query';
import { queryKeys } from '../helpers/queryHelper';
import { defaultCacheStaleTime } from '../constants/constant';
import Moralis from 'moralis';
import { TCurrentUser } from 'contexts/userContext';

const defaultNFT: NFT = {
	id: '',
	name: '',
	image: '',
	tokenId: '',
	contractAddress: ''
};

export async function getMetaDataFromNFTId(ERC721ContractAddress: string, NFTId: string) {
	const options = {
		chain: chain,
		address: ERC721ContractAddress,
		tokenId: NFTId
	};

	// @ts-ignore
	const response: any = await Moralis.EvmApi.nft.getNFTMetadata(options);
	return response?.result;
}

export function useGetMetaDataFromNFTId(
	ERC721ContractAddress: string,
	NFTId: string
): [NFT, boolean] {
	const onSuccess = (data: NFT) => {
		return data;
	};
	const onError = (data: string) => {
		return defaultNFT;
	};
	const {
		data: nft,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.NFTDetail(ERC721ContractAddress, NFTId),
		async () => {
			if (ERC721ContractAddress != '' && NFTId != '') {
				const metaData = await getMetaDataFromNFTId(ERC721ContractAddress, NFTId);
				const result: NFT = {
					id: `${metaData.name}-${metaData?.tokenId}`, //id will be name-tokenId
					name: metaData.name,
					symbol: metaData.symbol,
					image: getImageUrlFromMetaData(metaData.metadata || ''),
					tokenId: metaData.tokenId,
					contractAddress: ERC721ContractAddress
				};
				return result;
			} else {
				return defaultNFT;
			}
		},
		{
			onSuccess,
			onError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	return [nft || defaultNFT, isLoading || isFetching];
}

export function useFetchNFTByUserCoupons(
	coupons: coupon[],
	ERC721ContractAddress: string
): [Array<NFT>, boolean] {
	const results = useQueries(
		coupons.map((coupon) => {
			return {
				queryKey: queryKeys.NFTDetail(ERC721ContractAddress, coupon.NFTId),
				queryFn: async () => {
					try {
						const metaData = await getMetaDataFromNFTId(ERC721ContractAddress, coupon.NFTId);
						const result: NFT = {
							id: `${metaData.name}-${metaData.token_id}`, //id will be name-tokenId
							name: metaData.name,
							symbol: metaData.symbol,
							image: getImageUrlFromMetaData(metaData.metadata || ''),
							tokenId: metaData.token_id,
							contractAddress: ERC721ContractAddress
						};
						return result;
					} catch (e) {
						console.error('Error fetching individual NFT with error');
						console.error(e);
						return defaultNFT;
					}
				},
				staleTime: defaultCacheStaleTime,
				retry: false,
				enabled: coupons.length > 0
			};
		})
	);
	const isLoading = results.some((query) => query.isLoading);
	const isFetching = results.some((query) => query.isFetching);
	const NFTs = results.map((result) => result.data || defaultNFT);
	return [NFTs, isLoading || isFetching];
}

export function useIsNFTApproved(
	ERC721ContractAddress: string,
	HERC20ContractAddress: string,
	NFTId: string
): [boolean, boolean] {
	const onSuccess = (data: boolean) => {
		return data;
	};
	const onError = (data: boolean) => {
		return false;
	};
	const isNFTApproved = async (
		ERC721ContractAddress: string,
		HERC20ContractAddress: string,
		NFTId: string
	) => {
		const approvalAddress = await getNFTApproved(ERC721ContractAddress, NFTId);
		return approvalAddress == HERC20ContractAddress;
	};
	const {
		data: isApproved,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.NFTApproval(ERC721ContractAddress, HERC20ContractAddress, NFTId),
		() => {
			if (HERC20ContractAddress != '' && ERC721ContractAddress != '' && NFTId != '') {
				return isNFTApproved(ERC721ContractAddress, HERC20ContractAddress, NFTId);
			} else {
				return false;
			}
		},
		{
			onSuccess,
			onError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	return [isApproved || false, isLoading || isFetching];
}

export async function getNFTList(ERC721ContractAddress: string, address: string) {
	const options = {
		chain: chain,
		address: address,
		tokenAddresses: [ERC721ContractAddress]
	};

	// @ts-ignore
	const userNFTs = await Moralis.EvmApi.nft.getWalletNFTs(options);
	const results = userNFTs?.result?.map((userNFT: any) => {
		const result: NFT = {
			id: `${userNFT.name}-${userNFT.tokenId}`, //id will be name-tokenId
			name: userNFT.name ?? '',
			symbol: userNFT.symbol,
			image: getImageUrlFromMetaData(JSON.stringify(userNFT.metadata) || ''),
			tokenId: userNFT.tokenId.toString() ?? '',
			contractAddress: userNFT.tokenAddress.format('lowercase')
		};
		return result;
	});
	console.log(results);
	return results || [];
}

export function useFetchNFTByUserByCollection(
	user: TCurrentUser | null,
	ERC721ContractAddress: string
): [Array<NFT>, boolean] {
	const onSuccess = (data: NFT[]) => {
		return data;
	};
	const onError = () => {
		return [] as NFT[];
	};
	const walletPublicKey: string = user?.address || '';
	const {
		data: NFTs,
		isLoading,
		isFetching
	} = useQuery(
		queryKeys.listUserNFTs(walletPublicKey, ERC721ContractAddress),
		() => {
			if (walletPublicKey != '') {
				return getNFTList(ERC721ContractAddress, walletPublicKey);
			} else {
				return [] as Array<NFT>;
			}
		},
		{
			onSuccess,
			onError,
			retry: false,
			staleTime: defaultCacheStaleTime
		}
	);
	return [NFTs || [], isLoading || isFetching];
}
