import { envName } from "./service";

function getCollections() {
  if (envName == "dev") {
    return [
      {
        name: "BAYC",
        icon: "/nfts/bayc.jpg",
        erc20Name: "DAI",
        erc20Icon: "/erc20/DAIIcon.png",
        unit: "ether",
        ERC721ContractAddress: "0x66ba090ed8e3d76680f25fd924c90f662daf0369",
        ERC20ContractAddress: "0x2FC813E8562D2c52B7423C07AB1Fead3A195CF15",
        HERC20ContractAddress: "0xEAf96aB7e599473A881B2787449F6994F79219c4",
        htokenHelperContractAddress: "0xf2CE170da2106371e337615be64A67B9316A651b",
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
        ERC20ContractAddress: "0x3f657A7DB9B49DC364494A98CD49488f724d4c09",
        HERC20ContractAddress: "0x3eB7Fb723eCe2CCCFa9f6f5F4c603f135192529B",
        htokenHelperContractAddress: "0xf2CE170da2106371e337615be64A67B9316A651b",
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
        htokenHelperContractAddress: "0xf2CE170da2106371e337615be64A67B9316A651b",
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
        erc20Name: "DAI",
        erc20Icon: "/erc20/DAIIcon.png",
        unit: "ether",
        ERC721ContractAddress: "0x66ba090ed8e3d76680f25fd924c90f662daf0369",
        ERC20ContractAddress: "0x2FC813E8562D2c52B7423C07AB1Fead3A195CF15",
        HERC20ContractAddress: "0xEAf96aB7e599473A881B2787449F6994F79219c4",
        htokenHelperContractAddress: "0xf2CE170da2106371e337615be64A67B9316A651b",
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
        ERC20ContractAddress: "0x3f657A7DB9B49DC364494A98CD49488f724d4c09",
        HERC20ContractAddress: "0x3eB7Fb723eCe2CCCFa9f6f5F4c603f135192529B",
        htokenHelperContractAddress: "0xf2CE170da2106371e337615be64A67B9316A651b",
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
        htokenHelperContractAddress: "0xf2CE170da2106371e337615be64A67B9316A651b",
        hivemindContractAddress: "0xd3de0B05F13759267F7F3213BEe7699F648c2Cbb",
        oracleContractAddress: "0x5e5ECc26FB7cf199E4404D35f4122C8A0E3b5163",
      }
    ] as collection[]
  } else {
    return [] as collection[]
  }
}

export const collections: collection[] = getCollections()