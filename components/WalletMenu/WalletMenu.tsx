import { Dropdown, Menu, Space, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import * as styles from './WalletMenu.css';
import { DownIcon } from 'icons/DownIcon';
import { formatAddress } from 'helpers/utils';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { WalletIcon } from 'icons/WalletIcon';
import { useMoralis } from "react-moralis";
import { UserContext } from "../../contexts/userContext";

const {Title} = Typography;

const WalletMenu = () => {
  const {authenticate, user, logout} = useMoralis();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const {currentUser, setCurrentUser} = useContext(UserContext);

  useEffect(() => {
    setWalletAddress(user?.get('ethAddress') || ('' as string));
  }, [currentUser]);

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
  const disconnect = async () => {
    await logout;
    console.log('log out:', user?.get('ethAddress'));
    setCurrentUser(null);
  };


  const menu = (
    <Menu
      onClick={disconnect}
      selectable
      items={[
        {
          key: 'disconnect',
          label: 'Disconnect'
        }
      ]}
    />
  );
  return !currentUser ? (
    <HoneyButton variant="primary" icon={<WalletIcon/>} onClick={connect}>
      CONNECT WALLET
    </HoneyButton>
  ) : (
    <Dropdown overlay={menu}>
      <a onClick={e => e.preventDefault()}>
        <Space size="small" align="center">
          <div className={styles.phantomIcon}/>
          <Space size={0} direction="vertical">
            <Title level={4} className={styles.title}>
              {formatAddress(walletAddress)}
            </Title>
          </Space>
          <DownIcon/>
        </Space>
      </a>
    </Dropdown>
  );
};

export default WalletMenu;
