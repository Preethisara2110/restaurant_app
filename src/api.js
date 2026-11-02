const API_BASE = 'https://restaurantdata.onrender.com';

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }
  return response.json();
}

export async function getStates() {
  const data = await getJson(`${API_BASE}/states`);
  return Array.isArray(data) ? data : (data.states || data.data || []);
}

export async function getCities(state) {
  const data = await getJson(`${API_BASE}/cities/${encodeURIComponent(state)}`);
  return Array.isArray(data) ? data : (data.cities || data.data || []);
}

export async function getRestaurants(state, city) {
  const url = `${API_BASE}/restaurants?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`;
  const data = await getJson(url);
  if (Array.isArray(data)) return data;
  return data.restaurants || data.data || [];
}

export function normalizeRestaurant(item, index = 0) {
  return {
    id: String(item.id ?? item._id ?? item.restaurantId ?? `restaurant-${index}`),
    name: item.restaurantName ?? item.restaurant_name ?? item.name ?? 'Restaurant',
    address: item.address ?? item.restaurantAddress ?? 'Address not available',
    city: item.city ?? '',
    state: item.state ?? '',
    rating: item.overallRating ?? item.overall_rating ?? item.rating ?? item.avgRating ?? 'N/A',
    image: item.image ?? item.imageUrl ?? item.image_url ?? ''
  };
}
