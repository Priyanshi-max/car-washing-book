import React from 'react';
import { Car, Calendar, Clock, User, Settings, DollarSign, Edit, Trash2, Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';
import StarRating from './StarRating';

const BookingCard = ({ booking, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-2">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              {booking.customerName}
            </h3>
            <StatusBadge status={booking.status} />
          </div>
          <div className="flex space-x-1 ml-4">
            <button onClick={() => onView(booking.id)} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => onEdit(booking.id)} className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit Booking">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(booking.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Booking">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-700">
            <Car className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-medium truncate block">
                {booking.carDetails.year} {booking.carDetails.make} {booking.carDetails.model}
              </span>
              <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600">
                {booking.carDetails.type}
              </span>
            </div>
          </div>

          <div className="flex items-center text-gray-700">
            <Settings className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
            <span className="font-medium">{booking.serviceType}</span>
          </div>

          <div className="flex items-center text-gray-700">
            <Calendar className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
            <span>{new Date(booking.date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center text-gray-700">
            <Clock className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
            <span className="text-sm">{booking.timeSlot}</span>
            <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {booking.duration} min
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
         <div className="flex items-center text-green-600 font-bold text-lg">
  <span className="mr-1">₹</span>
  {booking.price}
</div>

          <StarRating rating={booking.rating} />
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
