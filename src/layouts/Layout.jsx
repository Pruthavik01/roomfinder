import React from 'react';
import Header from '../components/Header';
import Footer from '../components/footer.jsx';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <div style={{padding:20}}>Loading...</div>;
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '70vh' }}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
