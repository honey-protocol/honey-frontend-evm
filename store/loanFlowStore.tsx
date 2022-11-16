import create from 'zustand';
import { LoanWorkFlowType } from '../types/workflows';

interface LoanFlowState {
	HERC20ContractAddr: string;
	NFTId: string;
	couponId: string;
	workflow: LoanWorkFlowType;
	setNFTId: (NFTId: string) => void;
	setCouponId: (couponId: string) => void;
	setHERC20ContractAddr: (HERC20ContractAddr: string) => void;
	//workflow can be "depositNFT" or "loanOrBorrow"
	setWorkflow: (workflow: LoanWorkFlowType) => void;
	reset: () => void;
}

const useLoanFlowStore = create<LoanFlowState>()((set) => ({
	HERC20ContractAddr: '',
	NFTId: '',
	couponId: '',
	workflow: LoanWorkFlowType.none,
	setNFTId: (NFTId: string) => set(() => ({ NFTId: NFTId })),
	setCouponId: (couponId: string) => set(() => ({ couponId: couponId })),
	setHERC20ContractAddr: (HERC20ContractAddr: string) =>
		set(() => ({ HERC20ContractAddr: HERC20ContractAddr })),
	setWorkflow: (workflow: LoanWorkFlowType) => set(() => ({ workflow: workflow })),
	reset: () =>
		set(() => ({
			HERC20ContractAddr: '',
			NFTId: '',
			couponId: '',
			workflow: LoanWorkFlowType.none
		}))
}));

export default useLoanFlowStore;
