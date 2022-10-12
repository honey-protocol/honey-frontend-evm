export const queryKeys = {
  // statistic for each farm
  asset: (HERC20ContractAddress: string) => ['asset', HERC20ContractAddress] as const,
  nftPriceInUSD: (HERC20ContractAddress: string) => ['nft', 'price', HERC20ContractAddress] as const,
  underlyingPriceInUSD: (HERC20ContractAddress: string) => ['underlying', 'price', HERC20ContractAddress] as const,
  maxBorrow: (HERC20ContractAddress: string) => ['nft', 'maxBorrow', HERC20ContractAddress] as const,
  maxBorrowFromNFT: (HERC20ContractAddress: string, ERC721ContractAddress: string, userAddress: string, NFTTokenId: string) => ['nft', 'maxBorrow', HERC20ContractAddress, ERC721ContractAddress, userAddress, NFTTokenId] as const,
  borrowAmount: (HERC20ContractAddress: string, NFTTokenId: string) => ['nft', 'borrow', HERC20ContractAddress, NFTTokenId] as const,
  // NFT section
  listUserNFTs: (walletPublicKey: string, ERC721ContractAddress: string) => ['nft', 'list', walletPublicKey, ERC721ContractAddress] as const,
  listUserCoupons: (HERC20ContractAddress: string, walletPublicKey: string) => ['coupons', 'list', HERC20ContractAddress, walletPublicKey] as const,
  NFTDetail: (ERC721ContractAddress: string, NFTId: string) => ['nft', 'detail', ERC721ContractAddress, NFTId] as const,
  NFTApproval: (ERC721ContractAddress: string, HERC20ContractAddress: string, NFTId: string) => ['nft', 'approval', ERC721ContractAddress, HERC20ContractAddress, NFTId] as const,
  // statistic for user asset
  userTotalBorrow: (walletPublicKey: string, HERC20ContractAddress: string) => ['user', 'totalBorrow', walletPublicKey, HERC20ContractAddress] as const,
  userTotalSupply: (walletPublicKey: string, HERC20ContractAddress: string) => ['user', 'totalSupply', walletPublicKey, HERC20ContractAddress] as const,
  userTotalPosition: (walletPublicKey: string, HERC20ContractAddress: string) => ['user', 'totalPosition', walletPublicKey, HERC20ContractAddress] as const,
  // user asset
  userBalance: (walletPublicKey: string, ERC20ContractAddress: string) => ['user', 'erc20', walletPublicKey, ERC20ContractAddress] as const,
  // liquidator related
  listCollateral: (HERC20ContractAddress: string) => ['collateral', 'list', HERC20ContractAddress] as const,
}