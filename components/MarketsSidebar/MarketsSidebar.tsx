import React, { useContext, useEffect, useState } from 'react';
import * as styles from './MarketsSidebar.css';
import { MarketsSidebarProps } from './types';
import { Typography } from 'antd';
import HoneyTabs, { HoneyTabItem } from 'components/HoneyTabs/HoneyTabs';
import EmptyStateDetails from 'components/EmptyStateDetails/EmptyStateDetails';
import { UserContext } from "../../contexts/userContext";
import { useMoralis } from "react-moralis";
import useLoanFlowStore from "../../store/loanFlowStore";

const { Text } = Typography;

type Tab = 'borrow' | 'repay';

const MarketsSidebar = (props: MarketsSidebarProps) => {
  const {
    hideMobileSidebar,
  } = props;
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
      } catch (e) {
        console.log(e)
      }
    }
  };

  return (
    <div className={styles.marketsSidebarContainer}>
      {!currentUser ? (
        <EmptyStateDetails
          icon={<div className={styles.lightIcon}/>}
          title="You didn’t connect any wallet yet"
          description="First, choose a NFT collection"
          btnTitle="CONNECT WALLET"
          onBtnClick={connect}
        />
      ) : ( <></>)
      }
    </div>
  );
};

export default MarketsSidebar;
