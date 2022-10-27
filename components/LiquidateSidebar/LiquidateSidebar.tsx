import React, { useState } from 'react';
import * as styles from './LiquidateSidebar.css';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import BidForm from '../BidForm/BidForm';
import BidsList from '../BidsList/BidsList';
import { LiquidateSidebarProps } from './types';

const items: [HoneyTabItem, HoneyTabItem] = [
  { label: 'Place a bid', key: 'bid' },
  { label: 'Current bids', key: 'current' }
];

type Tab = 'bid' | 'current';

const LiquidateSidebar = (props: LiquidateSidebarProps) => {
  const mockData = true;
  const collectionId = 'sa';
  const userBalance = 5;

  const biddingArray: any = [];
  const highestBiddingValue = 5;
  const currentUserBid = 11;

  const wallet = true;
  const connect = () => {};
  const [activeTab, setActiveTab] = useState<Tab>('bid');

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };
  return (
    <div className={styles.liquidateSidebarContainer}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={Boolean(collectionId)}
      >
        {!wallet ? (
          <EmptyStateDetails
            icon={<div className={styles.lightIcon} />}
            title="You didn’t connect any wallet yet"
            description="First, choose a NFT collection"
            buttons={[
              {
                title: 'CONNECT WALLET',
                onClick: connect
              },
              {
                title: 'RETURN',
                onClick: () => {},
                variant: 'secondary'
              }
            ]}
          />
        ) : !collectionId ? (
          <EmptyStateDetails
            icon={<div className={styles.boltIcon} />}
            title="Manage panel"
            description="First, choose a NFT collection"
          />
        ) : (
          <>
            {activeTab === 'bid' && <BidForm />}
            {activeTab === 'current' && (
              <BidsList biddingArray={biddingArray} />
            )}
          </>
        )}
      </HoneyTabs>
    </div>
  );
};

export default LiquidateSidebar;
