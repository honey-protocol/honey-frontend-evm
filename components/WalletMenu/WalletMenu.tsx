import { Dropdown, Menu, Space, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import * as styles from './WalletMenu.css';
import { DownIcon } from 'icons/DownIcon';
import { formatAddress } from 'helpers/utils';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { WalletIcon } from 'icons/WalletIcon';
import { useMoralis } from 'react-moralis';
import { UserContext } from '../../contexts/userContext';
import { useQueryClient } from 'react-query';
import Moralis from 'moralis-v1';
import { CautionIcon } from 'icons/CautionIcon';

const { Title } = Typography;

const mumbaiChainId = '0x13881';

const WalletMenu = () => {
	const { authenticate, user, logout, network } = useMoralis();
	const queryClient = useQueryClient();
	const [walletAddress, setWalletAddress] = useState<string>('');
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const [connectedNetworkId, setConnectedNetworkId] = useState('');

	useEffect(() => {
		setWalletAddress(user?.get('ethAddress') || ('' as string));
		if (user != null && currentUser == null) {
			console.log('logged in user:', user?.get('ethAddress'));
			Moralis.enableWeb3().then((r) => setCurrentUser(user));
		}

		setConnectedNetworkId(window.ethereum.chainId);
		window.ethereum.on('chainChanged', (chainId: string) => {
			setConnectedNetworkId(chainId);
		});
		console.log({ network });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const connect = async () => {
		if (!currentUser) {
			try {
				await authenticate({ signingMessage: 'Authorize linking of your wallet' });
				await queryClient.invalidateQueries(['user']);
				await queryClient.invalidateQueries(['nft']);
				await queryClient.invalidateQueries(['coupons']);
			} catch (e) {
				console.log(e);
			}
		}
	};
	const disconnect = async () => {
		console.log('log out:', user?.get('ethAddress'));
		await logout();
		setCurrentUser(null);
	};

	const changeWalletNetwork = async () => {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: mumbaiChainId }]
		});
		await queryClient.invalidateQueries(['user']);
		await queryClient.invalidateQueries(['nft']);
		await queryClient.invalidateQueries(['coupons']);
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
		<HoneyButton variant="primary" icon={<WalletIcon />} onClick={connect}>
			CONNECT WALLET
		</HoneyButton>
	) : connectedNetworkId !== mumbaiChainId ? (
		<HoneyButton variant="primary" onClick={changeWalletNetwork}>
			Change Network <CautionIcon />
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
