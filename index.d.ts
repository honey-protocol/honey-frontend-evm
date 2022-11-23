declare module '*.png';
declare module '*.svg';

//tokenAcc is same as pubkey,
type NFT = {
	id: string; //id will be name-tokenId
	name: string;
	symbol?: string;
	image: string;
	tokenId: string;
	contractAddress: string;
};

type collateral = {
	id: string; //id will be name-tokenId
	name: string;
	symbol?: string;
	image: string; // we will use default image here
	couponId: string;
	tokenId: string;
	ERC721ContractAddress: string;
	ERC20ContractAddress: string;
	HERC20ContractAddress: string;
	loanAmount: number;
};

type coupon = {
	NFTId: string;
	borrowAmount: string;
	active: boolean;
	debtShares: string;
	couponId: string;
};

type Unit = import('web3-utils').Unit;

type collection = {
	name: string;
	icon: string;
	erc20Name: string;
	erc20Icon: string;
	unit: Unit;
	ERC721ContractAddress: string;
	ERC20ContractAddress: string;
	HERC20ContractAddress: string;
};

type helperContract = {
	htokenHelperContractAddress: string;
	hivemindContractAddress: string;
	oracleContractAddress: string;
	marketContractAddress: string;
};

type userCollectionStatistic = {
	collectionName: string;
	erc20Name: string;
	userAddress: string;
	borrow: number;
	available: number;
	position: number;
};

type asset = {
	totalBorrow: string;
	totalReserve: string;
	totalDeposit: string;
	numOfCoupons: number;
};

type loan = {
	HERC20ContractAddress: string;
	NFTId: string;
	borrowAmount: string;
	active: boolean;
	couponId: string;
	owner: string;
};
