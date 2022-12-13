import React, { useContext, useState } from 'react';
import * as styles from './LiquidateSidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import BidForm from '../BidForm/BidForm';
import BidsList from '../BidsList/BidsList';
import { LiquidateSidebarProps } from './types';
import useDisplayStore from '../../store/displayStore';
import { useQueryClient } from 'react-query';
import { UserContext } from '../../contexts/userContext2';
import { useMoralis } from 'react-moralis';
import { LiquidationWorkFlowType } from '../../types/workflows';
import useLiquidationFlowStore from '../../store/liquidationFlowStore';

type Tab = 'bid' | 'current';

const LiquidateSidebar = (props: LiquidateSidebarProps) => {
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const workflow = useLiquidationFlowStore((state) => state.workflow);
	const queryClient = useQueryClient();
	/*  begin tab function            */
	const [activeTab, setActiveTab] = useState<Tab>('bid');
	const handleTabChange = (tabKey: string) => {
		setActiveTab(tabKey as Tab);
	};
	const items: [HoneyTabItem, HoneyTabItem] = [
		{ label: 'Place a bid', key: 'bid' },
		{
			label: 'Current bids',
			key: 'current',
			disabled: Boolean(workflow == LiquidationWorkFlowType.none)
		}
	];
	/*  end   tab function            */
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
		<div className={styles.liquidateSidebarContainer}>
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
				) : workflow == LiquidationWorkFlowType.collectionBid && activeTab === 'bid' ? (
					<>
						<BidForm />
					</>
				) : workflow == LiquidationWorkFlowType.collectionBid && activeTab === 'current' ? (
					<>
						<BidsList />
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

export default LiquidateSidebar;
