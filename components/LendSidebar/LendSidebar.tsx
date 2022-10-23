import React, { useContext, useState } from 'react';
import * as styles from './LendSidebar.css';
import { LendSidebarProps } from './types';
// import DepositForm from '../DepositForm/DepositForm';
// import WithdrawForm from '../WithdrawForm/WithdrawForm';
import HoneyTabs, { HoneyTabItem } from '../HoneyTabs/HoneyTabs';
import EmptyStateDetails from '../EmptyStateDetails/EmptyStateDetails';
import useDisplayStore from "../../store/displayStore";
import { useQueryClient } from "react-query";
import useLendFlowStore from "../../store/lendFlowStore";
import { LendWorkFlowType } from "../../types/workflows";
import { UserContext } from "../../contexts/userContext";
import { useMoralis } from "react-moralis";

type Tab = 'deposit' | 'withdraw';

const LendSidebar = (props: LendSidebarProps) => {
  const {} = props;
  const workflow = useLendFlowStore((state) => state.workflow)
  const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile)
  const queryClient = useQueryClient();
  /*  begin tab function            */
  const items: [HoneyTabItem, HoneyTabItem] = [
    {label: 'Deposit', key: 'deposit'},
    {label: 'Withdraw', key: 'withdraw'}
  ];
  const [activeTab, setActiveTab] = useState<Tab>('deposit');

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as Tab);
  };
  /*  end   tab function            */
  /*  begin authentication function */
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const {authenticate, user} = useMoralis();
  const connect = async () => {
    if (!currentUser) {
      try {
        await authenticate({signingMessage: 'Authorize linking of your wallet'})
        console.log('logged in user:', user?.get('ethAddress'));
        await queryClient.invalidateQueries(['user'])
        await queryClient.invalidateQueries(['nft'])
        await queryClient.invalidateQueries(['coupons'])
        setCurrentUser(user);
      } catch (e) {
        console.log(e)
      } finally {
        setIsSidebarVisibleInMobile(false)
        document.body.classList.remove('disable-scroll');
      }
    }
  };
  /* end authentication function */
  return (
    <div className={styles.lendSidebarContainer}>
      <HoneyTabs
        activeKey={activeTab}
        onTabChange={handleTabChange}
        items={items}
        active={workflow != LendWorkFlowType.lendOrWithdraw}
      >
        {!currentUser ? (
          <EmptyStateDetails
            icon={<div className={styles.lightIcon}/>}
            title="You didn’t connect any wallet yet"
            description="First, choose a NFT collection"
            btnTitle="CONNECT WALLET"
            onBtnClick={connect}
          />
        ) : (<></>)}
      </HoneyTabs>
    </div>
  );
};

export default LendSidebar;
