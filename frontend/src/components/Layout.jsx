import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useNavbar } from '../context/NavbarContext';

export default function Layout() {
  const { navbarProps } = useNavbar();
  const location = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <Navbar {...navbarProps} />
      <Outlet />
    </>
  );
}
