// need this function because sometimes 3rd party provider return address in upper case
import { collections } from "../constants/NFTCollections";

export function caseInsensitiveCompare(str1: string, str2: string) {
  return str1.toLowerCase() === str2.toLowerCase()
}

export function getContractsByHTokenAddr(HERC20ContractAddr: string) {
  const collection = collections.find(
    collection => caseInsensitiveCompare(collection.HERC20ContractAddress, HERC20ContractAddr)
  );
  const ERC20ContractAddress = collection?.ERC20ContractAddress || ''
  const hivemindContractAddress = collection?.hivemindContractAddress || ''
  const nftContractAddress = collection?.ERC721ContractAddress || ''
  const htokenHelperContractAddress = collection?.htokenHelperContractAddress || ''
  const name = collection?.name || ''
  const icon = collection?.icon || ''
  const erc20Name = collection?.erc20Name || ''
  const erc20Icon = collection?.erc20Icon || ''
  const unit = collection?.unit || "ether"
  return {
    name: name,
    icon: icon,
    erc20Name: erc20Name,
    erc20Icon: erc20Icon,
    ERC20ContractAddress: ERC20ContractAddress,
    hivemindContractAddress: hivemindContractAddress,
    nftContractAddress: nftContractAddress,
    htokenHelperContractAddress: htokenHelperContractAddress,
    unit: unit,
  }
}