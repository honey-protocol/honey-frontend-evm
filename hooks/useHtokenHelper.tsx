import { basePath, chain } from "../constants/service";
import Moralis from "moralis-v1";
import { fromWei, Unit } from "web3-utils";
import MoralisType from "moralis-v1";
import { useQuery } from "react-query";
import { queryKeys } from "../helpers/queryHelper";
import { defaultCacheStaleTime } from "../constants/constant";
import { BN } from "bn.js";

export async function getSupplyBalance(htokenHelperContractAddress: string, HERC20ContractAddress: string, address: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json()
  const options = {
    chain: chain,
    address: htokenHelperContractAddress,
    function_name: "getAvailableUnderlyingForUser",
    abi: ABI,
    params: {_hToken: HERC20ContractAddress, _account: address},
  }

  // @ts-ignore
  const result: any = await Moralis.Web3API.native.runContractFunction(options)
  const supplyBalance = fromWei(result, unit)
  return supplyBalance
}

export async function getAllCollateral(htokenHelperContractAddress: string, HERC20ContractAddress: string, start: string, end: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json()
  const options = {
    chain: chain,
    address: htokenHelperContractAddress,
    function_name: "getAllCollateralPerHToken",
    abi: ABI,
    params: {_hToken: HERC20ContractAddress, _startTokenId: start, _endTokenId: end},
  }

  // @ts-ignore
  const results: Array<any> = await Moralis.Web3API.native.runContractFunction(options)
  const loans = results.map((result) => {
    const [id, active, owner, collateralId, borrowAmount, interestPerToken] = result
    const userLoan: loan = {
      HERC20ContractAddress: HERC20ContractAddress,
      NFTId: collateralId,
      borrowAmount: borrowAmount,
      active: active == 2,
      couponId: id,
      owner: owner
    }
    return userLoan
  })
  return loans.filter((loan) => loan.active && loan.borrowAmount != "0")
}

