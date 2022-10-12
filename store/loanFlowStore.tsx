import create from "zustand"
import { LoanWorkFlowType } from "../types/workflows";

interface LoanFlowState {
  HERC20ContractAddr: string
  NFTId: string
  couponId: string
  isLoading: boolean
  workflow: LoanWorkFlowType
  setIsLoading: (isLoading: boolean) => void
  setNFTId: (NFTId: string) => void
  setCouponId: (couponId: string) => void
  setHERC20ContractAddr: (HERC20ContractAddr: string) => void
  //workflow can be "depositNFT" or "loanOrBorrow"
  setWorkflow: (workflow: LoanWorkFlowType) => void
  reset: () => void
}

const useLoanFlowStore = create<LoanFlowState>()((set) => ({
  HERC20ContractAddr: "",
  NFTId: "",
  couponId: "",
  isLoading: false,
  workflow: LoanWorkFlowType.none,
  setIsLoading: (isLoading: boolean) => set((state) => ({isLoading: isLoading})),
  setNFTId: (NFTId: string) => set((state) => ({NFTId: NFTId})),
  setCouponId: (couponId: string) => set((state) => ({couponId: couponId})),
  setHERC20ContractAddr: (HERC20ContractAddr: string) => set((state) => ({HERC20ContractAddr: HERC20ContractAddr})),
  setWorkflow: (workflow: LoanWorkFlowType) => set((state) => ({workflow: workflow})),
  reset: () => set(() => ({
    HERC20ContractAddr: "",
    NFTId: "",
    couponId: "",
    workflow: LoanWorkFlowType.none,
    isLoading: false,
  })),
}))

export default useLoanFlowStore