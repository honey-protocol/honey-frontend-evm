import React, { useContext, useState } from 'react';
import * as styles from './LendSidebar.css';
import { LendSidebarProps } from './types';
import DepositForm from '../DepositForm/DepositForm';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import useDisplayStore from '../../store/displayStore';
import { useQueryClient } from 'react-query';
import useLendFlowStore from '../../store/lendFlowStore';
import { LendWorkFlowType, LoanWorkFlowType } from '../../types/workflows';
import { UserContext } from '../../contexts/userContext2';
import WithdrawForm from '../WithdrawForm/WithdrawForm';

type Tab = 'deposit' | 'withdraw';

const LendSidebar = (props: LendSidebarProps) => {
	const {} = props;
	const workflow = useLendFlowStore((state) => state.workflow);
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
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
	/*  end   tab function
	 /*  begin authentication function */
	const { walletAddress, connect } = useContext(UserContext);

	const handleConnect = async () => {
		if (!walletAddress) {
			try {
				await connect();
				await queryClient.invalidateQueries(['user']);
				await queryClient.invalidateQueries(['nft']);
				await queryClient.invalidateQueries(['coupons']);
			} catch (e) {
				console.log(e);
			} finally {
				setIsSidebarVisibleInMobile(false);
				document.body.classList.remove('disable-scroll');
			}
		}
	};
	/* end authentication function */
	return (
		<div className={styles.lendSidebarContainer}>
			<HoneyTabs activeKey={activeTab} onTabChange={handleTabChange} items={items} active={true}>
				{!walletAddress ? (
					<EmptyStateDetails
						icon={<div className={styles.lightIcon} />}
						title="You didn’t connect any wallet yet"
						description="First, choose a NFT collection"
						buttons={[
							{
								title: 'CONNECT WALLET',
								onClick: handleConnect
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
