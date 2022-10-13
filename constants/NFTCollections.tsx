import { envName } from "./service";

function getCollections() {
  if (envName == "dev") {
    return [
      {
        name: "BAYC",
        icon: "/nfts/bayc.jpg",
        erc20Name: "USDC",
        erc20Icon: "/erc20/USDCIcon.png",
        unit: "mwei",
        ERC721ContractAddress: "0x66ba090ed8e3d76680f25fd924c90f662daf0369",
        ERC20ContractAddress: "0xdBe9E49029A4046B672E714Cc2247CF62BF16187",
        HERC20ContractAddress: "0xC7ADB10e9faa35753430403c57ACfDF2B95eE30A",
        htokenHelperContractAddress: "0x24C4278330892FF6D37bDB8d8C29360DdE511C31",
        hivemindContractAddress: "0xd3de0B05F13759267F7F3213BEe7699F648c2Cbb",
        oracleContractAddress: "0x5e5ECc26FB7cf199E4404D35f4122C8A0E3b5163",
      },
      {
        name: "BAYC",
        icon: "/nfts/bayc.jpg",
        erc20Name: "BTC",
        erc20Icon: "/erc20/BitCoinIcon.png",
        unit: "ether",
        ERC721ContractAddress: "0x66ba090ed8e3d76680f25fd924c90f662daf0369",
        ERC20ContractAddress: "0xdBe9E49029A4046B672E714Cc2247CF62BF16187",
        HERC20ContractAddress: "0x3eB7Fb723eCe2CCCFa9f6f5F4c603f135192529B",
        htokenHelperContractAddress: "0x24C4278330892FF6D37bDB8d8C29360DdE511C31",
        hivemindContractAddress: "0xd3de0B05F13759267F7F3213BEe7699F648c2Cbb",
        oracleContractAddress: "0x5e5ECc26FB7cf199E4404D35f4122C8A0E3b5163",
      },
      {
        name: "AZUKI",
        icon: "/nfts/azuki.jpg",
        erc20Name: "WETH",
        erc20Icon: "/erc20/WethIcon.png",
        unit: "ether",
        ERC721ContractAddress: "0x060e5b59ad1095f643271f7b4dd492a9636e0812",
        ERC20ContractAddress: "0x20C27c2f53da9704817bc71453064B5726650F64",
        HERC20ContractAddress: "0x928F9465C7B3fB2b4156D8ca27d1B303b0dfae5E",
        htokenHelperContractAddress: "0x24C4278330892FF6D37bDB8d8C29360DdE511C31",
        hivemindContractAddress: "0xd3de0B05F13759267F7F3213BEe7699F648c2Cbb",
        oracleContractAddress: "0x5e5ECc26FB7cf199E4404D35f4122C8A0E3b5163",
      }
    ] as collection[]
  } else if (envName == "prod") {
    // change this prod farm when we go to prod
    return [
      {
        name: "BAYC",
        icon: "/nfts/bayc.jpg",
        erc20Name: "USDC",
        erc20Icon: "/erc20/USDCIcon.png",
        unit: "mwei",
        ERC721ContractAddress: "0x66ba090ed8e3d76680f25fd924c90f662daf0369",
        ERC20ContractAddress: "0xdBe9E49029A4046B672E714Cc2247CF62BF16187",
        HERC20ContractAddress: "0xC7ADB10e9faa35753430403c57ACfDF2B95eE30A",
        htokenHelperContractAddress: "0x24C4278330892FF6D37bDB8d8C29360DdE511C31",
        hivemindContractAddress: "0xd3de0B05F13759267F7F3213BEe7699F648c2Cbb",
        oracleContractAddress: "0x5e5ECc26FB7cf199E4404D35f4122C8A0E3b5163",
      },
      {
        name: "BAYC",
        icon: "/nfts/bayc.jpg",
        erc20Name: "BTC",
        erc20Icon: "/erc20/BitCoinIcon.png",
        unit: "ether",
        ERC721ContractAddress: "0x66ba090ed8e3d76680f25fd924c90f662daf0369",
        ERC20ContractAddress: "0xdBe9E49029A4046B672E714Cc2247CF62BF16187",
        HERC20ContractAddress: "0x3eB7Fb723eCe2CCCFa9f6f5F4c603f135192529B",
        htokenHelperContractAddress: "0x24C4278330892FF6D37bDB8d8C29360DdE511C31",
        hivemindContractAddress: "0xd3de0B05F13759267F7F3213BEe7699F648c2Cbb",
        oracleContractAddress: "0x5e5ECc26FB7cf199E4404D35f4122C8A0E3b5163",
      },
      {
        name: "AZUKI",
        icon: "/nfts/azuki.jpg",
        erc20Name: "WETH",
        erc20Icon: "/erc20/WethIcon.png",
        unit: "ether",
        ERC721ContractAddress: "0x060e5b59ad1095f643271f7b4dd492a9636e0812",
        ERC20ContractAddress: "0x20C27c2f53da9704817bc71453064B5726650F64",
        HERC20ContractAddress: "0x928F9465C7B3fB2b4156D8ca27d1B303b0dfae5E",
        htokenHelperContractAddress: "0x24C4278330892FF6D37bDB8d8C29360DdE511C31",
        hivemindContractAddress: "0xd3de0B05F13759267F7F3213BEe7699F648c2Cbb",
        oracleContractAddress: "0x5e5ECc26FB7cf199E4404D35f4122C8A0E3b5163",
      }
    ] as collection[]
  } else {
    return [] as collection[]
  }
}

export const collections: collection[] = getCollections()