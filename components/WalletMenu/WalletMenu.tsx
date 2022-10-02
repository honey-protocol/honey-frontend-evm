import { Dropdown, Menu, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import * as styles from './WalletMenu.css';
import { DownIcon } from 'icons/DownIcon';
import { formatAddress } from 'helpers/utils';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { WalletIcon } from 'icons/WalletIcon';

const { Title, Text } = Typography;

const WalletMenu = () => {

  // const walletAddress = wallet?.publicKey.toString();
  const walletAddress = "0X2345"
  //
  function handleClick(e: any) {
    // if (e.key == '4') disconnect();
    console.log("login")
  }

  const menu = (
    <Menu
      onClick={handleClick}
      selectable
      items={[
        {
          key: '4',
          label: 'Disconnect'
        }
      ]}
    />
  );
  return !walletAddress ? (
    <HoneyButton variant="primary" icon={<WalletIcon />} >
      CONNECT WALLET
    </HoneyButton>
  ) : (
    <Dropdown overlay={menu}>
      <a onClick={e => e.preventDefault()}>
        <Space size="small" align="center">
          <div className={styles.phantomIcon} />
          <Space size={0} direction="vertical">
            <Title level={4} className={styles.title}>
              {formatAddress(walletAddress)}
            </Title>
          </Space>
          <DownIcon />
        </Space>
      </a>
    </Dropdown>
  );
};

export default WalletMenu;
