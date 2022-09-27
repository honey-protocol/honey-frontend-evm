import MoralisType from "moralis";
import {
  getBorrowBalance,
  getUserCoupons
} from "./useHerc20";
import { getAssets, getSupplyBalance, getUnderlyingPriceInUSD } from "./useHtokenHelper";
import { useQuery, useQueries } from "react-query";
import { queryKeys } from "../helpers/queryHelper";
import { defaultCacheStaleTime } from "../constants/constant";

const defaultUserCollectionStatistic: userCollectionStatistic = {
  collectionName: "",
  erc20Name: "",
  userAddress: "",
  borrow: 0,
  available: 0,
  position: 0,
}

export function useViewUserBalances(user: MoralisType.User | null, collections: collection[]): [number, number, number] {
  const walletPublicKey: string = user?.get("ethAddress") || ""
  const borrowBalancesQueries = useQueries(
    collections.map(collection => {
      return {
        queryKey: queryKeys.userTotalBorrow(walletPublicKey, collection.HERC20ContractAddress),
        queryFn: async () => {
          try {
            const borrowBalance = await getBorrowBalance(collection.HERC20ContractAddress, walletPublicKey, collection.unit)
            const priceInUSD = await getUnderlyingPriceInUSD(collection.htokenHelperContractAddress, collection.HERC20ContractAddress, collection.unit)
            return Number(borrowBalance || '0') * Number(priceInUSD || 0)
          } catch (e) {
            console.error(`Error fetching user borrow balance for ${collection.HERC20ContractAddress}`)
            return 0
          }
        },
        staleTime: defaultCacheStaleTime,
        retry: false,
        enabled: walletPublicKey != "",
      }
    })
  )
  const sumOfBorrowBalance = borrowBalancesQueries.reduce(
    (total, current) => total + (current.data || 0), 0
  )
  const supplyBalancesQueries = useQueries(
    collections.map(collection => {
      return {
        queryKey: queryKeys.userTotalSupply(walletPublicKey, collection.HERC20ContractAddress),
        queryFn: async () => {
          try {
            const supplyBalance = await getSupplyBalance(collection.htokenHelperContractAddress, collection.HERC20ContractAddress, walletPublicKey, collection.unit)
            const priceInUSD = await getUnderlyingPriceInUSD(collection.htokenHelperContractAddress, collection.HERC20ContractAddress, collection.unit)
            return Number(supplyBalance || '0') * Number(priceInUSD || 0)
          } catch (e) {
            console.error(`Error fetching user supply balance for ${collection.HERC20ContractAddress}`)
            return 0
          }
        },
        staleTime: defaultCacheStaleTime,
        retry: false,
        enabled: walletPublicKey != "",
      }
    })
  )
  const sumOfSupplyBalance = supplyBalancesQueries.reduce(
    (total, current) => total + (current.data || 0), 0
  )

  const couponsQueries = useQueries(
    collections.map(collection => {
      return {
        queryKey: queryKeys.userTotalPosition(walletPublicKey, collection.HERC20ContractAddress),
        queryFn: async () => {
          try {
            const coupons = await getUserCoupons({
              HERC20ContractAddress: collection.HERC20ContractAddress,
              userAddress: walletPublicKey,
              unit: collection.unit
            })
            return coupons
          } catch (e) {
            console.error(`Error fetching user supply balance for ${collection.HERC20ContractAddress}`)
            return [] as Array<coupon>
          }
        },
        staleTime: defaultCacheStaleTime,
        retry: false,
        enabled: walletPublicKey != "",
      }
    })
  )
  const totalCoupons = couponsQueries.reduce(
    (total, current) => total + (current.data ? current.data.length : 0), 0
  )
  return [sumOfBorrowBalance, sumOfSupplyBalance, totalCoupons]

}

export function useViewCollectionUserBalances(user: MoralisType.User | null, collections: collection[]): userCollectionStatistic[] {
  const walletPublicKey: string = user?.get("ethAddress") || ""

  const results = useQueries(
    collections.map(collection => {
      return {
        queryKey: queryKeys.asset(collection.HERC20ContractAddress),
        queryFn: async () => {
          try {
            const asset = await getAssets(collection.htokenHelperContractAddress, collection.HERC20ContractAddress, collection.unit)
            const priceInUSD = await getUnderlyingPriceInUSD(collection.htokenHelperContractAddress, collection.HERC20ContractAddress, collection.unit)
            const statistic: userCollectionStatistic = {
              collectionName: collection.name,
              erc20Name: collection.erc20Name,
              userAddress: walletPublicKey,
              borrow: parseFloat(asset.totalBorrow) * parseFloat(priceInUSD),
              available: (parseFloat(asset.totalReserve) + parseFloat(asset.totalDeposit) - parseFloat(asset.totalBorrow)) * parseFloat(priceInUSD),
              position: asset.numOfCoupons
            }
            return statistic
          } catch (e) {
            console.error(`Error fetching user collection balance for ${collection.HERC20ContractAddress}`)
            return defaultUserCollectionStatistic
          }
        },
        staleTime: defaultCacheStaleTime,
        retry: false
      }
    })
  )
  const collectionUsersBalances = results.map(result => result.data || defaultUserCollectionStatistic)
  return collectionUsersBalances
}