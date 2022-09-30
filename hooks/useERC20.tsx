import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Moralis  from "moralis-v1";
import { fromWei} from "web3-utils";
import { basePath, chain, confirmedBlocks } from "../constants/service";
import MoralisType from "moralis-v1";
import { safeToWei } from "../helpers/repayHelper";
import { useQuery } from "react-query";
import { queryKeys } from "../helpers/queryHelper";
import { defaultCacheStaleTime } from "../constants/constant";

export async function getDepositUnderlyingApproval(ERC20ContractAddress: string, HERC20ContractAddress: string, amount: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/ERC20.json`)).json()
  const options = {
    chain: chain,
    contractAddress: ERC20ContractAddress,
    functionName: "approve",
    abi: ABI,
    params: {spender: HERC20ContractAddress, amount: safeToWei(amount, unit)},
  }
  const transaction = await Moralis.executeFunction(options)
  console.log(`transaction hash: ${transaction.hash}`);

  // @ts-ignore
  const receipt = await transaction.wait(confirmedBlocks);
  console.log(receipt)

}

export async function getRepayLoanApproval(ERC20ContractAddress: string, HERC20ContractAddress: string, amount: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/ERC20.json`)).json()
  const options = {
    chain: chain,
    contractAddress: ERC20ContractAddress,
    functionName: "approve",
    abi: ABI,
    params: {spender: HERC20ContractAddress, amount: safeToWei(amount, unit)},
  }
  const transaction = await Moralis.executeFunction(options)
  console.log(`transaction hash: ${transaction.hash}`);

  // @ts-ignore
  const receipt = await transaction.wait(confirmedBlocks);
  console.log(receipt)

}

export async function getAllowance(ERC20ContractAddress: string, HERC20ContractAddress: string, userAddress: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/ERC20.json`)).json()
  const options = {
    chain: chain,
    address: ERC20ContractAddress,
    function_name: "allowance",
    abi: ABI,
    params: {spender: HERC20ContractAddress, owner: userAddress},
  }

  // @ts-ignore
  const result = await Moralis.Web3API.native.runContractFunction(options)
  return fromWei(result, unit)
}

export function useGetAllowance(ERC20ContractAddress: string, HERC20ContractAddress: string, user: MoralisType.User | null, unit: Unit): [string, boolean, Dispatch<SetStateAction<{}>>] {
  const [amount, setAmount] = useState("0");
  const [isLoading, setLoading] = useState(true);
  const [shouldRefetchAmount, refetchAmount] = useState({});
  useEffect(() => {
      let didCancel = false
      const fetchAllowance = async () => {
        setLoading(true)
        if (!didCancel) {
          const walletPublicKey: string = user?.get("ethAddress") || ""
          if (walletPublicKey != "" && HERC20ContractAddress != "" && ERC20ContractAddress != "") {
            const allowance = await getAllowance(ERC20ContractAddress, HERC20ContractAddress, walletPublicKey, unit)
            setAmount(allowance)
          } else {
            setAmount("")
          }
        }
      }

      fetchAllowance()
        .catch((err) => {
          console.error(`Error calling fetch allowance: ${err}`)
          setAmount("")
        })
        .finally(() => {
          setLoading(false)
        })

      return () => {
        didCancel = true
      }
    }, [user, HERC20ContractAddress, ERC20ContractAddress, shouldRefetchAmount]
  )
  return [amount, isLoading, refetchAmount]
}

export async function getUserBalance(ERC20ContractAddress: string, userAddress: string, unit: Unit) {
  const ABI = await (await fetch(`${basePath}/abi/ERC20.json`)).json()
  const options = {
    chain: chain,
    address: ERC20ContractAddress,
    function_name: "balanceOf",
    abi: ABI,
    params: {account: userAddress},
  }

  // @ts-ignore
  const result = await Moralis.Web3API.native.runContractFunction(options)
  return fromWei(result, unit)
}

export function useGetUserBalance(ERC20ContractAddress: string, user: MoralisType.User | null, unit: Unit): [string, boolean] {
  const onSuccess = (data: string) => {
    return data
  }
  const onError = (data: string) => {
    return '0'
  }
  const walletPublicKey: string = user?.get("ethAddress") || ""
  const {data: amount, isLoading, isFetching} = useQuery(
    queryKeys.userBalance(walletPublicKey, ERC20ContractAddress),
    () => {
      if (walletPublicKey != "" && ERC20ContractAddress != "") {
        return getUserBalance(ERC20ContractAddress, walletPublicKey, unit)
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
  return [amount || '0', isLoading || isFetching]
}
