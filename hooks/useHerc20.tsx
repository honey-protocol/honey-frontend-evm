import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Moralis from "moralis-v1";
import { fromWei, Unit } from "web3-utils";
import { basePath, chain, confirmedBlocks } from "../constants/service";
import MoralisType from "moralis-v1";
import { safeToWei } from "../helpers/repayHelper";
import { useQuery } from "react-query";
import { queryKeys } from "../helpers/queryHelper";
import { defaultCacheStaleTime } from "../constants/constant";

export async function depositNFTCollateral(HERC20ContractAddress: string, NFTTokenId: string) {
  const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json()
  const options = {
    chain: chain,
    contractAddress: HERC20ContractAddress,
    functionName: "depositCollateral",
    abi: ABI,
    params: {_collateralId: NFTTokenId},
  }
  const transaction = await Moralis.executeFunction(options)
  console.log(`transaction hash: ${transaction.hash}`);

  // @ts-ignore
  const receipt = await transaction.wait(confirmedBlocks);
  console.log(receipt)

}

export interface borrowVariables {
  HERC20ContractAddress: string
  NFTTokenId: string
  amount: string
  unit: Unit
}

export const borrow = async ({
                               HERC20ContractAddress: HERC20ContractAddress,
                               NFTTokenId: NFTTokenId,
                               amount: amount,
                               unit: unit
                             }: borrowVariables) => {
  const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json()
  const options = {
    chain: chain,
    contractAddress: HERC20ContractAddress,
    functionName: "borrow",
    abi: ABI,
    params: {_borrowAmount: safeToWei(amount, unit), _collateralId: NFTTokenId},
  }
  const transaction = await Moralis.executeFunction(options)
  console.log(`transaction hash: ${transaction.hash}`);

  // @ts-ignore
  const receipt = await transaction.wait(confirmedBlocks);
  console.log(receipt)

}

export interface depositVariables {
  HERC20ContractAddress: string
  amount: string
  unit: Unit
}

export async function depositUnderlying({
                                          HERC20ContractAddress: HERC20ContractAddress,
                                          amount: amount,
                                          unit: unit
                                        }: depositVariables) {
  const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json()
  const options = {
    chain: chain,
    contractAddress: HERC20ContractAddress,
    functionName: "depositUnderlying",
    abi: ABI,
    params: {_amount: safeToWei(amount, unit)},
  }
  const transaction = await Moralis.executeFunction(options)
  console.log(`transaction hash: ${transaction.hash}`);

  // @ts-ignore
  const receipt = await transaction.wait(confirmedBlocks);
  console.log(receipt)

}

export async function redeemUnderlying(HERC20ContractAddress: string, amount: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json()
  const options = {
    chain: chain,
    contractAddress: HERC20ContractAddress,
    functionName: "redeem",
    abi: ABI,
    params: {_amount: safeToWei(amount, unit)},
  }
  const transaction = await Moralis.executeFunction(options)
  console.log(`transaction hash: ${transaction.hash}`);

  // @ts-ignore
  const receipt = await transaction.wait(confirmedBlocks);
  console.log(receipt)

}

export interface getUserCouponsVariables {
  HERC20ContractAddress: string
  userAddress: string
  unit: Unit
}

export const getUserCoupons = async ({HERC20ContractAddress, userAddress, unit}: getUserCouponsVariables) => {
  const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json()
  const options = {
    chain: chain,
    address: HERC20ContractAddress,
    function_name: "getUserCoupons",
    abi: ABI,
    params: {_user: userAddress},
  }
  // @ts-ignore
  const results: Array<any> = await Moralis.Web3API.native.runContractFunction(options)
  const coupons = results.map((result) => {
    const [id, active, owner, collateralId, borrowAmount, index] = result
    const userCoupon: coupon = {
      NFTId: collateralId,
      borrowAmount: fromWei(borrowAmount, unit),
      active: active == 2,
      index: index,
      couponId: id
    }
    return userCoupon
  })
  return coupons.filter((coupon) => coupon.active)

}

