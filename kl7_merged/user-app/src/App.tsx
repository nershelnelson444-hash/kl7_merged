import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import CarDetail from './pages/CarDetail';
import Blog from './pages/Blog';
import LegalPage from './pages/LegalPage';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import SellYourBike from './pages/SellYourBike';
import Login from './pages/Login';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function AppContent() {
  const { pathname } = useLocation();
  const hideLayout = pathname === '/login';

  return (
    <div className="w-full min-h-screen bg-background-main font-sans text-text-black relative">
      {!hideLayout && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/:slug" element={<CarDetail />} />
        <Route path="/legal-pages/:slug" element={<LegalPage />} />
        <Route path="/sell" element={<SellYourBike />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;