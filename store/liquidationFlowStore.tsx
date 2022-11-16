import create from 'zustand';
import { LiquidationWorkFlowType } from '../types/workflows';

interface LiquidationFlowState {
	HERC20ContractAddr: string;
	NFTId: string;
	couponId: string;
	workflow: LiquidationWorkFlowType;
	setNFTId: (NFTId: string) => void;
	setCouponId: (couponId: string) => void;
	setHERC20ContractAddr: (HERC20ContractAddr: string) => void;
	setWorkflow: (workflow: LiquidationWorkFlowType) => void;
	reset: () => void;
}

const useLiquidationFlowStore = create<LiquidationFlowState>()((set) => ({
	HERC20ContractAddr: '',
	NFTId: '',
	couponId: '',
	workflow: LiquidationWorkFlowType.none,
	setNFTId: (NFTId: string) => set(() => ({ NFTId: NFTId })),
	setCouponId: (couponId: string) => set(() => ({ couponId: couponId })),
	setHERC20ContractAddr: (HERC20ContractAddr: string) =>
		set(() => ({ HERC20ContractAddr: HERC20ContractAddr })),
	setWorkflow: (workflow: LiquidationWorkFlowType) => set(() => ({ workflow: workflow })),
	reset: () =>
		set(() => ({
			HERC20ContractAddr: '',
			NFTId: '',
			couponId: '',
			workflow: LiquidationWorkFlowType.none
		}))
}));

export default useLiquidationFlowStore;
