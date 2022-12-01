import { envName } from './service';

function getCollections() {
	if (envName == 'dev') {
		return [
			{
				name: 'BAYC',
				icon: '/nfts/bayc.jpg',
				erc20Name: 'DAI',
				erc20Icon: '/erc20/DAIIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x66ba090ed8e3d76680f25fd924c90f662daf0369',
				ERC20ContractAddress: '0x2FC813E8562D2c52B7423C07AB1Fead3A195CF15',
				HERC20ContractAddress: '0xF1424637f90D78e8B4c87A74D2316Aeb98C77d95'
			},
			{
				name: 'BAYC',
				icon: '/nfts/bayc.jpg',
				erc20Name: 'BTC',
				erc20Icon: '/erc20/BitCoinIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x66ba090ed8e3d76680f25fd924c90f662daf0369',
				ERC20ContractAddress: '0x3f657A7DB9B49DC364494A98CD49488f724d4c09',
				HERC20ContractAddress: '0x10474Ce49166Bf2c2D41e9cED85bFE5D8C16F9d8'
			},
			{
				name: 'AZUKI',
				icon: '/nfts/azuki.jpg',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/WethIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x060e5b59ad1095f643271f7b4dd492a9636e0812',
				ERC20ContractAddress: '0x20C27c2f53da9704817bc71453064B5726650F64',
				HERC20ContractAddress: '0x0221463a6118f02d219fcBF5C21a351Db2D4Ab70'
			}
		] as collection[];
	} else if (envName == 'prod') {
		// change this prod farm when we go to prod
		return [
			{
				name: 'BAYC',
				icon: '/nfts/bayc.jpg',
				erc20Name: 'DAI',
				erc20Icon: '/erc20/DAIIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x66ba090ed8e3d76680f25fd924c90f662daf0369',
				ERC20ContractAddress: '0x2FC813E8562D2c52B7423C07AB1Fead3A195CF15',
				HERC20ContractAddress: '0xF1424637f90D78e8B4c87A74D2316Aeb98C77d95'
			},
			{
				name: 'BAYC',
				icon: '/nfts/bayc.jpg',
				erc20Name: 'BTC',
				erc20Icon: '/erc20/BitCoinIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x66ba090ed8e3d76680f25fd924c90f662daf0369',
				ERC20ContractAddress: '0x3f657A7DB9B49DC364494A98CD49488f724d4c09',
				HERC20ContractAddress: '0x10474Ce49166Bf2c2D41e9cED85bFE5D8C16F9d8'
			},
			{
				name: 'AZUKI',
				icon: '/nfts/azuki.jpg',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/WethIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x060e5b59ad1095f643271f7b4dd492a9636e0812',
				ERC20ContractAddress: '0x20C27c2f53da9704817bc71453064B5726650F64',
				HERC20ContractAddress: '0x0221463a6118f02d219fcBF5C21a351Db2D4Ab70'
			}
		] as collection[];
	} else {
		return [] as collection[];
	}
}

function getHelperContract() {
	if (envName == 'dev') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0x07076176AdC49f03fc2E129C2B0bcA58EA251A51',
			hivemindContractAddress: '0xa705A06f6A31a00Ccdd71E17258d2Ea0cBd2de36',
			oracleContractAddress: '0x901135B6e80C3816031DAB0F0846AA1B1aE60FB1',
			marketContractAddress: '0xE6736a60051271E2438d5612AE988dA3CE70Cea8'
		};
		return contract;
	} else if (envName == 'prod') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0x07076176AdC49f03fc2E129C2B0bcA58EA251A51',
			hivemindContractAddress: '0xa705A06f6A31a00Ccdd71E17258d2Ea0cBd2de36',
			oracleContractAddress: '0x901135B6e80C3816031DAB0F0846AA1B1aE60FB1',
			marketContractAddress: '0xE6736a60051271E2438d5612AE988dA3CE70Cea8'
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
