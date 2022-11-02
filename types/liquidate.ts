export type LiquidateTableRow = {
  key: string;
  name: string;
  icon: string;
  erc20Icon: string;
  risk: number;
  liqThreshold: number;
  totalDebt: number;
  tvl: number;
  positions: Array<LiquidateTablePosition>;
};

export type LiquidateTablePosition = {
  name: string;
  healthLvl: number;
  untilLiquidation: number;
  debt: number;
  estimatedValue: number;
  nftMint: string;
  owner: string;
  obligation: string;
  highestBid: number;
};

export type BiddingPosition = {
  bid: string;
  bidLimit: string;
  bidder: string;
};
