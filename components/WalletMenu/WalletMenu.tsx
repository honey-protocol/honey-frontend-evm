import { Dropdown, Menu, Select, Space, Typography } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/userContext';
import { useQueryClient } from 'react-query';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi';
import useDisplayStore from 'store/displayStore';
import * as styles from './WalletMenu.css';
import { SettingsIcon } from 'icons/SettingsIcon';
import SettingsModal from 'components/SettingsModal/SettingsModal';
import { hexValue } from 'ethers/lib/utils.js';
import { SolanaCircleIcon } from 'icons/SolanaCircleIcon';
import { PolygonIcon } from 'icons/PolygonIcon';
import { ArbitrumIcon } from 'icons/ArbitrumIcon';
import { DownIcon } from 'icons/DownIcon';

const supportedChains = [
	{
		name: 'Arbitrum',
		value: '0xa4b1',
		icon: <ArbitrumIcon />,
		href: 'https://arbitrum.honey.finance'
	},
	{
		name: 'Polygon',
		value: '0x89',
		icon: <PolygonIcon />,
		href: 'https://polygon.honey.finance'
	},
	{
		name: 'Solana',
		value: 'solana',
		icon: <SolanaCircleIcon />,
		href: 'https://solana.honey.finance'
	}
];

const WalletMenu = () => {
	const queryClient = useQueryClient();
	const { setCurrentUser, currentUser } = useContext(UserContext);
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const { chain } = useNetwork();

	//Invalidate queries whenever isConnected or connected address changes
	const invalidateQueries = useCallback(async () => {
		await queryClient.invalidateQueries(['user']);
		await queryClient.invalidateQueries(['nft']);
		await queryClient.invalidateQueries(['coupons']);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//Hide sidebar and enable scoll for mobile
	const resetMobile = () => {
		setIsSidebarVisibleInMobile(false);
		document.body.classList.remove('disable-scroll');
	};

	const { address, isConnected } = useAccount({
		onConnect: () => {
			invalidateQueries();
			resetMobile();
		}
	});

	useEffect(() => {
		setCurrentUser(address ? { address } : null);
	}, [address]);

	return (
		<>
			<SettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
			<Space>
				{currentUser && (
					<Select
						value={chain ? hexValue(chain?.id) : ''}
						options={supportedChains.map((_chain) => ({
							value: _chain.value,
							label: (
								<Space align="center" className={styles.chainLabel}>
									{_chain.icon}
									<span className={styles.chainLabelName}>{_chain.name}</span>
								</Space>
							)
						}))}
						// open
						defaultValue="solana"
						onChange={(value) => {
							const href = supportedChains.find((_chain) => _chain.value === value)?.href;
							window.open(href);
						}}
						className={styles.dropdownSelect}
						popupClassName={styles.selectDropdownList}
						suffixIcon={
							<div className={styles.selectSuffixIcon}>
								<DownIcon fill={'black'} />
							</div>
						}
						// suffixIcon={<></>}
					/>
				)}
				<ConnectButton showBalance={false} />
			</Space>
		</>
	);
};

export default WalletMenu;
