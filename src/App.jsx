import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';

export default function App() {
  return <div className="app">
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/booking/:id" element={<BookingPage />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="*" element={<Home />} />
    </Routes>
    <Footer />
  </div>;
}
