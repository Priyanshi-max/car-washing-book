import { apiRequest } from '../utils/apiHelper';

// Get all bookings
export const getAllBookings = () => apiRequest('get', '/bookings');

// Get booking by ID
export const getBookingById = (id) => apiRequest('get', `/bookings/${id}`);

// Create new booking
export const createBooking = (data) => apiRequest('post', '/bookings', data);

// Update booking
export const updateBooking = (id, data) => apiRequest('put', `/bookings/${id}`, data);

// Delete booking
export const deleteBooking = (id) => apiRequest('delete', `/bookings/${id}`);
