import MoralisType from 'moralis-v1';
import { useQuery } from "react-query";
import { queryKeys } from "../helpers/queryHelper";
import { blackHole, defaultCacheStaleTime } from "../constants/constant";
import { fromWei, Unit } from "web3-utils";
import { basePath, chain } from "../constants/service";
import Moralis from "moralis-v1";
import { Bid } from "../types/liquidate";
import { getTotalBorrow } from "./useHerc20";

export interface CollectionBids {
  highestBidder: string
  highestBid: string
  bids: Array<Bid>
}

export async function getCollectionBids(marketContractAddress: string, HERC20ContractAddress: string, unit: Unit): Promise<CollectionBids> {
  const ABI = await (await fetch(`${basePath}/abi/marketPlace.json`)).json()
  const options = {
    chain: chain,
    address: marketContractAddress,
    function_name: "getAllBidsForACollection",
    abi: ABI,
    params: {_hToken: HERC20ContractAddress},
  }

  // @ts-ignore
  const result: Array = await Moralis.Web3API.native.runContractFunction(options)
  const highestBidder: string = result[1]
  const highestBid = fromWei(result[2] as string, unit)
  const bidders: Array<string> = result[3]
  const bids: Array<string> = result[4]
  const unlockTime: Array<number> = result[5]
  const bidResult = bidders.map(function (bidder: any, i: number) {
    const bid: Bid = {
      bid: fromWei(bids[i], unit),
      bidder: bidder,
      unlockTimeStamp: unlockTime[i]
    }
    return bid
  })
  const filteredBidResult = bidResult.filter(bid => bid.bidder != blackHole)
  const collectionBids: CollectionBids = {
    highestBidder: (highestBidder == blackHole) ? "" : highestBidder,
    highestBid: (highestBidder == blackHole) ? "" : highestBid,
    bids: filteredBidResult
  }
  return collectionBids
}

export function useGetCollectionBids(
  marketContractAddress: string,
  HERC20ContractAddress: string,
  unit: Unit
): [CollectionBids, boolean] {
  const defaultCollectionBids: CollectionBids = {
    highestBidder: "",
    highestBid: "0",
    bids: []
  }
  const onSuccess = (data: CollectionBids) => {
    return data
  }
  const onError = () => {

    return defaultCollectionBids
  }
  const {data: collectionBids, isLoading, isFetching} = useQuery(
    queryKeys.listCollectionBids(marketContractAddress, HERC20ContractAddress),
    () => {
      if (HERC20ContractAddress != "" && marketContractAddress != "") {
        return getCollectionBids(marketContractAddress, HERC20ContractAddress, unit)
      } else {
        return defaultCollectionBids
      }
    },
    {
      onSuccess,
      onError,
      retry: false,
      staleTime: defaultCacheStaleTime
    }
  )
  return [collectionBids || defaultCollectionBids, isLoading || isFetching];
}