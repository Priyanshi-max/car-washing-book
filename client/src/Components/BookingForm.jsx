import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Save, Edit3, Loader } from 'lucide-react';
import { createBooking, updateBooking, getBookingById } from '../services/bookingService';
import BookingFormSections from './BookingFormSections';

const BookingForm = () => {
  const { id } = useParams();
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

 
  useEffect(() => {
    const fetchBookingData = async () => {
      if (id) {
        try {
          setLoading(true);
          setError(null);
          const response = await getBookingById(id);
          const booking = response.data || response;
          
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
        await updateBooking(id, apiData);
        console.log('Booking updated successfully');
      } else {
        await createBooking(apiData);
        console.log('Booking created successfully');
      }

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

            {/* Form Sections */}
            <BookingFormSections
              formData={formData}
              handleChange={handleChange}
              handleAddOnChange={handleAddOnChange}
            />

            {/* Form Actions */}
            <div className="p-8 pt-0">
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

export default BookingForm;