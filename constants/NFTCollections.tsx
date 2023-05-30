import { envName } from './service';

function getCollections() {
	if (envName == 'dev') {
		return [
			{
				name: 'Pancake Squad',
				icon: '/nfts/pancakeSquad.png',
				erc20Name: 'WBNB',
				erc20Icon: '/erc20/BNBCoin.png',
				formatDecimals: 2,
				unit: 'ether',
				ERC721ContractAddress: '0x0a8901b0E25DEb55A87524f0cC164E9644020EBA',
				ERC20ContractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
				HERC20ContractAddress: '0x6a3ebf00bc0ff2ed527879559f69f8c907853678'
			}
		] as collection[];
	} else {
		return [
			{
				name: 'Pancake Squad',
				icon: '/nfts/pancakeSquad.png',
				erc20Name: 'WBNB',
				erc20Icon: '/erc20/BNBCoin.png',
				formatDecimals: 2,
				unit: 'ether',
				ERC721ContractAddress: '0x0a8901b0E25DEb55A87524f0cC164E9644020EBA',
				ERC20ContractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
				HERC20ContractAddress: '0x6a3ebf00bc0ff2ed527879559f69f8c907853678'
			}
		] as collection[];
	}
}

function getHelperContract() {
	if (envName == 'dev') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0xbE55638ACDdDe957fD934Ba1B37fA2Ef7A06425d',
			hivemindContractAddress: '0xE5870FA96a4C1250AA928d0192f466A5CbAe5d13',
			oracleContractAddress: '0x6414dd4c6b515a9a1404624d907a78da73f849b2',
			marketContractAddress: '0x383D436fb922B5081DeBD35F1b3012D664100F33'
		};
		return contract;
	} else if (envName == 'prod') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0xbE55638ACDdDe957fD934Ba1B37fA2Ef7A06425d',
			hivemindContractAddress: '0xE5870FA96a4C1250AA928d0192f466A5CbAe5d13',
			oracleContractAddress: '0x6414dd4c6b515a9a1404624d907a78da73f849b2',
			marketContractAddress: '0x383D436fb922B5081DeBD35F1b3012D664100F33'
		};
		return contract;
	} else {
		const contract: helperContract = {
			htokenHelperContractAddress: '',
			hivemindContractAddress: '',
			oracleContractAddress: '',
			marketContractAddress: ''
		};
		return contract;
	}
}

export const collections: collection[] = getCollections();
export const helperContract: helperContract = getHelperContract();
