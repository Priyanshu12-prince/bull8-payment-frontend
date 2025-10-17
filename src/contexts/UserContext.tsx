import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the user data type based on your API response
interface UserData {
  name: string;
  email: string;
  contact: string;
  userId: string;
  domainName: string;
  ctclId: string;
  plan: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const isAuthenticated = !!userData;
  

  const value = {
    userData,
    setUserData,
    isAuthenticated,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
