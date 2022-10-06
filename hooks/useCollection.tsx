import MoralisType from "moralis-v1";
import { MarketTablePosition, MarketTableRow } from "../types/markets";

export function useMarket(user: MoralisType.User | null, collections: collection[]): MarketTableRow[] {
  const result = collections.map(collection => {
      const market: MarketTableRow = {
        key: collection.HERC20ContractAddress,
        name: `${collection.name}/${collection.erc20Name}`,
        icon: collection.icon,
        erc20Icon: collection.erc20Icon,
        rate: 0.1,
        debt: 0,
        allowance: 0,
        available: 0,
        value: 0,
        positions: [
          {
            name: "cat"
          },
          {
            name: "dog"
          }
        ],
      }
      return market
    }
  )
  return result
}