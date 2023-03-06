import React, { useContext, useState } from 'react';
import * as styles from './LiquidateSidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import BidForm from '../BidForm/BidForm';
import BidsList from '../BidsList/BidsList';
import { LiquidateSidebarProps } from './types';
import useDisplayStore from '../../store/displayStore';
import { useQueryClient } from 'react-query';
import { UserContext } from '../../contexts/userContext';
import { useMoralis } from 'react-moralis';
import { LiquidationWorkFlowType } from '../../types/workflows';
import useLiquidationFlowStore from '../../store/liquidationFlowStore';
import NFTBidsList from '../NFTBidsList/NFTBidsList';
import BidCollateralForm from '../BidCollateralForm/BidCollateralForm';
import { useConnectModal } from '@rainbow-me/rainbowkit';

type Tab = 'bid' | 'current';

const LiquidateSidebar = (props: LiquidateSidebarProps) => {
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const workflow = useLiquidationFlowStore((state) => state.workflow);
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
	const { openConnectModal } = useConnectModal();
	const { currentUser } = useContext(UserContext);

	return (
		<div className={styles.liquidateSidebarContainer}>
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
				) : workflow == LiquidationWorkFlowType.collateralBid && activeTab === 'bid' ? (
					<>
						<BidCollateralForm />
					</>
				) : workflow == LiquidationWorkFlowType.collectionBid && activeTab === 'bid' ? (
					<>
						<BidForm />
					</>
				) : workflow == LiquidationWorkFlowType.collectionBid && activeTab === 'current' ? (
					<>
						<BidsList />
					</>
				) : workflow == LiquidationWorkFlowType.collateralBid && activeTab === 'current' ? (
					<>
						<NFTBidsList />
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