export function useGetUnderlyingBalance(
  htokenHelperContractAddress: string,
  HERC20ContractAddress: string,
  user: MoralisType.User | null,
  unit: Unit
): [string, boolean] {
  const onSuccess = (data: string) => {
    return data
  }
  const onError = (data: string) => {
    return '0'
  }
  const walletPublicKey: string = user?.get("ethAddress") || ""
  const {data: amount, isLoading, isFetching} = useQuery(
    queryKeys.userTotalSupply(walletPublicKey, HERC20ContractAddress),
    () => {
      if (walletPublicKey != "" && htokenHelperContractAddress != "" && HERC20ContractAddress != "") {
        return getSupplyBalance(htokenHelperContractAddress, HERC20ContractAddress, walletPublicKey, unit)
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


export async function getNFTPriceInUSD(htokenHelperContractAddress: string, HERC20ContractAddress: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json()
  const options = {
    chain: chain,
    address: htokenHelperContractAddress,
    function_name: "getFloorPriceInUSD",
    abi: ABI,
    params: {_hToken: HERC20ContractAddress},
  }

  // @ts-ignore
  const result: any = await Moralis.Web3API.native.runContractFunction(options)
  const nftPrice = fromWei(result, unit)
  return nftPrice
}

export function useGetNFTPriceInUSD(
  htokenHelperContractAddress: string,
  HERC20ContractAddress: string,
  unit: Unit
): [string, boolean] {
  const onSuccess = (data: string) => {
    return data
  }
  const onError = (data: string) => {
    return '0'
  }

  const {data: amount, isLoading, isFetching} = useQuery(
    queryKeys.nftPriceInUSD(HERC20ContractAddress),
    () => getNFTPriceInUSD(htokenHelperContractAddress, HERC20ContractAddress, unit),
    {
      onSuccess,
      onError,
      retry: false,
      staleTime: defaultCacheStaleTime
    }
  )

  return [amount || '0', isLoading || isFetching];
}

export async function getAssets(htokenHelperContractAddress: string, HERC20ContractAddress: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json()
  const options = {
    chain: chain,
    address: htokenHelperContractAddress,
    function_name: "getAssets",
    abi: ABI,
    params: {_hToken: HERC20ContractAddress},
  }

  // @ts-ignore
  const result: any = await Moralis.Web3API.native.runContractFunction(options)
  const totalBorrow = result[0] as string
  const totalReserve = result[1] as string
  const deposit = result[2] as string
  const activeCoupons = result[3] as Array<any>
  const resultAsset: asset = {
    totalBorrow: fromWei(totalBorrow, unit),
    totalReserve: fromWei(totalReserve, unit),
    totalDeposit: fromWei(deposit, unit),
    numOfCoupons: activeCoupons.length
  }
  return resultAsset
}

export async function getUnderlyingPriceInUSD(htokenHelperContractAddress: string, HERC20ContractAddress: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json()
  const options = {
    chain: chain,
    address: htokenHelperContractAddress,
    function_name: "getUnderlyingPriceInUSD",
    abi: ABI,
    params: {_hToken: HERC20ContractAddress},
  }

  // @ts-ignore
  const result: any = await Moralis.Web3API.native.runContractFunction(options)
  const erc20PriceInUSD = fromWei(result, unit)
  return erc20PriceInUSD
}

export async function getMaxBorrowableAmount(htokenHelperContractAddress: string, HERC20ContractAddress: string, hivemindContractAddress: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/htokenHelper.json`)).json()
  const options = {
    chain: chain,
    address: htokenHelperContractAddress,
    function_name: "getMaxBorrowableAmount",
    abi: ABI,
    params: {_hToken: HERC20ContractAddress, _hivemind: hivemindContractAddress},
  }

  // @ts-ignore
  const result: any = await Moralis.Web3API.native.runContractFunction(options)
  const maxBorrowableAmount = fromWei(result, unit)
  return maxBorrowableAmount
}

export function useGetMaxBorrowableAmount(
  htokenHelperContractAddress: string,
  HERC20ContractAddress: string,
  hivemindContractAddress: string,
  unit: Unit
): [string, boolean] {
  const onSuccess = (data: string) => {
    return data
  }
  const onError = (data: string) => {
    return '0'
  }

  const {data: amount, isLoading, isFetching} = useQuery(
    queryKeys.maxBorrow(HERC20ContractAddress),
    () => {
      return getMaxBorrowableAmount(htokenHelperContractAddress, HERC20ContractAddress, hivemindContractAddress, unit)
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

export function useGetNFTPrice(
  htokenHelperContractAddress: string,
  HERC20ContractAddress: string,
  unit: Unit
): [number, boolean] {
  const onGetUnderlyingPriceSuccess = (data: string) => {
    return data
  }
  const onGetUnderlyingPriceError = (data: string) => {
    return '0'
  }

  const {
    data: underlyingPriceInUSD,
    isLoading: isLoadingGetUnderlyingPrice,
    isFetching: isFetchingGetUnderlyingPrice
  } = useQuery(
    queryKeys.underlyingPriceInUSD(HERC20ContractAddress),
    () => {
      if (htokenHelperContractAddress != "" && HERC20ContractAddress != "") {
        return getUnderlyingPriceInUSD(htokenHelperContractAddress, HERC20ContractAddress, unit)
      } else {
        return ""
      }
    },
    {
      onSuccess: onGetUnderlyingPriceSuccess,
      onError: onGetUnderlyingPriceError,
      retry: false,
      staleTime: defaultCacheStaleTime
    }
  )

  const onGetNFTPriceSuccess = (data: string) => {
    return data
  }
  const onGetNFTPriceError = (data: string) => {
    return '0'
  }

  const {data: nftPriceInUSD, isLoading: isLoadingGetNFTPrice, isFetching: isFetchingNFTPrice} = useQuery(
    queryKeys.nftPriceInUSD(HERC20ContractAddress),
    () => {
      if (htokenHelperContractAddress != "" && HERC20ContractAddress != "") {
        return getNFTPriceInUSD(htokenHelperContractAddress, HERC20ContractAddress, unit)
      } else {
        return "0"

      }
    },
    {
      onSuccess: onGetNFTPriceSuccess,
      onError: onGetNFTPriceError,
      retry: false,
      staleTime: defaultCacheStaleTime
    }
  )
  if ((nftPriceInUSD || '0') != '0' && (underlyingPriceInUSD || '0') != '0') {
    const underlyingPrice = parseFloat(underlyingPriceInUSD || '0')
    const nftPrice = parseFloat(nftPriceInUSD || '0')
    const result = nftPrice / underlyingPrice
    return [result, isLoadingGetUnderlyingPrice || isFetchingGetUnderlyingPrice || isLoadingGetNFTPrice || isFetchingNFTPrice];
  } else {
    const result = 0
    return [result, isLoadingGetUnderlyingPrice || isFetchingGetUnderlyingPrice || isLoadingGetNFTPrice || isFetchingNFTPrice];
  }
}