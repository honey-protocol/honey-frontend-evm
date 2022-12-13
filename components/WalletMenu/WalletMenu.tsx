import { Dropdown, Menu, Space, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import * as styles from './WalletMenu.css';
import { DownIcon } from 'icons/DownIcon';
import { formatAddress } from 'helpers/utils';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { WalletIcon } from 'icons/WalletIcon';
import { useMoralis } from 'react-moralis';
import { UserContext } from '../../contexts/userContext2';
import { useQueryClient } from 'react-query';

const { Title } = Typography;

const WalletMenu = () => {
	const { authenticate, user, logout } = useMoralis();
	const queryClient = useQueryClient();
	const { walletAddress, connect, disconnect } = useContext(UserContext);

	const handleConnect = async () => {
		if (!walletAddress) {
			try {
				await connect();
				console.log('logged in user:', user?.get('ethAddress'));
				await queryClient.invalidateQueries(['user']);
				await queryClient.invalidateQueries(['nft']);
				await queryClient.invalidateQueries(['coupons']);
			} catch (e) {
				console.log(e);
			}
		}
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
	return !walletAddress ? (
		<HoneyButton variant="primary" icon={<WalletIcon />} onClick={handleConnect}>
			CONNECT WALLET
		</HoneyButton>
	) : (
		<Dropdown overlay={menu}>
			<a onClick={(e) => e.preventDefault()}>
				<Space size="small" align="center">
					<div className={styles.metamaskIcon} />
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
