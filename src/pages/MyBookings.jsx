import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock3, Users, MapPin, Trash2, ClipboardList } from 'lucide-react';
import { readBookings, saveBookings, formatDate } from '../utils';

export default function MyBookings() {
  const [bookings, setBookings] = useState(readBookings);
  function cancel(id) {
    const updated = bookings.filter(b => b.bookingId !== id);
    setBookings(updated); saveBookings(updated);
  }
  return <main className="page-shell">
    <div className="container my-bookings-container">
      <span className="section-kicker">YOUR PLANS, ALL IN ONE PLACE</span>
      <div className="my-bookings-heading"><div><h1>My Bookings</h1><p className="muted">All your upcoming dining plans, together.</p></div><Link to="/" className="book-button">Find a restaurant</Link></div>
      {bookings.length === 0 ? <div className="empty-state bookings-empty"><div className="empty-icon"><ClipboardList size={28} /></div><h2>No reservations yet</h2><p>Your next favorite meal is waiting to be discovered.</p><Link to="/" className="book-button">Explore restaurants</Link></div> :
        <div className="bookings-list">{bookings.slice().reverse().map(booking => <article className="booking-card" key={booking.bookingId}>
          <div className="booking-card-top"><div><span className="confirmed-pill">Confirmed</span><h2>{booking.restaurantName}</h2><p><MapPin size={14} /> {booking.address}</p></div><button className="cancel-button" onClick={() => cancel(booking.bookingId)} aria-label={`Cancel ${booking.restaurantName} reservation`}><Trash2 size={17} /></button></div>
          <div className="booking-meta"><span><CalendarDays size={16} /> {formatDate(booking.date)}</span><span><Clock3 size={16} /> {booking.time}</span><span><Users size={16} /> {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span></div>
        </article>)}</div>}
    </div>
  </main>;
}
