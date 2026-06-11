import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const NavbarWrapper = () => {
  const location = useLocation();
  
  // Define routes where navbar should be hidden
  const hideNavbarRoutes = ['/join', '/explore', '/login', '/reset-password'];

  // Hide on those routes and anywhere inside the member portal (it has its own topbar).
  const shouldHideNavbar =
    hideNavbarRoutes.includes(location.pathname) || location.pathname.startsWith('/dashboard');
  
  if (shouldHideNavbar) {
    return null;
  }
  
  return <Navbar />;
};

export default NavbarWrapper;