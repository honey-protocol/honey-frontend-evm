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
				HERC20ContractAddress: '0x67a763aA59d5624Ef91A070d28f265E4719c6358'
			},
			{
				name: 'BAYC',
				icon: '/nfts/bayc.jpg',
				erc20Name: 'BTC',
				erc20Icon: '/erc20/BitCoinIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x66ba090ed8e3d76680f25fd924c90f662daf0369',
				ERC20ContractAddress: '0x3f657A7DB9B49DC364494A98CD49488f724d4c09',
				HERC20ContractAddress: '0xe51490289ba939dE69412b4F77a3EA56D5025ED5'
			},
			{
				name: 'AZUKI',
				icon: '/nfts/azuki.jpg',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/WethIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x060e5b59ad1095f643271f7b4dd492a9636e0812',
				ERC20ContractAddress: '0x20C27c2f53da9704817bc71453064B5726650F64',
				HERC20ContractAddress: '0xecD86f1a876507E19C630a417CAA51B70D28b6e2'
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
				HERC20ContractAddress: '0x67a763aA59d5624Ef91A070d28f265E4719c6358'
			},
			{
				name: 'BAYC',
				icon: '/nfts/bayc.jpg',
				erc20Name: 'BTC',
				erc20Icon: '/erc20/BitCoinIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x66ba090ed8e3d76680f25fd924c90f662daf0369',
				ERC20ContractAddress: '0x3f657A7DB9B49DC364494A98CD49488f724d4c09',
				HERC20ContractAddress: '0xe51490289ba939dE69412b4F77a3EA56D5025ED5'
			},
			{
				name: 'AZUKI',
				icon: '/nfts/azuki.jpg',
				erc20Name: 'WETH',
				erc20Icon: '/erc20/WethIcon.png',
				unit: 'ether',
				ERC721ContractAddress: '0x060e5b59ad1095f643271f7b4dd492a9636e0812',
				ERC20ContractAddress: '0x20C27c2f53da9704817bc71453064B5726650F64',
				HERC20ContractAddress: '0xecD86f1a876507E19C630a417CAA51B70D28b6e2'
			}
		] as collection[];
	} else {
		return [] as collection[];
	}
}

function getHelperContract() {
	if (envName == 'dev') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0xf0c1dF7A01e260ae93F3F29dB01bEC9dd030c75b',
			hivemindContractAddress: '0x00a6D40877512A4647BCf7f80a523F1B8C55A5f4',
			oracleContractAddress: '0x5e5ECc26FB7cf199E4404D35f4122C8A0E3b5163',
			marketContractAddress: '0xaD906a8B18fc45EbF7C80D440058CB020722232E'
		};
		return contract;
	} else if (envName == 'prod') {
		const contract: helperContract = {
			htokenHelperContractAddress: '0xf0c1dF7A01e260ae93F3F29dB01bEC9dd030c75b',
			hivemindContractAddress: '0x00a6D40877512A4647BCf7f80a523F1B8C55A5f4',
			oracleContractAddress: '0x5e5ECc26FB7cf199E4404D35f4122C8A0E3b5163',
			marketContractAddress: '0xaD906a8B18fc45EbF7C80D440058CB020722232E'
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
