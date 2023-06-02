import { envName } from './service';

function getCollections() {
	if (envName == 'dev') {
		return [
			{
				name: 'Y00TS',
				icon: '/nfts/y00ts.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				formatDecimals: 2,
				unit: 'ether',
				ERC721ContractAddress: '0x670fd103b1a08628e9557cD66B87DeD841115190',
				ERC20ContractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
				HERC20ContractAddress: '0x13e3b746e89fd9693222fd377521d874e0e1ae5b'
			},
			{
				name: 'OWLPHA',
				icon: '/nfts/owlpha.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x12AA01F646fe5C993C66c9C86EddAd4e514f6cBc',
				ERC20ContractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
				HERC20ContractAddress: '0x0352931a93296407f2740549503d83fb9f66fc18'
			},
			{
				name: 'BROZO',
				icon: '/nfts/brozo.png',
				erc20Name: 'WMATIC',
				erc20Icon: '/erc20/MaticIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x220fa5cCc9404802ED6DB0935EB4feeFC27C937e',
				ERC20ContractAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
				HERC20ContractAddress: '0x186bC464BdfE5eCc2aA100c6db0154C693020BAe'
			},
			{
				name: 'REKT DOGS',
				icon: '/nfts/rektdogs.png',
				erc20Name: 'WMATIC',
				erc20Icon: '/erc20/MaticIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0xAce8187B113a38F83Bd9C896C6878B175c234dCc',
				ERC20ContractAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
				HERC20ContractAddress: '0xfb2654bc0ff6e02ffe819d355b8b085e089eb483'
			},
			{
				name: 'POLYGON PUNKS',
				icon: '/nfts/polygonPunk.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				// formatDecimals: 2,
				unit: 'ether',
				ERC721ContractAddress: '0x9498274B8C82B4a3127D67839F2127F2Ae9753f4',
				ERC20ContractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
				HERC20ContractAddress: '0x3a6BAdbF5420a5391477e45B73079ECA3B8Cb46B'
			},
			// ,
			// {
			// 	name: 'LAND',
			// 	icon: '/nfts/sandbox.png',
			// 	erc20Name: 'WETH',
			// 	erc20Icon: '/erc20/EthIcon.png',
			// 	unit: 'ether',
			// 	ERC721ContractAddress: '0x9d305a42A3975Ee4c1C57555BeD5919889DCE63F',
			// 	ERC20ContractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
			// 	HERC20ContractAddress: '0x9e826d1427c15ff6f41521e9811fd526f7717a2a'
			// },
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
				name: 'Y00TS',
				icon: '/nfts/y00ts.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				formatDecimals: 2,
				unit: 'ether',
				ERC721ContractAddress: '0x670fd103b1a08628e9557cD66B87DeD841115190',
				ERC20ContractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
				HERC20ContractAddress: '0x13e3b746e89fd9693222fd377521d874e0e1ae5b'
			},
			{
				name: 'OWLPHA',
				icon: '/nfts/owlpha.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x12AA01F646fe5C993C66c9C86EddAd4e514f6cBc',
				ERC20ContractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
				HERC20ContractAddress: '0x0352931a93296407f2740549503d83fb9f66fc18'
			},
			{
				name: 'BROZO',
				icon: '/nfts/brozo.png',
				erc20Name: 'WMATIC',
				erc20Icon: '/erc20/MaticIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x220fa5cCc9404802ED6DB0935EB4feeFC27C937e',
				ERC20ContractAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
				HERC20ContractAddress: '0x186bC464BdfE5eCc2aA100c6db0154C693020BAe'
			},
			{
				name: 'REKT DOGS',
				icon: '/nfts/rektdogs.png',
				erc20Name: 'WMATIC',
				erc20Icon: '/erc20/MaticIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0xAce8187B113a38F83Bd9C896C6878B175c234dCc',
				ERC20ContractAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
				HERC20ContractAddress: '0xfb2654bc0ff6e02ffe819d355b8b085e089eb483'
			},
			{
				name: 'POLYGON PUNKS',
				icon: '/nfts/polygonPunk.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				// formatDecimals: 2,
				unit: 'ether',
				ERC721ContractAddress: '0x9498274B8C82B4a3127D67839F2127F2Ae9753f4',
				ERC20ContractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
				HERC20ContractAddress: '0x3a6BAdbF5420a5391477e45B73079ECA3B8Cb46B'
			},
			// ,
			// {
			// 	name: 'LAND',
			// 	icon: '/nfts/sandbox.png',
			// 	erc20Name: 'WETH',
			// 	erc20Icon: '/erc20/EthIcon.png',
			// 	unit: 'ether',
			// 	ERC721ContractAddress: '0x9d305a42A3975Ee4c1C57555BeD5919889DCE63F',
			// 	ERC20ContractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
			// 	HERC20ContractAddress: '0x9e826d1427c15ff6f41521e9811fd526f7717a2a'
			// },
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
			htokenHelperContractAddress: '0x80478086f9fb2462e7a35eec6e9a683b25153b37',
			hivemindContractAddress: '0x9a1EDb903B058298dd0b06f52876d9D45358B7cB',
			oracleContractAddress: '0xe236c45c8C3B0065F96cA62Dc5fd4759974161BC',
			marketContractAddress: '0xf7AC7E1fF22cc0e71964A2730d4e2835146F5aBE'
		};
		return contract;
	} else if (envName == 'prod') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0x80478086f9fb2462e7a35eec6e9a683b25153b37',
			hivemindContractAddress: '0x9a1EDb903B058298dd0b06f52876d9D45358B7cB',
			oracleContractAddress: '0xe236c45c8C3B0065F96cA62Dc5fd4759974161BC',
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
