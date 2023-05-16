import { envName } from './service';

function getCollections() {
	if (envName == 'dev') {
		return [
			{
				name: 'The Lost Donkey',
				icon: '/nfts/theLostDonkeys.png',
				erc20Name: 'MAGIC',
				erc20Icon: '/erc20/magicIcon.png',
				formatDecimals: 2,
				unit: 'ether',
				ERC721ContractAddress: '0x5e84c1a06e6ad1a8ed66bc48dbe5eb06bf2fe4aa',
				ERC20ContractAddress: '0x539bdE0d7Dbd336b79148AA742883198BBF60342',
				HERC20ContractAddress: '0x582be1f3d46b71c1c93b03b3cf195ebc4e13d8a2'
			},
			{
				name: 'OreoChads',
				icon: '/nfts/oreoChads.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				formatDecimals: 3,
				unit: 'ether',
				ERC721ContractAddress: '0xebfd7babc5db1ec60783fa6085791a7782ee6077',
				ERC20ContractAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				HERC20ContractAddress: '0x511e3d68774510fff856a62578820b369147df2e'
			},
			{
				name: 'Blueberry',
				icon: '/nfts/blueberry.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				formatDecimals: 3,
				unit: 'ether',
				ERC721ContractAddress: '0x17f4baa9d35ee54ffbcb2608e20786473c7aa49f',
				ERC20ContractAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				HERC20ContractAddress: '0xca19d36f203b97e11273c728881eb85e4f3658b5'
			},
			{
				name: 'Primapes',
				icon: '/nfts/primapes.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				formatDecimals: 3,
				unit: 'ether',
				ERC721ContractAddress: '0x72c3205acf3eb2b37b0082240bf0b909a46c0993',
				ERC20ContractAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				HERC20ContractAddress: '0xb2585c40bbafb8a09637194ae478696d35e7e1a3'
			},
			{
				name: 'Federal Frens',
				icon: '/nfts/fedfrens.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				formatDecimals: 3,
				unit: 'ether',
				ERC721ContractAddress: '0x00e3Dcb7fd5946DdE80D627b0723AF78249D7d49',
				ERC20ContractAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				HERC20ContractAddress: '0x4216b7e2560bac4a3b438455a3facc904b07d9ef'
			}
		] as collection[];
	} else if (envName == 'prod') {
		// change this prod market when we go to prod
		return [
			{
				name: 'The Lost Donkey',
				icon: '/nfts/theLostDonkeys.png',
				erc20Name: 'MAGIC',
				erc20Icon: '/erc20/magicIcon.png',
				formatDecimals: 2,
				unit: 'ether',
				ERC721ContractAddress: '0x5e84c1a06e6ad1a8ed66bc48dbe5eb06bf2fe4aa',
				ERC20ContractAddress: '0x539bdE0d7Dbd336b79148AA742883198BBF60342',
				HERC20ContractAddress: '0x582be1f3d46b71c1c93b03b3cf195ebc4e13d8a2'
			},
			{
				name: 'OreoChads',
				icon: '/nfts/oreoChads.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				formatDecimals: 3,
				unit: 'ether',
				ERC721ContractAddress: '0xebfd7babc5db1ec60783fa6085791a7782ee6077',
				ERC20ContractAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				HERC20ContractAddress: '0x511e3d68774510fff856a62578820b369147df2e'
			},
			{
				name: 'Blueberry',
				icon: '/nfts/blueberry.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				formatDecimals: 3,
				unit: 'ether',
				ERC721ContractAddress: '0x17f4baa9d35ee54ffbcb2608e20786473c7aa49f',
				ERC20ContractAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				HERC20ContractAddress: '0xca19d36f203b97e11273c728881eb85e4f3658b5'
			},
			{
				name: 'Primapes',
				icon: '/nfts/primapes.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				formatDecimals: 3,
				unit: 'ether',
				ERC721ContractAddress: '0x72c3205acf3eb2b37b0082240bf0b909a46c0993',
				ERC20ContractAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				HERC20ContractAddress: '0xb2585c40bbafb8a09637194ae478696d35e7e1a3'
			},
			{
				name: 'Federal Frens',
				icon: '/nfts/fedfrens.png',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/EthIcon.png',
				formatDecimals: 3,
				unit: 'ether',
				ERC721ContractAddress: '0x00e3Dcb7fd5946DdE80D627b0723AF78249D7d49',
				ERC20ContractAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
				HERC20ContractAddress: '0x4216b7e2560bac4a3b438455a3facc904b07d9ef'
			}
		] as collection[];
	} else {
		return [] as collection[];
	}
}

function getHelperContract() {
	if (envName == 'dev') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0x80478086f9fb2462e7a35eec6e9a683b25153b37',
			hivemindContractAddress: '0xbE55638ACDdDe957fD934Ba1B37fA2Ef7A06425d',
			oracleContractAddress: '0xB3d108BD30C564181bCcdF419f34f87b10F5c76d',
			marketContractAddress: '0x9a1EDb903B058298dd0b06f52876d9D45358B7cB'
		};
		return contract;
	} else if (envName == 'prod') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0x80478086f9fb2462e7a35eec6e9a683b25153b37',
			hivemindContractAddress: '0xbE55638ACDdDe957fD934Ba1B37fA2Ef7A06425d',
			oracleContractAddress: '0xB3d108BD30C564181bCcdF419f34f87b10F5c76d',
			marketContractAddress: '0x9a1EDb903B058298dd0b06f52876d9D45358B7cB'
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
