import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { getRestaurants, normalizeRestaurant } from '../api';
import RestaurantCard from '../components/RestaurantCard';

export default function SearchResults() {
  const [params] = useSearchParams();
  const state = params.get('state') || '';
  const city = params.get('city') || '';
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    getRestaurants(state, city).then(items => {
      if (active) setRestaurants(items.map(normalizeRestaurant));
    }).catch(err => { if (active) setError(err.message || 'Unable to load restaurants.'); })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [state, city]);

  return <main className="page-shell">
    <div className="container results-container">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Change location</Link>
      <div className="results-header">
        <div><span className="section-kicker">YOUR NEXT GREAT MEAL</span>
          <h1>{loading ? 'Finding restaurants…' : `${restaurants.length} restaurants available in ${city}`}</h1>
          <p className="muted">{city}, {state} · Handpicked places for memorable moments</p>
        </div>
        <div className="location-chip"><Search size={16} /> {city}, {state}</div>
      </div>
      {loading && <div className="loading-state"><span className="spinner"></span><h3>Finding your table</h3><p>The restaurant server may take up to 60 seconds to wake up. Thanks for waiting.</p></div>}
      {!loading && error && <div className="empty-state"><h3>We couldn't load restaurants</h3><p>{error}</p><button className="outline-button" onClick={() => window.location.reload()}>Try again</button></div>}
      {!loading && !error && restaurants.length === 0 && <div className="empty-state"><h3>No restaurants found in {city}</h3><p>Try another city to discover more places.</p><Link className="book-button" to="/">Search another location</Link></div>}
      {!loading && !error && restaurants.length > 0 && <div className="restaurant-grid">{restaurants.map((r, i) => <RestaurantCard key={`${r.id}-${i}`} restaurant={r} index={i} />)}</div>}
    </div>
  </main>;
}
