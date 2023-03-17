import React, { FC, ReactNode, useState } from 'react';

export type TCurrentUser = {
	address: string;
};

interface UserContextState {
	currentUser: TCurrentUser | null;
	setCurrentUser: React.Dispatch<React.SetStateAction<TCurrentUser | null>>;
}

const UserContext = React.createContext<UserContextState>({} as UserContextState);

interface UserProviderProps {
	children: ReactNode;
}

const UserProvider: FC<UserProviderProps> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<TCurrentUser | null>(null);
	return (
		<UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>
	);
};
export { UserProvider, UserContext };
