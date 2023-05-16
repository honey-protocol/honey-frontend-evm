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
				name: 'Chicken-Derby',
				icon: '/nfts/derby.png',
				erc20Name: 'MATIC',
				erc20Icon: '/erc20/MaticIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x8634666bA15AdA4bbC83B9DbF285F73D9e46e4C2',
				ERC20ContractAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
				HERC20ContractAddress: '0x6e72368737f628db71336eec98e99d8496257965'
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
				name: 'Chicken-Derby',
				icon: '/nfts/derby.png',
				erc20Name: 'W-MATIC',
				erc20Icon: '/erc20/MaticIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x8634666bA15AdA4bbC83B9DbF285F73D9e46e4C2',
				ERC20ContractAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
				HERC20ContractAddress: '0x6e72368737f628db71336eec98e99d8496257965'
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
			htokenHelperContractAddress: '0xBdB3F78722DC37C864bFB5787F2A7D62bcb29Fbb',
			hivemindContractAddress: '0x9a1EDb903B058298dd0b06f52876d9D45358B7cB',
			oracleContractAddress: '0xe236c45c8C3B0065F96cA62Dc5fd4759974161BC',
			marketContractAddress: '0xf7AC7E1fF22cc0e71964A2730d4e2835146F5aBE'
		};
		return contract;
	} else if (envName == 'prod') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0xBdB3F78722DC37C864bFB5787F2A7D62bcb29Fbb',
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
