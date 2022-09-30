import { basePath, chain } from "../constants/service";
import Moralis from "moralis-v1";
import { fromWei } from "web3-utils";
import MoralisType from "moralis-v1";
import { useQuery } from "react-query";
import { queryKeys } from "../helpers/queryHelper";
import { defaultCacheStaleTime } from "../constants/constant";

export async function getMaxBorrowFromNFT(hivemindContractAddress: string, HERC20ContractAddress: string, ERC721ContractAddress: string, userAddress: string, NFTTokenId: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/hivemind.json`)).json()
  const options = {
    chain: chain,
    address: hivemindContractAddress,
    function_name: "getHypotheticalAccountLiquidity",
    abi: ABI,
    params: {
      _account: userAddress,
      _hToken: HERC20ContractAddress,
      _collection: ERC721ContractAddress,
      _collateralId: NFTTokenId,
      _redeemTokens: '0',
      _borrowAmount: '0'
    },
  }
  // @ts-ignore
  const result: any = await Moralis.Web3API.native.runContractFunction(options)
  return fromWei(result["liquidity"], unit)
}

export function useGetMaxBorrowAmountFromNFT(hivemindContractAddress: string, HERC20ContractAddress: string, ERC721ContractAddress: string, user: MoralisType.User | null, NFTId: string, unit: Unit): [string, boolean] {
  const onSuccess = (data: string) => {
    return data
  }
  const onError = (data: string) => {
    return '0'
  }
  const walletPublicKey: string = user?.get("ethAddress") || ""
  const {data: amount, isLoading, isFetching} = useQuery(
    queryKeys.maxBorrowFromNFT(HERC20ContractAddress, ERC721ContractAddress, walletPublicKey, NFTId),
    () => {
      if (NFTId! = "" && walletPublicKey != "") {
        return getMaxBorrowFromNFT(hivemindContractAddress, HERC20ContractAddress, ERC721ContractAddress, walletPublicKey, NFTId, unit)
      } else {
        return '0'
      }
    },
    {
      onSuccess,
      onError,
      retry: false,
      staleTime: defaultCacheStaleTime
    }
  )
  return [amount || '0', isLoading || isFetching];
}