export function readBookings() {
  try {
    const parsed = JSON.parse(localStorage.getItem('bookings') || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBookings(bookings) {
  localStorage.setItem('bookings', JSON.stringify(bookings));
}

export function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
}
