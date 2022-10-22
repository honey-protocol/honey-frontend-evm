// approval 105% amount
import { repayMargin } from "../constants/constant";
import { repayBorrow } from "../hooks/useHerc20";
import { toWei } from "web3-utils";


export async function repayBorrowHelper(HERC20ContractAddress: string, NFTTokenId: string, userDebt: number, sliderValue: number, unit: Unit, borrowAmount: string) {
  if (userDebt - sliderValue >= 0.01) {
    await repayBorrow(HERC20ContractAddress, NFTTokenId, sliderValue.toFixed(18).toString(), unit)
    console.log(`repay loan for amount: ${sliderValue}`)
  } else {
    const newAmount = Number(borrowAmount) * repayMargin
    await repayBorrow(HERC20ContractAddress, NFTTokenId, newAmount.toFixed(18).toString(), unit)
    console.log(`repay loan for amount: ${newAmount}`)
  }
}

export function safeToWei(amount: string, unit: Unit) {
  if (unit == "mwei") {
    amount = Number(amount).toFixed(6).toString()
  }
  return toWei(amount, unit)
}