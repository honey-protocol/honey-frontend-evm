import React, { useContext, useState } from 'react';
import * as styles from './LendSidebar.css';
import { LendSidebarProps } from './types';
import DepositForm from '../DepositForm/DepositForm';
// import WithdrawForm from '../WithdrawForm/WithdrawForm';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import useDisplayStore from '../../store/displayStore';
import { useQueryClient } from 'react-query';
import useLendFlowStore from '../../store/lendFlowStore';
import { LendWorkFlowType, LoanWorkFlowType } from '../../types/workflows';
import { UserContext } from '../../contexts/userContext';
import BorrowForm from '../BorrowForm/BorrowForm';
import WithdrawForm from '../WithdrawForm/WithdrawForm';
import { useConnectModal } from '@rainbow-me/rainbowkit';

type Tab = 'deposit' | 'withdraw';

const LendSidebar = (props: LendSidebarProps) => {
	const {} = props;
	const workflow = useLendFlowStore((state) => state.workflow);
	const { openConnectModal } = useConnectModal();
	const queryClient = useQueryClient();
	/*  begin tab function            */
	const items: [HoneyTabItem, HoneyTabItem] = [
		{ label: 'Deposit', key: 'deposit' },
		{
			label: 'Withdraw',
			key: 'withdraw',
			disabled: Boolean(workflow != LendWorkFlowType.lendOrWithdraw)
		}
	];
	const [activeTab, setActiveTab] = useState<Tab>('deposit');

	const handleTabChange = (tabKey: string) => {
		setActiveTab(tabKey as Tab);
	};
	/*  end   tab function            */
	const { currentUser } = useContext(UserContext);

	return (
		<div className={styles.lendSidebarContainer}>
			<HoneyTabs activeKey={activeTab} onTabChange={handleTabChange} items={items} active={true}>
				{!currentUser ? (
					<EmptyStateDetails
						icon={<div className={styles.lightIcon} />}
						title="You didn’t connect any wallet yet"
						description="First, choose a NFT collection"
						buttons={[
							{
								title: 'CONNECT WALLET',
								onClick: openConnectModal
							}
						]}
					/>
				) : workflow == LendWorkFlowType.lendOrWithdraw && activeTab == 'deposit' ? (
					<>
						<DepositForm />
					</>
				) : workflow == LendWorkFlowType.lendOrWithdraw && activeTab == 'withdraw' ? (
					<>
						<WithdrawForm />
					</>
				) : (
					<EmptyStateDetails
						icon={<div className={styles.boltIcon} />}
						title="Manage panel"
						description="First, choose a NFT collection"
					/>
				)}
			</HoneyTabs>
		</div>
	);
};

export default LendSidebar;