export function useGetUserCoupons(HERC20ContractAddress: string, user: MoralisType.User | null, unit: Unit): [Array<coupon>, boolean] {
  const onSuccess = (data: coupon[]) => {
    return data
  }
  const onError = () => {
    return [] as coupon[]
  }
  const walletPublicKey: string = user?.get("ethAddress") || ""
  const {data: coupons, isLoading, isFetching} = useQuery(
    queryKeys.listUserCoupons(HERC20ContractAddress, walletPublicKey),
    () => {
      if (walletPublicKey != "") {
        return getUserCoupons({HERC20ContractAddress, userAddress: walletPublicKey, unit})
      } else {
        return [] as Array<coupon>
      }
    },
    {
      onSuccess,
      onError,
      retry: false,
      staleTime: defaultCacheStaleTime
    }
  )
  return [coupons || [], isLoading || isFetching];
}

export async function getBorrowFromCoupon(HERC20ContractAddress: string, NFTTokenId: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json()
  const options = {
    chain: chain,
    address: HERC20ContractAddress,
    function_name: "getBorrowAmountForCollateral",
    abi: ABI,
    params: {_collateralId: NFTTokenId},
  }

  // @ts-ignore
  const result = await Moralis.Web3API.native.runContractFunction(options)
  return fromWei(result, unit)

}

export async function repayBorrow(HERC20ContractAddress: string, NFTTokenId: string, amount: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json()
  const options = {
    chain: chain,
    contractAddress: HERC20ContractAddress,
    functionName: "repayBorrow",
    abi: ABI,
    params: {_repayAmount: safeToWei(amount, unit), _collateralId: NFTTokenId},
  }
  const transaction = await Moralis.executeFunction(options)
  console.log(`transaction hash: ${transaction.hash}`);

  // @ts-ignore
  const receipt = await transaction.wait(confirmedBlocks);
  console.log(receipt)

}

export interface withdrawCollateralVariables {
  HERC20ContractAddress: string
  NFTTokenId: string
}

export async function withdrawCollateral({HERC20ContractAddress, NFTTokenId}: withdrawCollateralVariables) {
  const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json()
  const options = {
    chain: chain,
    contractAddress: HERC20ContractAddress,
    functionName: "withdrawCollateral",
    abi: ABI,
    params: {_collateralId: NFTTokenId},
  }
  const transaction = await Moralis.executeFunction(options)
  console.log(`transaction hash: ${transaction.hash}`);

  // @ts-ignore
  const receipt = await transaction.wait(confirmedBlocks);
  console.log(receipt)

}

export async function getBorrowBalance(HERC20ContractAddress: string, address: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json()
  const options = {
    chain: chain,
    address: HERC20ContractAddress,
    function_name: "getAccountSnapshot",
    abi: ABI,
    params: {_account: address},
  }

  // @ts-ignore
  const result: any = await Moralis.Web3API.native.runContractFunction(options)
  const borrowBalance = fromWei(result[1], unit)
  return borrowBalance
}

export async function getTotalBorrow(HERC20ContractAddress: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json()
  const options = {
    chain: chain,
    address: HERC20ContractAddress,
    function_name: "totalBorrows",
    abi: ABI,
    params: {},
  }

  // @ts-ignore
  const result: any = await Moralis.Web3API.native.runContractFunction(options)
  return fromWei(result, unit)
}

export function useGetTotalBorrow(
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
    queryKeys.totalBorrow(HERC20ContractAddress),
    () => {
      if (HERC20ContractAddress != "") {
        return getTotalBorrow(HERC20ContractAddress, unit)
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

export async function getTotalReserves(HERC20ContractAddress: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json()
  const options = {
    chain: chain,
    address: HERC20ContractAddress,
    function_name: "totalReserves",
    abi: ABI,
    params: {},
  }

  // @ts-ignore
  const result = await Moralis.Web3API.native.runContractFunction(options)
  const totalReserve = fromWei(result, unit)
  return totalReserve
}

export async function getActiveCoupons(HERC20ContractAddress: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/herc20.json`)).json()
  const options = {
    chain: chain,
    address: HERC20ContractAddress,
    function_name: "getActiveCoupons",
    abi: ABI,
    params: {},
  }
  // @ts-ignore
  const results: Array<any> = await Moralis.Web3API.native.runContractFunction(options)
  const coupons = results.map((result) => {
    const [id, active, collateralId, borrowAmount, index, owner] = result
    const userCoupon: coupon = {
      NFTId: collateralId,
      borrowAmount: fromWei(borrowAmount, unit),
      active: active == 2,
      index: index,
      couponId: id
    }
    return userCoupon
  })
  return coupons

}