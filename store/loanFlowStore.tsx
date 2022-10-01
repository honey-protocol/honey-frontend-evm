import create from "zustand"

interface LoanFlowState {
  HERC20ContractAddr: string
  NFTId: string
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  setNFTId: (NFTId: string) => void
  setHERC20ContractAddr: (HERC20ContractAddr: string) => void
}

const useLoanFlowStore = create<LoanFlowState>()((set) => ({
  HERC20ContractAddr: "",
  NFTId: "",
  isLoading: false,
  setIsLoading: (isLoading) => set((state) => ({isLoading: isLoading})),
  setNFTId: (NFTId) => set((state) => ({NFTId: NFTId})),
  setHERC20ContractAddr: (HERC20ContractAddr) => set((state) => ({HERC20ContractAddr: HERC20ContractAddr})),
}))