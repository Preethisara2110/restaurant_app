import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Sparkles } from 'lucide-react';
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
  </main>;
}
