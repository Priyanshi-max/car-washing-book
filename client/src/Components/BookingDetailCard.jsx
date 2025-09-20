import React from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Car, 
  Settings,
  Star
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import StarRating from './StarRating';

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

const BookingDetailCard = ({ booking, onStatusChange }) => {
  // Helper function to format vehicle details
  const getVehicleInfo = () => {
    const { carDetails } = booking;
    if (carDetails) {
      return `${carDetails.year || ''} ${carDetails.make || ''} ${carDetails.model || ''}`.trim();
    }
    return 'Vehicle information not available';
  };

  return (
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
              onClick={() => onStatusChange('Confirmed')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Confirm Booking
            </button>
            <button
              onClick={() => onStatusChange('Cancelled')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Cancel Booking
            </button>
          </div>
        )}
        
        {booking.status === 'Confirmed' && (
          <button
            onClick={() => onStatusChange('Completed')}
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
  );
};

export default BookingDetailCard;