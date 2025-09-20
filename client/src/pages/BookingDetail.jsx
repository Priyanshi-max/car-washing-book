import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Car, 
  Calendar, 
  Clock, 
  User, 
  Settings, 
  Star, 
  DollarSign,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Share
} from 'lucide-react';
import { getBookingById, updateBooking, deleteBooking } from '../services/bookingService';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: AlertCircle,
      bgColor: 'bg-yellow-50'
    },
    Confirmed: { 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      icon: CheckCircle,
      bgColor: 'bg-blue-50'
    },
    Completed: { 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle,
      bgColor: 'bg-green-50'
    },
    Cancelled: { 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: XCircle,
      bgColor: 'bg-red-50'
    }
  };
  
  const config = statusConfig[status] || statusConfig.Pending;
  const IconComponent = config.icon;
  
  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${config.color}`}>
      <IconComponent className="w-5 h-5 mr-2" />
      <span className="font-semibold">{status}</span>
    </div>
  );
};

// Star Rating Component
const StarRating = ({ rating, showNoRating = true }) => {
  if (!rating && showNoRating) {
    return <span className="text-gray-400">No rating yet</span>;
  }
  
  if (!rating) return null;
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-2 text-gray-600 font-medium">({rating}/5)</span>
    </div>
  );
};

// Info Row Component
const InfoRow = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-start py-3 ${className}`}>
    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <div className="ml-4 flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-base text-gray-900 font-medium">{value}</p>
    </div>
  </div>
);

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBookingById(id);
        setBooking(response.data || response); // Handle different response structures
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

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/edit-booking/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(id);
        console.log('Booking deleted successfully');
        navigate('/');
      } catch (err) {
        console.error('Error deleting booking:', err);
        alert('Failed to delete booking. Please try again.');
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
      try {
        const updatedBooking = { ...booking, status: newStatus };
        await updateBooking(id, updatedBooking);
        setBooking(updatedBooking);
        console.log('Booking status updated successfully');
      } catch (err) {
        console.error('Error updating booking status:', err);
        alert('Failed to update booking status. Please try again.');
      }
    }
  };

  const handleDownload = () => {
    // Simulate download functionality
    console.log('Downloading booking receipt...');
    alert('Receipt download started!');
  };

  const handleShare = () => {
    // Simulate share functionality
    console.log('Sharing booking details...');
    alert('Booking details copied to clipboard!');
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error Loading Booking</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
          <p className="mt-2 text-gray-600">The booking you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Helper function to format vehicle details
  const getVehicleInfo = () => {
    const { carDetails } = booking;
    if (carDetails) {
      return `${carDetails.year || ''} ${carDetails.make || ''} ${carDetails.model || ''}`.trim();
    }
    return 'Vehicle information not available';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Booking Details
                </h1>
                <p className="text-gray-600">ID: #{booking.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center transition-colors"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Booking Status</h2>
                <StatusBadge status={booking.status} />
              </div>
              
              {booking.status === 'Pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleStatusChange('Confirmed')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => handleStatusChange('Cancelled')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
              
              {booking.status === 'Confirmed' && (
                <button
                  onClick={() => handleStatusChange('Completed')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Mark as Completed
                </button>
              )}
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-1">
                <InfoRow 
                  icon={User} 
                  label="Name" 
                  value={booking.customerName || 'Not provided'} 
                />
                {booking.customerPhone && (
                  <InfoRow 
                    icon={Phone} 
                    label="Phone" 
                    value={booking.customerPhone} 
                  />
                )}
                {booking.customerEmail && (
                  <InfoRow 
                    icon={Mail} 
                    label="Email" 
                    value={booking.customerEmail} 
                  />
                )}
              </div>
            </div>

            {/* Car Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
              <div className="space-y-1">
                <InfoRow 
                  icon={Car} 
                  label="Vehicle" 
                  value={getVehicleInfo()}
                />
                {booking.carDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {booking.carDetails.type && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide w-20">Type:</span>
                        <span className="ml-3 text-base text-gray-900 font-medium">{booking.carDetails.type}</span>
                      </div>
                    )}
                    {booking.carDetails.color && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide w-20">Color:</span>
                        <span className="ml-3 text-base text-gray-900 font-medium">{booking.carDetails.color}</span>
                      </div>
                    )}
                    {booking.carDetails.licensePlate && (
                      <div className="flex items-center md:col-span-2">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide w-20">License:</span>
                        <span className="ml-3 text-base text-gray-900 font-medium font-mono bg-gray-100 px-2 py-1 rounded">{booking.carDetails.licensePlate}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Service Type</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{booking.serviceType || 'Not specified'}</p>
                </div>
                
                {booking.addOns && booking.addOns.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Add-ons</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {booking.addOns.map((addon, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                        >
                          {addon}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {booking.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Special Notes</p>
                    <p className="mt-1 text-base text-gray-900 bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rating (if completed) */}
            {booking.status === 'Completed' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Rating</h2>
                <StarRating rating={booking.rating} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Appointment Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Info</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">{booking.date || 'Not scheduled'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Time Slot</p>
                    <p className="font-semibold text-gray-900">{booking.timeSlot || 'Not scheduled'}</p>
                  </div>
                </div>
                
                {booking.duration && (
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-900">{booking.duration} minutes</p>
                    </div>
                  </div>
                )}
                
                {booking.location && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">{booking.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-gray-600">Total Amount</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  ${booking.price || '0'}
                </span>
              </div>
            </div>

            {/* Booking History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking History</h3>
              <div className="space-y-3">
                {booking.createdAt && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">Booking created on {booking.createdAt}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Status: {booking.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;