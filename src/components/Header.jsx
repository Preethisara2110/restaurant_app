import { Link, NavLink } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link to="/" className="brand" aria-label="TableEase home">
          <span className="brand-mark"><UtensilsCrossed size={21} /></span>
          <span>table<span className="brand-accent">ease</span></span>
        </Link>
        <nav className="main-nav">
          <NavLink to="/" end>Find Restaurants</NavLink>
          <a href="/#locations">Locations</a>
          <NavLink to="/my-bookings">Reservations</NavLink>
        </nav>
        <NavLink className="nav-cta" to="/my-bookings">My Bookings</NavLink>
      </div>
    </header>
  );
}
