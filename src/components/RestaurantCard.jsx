import { MapPin, Star, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const photos = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80'
];

export default function RestaurantCard({ restaurant, index }) {
  const image = restaurant.image || photos[index % photos.length];
  return <article className="restaurant-card">
    <div className="restaurant-image-wrap">
      <img className="restaurant-image" src={image} alt={restaurant.name}
        onError={e => { e.currentTarget.src = photos[index % photos.length]; }} />
      <span className="image-tag">Popular choice</span>
    </div>
    <div className="restaurant-content">
      <div className="restaurant-title-row">
        <h3>{restaurant.name}</h3>
        <span className="rating"><Star size={15} fill="currentColor" /> {restaurant.rating}</span>
      </div>
      <p className="address"><MapPin size={15} /> {restaurant.address}</p>
      <p className="restaurant-location">{[restaurant.city, restaurant.state].filter(Boolean).join(', ')}</p>
      <div className="card-bottom">
        <span className="free-label">Free reservation</span>
        <Link className="book-button" to={`/booking/${encodeURIComponent(restaurant.id)}`}
          state={{ restaurant }}>
          Book FREE Reservation <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  </article>;
}
