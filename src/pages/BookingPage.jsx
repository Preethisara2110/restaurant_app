import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock3, Users, MapPin, CheckCircle2, Star } from 'lucide-react';
import { readBookings, saveBookings, formatDate } from '../utils';

const slots = [
  { label: 'Morning', times: ['9:00 AM', '10:00 AM', '11:00 AM'] },
  { label: 'Afternoon', times: ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'] },
  { label: 'Evening', times: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'] }
];
function dateKey(date) {
  const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, '0'), d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function BookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const restaurant = location.state?.restaurant || readBookings().find(b => String(b.restaurantId) === id);
  const dates = useMemo(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() + i); return d; }), []);
  const [selectedDate, setSelectedDate] = useState(dateKey(dates[0]));
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [confirmed, setConfirmed] = useState(false);

  if (!restaurant) return <main className="page-shell"><div className="container empty-state"><h2>Restaurant not found</h2><p>Please search for a restaurant again.</p><Link to="/" className="book-button">Find restaurants</Link></div></main>;

  function confirmBooking() {
    if (!selectedTime) return;
    const booking = {
      bookingId: `${Date.now()}`,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      date: selectedDate,
      time: selectedTime,
      guests: Number(guests),
      createdAt: new Date().toISOString()
    };
    saveBookings([...readBookings(), booking]);
    setConfirmed(true);
  }

  return <main className="page-shell">
    <div className="container booking-container">
      <Link to={-1} className="back-link"><ArrowLeft size={16} /> Back to restaurants</Link>
      <div className="booking-layout">
        <section className="booking-main">
          <span className="section-kicker">MAKE IT A DATE</span>
          <h1>Reserve your <em>table.</em></h1>
          <div className="selected-restaurant">
            <div className="restaurant-avatar">{restaurant.name?.charAt(0) || 'R'}</div>
            <div><h2>{restaurant.name}</h2><p><MapPin size={14} /> {restaurant.address}</p></div>
            <span className="rating"><Star size={14} fill="currentColor" /> {restaurant.rating || 'N/A'}</span>
          </div>
          <div className="booking-section">
            <div className="step-heading"><span className="step-number">01</span><div><h3>Choose a date</h3><p>Select a day within the next 7 days</p></div><CalendarDays /></div>
            <div className="date-picker-row">
              {dates.map((date, i) => <button key={dateKey(date)} type="button" className={`date-option ${selectedDate === dateKey(date) ? 'selected' : ''}`} data-testid="date-option" onClick={() => { setSelectedDate(dateKey(date)); setSelectedTime(''); }}>
                <span>{i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}</span><strong>{date.getDate()}</strong><small>{date.toLocaleDateString('en-US', { month: 'short' })}</small>
              </button>)}
            </div>
          </div>
          <div className="booking-section">
            <div className="step-heading"><span className="step-number">02</span><div><h3>Choose a time</h3><p>Pick the time that works best for you</p></div><Clock3 /></div>
            <p className="today-label">{selectedDate === dateKey(dates[0]) ? 'Today' : formatDate(selectedDate)}</p>
            {slots.map(group => <div className="time-group" key={group.label}><p>{group.label}</p><div className="time-options">{group.times.map(time => <button key={time} type="button" data-testid="time-slot" className={`time-option ${selectedTime === time ? 'selected' : ''}`} onClick={() => setSelectedTime(time)}>{time}</button>)}</div></div>)}
          </div>
        </section>
        <aside className="booking-summary">
          <span className="section-kicker">YOUR RESERVATION</span><h2>Almost <em>there.</em></h2>
          <div className="summary-line"><CalendarDays size={17} /><span>{formatDate(selectedDate)}</span></div>
          <div className="summary-line"><Clock3 size={17} /><span>{selectedTime || 'Select a time'}</span></div>
          <div className="summary-line"><Users size={17} /><select aria-label="Number of guests" value={guests} onChange={e => setGuests(e.target.value)}>{[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}</select></div>
          <div className="summary-divider"></div>
          <div className="summary-total"><span>Reservation fee</span><strong>FREE</strong></div>
          <button className="confirm-button" type="button" disabled={!selectedTime} onClick={confirmBooking}>Confirm reservation</button>
          <p className="summary-note">No payment required. You can manage your reservation anytime.</p>
          {confirmed && <div className="confirmation"><CheckCircle2 size={20} /><div><strong>Reservation confirmed!</strong><p>Your table has been saved.</p><button onClick={() => navigate('/my-bookings')}>View my bookings</button></div></div>}
        </aside>
      </div>
    </div>
  </main>;
}
