# TableEase – Restaurant Reservation App

## Run locally
1. Install Node.js (18+ recommended).
2. Open this folder in VS Code / terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL shown by Vite.

## Build
`npm run build`

## Features
- State and city dropdowns from the provided restaurant API.
- Restaurant search by state and city.
- Restaurant cards with ratings and booking navigation.
- Reservation date selection for the next seven days.
- Time slot and guest selection.
- My Bookings page backed by `localStorage` key `bookings`.
- Swiper carousel and responsive layout.
- Vercel rewrite for direct visits to `/my-bookings`.

The API can take up to 60 seconds to respond. The app shows loading and error states and does not silently substitute unrelated restaurant results.
