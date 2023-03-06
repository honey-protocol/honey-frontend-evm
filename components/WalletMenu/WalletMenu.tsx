import { Dropdown, Menu, Space, Typography } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/userContext';
import { useQueryClient } from 'react-query';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import useDisplayStore from 'store/displayStore';

const WalletMenu = () => {
	const queryClient = useQueryClient();
	const { setCurrentUser } = useContext(UserContext);
	const setIsSidebarVisibleInMobile = useDisplayStore((state) => state.setIsSidebarVisibleInMobile);

	//Invalidate queries whenever isConnected or connected address changes
	const invalidateQueries = useCallback(async () => {
		await queryClient.invalidateQueries(['user']);
		await queryClient.invalidateQueries(['nft']);
		await queryClient.invalidateQueries(['coupons']);
	}, [queryClient]);

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

	return <ConnectButton showBalance={false} />;
};

export default WalletMenu;
