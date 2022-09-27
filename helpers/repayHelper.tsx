// approval 105% amount
import { getRepayLoanApproval } from "../hooks/useERC20";
import { approvalMargin } from "../constants/constant";
import { repayBorrow } from "../hooks/useHerc20";
import { toWei } from "web3-utils";

export async function getRepayLoanApprovalWithMargin(ERC20ContractAddress: string, HERC20ContractAddress: string, repayAmount: string, borrowAmount: string, unit: Unit, sliderCount: number) {
  if (sliderCount >= 100) {
    const newAmount = Number(borrowAmount) * approvalMargin
    await getRepayLoanApproval(ERC20ContractAddress, HERC20ContractAddress, newAmount.toFixed(18).toString(), unit)
    console.log(`repay loan for amount: ${newAmount}`)
  } else {
    const newAmount = Number(repayAmount) * approvalMargin
    await getRepayLoanApproval(ERC20ContractAddress, HERC20ContractAddress, newAmount.toFixed(18).toString(), unit)
    console.log(`request approval for amount: ${newAmount}`)
  }
}

export async function repayBorrowWithSliderCount(HERC20ContractAddress: string, NFTTokenId: string, repayAmount: string, borrowAmount: string, unit: Unit, sliderCount: number) {
  //the max value of slider is 102 instead of 100
  if (sliderCount >= 100) {
    const newAmount = Number(borrowAmount) * approvalMargin
    await repayBorrow(HERC20ContractAddress, NFTTokenId, newAmount.toFixed(18).toString(), unit)
    console.log(`repay loan for amount: ${newAmount}`)
  } else {
    await repayBorrow(HERC20ContractAddress, NFTTokenId, repayAmount, unit)
    console.log(`repay loan for amount: ${repayAmount}`)
  }
}

export async function safeToWei(amount: string, unit: Unit) {
  if (unit == "mwei") {
    amount = Number(amount).toFixed(6).toString()
  }
  return toWei(amount, unit)
}