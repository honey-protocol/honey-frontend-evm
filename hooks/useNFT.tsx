import { useState, useEffect, useRef, MutableRefObject, SetStateAction, Dispatch } from 'react';

import MoralisType from "moralis";
import Moralis from "moralis";
import { chain } from "../constants/service";
import { getImageUrlFromMetaData } from "../helpers/NFThelper";
import { getNFTApproved } from "./useERC721";
import { useQueries, useQuery } from "react-query";
import { queryKeys } from "../helpers/queryHelper";
import { defaultCacheStaleTime } from "../constants/constant";
import { getSupplyBalance } from "./useHtokenHelper";


const defaultNFT: NFT = {
  id: "",
  name: "",
  image: "",
  tokenId: "",
  contractAddress: "",
}


export async function getMetaDataFromNFTId(ERC721ContractAddress: string, NFTId: string) {
  const options = {
    chain: chain,
    address: ERC721ContractAddress,
    token_id: NFTId
  }

  // @ts-ignore
  const result = await Moralis.Web3API.token.getTokenIdMetadata(options)
  return result
}

export function useFetchNFTByUserCoupons(coupons: coupon[], ERC721ContractAddress: string): [Array<NFT>, boolean] {
  const results = useQueries(
    coupons.map(coupon => {
      return {
        queryKey: queryKeys.NFTDetail(ERC721ContractAddress, coupon.NFTId),
        queryFn: async () => {
          try {
            const metaData = await getMetaDataFromNFTId(ERC721ContractAddress, coupon.NFTId)
            const result: NFT = {
              id: `${metaData.name}-${metaData.token_id}`, //id will be name-tokenId
              name: metaData.name,
              symbol: metaData.symbol,
              image: getImageUrlFromMetaData(metaData.metadata || ""),
              tokenId: metaData.token_id,
              contractAddress: ERC721ContractAddress
            }
            return result
          } catch (e) {
            console.error("Error fetching individual NFT with error")
            console.error(e)
            return defaultNFT
          }
        },
        staleTime: defaultCacheStaleTime,
        retry: false,
        enabled: coupons.length > 0
      }
    })
  )
  const isLoading = results.some(query => query.isLoading)
  const isFetching = results.some(query => query.isFetching)
  const NFTs = results.map(result => result.data || defaultNFT)
  return [NFTs, isLoading || isFetching]
}

export function useIsNFTApproved(ERC721ContractAddress: string, HERC20ContractAddress: string, NFTId: string): [boolean, boolean] {
  const onSuccess = (data: boolean) => {
    return data
  }
  const onError = (data: boolean) => {
    return false
  }
  const isNFTApproved = async (ERC721ContractAddress: string, HERC20ContractAddress: string, NFTId: string) => {
    const approvalAddress = await getNFTApproved(ERC721ContractAddress, NFTId)
    return approvalAddress == HERC20ContractAddress
  }
  const {data: isApproved, isLoading, isFetching} = useQuery(
    queryKeys.NFTApproval(ERC721ContractAddress, HERC20ContractAddress, NFTId),
    () => {
      if (HERC20ContractAddress != "" && ERC721ContractAddress != "" && NFTId != "") {
        return isNFTApproved(ERC721ContractAddress, HERC20ContractAddress, NFTId)
      } else {
        return false
      }
    },
    {
      onSuccess,
      onError,
      retry: false,
      staleTime: defaultCacheStaleTime
    }
  )
  return [isApproved || false, isLoading || isFetching]
}

export async function getNFTList(ERC721ContractAddress: string, address: string) {
  const options = {
    chain: chain,
    address: address,
    token_address: ERC721ContractAddress,
  }

  // @ts-ignore
  const userNFTs = await Moralis.Web3API.account.getNFTsForContract(options);
  const results = userNFTs?.result?.map(userNFT => {
      const result: NFT = {
        id: `${userNFT.name}-${userNFT.token_id}`, //id will be name-tokenId
        name: userNFT.name,
        symbol: userNFT.symbol,
        image: getImageUrlFromMetaData(userNFT.metadata || ""),
        tokenId: userNFT.token_id,
        contractAddress: userNFT.token_address,
      }
      return result
    }
  )
  console.log(results)
  return results || []

}

export function useFetchNFTByUserByCollection(user: MoralisType.User | null, ERC721ContractAddress: string): [Array<NFT>, boolean] {
  const onSuccess = (data: NFT[]) => {
    return data
  }
  const onError = () => {
    return [] as NFT[]
  }
  const walletPublicKey: string = user?.get("ethAddress") || ""
  const {data: NFTs, isLoading, isFetching} = useQuery(
    queryKeys.listUserNFTs(walletPublicKey, ERC721ContractAddress),
    () => {
      if (walletPublicKey != "") {
        return getNFTList(ERC721ContractAddress, walletPublicKey)
      } else {
        return [] as Array<NFT>
      }
    }
    ,
    {
      onSuccess,
      onError,
      retry: false,
      staleTime: defaultCacheStaleTime
    }
  )
  return [NFTs || [], isLoading || isFetching];
}

