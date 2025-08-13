import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout: React.FC = () => {
  // State để điều khiển header trong suốt
  const [isNavbarTransparent, setIsNavbarTransparent] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar isTransparent={isNavbarTransparent && location.pathname === '/'} />
      <main className="">
        <Outlet context={{ setIsNavbarTransparent }} />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 