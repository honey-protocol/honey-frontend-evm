// approval 105% amount
import { getRepayLoanApproval } from "../hooks/useERC20";
import { approvalMargin } from "../constants/constant";
import { repayBorrow } from "../hooks/useHerc20";
import { toWei } from "web3-utils";


export async function repayBorrowHelper(HERC20ContractAddress: string, NFTTokenId: string, userDebt: number, sliderValue: number, unit: Unit, borrowAmount: string) {
  if (userDebt - sliderValue >= 0.01) {
    await repayBorrow(HERC20ContractAddress, NFTTokenId, sliderValue.toFixed(18).toString(), unit)
    console.log(`repay loan for amount: ${sliderValue}`)
  } else {
    await repayBorrow(HERC20ContractAddress, NFTTokenId, borrowAmount, unit)
    console.log(`repay loan for amount: ${borrowAmount}`)
  }
}

export function safeToWei(amount: string, unit: Unit) {
  if (unit == "mwei") {
    amount = Number(amount).toFixed(6).toString()
  }
  return toWei(amount, unit)
}