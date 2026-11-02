import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Sparkles, Utensils, CalendarCheck, ShieldCheck, ArrowRight, ChevronDown as Down } from 'lucide-react';
import { getStates, getCities } from '../api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const fallbackStates = ['California', 'Florida', 'Illinois', 'New York', 'Texas', 'Washington'];
const fallbackCities = {
  California: ['Los Angeles', 'San Diego', 'San Francisco', 'San Jose'],
  Florida: ['Jacksonville', 'Miami', 'Orlando', 'Tampa'],
  Illinois: ['Chicago', 'Aurora', 'Naperville'],
  'New York': ['New York City', 'Buffalo', 'Rochester'],
  Texas: ['Austin', 'Dallas', 'Houston', 'San Antonio'],
  Washington: ['Seattle', 'Spokane', 'Tacoma']
};
const slides = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=85',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85'
];

export default function Home() {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getStates().then(items => {
      if (active) setStates(items.map(x => typeof x === 'string' ? x : x.name ?? x.state).filter(Boolean));
    }).catch(() => {
      if (active) { setStates(fallbackStates); setError('Unable to reach the server right now. Showing available state options.'); }
    }).finally(() => active && setLoadingStates(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!state) { setCities([]); setCity(''); return; }
    let active = true;
    setLoadingCities(true); setCity('');
    getCities(state).then(items => {
      if (active) setCities(items.map(x => typeof x === 'string' ? x : x.name ?? x.city).filter(Boolean));
    }).catch(() => {
      if (active) setCities(fallbackCities[state] || []);
    }).finally(() => active && setLoadingCities(false));
    return () => { active = false; };
  }, [state]);

  function submit(e) {
    e.preventDefault();
    if (!state || !city) { setError('Please select both a state and a city.'); return; }
    navigate(`/search?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`);
  }

  return <main>
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <span className="eyebrow"><Sparkles size={15} /> GOOD FOOD, GREAT MOMENTS</span>
        <h1>Find your table.<br /><em>Make it memorable.</em></h1>
        <p className="hero-copy">Discover the best restaurants around you and reserve your perfect table in just a few clicks.</p>
        <form className="search-panel" onSubmit={submit}>
          <div className="search-field" id="state">
            <label htmlFor="stateSelect"><MapPin size={16} /> Select State</label>
            <select id="stateSelect" aria-label="Select state" value={state} onChange={e => { setState(e.target.value); setError(''); }} disabled={loadingStates}>
              <option value="">{loadingStates ? 'Loading states…' : 'Choose a state'}</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="select-chevron" size={17} />
          </div>
          <div className="search-divider"></div>
          <div className="search-field" id="city">
            <label htmlFor="citySelect"><MapPin size={16} /> Select City</label>
            <select id="citySelect" aria-label="Select city" value={city} onChange={e => { setCity(e.target.value); setError(''); }} disabled={!state || loadingCities}>
              <option value="">{!state ? 'Choose a state first' : loadingCities ? 'Loading cities…' : 'Choose a city'}</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="select-chevron" size={17} />
          </div>
          <button id="searchBtn" className="search-button" type="submit"><Search size={18} /> Search</button>
        </form>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="hero-note"><span className="note-dot"></span> Free reservations · No booking fees</div>
      </div>
      <div className="hero-bottom"><span>01 — DISCOVER</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section className="intro-section container" id="locations">
      <div><span className="section-kicker">A SEAT AT THE TABLE</span><h2>Every occasion deserves<br />a <em>great place.</em></h2></div>
      <p>From cozy neighborhood favorites to special-occasion dining, find a restaurant that feels just right. Your next great meal is closer than you think.</p>
    </section>
    <section className="carousel-section">
      <div className="container carousel-heading"><div><span className="section-kicker">THE EXPERIENCE</span><h2>Made for <em>good times.</em></h2></div><span className="carousel-caption">A little inspiration for your next outing</span></div>
      <Swiper modules={[Autoplay]} autoplay={{ delay: 3200, disableOnInteraction: false }} loop spaceBetween={18} slidesPerView={1.15} breakpoints={{640:{slidesPerView:2.1}, 1024:{slidesPerView:3.1}}} className="experience-swiper">
        {slides.map((src, i) => <SwiperSlide key={src}><div className="experience-slide"><img src={src} alt={`Restaurant dining inspiration ${i + 1}`} /><span>{['The perfect date night', 'Gather around the table', 'Something worth celebrating'][i]}</span></div></SwiperSlide>)}
      </Swiper>
    </section>

    <section className="offers-section container">
      <div className="section-heading"><span className="section-kicker">SPECIAL OFFERS</span><h2>Good food. <em>Great deals.</em></h2><p>Discover something delicious for your next outing.</p></div>
      <div className="offer-grid">
        <article className="offer-card offer-food"><img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=85" alt="Fresh restaurant meal"/><div><span>WEEKEND SPECIAL</span><h3>Make room for<br/>something delicious</h3><strong>50% OFF</strong></div></article>
        <article className="offer-card offer-dark"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=85" alt="A delicious meal"/><div><span>THE FOOD EDIT</span><h3>Explore new<br/>favourites</h3><strong>DISCOVER MORE</strong></div></article>
        <article className="offer-card offer-food"><img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=85" alt="Colorful healthy food"/><div><span>FRESH PICKS</span><h3>Every bite<br/>is a good idea</h3><strong>50% OFF</strong></div></article>
      </div>
    </section>

    <section className="about-band"><div className="container about-inner"><div className="about-icon"><Utensils size={38}/></div><div><span className="section-kicker">WELCOME TO TABLEEASE</span><h2>Restaurant <em>Food & Drinks</em></h2><p>Make every meal memorable. Find a place you love, choose a time that works, and book your table in just a few clicks.</p><ul><li><CalendarCheck size={16}/> Easy online reservations</li><li><ShieldCheck size={16}/> No booking fees</li><li><MapPin size={16}/> Restaurants across the USA</li></ul></div></div></section>

    <section className="news-section container"><div className="section-heading"><span className="section-kicker">A LITTLE INSPIRATION</span><h2>Read our latest <em>news.</em></h2></div><div className="news-grid">{[{img:'https://images.unsplash.com/photo-1498833766827-4b8f6b8f5e6a?w=700&q=80',title:'The joy of discovering a new favourite'},{img:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80',title:'A table for every special occasion'},{img:'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=700&q=80',title:'Make your next dining experience count'}].map((item,i)=><article className="news-card" key={item.title}><img src={item.img} alt="Restaurant dining"/><small>DINING · {i+1} MIN READ</small><h3>{item.title}</h3><a href="#locations">Read more <ArrowRight size={13}/></a></article>)}</div></section>

    <section className="booking-info-band"><div className="container booking-info-inner"><div><span className="section-kicker">SIMPLE FROM START TO FINISH</span><h2>Table booking,<br/><em>made easy.</em></h2><p>Choose your destination, find your favourite restaurant, and reserve your table. Your next great meal is only a few clicks away.</p><a className="book-button" href="#locations">Find a restaurant <ArrowRight size={15}/></a></div><img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&q=85" alt="People enjoying a restaurant experience"/></div></section>

    <section className="faq-section container"><div className="section-heading"><span className="section-kicker">NEED A HAND?</span><h2>Frequently asked <em>questions.</em></h2></div><div className="faq-layout"><img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85" alt="Beautiful restaurant interior"/><div><details open><summary>How do I make a restaurant reservation?<Down size={16}/></summary><p>Select a state and city, choose a restaurant, then pick your preferred date and time.</p></details><details><summary>Can I book a table in advance?<Down size={16}/></summary><p>Yes. You can reserve a table for any available day within the next seven days.</p></details><details><summary>Is there a reservation fee?<Down size={16}/></summary><p>No. Reservations through TableEase are free.</p></details><details><summary>Where can I view my reservations?<Down size={16}/></summary><p>Open My Bookings from the navigation bar to view or cancel saved reservations.</p></details></div></div></section>

    <section className="app-download"><div className="container app-download-inner"><img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9?w=550&q=85" alt="Mobile restaurant booking"/><div><span className="section-kicker">GOOD FOOD IS JUST A TAP AWAY</span><h2>Download the<br/><em>Restaurant Booking App</em></h2><p>Discover restaurants and keep your dining plans close at hand.</p><a className="book-button" href="#locations">Explore restaurants <ArrowRight size={15}/></a></div></div></section>
  </main>;
}
