import React, { useContext, useEffect, useState } from 'react';
import * as styles from './MarketsSidebar.css';
import { MarketsSidebarProps } from './types';
import { Typography } from 'antd';
import HoneyTabs, { HoneyTabItem } from 'components/HoneyTabs/HoneyTabs';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';
import { UserContext } from "../../contexts/userContext";
import { useMoralis } from "react-moralis";
import useLoanFlowStore from "../../store/loanFlowStore";
import { LoanWorkFlowType } from "../../types/workflows";
import useDisplayStore from "../../store/displayStore";

const {Text} = Typography;

type Tab = 'borrow' | 'repay';

const MarketsSidebar = (props: MarketsSidebarProps) => {
  const {
    hideMobileSidebar,
  } = props;
  const workflow = useLoanFlowStore((state) => state.workflow)
  const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile)
  /*  begin tab function            */
  const [activeTab, setActiveTab] = useState<Tab>('borrow');
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };
  const items: [HoneyTabItem, HoneyTabItem] = [
    {label: 'Borrow', key: 'borrow'},
    {label: 'Repay', key: 'repay', disabled: Boolean(workflow != LoanWorkFlowType.loanOrBorrow)}
  ];
  /*  end   tab function            */
  /*  begin authentication function */
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const {authenticate, user} = useMoralis();
  const connect = async () => {
    if (!currentUser) {
      try {
        await authenticate({signingMessage: 'Authorize linking of your wallet'})
        console.log('logged in user:', user?.get('ethAddress'));
        //todo wait till we integrate with cache

        // await queryClient.invalidateQueries(['user'])
        // await queryClient.invalidateQueries(['nft'])
        // await queryClient.invalidateQueries(['coupons'])
        setCurrentUser(user);
        setIsSidebarVisibleInMobile(false)
      } catch (e) {
        console.log(e)
      }
    }
  };
  /* end authentication function */

  return (
    <div className={styles.marketsSidebarContainer}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={workflow != LoanWorkFlowType.loanOrBorrow}
      >
        {!currentUser ? (
          <EmptyStateDetails
            icon={<div className={styles.lightIcon}/>}
            title="You didn’t connect any wallet yet"
            description="First, choose a NFT collection"
            btnTitle="CONNECT WALLET"
            onBtnClick={connect}
          />
        ) : (<></>)
        }
      </HoneyTabs>
    </div>
  );
};

export default MarketsSidebar;
