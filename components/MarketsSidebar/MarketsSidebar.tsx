import React, { useContext, useState } from 'react';
import * as styles from './MarketsSidebar.css';
import { MarketsSidebarProps } from './types';
import HoneyTabs, { HoneyTabItem } from 'components/HoneyTabs/HoneyTabs';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';
import { UserContext } from '../../contexts/userContext';
import useLoanFlowStore from '../../store/loanFlowStore';
import { LoanWorkFlowType } from '../../types/workflows';
import useDisplayStore from '../../store/displayStore';
import { useQueryClient } from 'react-query';
import DepositNFTForm from '../DepositNFTForm/DepositNFTForm';
import BorrowForm from '../BorrowForm/BorrowForm';
import RepayForm from '../RepayForm/RepayForm';
import { useConnectModal } from '@rainbow-me/rainbowkit';

type Tab = 'borrow' | 'repay';

const MarketsSidebar = (props: MarketsSidebarProps) => {
	const {} = props;
	const { workflow, HERC20ContractAddr, setWorkflow } = useLoanFlowStore((state) => state);
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const queryClient = useQueryClient();
	/*  begin tab function            */
	const [activeTab, setActiveTab] = useState<Tab>('borrow');
	const handleTabChange = (tabKey: string) => {
		setActiveTab(tabKey as Tab);
	};
	const items: [HoneyTabItem, HoneyTabItem] = [
		{ label: 'Borrow', key: 'borrow' },
		{ label: 'Repay', key: 'repay', disabled: Boolean(workflow != LoanWorkFlowType.loanOrBorrow) }
	];

	//Rainbowkit connect modalaads
	const { openConnectModal } = useConnectModal();
	/*  end   tab function            */
	/*  begin authentication function */
	const { currentUser } = useContext(UserContext);

	const initDepositNFTFlow = () => {
		setWorkflow(LoanWorkFlowType.depositNFT);
		setIsSidebarVisibleInMobile(true);
		document.body.classList.add('disable-scroll');
	};

	return (
		<div className={styles.marketsSidebarContainer}>
			<HoneyTabs activeKey={activeTab} onTabChange={handleTabChange} items={items} active={true}>
				{!currentUser ? (
					<EmptyStateDetails
						icon={<div className={styles.lightIcon} />}
						title="You didn’t connect any wallet yet"
						description="First, choose a NFT collection"
						buttons={[{ title: 'CONNECT WALLET', onClick: openConnectModal }]}
					/>
				) : !HERC20ContractAddr ? (
					<EmptyStateDetails
						icon={<div className={styles.boltIcon} />}
						title="Manage panel"
						description="First, choose a NFT collection"
					/>
				) : workflow == LoanWorkFlowType.depositNFT ? (
					<>
						<DepositNFTForm />
					</>
				) : workflow == LoanWorkFlowType.loanOrBorrow && activeTab == 'borrow' ? (
					<>
						<BorrowForm />
					</>
				) : workflow == LoanWorkFlowType.loanOrBorrow && activeTab == 'repay' ? (
					<>
						<RepayForm />
					</>
				) : (
					<EmptyStateDetails
						icon=""
						title=""
						description=""
						buttons={[
							{
								title: 'Select Nft to deposit',
								variant: 'primary',
								onClick: initDepositNFTFlow
							}
						]}
					/>
				)}
			</HoneyTabs>
		</div>
	);
};

export default MarketsSidebar;
