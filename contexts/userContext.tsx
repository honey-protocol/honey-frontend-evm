import React, { FC, ReactNode, useState } from "react";
import MoralisType from "moralis-v1";

interface UserContextState {
  currentUser: MoralisType.User | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<MoralisType.User<MoralisType.Attributes> | null>>,
}


const UserContext = React.createContext<UserContextState>({} as UserContextState);

interface UserProviderProps {
  children: ReactNode;
}


const UserProvider: FC<UserProviderProps> =
  ({
     children,
   }) => {
    const [currentUser, setCurrentUser] = useState<MoralisType.User | null>(null);
    return <UserContext.Provider value={{currentUser, setCurrentUser}}>{children}</UserContext.Provider>;
  };
export { UserProvider, UserContext };