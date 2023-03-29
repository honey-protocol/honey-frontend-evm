import { envName } from './service';

function getCollections() {
	if (envName == 'dev') {
		return [
			{
				name: 'LAND',
				icon: '/nfts/sandbox.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x9d305a42A3975Ee4c1C57555BeD5919889DCE63F',
				ERC20ContractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
				HERC20ContractAddress: '0x9e826d1427c15ff6f41521e9811fd526f7717a2a'
			},
			{
				name: 'Y00TS',
				icon: '/nfts/y00ts.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x670fd103b1a08628e9557cD66B87DeD841115190',
				ERC20ContractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
				HERC20ContractAddress: '0x13e3b746e89fd9693222fd377521d874e0e1ae5b'
			}
			// ,
			// {
			// 	name: 'OWLPHA',
			// 	icon: '/nfts/owlpha.png',
			// 	erc20Name: 'MATIC',
			// 	erc20Icon: '/erc20/MaticIcon.png',
			// 	unit: 'ether',
			// // 	ERC721ContractAddress: '',
			// // 	ERC20ContractAddress: '',
			// // 	HERC20ContractAddress: ''
			// },
			// {
			// 	name: 'BROZO',
			// 	icon: '/nfts/brozo.png',
			// 	erc20Name: 'MATIC',
			// 	erc20Icon: '/erc20/MaticIcon.png',
			// 	unit: 'ether',
			// 	// ERC721ContractAddress: '',
			// 	// ERC20ContractAddress: '',
			// 	// HERC20ContractAddress: ''
			// }
		] as collection[];
	} else if (envName == 'prod') {
		// change this prod market when we go to prod
		return [
			{
				name: 'LAND',
				icon: '/nfts/sandbox.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/WethIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x9d305a42A3975Ee4c1C57555BeD5919889DCE63F',
				ERC20ContractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
				HERC20ContractAddress: '0x9e826d1427c15ff6f41521e9811fd526f7717a2a'
			},
			{
				name: 'Y00TS',
				icon: '/nfts/y00ts.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/WethIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x670fd103b1a08628e9557cD66B87DeD841115190',
				ERC20ContractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
				HERC20ContractAddress: '0x13e3b746e89fd9693222fd377521d874e0e1ae5b'
			}
			// ,
			// {
			// 	name: 'OWLPHA',
			// 	icon: '/nfts/owlpha.png',
			// 	erc20Name: 'MATIC',
			// 	erc20Icon: '/erc20/MaticIcon.png',
			// 	unit: 'ether',
			// // 	ERC721ContractAddress: '',
			// // 	ERC20ContractAddress: '',
			// // 	HERC20ContractAddress: ''
			// },
			// {
			// 	name: 'BROZO',
			// 	icon: '/nfts/brozo.png',
			// 	erc20Name: 'MATIC',
			// 	erc20Icon: '/erc20/MaticIcon.png',
			// 	unit: 'ether',
			// 	// ERC721ContractAddress: '',
			// 	// ERC20ContractAddress: '',
			// 	// HERC20ContractAddress: ''
			// }
		] as collection[];
	} else {
		return [] as collection[];
	}
}

function getHelperContract() {
	if (envName == 'dev') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0xF68617900C9f410217A14622Ee4c984A77Ff1A37',
			hivemindContractAddress: '0x9a1EDb903B058298dd0b06f52876d9D45358B7cB',
			oracleContractAddress: '0x5C071a3FCd0A8A22633c47aC662bb62A356ED9Dd',
			marketContractAddress: '0xf7AC7E1fF22cc0e71964A2730d4e2835146F5aBE'
		};
		return contract;
	} else if (envName == 'prod') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0xF68617900C9f410217A14622Ee4c984A77Ff1A37',
			hivemindContractAddress: '0x9a1EDb903B058298dd0b06f52876d9D45358B7cB',
			oracleContractAddress: '0x5C071a3FCd0A8A22633c47aC662bb62A356ED9Dd',
			marketContractAddress: '0xf7AC7E1fF22cc0e71964A2730d4e2835146F5aBE'
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
