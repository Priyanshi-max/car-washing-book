import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Settings, Plus, Calendar, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import BookingCard from '../Components/BookingCard';
import { getAllBookings } from '../services/bookingService';

const HomePage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterService, setFilterService] = useState('All');

  useEffect(() => {
    const getBookings = async () => {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
      setLoading(false);
    };
    getBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          `${b.carDetails.make} ${b.carDetails.model}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    const matchesService = filterService === 'All' || b.serviceType === filterService;
    return matchesSearch && matchesStatus && matchesService;
  });

  const handleView = id => navigate(`/booking/${id}`);
  const handleEdit = id => navigate(`/edit-booking/${id}`);
  const handleDelete = id => { 
    if(window.confirm('Delete booking?')) setBookings(bookings.filter(b => b.id !== id)); 
  };
  const handleAddBooking = () => navigate('/add-booking');

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    totalRevenue: bookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.price, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg mr-3"><Calendar className="w-6 h-6 text-white" /></div>
                Car Wash Bookings
              </h1>
              <p className="text-gray-600 mt-1 ml-12">Manage your car wash appointments efficiently</p>
            </div>
            <button onClick={handleAddBooking} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium shadow-sm">
              <Plus className="w-5 h-5 mr-2" /> New Booking
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"><Calendar className="w-6 h-6 text-blue-600" /><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-gray-600 text-sm">Total Bookings</p></div></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"><AlertCircle className="w-6 h-6 text-yellow-600" /><div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-gray-600 text-sm">Pending</p></div></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"><CheckCircle className="w-6 h-6 text-blue-600" /><div><p className="text-2xl font-bold">{stats.confirmed}</p><p className="text-gray-600 text-sm">Confirmed</p></div></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"><CheckCircle className="w-6 h-6 text-green-600" /><div><p className="text-2xl font-bold">{stats.completed}</p><p className="text-gray-600 text-sm">Completed</p></div></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"><DollarSign className="w-6 h-6 text-green-600" /><div><p className="text-2xl font-bold">${stats.totalRevenue}</p><p className="text-gray-600 text-sm">Revenue</p></div></div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative"><Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" /><input type="text" placeholder="Search by customer or car..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" /></div>
          <div className="relative"><Filter className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" /><select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"><option value="All">All Statuses</option><option value="Pending">Pending</option><option value="Confirmed">Confirmed</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div>
          <div className="relative"><Settings className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" /><select value={filterService} onChange={e => setFilterService(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"><option value="All">All Services</option><option value="Basic Wash">Basic Wash</option><option value="Deluxe Wash">Deluxe Wash</option><option value="Full Detailing">Full Detailing</option><option value="Premium Detailing">Premium Detailing</option></select></div>
        </div>

        {/* Bookings */}
        {loading ? (
          <p className="text-center text-gray-500 py-12">Loading bookings...</p>
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBookings.map(b => <BookingCard key={b.id} booking={b} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />)}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
