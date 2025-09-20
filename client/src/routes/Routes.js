import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import BookingDetail from '../pages/BookingDetail';
import AddEditBooking from '../pages/AddEditBooking';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/booking/:id" element={<BookingDetail />} />
        <Route path="/add-booking" element={<AddEditBooking />} />
        <Route path="/edit-booking/:id" element={<AddEditBooking />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
