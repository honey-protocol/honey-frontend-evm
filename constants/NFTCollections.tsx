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
			},
			{
				name: 'Monsta Party',
				icon: '/nfts/monsterParty.png',
				erc20Name: 'WBNB',
				erc20Icon: '/erc20/BNBCoin.png',
				formatDecimals: 2,
				unit: 'ether',
				ERC721ContractAddress: '0xebFBFD7C41B123500fb16B71C43B400c12B08bE0',
				ERC20ContractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
				HERC20ContractAddress: '0x0e76c1C5C554003e8661403a41c86E89FA65DB34'
			},
			{
				name: 'Pixel Sweeper',
				icon: '/nfts/pixelSweeper.png',
				erc20Name: 'WBNB',
				erc20Icon: '/erc20/BNBCoin.png',
				formatDecimals: 2,
				unit: 'ether',
				ERC721ContractAddress: '0x5F41842CFF838120271d772C6994F051d418a4aD',
				ERC20ContractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
				HERC20ContractAddress: '0xe3e9d70674fa02e3e223012835aab0317c9f7733'
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
			},
			{
				name: 'Monsta Party',
				icon: '/nfts/monsterParty.png',
				erc20Name: 'WBNB',
				erc20Icon: '/erc20/BNBCoin.png',
				formatDecimals: 2,
				unit: 'ether',
				ERC721ContractAddress: '0xebFBFD7C41B123500fb16B71C43B400c12B08bE0',
				ERC20ContractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
				HERC20ContractAddress: '0x0e76c1C5C554003e8661403a41c86E89FA65DB34'
			},
			{
				name: 'Pixel Sweeper',
				icon: '/nfts/pixelSweeper.png',
				erc20Name: 'WBNB',
				erc20Icon: '/erc20/BNBCoin.png',
				formatDecimals: 2,
				unit: 'ether',
				ERC721ContractAddress: '0x5F41842CFF838120271d772C6994F051d418a4aD',
				ERC20ContractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
				HERC20ContractAddress: '0xe3e9d70674fa02e3e223012835aab0317c9f7733'
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
