import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Settings, 
  MapPin,
  Download,
  Share
} from 'lucide-react';
import { getBookingById, updateBooking, deleteBooking } from '../services/bookingService';
import BookingDetailCard from '../Components/BookingDetailCard';
import DeleteConfirmationModal from '../Components/DeleteConfirmationModal';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBookingById(id);
        setBooking(response.data || response);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  const handleBack = () => navigate(-1);
  const handleEdit = () => navigate(`/edit-booking/${id}`);
  const handleDelete = () => setShowDeleteModal(true);
  const cancelDelete = () => setShowDeleteModal(false);

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBooking(id);
      setShowDeleteModal(false);
      navigate('/');
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
      try {
        const updatedBooking = { ...booking, status: newStatus };
        await updateBooking(id, updatedBooking);
        setBooking(updatedBooking);
      } catch (err) {
        console.error('Error updating booking status:', err);
        alert('Failed to update booking status. Please try again.');
      }
    }
  };

  const handleDownload = () => {
    console.log('Downloading booking receipt...');
    alert('Receipt download started!');
  };

  const handleShare = () => {
    console.log('Sharing booking details...');
    alert('Booking details copied to clipboard!');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error Loading Booking</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button onClick={handleBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No booking found
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
          <p className="mt-2 text-gray-600">The booking you're looking for doesn't exist.</p>
          <button onClick={handleBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gray-50">
  {/* Header */}
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:py-6 gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <button onClick={handleBack} className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Booking Details</h1>
        </div>
        
        {/* Action Buttons - Responsive */}
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto overflow-x-auto">
          <button onClick={handleDownload} className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center transition-colors text-sm whitespace-nowrap flex-shrink-0">
            <Download className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Download</span>
          </button>
          <button onClick={handleShare} className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center transition-colors text-sm whitespace-nowrap flex-shrink-0">
            <Share className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Share</span>
          </button>
          <button onClick={handleEdit} className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors text-sm whitespace-nowrap flex-shrink-0">
            <Edit className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Edit</span>
          </button>
          <button onClick={handleDelete} className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center transition-colors text-sm whitespace-nowrap flex-shrink-0">
            <Trash2 className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {/* Main Content - Using BookingDetailCard Component */}
      <BookingDetailCard booking={booking} onStatusChange={handleStatusChange} />

      {/* Sidebar */}
      <div className="space-y-4 sm:space-y-6 lg:col-span-1 order-first lg:order-last">
        {/* Appointment Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Info</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start sm:items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-1 sm:mt-0 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold text-gray-900 break-words">{booking.date || 'Not scheduled'}</p>
              </div>
            </div>
            <div className="flex items-start sm:items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-3 mt-1 sm:mt-0 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">Time Slot</p>
                <p className="font-semibold text-gray-900 break-words">{booking.timeSlot || 'Not scheduled'}</p>
              </div>
            </div>
            {booking.duration && (
              <div className="flex items-start sm:items-center">
                <Settings className="w-5 h-5 text-gray-400 mr-3 mt-1 sm:mt-0 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-900">{booking.duration} minutes</p>
                </div>
              </div>
            )}
            {booking.location && (
              <div className="flex items-start sm:items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1 sm:mt-0 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900 break-words">{booking.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <span className="text-green-600 mr-2 text-xl sm:text-2xl">₹</span>
              <span className="text-gray-600 text-sm sm:text-base">Total Amount</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-green-600 ml-2">₹{booking.price || '0'}</span>
          </div>
        </div>

        {/* Booking History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking History</h3>
          <div className="space-y-3">
            {booking.createdAt && (
              <div className="flex items-start text-sm">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span className="text-gray-600 break-words">Booking created on {booking.createdAt}</span>
              </div>
            )}
            <div className="flex items-start text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
              <span className="text-gray-600 break-words">Status: {booking.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Delete Confirmation Modal */}
  <DeleteConfirmationModal
    isOpen={showDeleteModal}
    onClose={cancelDelete}
    onConfirm={confirmDelete}
    bookingData={booking}
    isDeleting={isDeleting}
  />
</div>
  );
};

export default BookingDetail;