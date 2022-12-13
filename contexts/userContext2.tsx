import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useQueryClient } from 'react-query';

interface UserContextState {
	walletAddress: string;
	connect: () => void;
	disconnect: () => void;
	moralisAuthenticate: () => void;
	isMoralisAuthenticated: boolean;
}

const UserContext = React.createContext<UserContextState>({} as UserContextState);

interface UserProviderProps {
	children: ReactNode;
}

const UserProvider: FC<UserProviderProps> = ({ children }) => {
	const [walletAddress, setWalletAddress] = useState<string>('');
	const [isMoralisAuthenticated, setIsMoralisAuthenticated] = useState(false);
	const { authenticate, user, logout } = useMoralis();
	const queryClient = useQueryClient();

	const moralisAuthenticate = async () => {
		if (!isMoralisAuthenticated) {
			await authenticate({ signingMessage: 'Authorize linking of your wallet' });
			console.log('logged in user:', user?.get('ethAddress'));
			await queryClient.invalidateQueries(['user']);
			await queryClient.invalidateQueries(['nft']);
			await queryClient.invalidateQueries(['coupons']);
			setIsMoralisAuthenticated(true);
		}
	};

	const connect = useCallback(async () => {
		const ethereum = window.ethereum;
		if (!ethereum || !ethereum.request) {
			alert('Get metamask');
			return;
		}
		const accounts = await ethereum?.request({ method: 'eth_requestAccounts' });
		setWalletAddress(accounts[0]);
		console.log('Connected ', accounts[0]);
	}, []);

	const disconnect = async () => {
		await logout();
		setWalletAddress('');
		console.log('log out:', user?.get('ethAddress'));
	};

	const checkIfWalletConnected = useCallback(async () => {
		const ethereum = window.ethereum;
		if (!ethereum || !ethereum.request) return;
		const accounts = await ethereum?.request({ method: 'eth_accounts' });
		if (!accounts.length) {
			console.log('No accounts found');
		} else {
			console.log({ accounts });
			setWalletAddress(accounts[0]);
		}
	}, []);

	useEffect(() => {
		checkIfWalletConnected();
	}, [checkIfWalletConnected]);

	return (
		<UserContext.Provider
			value={{ walletAddress, connect, disconnect, moralisAuthenticate, isMoralisAuthenticated }}
		>
			{children}
		</UserContext.Provider>
	);
};
export { UserProvider, UserContext };
