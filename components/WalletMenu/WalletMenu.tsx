import { Dropdown, Menu, Space, Typography } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/userContext';
import { useQueryClient } from 'react-query';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import useDisplayStore from 'store/displayStore';
import * as styles from './WalletMenu.css';
import { SettingsIcon } from 'icons/SettingsIcon';
import SettingsModal from 'components/SettingsModal/SettingsModal';

const WalletMenu = () => {
	const queryClient = useQueryClient();
	const { setCurrentUser } = useContext(UserContext);
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);
	const [showSettingsModal, setShowSettingsModal] = useState(false);

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
				<div className={styles.settingsIcon} onClick={() => setShowSettingsModal(true)}>
					<SettingsIcon />
				</div>
				<ConnectButton showBalance={false} />
			</Space>
		</>
	);
};

export default WalletMenu;
