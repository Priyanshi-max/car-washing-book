import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Car, User, Wrench, DollarSign, MapPin, ArrowLeft, Save, Edit3, Loader } from 'lucide-react';
import { createBooking, updateBooking, getBookingById } from '../services/bookingService';

const AddEditBooking = () => {
  const { id } = useParams(); // Get ID from URL parameters
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    carDetails: {
      make: '',
      model: '',
      year: '',
      type: '',
      color: '',
      licensePlate: ''
    },
    serviceType: '',
    addOns: [],
    date: '',
    timeSlot: '',
    duration: '',
    price: '',
    status: 'Pending',
    notes: '',
    location: ''
  });

  // Fetch existing booking data if editing
  useEffect(() => {
    const fetchBookingData = async () => {
      if (id) {
        try {
          setLoading(true);
          setError(null);
          const response = await getBookingById(id);
          const booking = response.data || response;
          
          // Map API response to form structure
          setFormData({
            customerName: booking.customerName || '',
            customerPhone: booking.customerPhone || '',
            customerEmail: booking.customerEmail || '',
            carDetails: {
              make: booking.carDetails?.make || '',
              model: booking.carDetails?.model || '',
              year: booking.carDetails?.year || '',
              type: booking.carDetails?.type || '',
              color: booking.carDetails?.color || '',
              licensePlate: booking.carDetails?.licensePlate || ''
            },
            serviceType: booking.serviceType || '',
            addOns: booking.addOns || [],
            date: booking.date || '',
            timeSlot: booking.timeSlot || '',
            duration: booking.duration || '',
            price: booking.price || '',
            status: booking.status || 'Pending',
            notes: booking.notes || '',
            location: booking.location || ''
          });
        } catch (err) {
          console.error('Error fetching booking data:', err);
          setError('Failed to load booking data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookingData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested carDetails
    if (name.startsWith('car')) {
      const carField = name.replace('car', '').toLowerCase();
      setFormData(prev => ({
        ...prev,
        carDetails: {
          ...prev.carDetails,
          [carField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOnChange = (addon) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addon)
        ? prev.addOns.filter(item => item !== addon)
        : [...prev.addOns, addon]
    }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setError('Customer name is required');
      return false;
    }
    if (!formData.serviceType) {
      setError('Service type is required');
      return false;
    }
    if (!formData.date) {
      setError('Appointment date is required');
      return false;
    }
    if (!formData.timeSlot) {
      setError('Time slot is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Prepare data for API
      const apiData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        carDetails: {
          make: formData.carDetails.make,
          model: formData.carDetails.model,
          year: parseInt(formData.carDetails.year) || undefined,
          type: formData.carDetails.type,
          color: formData.carDetails.color,
          licensePlate: formData.carDetails.licensePlate
        },
        serviceType: formData.serviceType,
        addOns: formData.addOns,
        date: formData.date,
        timeSlot: formData.timeSlot,
        duration: parseInt(formData.duration) || undefined,
        price: parseFloat(formData.price) || undefined,
        status: formData.status,
        notes: formData.notes,
        location: formData.location
      };

      if (id) {
        // Update existing booking
        await updateBooking(id, apiData);
        console.log('Booking updated successfully');
      } else {
        // Create new booking
        await createBooking(apiData);
        console.log('Booking created successfully');
      }

      // Navigate back to bookings list or detail view
      navigate(id ? `/booking/${id}` : '/');
    } catch (err) {
      console.error('Error saving booking:', err);
      setError(err.response?.data?.message || `Failed to ${id ? 'update' : 'create'} booking. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const serviceTypes = [
    'Basic Wash',
    'Premium Wash',
    'Deluxe Wash',
    'Full Detail',
    'Interior Cleaning',
    'Exterior Wax',
    'Engine Bay Cleaning',
    'Ceramic Coating'
  ];

  const carTypes = [
    'Sedan',
    'SUV',
    'Hatchback',
    'Coupe',
    'Convertible',
    'Pickup Truck',
    'Van',
    'Motorcycle'
  ];

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM'
  ];

  const availableAddOns = [
    'Interior Cleaning',
    'Wax Protection',
    'Tire Shine',
    'Engine Cleaning',
    'Leather Treatment',
    'Paint Protection'
  ];

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {id ? <Edit3 size={28} className="text-blue-600" /> : <Calendar size={28} className="text-green-600" />}
              {id ? 'Edit Booking' : 'New Booking'}
            </h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <h2 className="text-xl font-semibold text-white">
                {id ? 'Update booking details' : 'Create a new booking'}
              </h2>
              <p className="text-blue-100 mt-1">
                Fill in the information below to {id ? 'update the' : 'schedule a new'} service appointment
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Customer Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Enter full name"
                      value={formData.customerName}
                      onChange={handleChange}
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      placeholder="Enter phone number"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      placeholder="Enter email address"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Car className="text-green-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Make
                      </label>
                      <input
                        type="text"
                        name="carMake"
                        placeholder="Toyota, Honda..."
                        value={formData.carDetails.make}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model
                      </label>
                      <input
                        type="text"
                        name="carModel"
                        placeholder="Camry, Civic..."
                        value={formData.carDetails.model}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year
                      </label>
                      <input
                        type="number"
                        name="carYear"
                        placeholder="2020"
                        min="1900"
                        max="2025"
                        value={formData.carDetails.year}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        name="carType"
                        value={formData.carDetails.type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white"
                      >
                        <option value="">Select type</option>
                        {carTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <input
                        type="text"
                        name="carColor"
                        placeholder="Red, Blue, Silver..."
                        value={formData.carDetails.color}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Plate
                      </label>
                      <input
                        type="text"
                        name="carLicenseplate"
                        placeholder="ABC-123"
                        value={formData.carDetails.licensePlate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Wrench className="text-purple-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type *
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                      required
                    >
                      <option value="">Select service</option>
                      {serviceTypes.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add-ons
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableAddOns.map(addon => (
                        <label key={addon} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.addOns.includes(addon)}
                            onChange={() => handleAddOnChange(addon)}
                            className="mr-2 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{addon}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        placeholder="60"
                        min="15"
                        step="15"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          name="price"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Notes
                    </label>
                    <textarea
                      name="notes"
                      placeholder="Any special instructions or notes..."
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Appointment Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="text-orange-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Slot *
                    </label>
                    <select
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none bg-white"
                      required
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="location"
                        placeholder="Service location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none bg-white"
                    >
                      <option value="Pending">🟡 Pending</option>
                      <option value="Confirmed">🟢 Confirmed</option>
                      <option value="Completed">✅ Completed</option>
                      <option value="Cancelled">🔴 Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      {id ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {id ? 'Update Booking' : 'Create Booking'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Quick Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Quick Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Make sure to select the correct service type for accurate pricing</li>
            <li>• Duration will help us allocate the right amount of time for your service</li>
            <li>• You can always update the booking details later if needed</li>
            <li>• Add-ons can be selected to provide additional services</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddEditBooking;