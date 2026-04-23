import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CartSidebar from './CartSidebar';

export default function CustomerLayout() {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
