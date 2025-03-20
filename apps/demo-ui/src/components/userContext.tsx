import { createContext, FC, useContext, useState } from "react";

interface UserContextType {
  isLoggedIn: boolean;
  userData: string | null;
  logOut: () => void;
}
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("userAuthorized");
  });

  const [userData, setUserData] = useState<string | null>(() => {
    return localStorage.getItem("userAuthorized");
  });

  const logOut = () => {
    localStorage.removeItem("userAuthorized");
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, userData, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
