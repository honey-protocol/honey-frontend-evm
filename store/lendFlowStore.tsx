import create from "zustand"
import { LendWorkFlowType } from "../types/workflows";

interface LendFlowState {
  HERC20ContractAddr: string
  workflow: LendWorkFlowType
  setHERC20ContractAddr: (HERC20ContractAddr: string) => void
  setWorkflow: (workflow: LendWorkFlowType) => void
  reset: () => void
}

const useLendFlowStore = create<LendFlowState>()((set) => ({
  HERC20ContractAddr: "",
  workflow: LendWorkFlowType.none,
  setHERC20ContractAddr: (HERC20ContractAddr: string) => set((state) => ({HERC20ContractAddr: HERC20ContractAddr})),
  setWorkflow: (workflow: LendWorkFlowType) => set((state) => ({workflow: workflow})),
  reset: () => set(() => ({
    HERC20ContractAddr: "",
    workflow: LendWorkFlowType.none,
  })),
}))

export default useLendFlowStore