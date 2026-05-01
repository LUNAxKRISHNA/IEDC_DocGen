import { createContext, useContext, useState } from 'react';

const NavbarContext = createContext();

export function NavbarProvider({ children }) {
  const [navbarProps, setNavbarProps] = useState({
    leftContent: null,
    rightContent: null,
    centerContent: null,
    isHome: false,
  });

  return (
    <NavbarContext.Provider value={{ navbarProps, setNavbarProps }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}
