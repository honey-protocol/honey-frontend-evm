export type LiquidateTableRow = {
  key: string;
  name: string;
  icon: string;
  erc20Icon: string;
  risk: number;
  liqThreshold: number;
  totalDebt: number;
  tvl: number;
};

export type LiquidateTablePosition = {
  name: string;
  tokenId: string;
  couponId: string;
  image: string;
  healthLvl: number;
  untilLiquidation: number;
  debt: number;
  estimatedValue: number;
};

export type Bid = {
  bid: string;
  bidder: string;
  unlockTimeStamp: number;
}

export type BiddingPosition = {
  bid: string;
  bidLimit: string;
  bidder: string;
};
