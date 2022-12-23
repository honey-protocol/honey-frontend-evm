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
				HERC20ContractAddress: '0xfa57bE5884d7a21b1a8396999CF9ED7547027aA8'
			},
			{
				name: 'BAYC',
				icon: '/nfts/bayc.jpg',
				erc20Name: 'BTC',
				erc20Icon: '/erc20/BitCoinIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x66ba090ed8e3d76680f25fd924c90f662daf0369',
				ERC20ContractAddress: '0x3f657A7DB9B49DC364494A98CD49488f724d4c09',
				HERC20ContractAddress: '0xcbe353B6eE82ddd4383167E32f0BEdfD2616976b'
			},
			{
				name: 'AZUKI',
				icon: '/nfts/azuki.jpg',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/WethIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x060e5b59ad1095f643271f7b4dd492a9636e0812',
				ERC20ContractAddress: '0x20C27c2f53da9704817bc71453064B5726650F64',
				HERC20ContractAddress: '0x25F49192AfcF88A777161Ab9bf27646de0D53680'
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
				HERC20ContractAddress: '0xfa57bE5884d7a21b1a8396999CF9ED7547027aA8'
			},
			{
				name: 'BAYC',
				icon: '/nfts/bayc.jpg',
				erc20Name: 'BTC',
				erc20Icon: '/erc20/BitCoinIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x66ba090ed8e3d76680f25fd924c90f662daf0369',
				ERC20ContractAddress: '0x3f657A7DB9B49DC364494A98CD49488f724d4c09',
				HERC20ContractAddress: '0xcbe353B6eE82ddd4383167E32f0BEdfD2616976b'
			},
			{
				name: 'AZUKI',
				icon: '/nfts/azuki.jpg',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/WethIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x060e5b59ad1095f643271f7b4dd492a9636e0812',
				ERC20ContractAddress: '0x20C27c2f53da9704817bc71453064B5726650F64',
				HERC20ContractAddress: '0x25F49192AfcF88A777161Ab9bf27646de0D53680'
			}
		] as collection[];
	} else {
		return [] as collection[];
	}
}

function getHelperContract() {
	if (envName == 'dev') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0x793a376B98080a11D6Cba7Eb8200e6E3ED88B0d8',
			hivemindContractAddress: '0x4892644dfaBdb209E60437732c40d4BF88Ed1f76',
			oracleContractAddress: '0xC920ca9976c8205731d41Ea7fAeE773e21E1E793',
			marketContractAddress: '0xdd2223DC2a82671Fc6Abe97BC78d69449226d1CC'
		};
		return contract;
	} else if (envName == 'prod') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0x793a376B98080a11D6Cba7Eb8200e6E3ED88B0d8',
			hivemindContractAddress: '0x4892644dfaBdb209E60437732c40d4BF88Ed1f76',
			oracleContractAddress: '0xC920ca9976c8205731d41Ea7fAeE773e21E1E793',
			marketContractAddress: '0xdd2223DC2a82671Fc6Abe97BC78d69449226d1CC'
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
