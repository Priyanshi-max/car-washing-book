import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Settings, Plus, Calendar, CheckCircle, AlertCircle, DollarSign, List, ArrowUpDown } from 'lucide-react';
import BookingCard from '../Components/BookingCard';
import DeleteConfirmationModal from '../Components/DeleteConfirmationModal';
import Pagination from '../Components/Pagination';
import { getAllBookings, deleteBooking } from '../services/bookingService';

const HomePage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterService, setFilterService] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Now changeable
  
  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Items per page options
  const itemsPerPageOptions = [1, 8, 10, 20, 30];

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price (High to Low)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'status', label: 'Status' },
    { value: 'service', label: 'Service Type' }
  ];

  useEffect(() => {
    const getBookingsData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getAllBookings();
        setBookings(data || []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("⚠️ Unable to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getBookingsData();
  }, []);

  // Reset to first page when filters change or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterService, itemsPerPage, sortBy]);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          `${b.carDetails?.make} ${b.carDetails?.model}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    const matchesService = filterService === 'All' || b.serviceType === filterService;
    return matchesSearch && matchesStatus && matchesService;
  });

  // Sort the filtered bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate);
      case 'oldest':
        return new Date(a.createdAt || a.bookingDate) - new Date(b.createdAt || b.bookingDate);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'status':
        const statusOrder = { 'Pending': 1, 'Confirmed': 2, 'Completed': 3, 'Cancelled': 4 };
        return (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
      case 'service':
        return (a.serviceType || '').localeCompare(b.serviceType || '');
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalFilteredBookings = sortedBookings.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = sortedBookings.slice(startIndex, endIndex);

  const handleView = (bookingId) => navigate(`/booking/${bookingId}`);
  const handleEdit = (bookingId) => navigate(`/edit-booking/${bookingId}`);
  
  const handleDelete = (bookingId) => {
    const booking = bookings.find(b => b.bookingId === bookingId);
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bookingToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteBooking(bookingToDelete.bookingId);
      setBookings(bookings.filter(b => b.bookingId !== bookingToDelete.bookingId));
      setShowDeleteModal(false);
      setBookingToDelete(null);
      
      // If current page becomes empty after deletion, go to previous page
      const remainingBookings = bookings.filter(b => b.bookingId !== bookingToDelete.bookingId);
      const newFilteredCount = remainingBookings.filter(b => {
        const matchesSearch = b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              `${b.carDetails?.make} ${b.carDetails?.model}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
        const matchesService = filterService === 'All' || b.serviceType === filterService;
        return matchesSearch && matchesStatus && matchesService;
      }).length;
      
      const newTotalPages = Math.ceil(newFilteredCount / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error("Failed to delete booking:", err);
      setError("⚠️ Unable to delete booking. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBookingToDelete(null);
  };

  const handleAddBooking = () => navigate('/add-booking');

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    // Current page will be reset to 1 by the useEffect
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // Current page will be reset to 1 by the useEffect
  };

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

        {/* Show error message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
            {error}
          </div>
        )}

        {/* Stats */}
        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"><Calendar className="w-6 h-6 text-blue-600" /><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-gray-600 text-sm">Total Bookings</p></div></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"><AlertCircle className="w-6 h-6 text-yellow-600" /><div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-gray-600 text-sm">Pending</p></div></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"><CheckCircle className="w-6 h-6 text-blue-600" /><div><p className="text-2xl font-bold">{stats.confirmed}</p><p className="text-gray-600 text-sm">Confirmed</p></div></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"><CheckCircle className="w-6 h-6 text-green-600" /><div><p className="text-2xl font-bold">{stats.completed}</p><p className="text-gray-600 text-sm">Completed</p></div></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <span className="text-green-600 text-2xl font-bold">₹</span>
              <div>
                <p className="text-2xl font-bold">{stats.totalRevenue}</p>
                <p className="text-gray-600 text-sm">Revenue</p>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        {!error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by customer or car..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                />
              </div>
              <div className="relative">
                <Filter className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                <select 
                  value={filterStatus} 
                  onChange={e => setFilterStatus(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="relative">
                <Settings className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                <select 
                  value={filterService} 
                  onChange={e => setFilterService(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
                >
                  <option value="All">All Services</option>
                  <option value="Basic Wash">Basic Wash</option>
                  <option value="Deluxe Wash">Deluxe Wash</option>
                  <option value="Full Detailing">Full Detailing</option>
                  <option value="Premium Detailing">Premium Detailing</option>
                </select>
              </div>
              <div className="relative">
                <List className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                <select 
                  value={itemsPerPage} 
                  onChange={e => handleItemsPerPageChange(Number(e.target.value))} 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
                >
                  {itemsPerPageOptions.map(option => (
                    <option key={option} value={option}>
                      {option} per page
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Sort Options */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ArrowUpDown className="w-4 h-4" />
                Sort by:
              </div>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      sortBy === option.value
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {!error && !loading && (
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-600">
            <div>
              Showing {currentBookings.length} of {totalFilteredBookings} bookings
              {totalFilteredBookings !== bookings.length && (
                <span className="text-blue-600"> (filtered from {bookings.length} total)</span>
              )}
            </div>
            <div>
              Page {currentPage} of {Math.ceil(totalFilteredBookings / itemsPerPage) || 1}
            </div>
          </div>
        )}

        {/* Bookings */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-4">Loading bookings...</p>
          </div>
        ) : !error && totalFilteredBookings > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentBookings.map(b => (
                <BookingCard
                  key={b.bookingId}     
                  booking={b}
                  onView={() => handleView(b.bookingId)}
                  onEdit={() => handleEdit(b.bookingId)}
                  onDelete={() => handleDelete(b.bookingId)}
                />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
              <Pagination
                currentPage={currentPage}
                totalItems={totalFilteredBookings}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                showItemCount={true}
                maxVisiblePages={5}
              />
            </div>
          </>
        ) : !error && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <p className="text-gray-600 text-lg">No bookings found</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchTerm || filterStatus !== 'All' || filterService !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Create your first booking to get started'
              }
            </p>
            {!(searchTerm || filterStatus !== 'All' || filterService !== 'All') && (
              <button 
                onClick={handleAddBooking}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Booking
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        bookingData={bookingToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default HomePage;