import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import MoralisType from 'moralis';
import { getBorrowFromCoupon } from './useHerc20';
import { useQuery } from "react-query";
import { queryKeys } from "../helpers/queryHelper";
import { defaultCacheStaleTime } from "../constants/constant";
import { getMaxBorrowFromNFT } from "./useHivemind";

export function useGetBorrowAmount(
  HERC20ContractAddress: string,
  NFTId: string,
  unit: Unit
): [string, boolean] {
  const onSuccess = (data: string) => {
    return data
  }
  const onError = (data: string) => {
    return '0'
  }
  const {data: amount, isLoading, isFetching} = useQuery(
    queryKeys.borrowAmount(HERC20ContractAddress, NFTId),
    () => {
      if (NFTId != "") {
        return getBorrowFromCoupon(HERC20ContractAddress, NFTId, unit)
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
