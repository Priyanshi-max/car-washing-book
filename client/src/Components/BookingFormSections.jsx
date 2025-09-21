import React, { useState, useEffect } from 'react';
import { User, Car, Wrench, Clock, MapPin, AlertCircle } from 'lucide-react';

const BookingFormSections = ({ formData, handleChange, handleAddOnChange, onValidationChange }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  // Validation functions
  const validateCustomerName = (name) => {
    if (!name || name.trim().length === 0) {
      return 'Customer name is required';
    }
    if (name.trim().length < 2) {
      return 'Customer name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return 'Customer name should only contain letters and spaces';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
      return 'Email address is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) {
      return 'Phone number is required';
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    if (!/^[6-9]/.test(cleanPhone)) {
      return 'Phone number must start with 6, 7, 8, or 9';
    }
    return '';
  };

  const validateCarMake = (make) => {
    if (!make || make.trim().length === 0) {
      return 'Car make is required';
    }
    if (make.trim().length < 2) {
      return 'Car make must be at least 2 characters long';
    }
    return '';
  };

  const validateCarModel = (model) => {
    if (!model || model.trim().length === 0) {
      return 'Car model is required';
    }
    if (model.trim().length < 2) {
      return 'Car model must be at least 2 characters long';
    }
    return '';
  };

  const validateCarYear = (year) => {
    if (!year || year.toString().trim().length === 0) {
      return 'Car year is required';
    }
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) {
      return `Year must be between 1900 and ${currentYear + 1}`;
    }
    return '';
  };

  // Real-time validation
  useEffect(() => {
    const newErrors = {};

    // Customer validation
    if (touched.customerName) {
      newErrors.customerName = validateCustomerName(formData.customerName);
    }
    if (touched.customerEmail) {
      newErrors.customerEmail = validateEmail(formData.customerEmail);
    }
    if (touched.customerPhone) {
      newErrors.customerPhone = validatePhone(formData.customerPhone);
    }

    // Car details validation
    if (touched.carMake) {
      newErrors.carMake = validateCarMake(formData.carDetails?.make);
    }
    if (touched.carModel) {
      newErrors.carModel = validateCarModel(formData.carDetails?.model);
    }
    if (touched.carYear) {
      newErrors.carYear = validateCarYear(formData.carDetails?.year);
    }

    setErrors(newErrors);

    // Notify parent component about validation status
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (onValidationChange) {
      onValidationChange(hasErrors, newErrors);
    }
  }, [
    formData.customerName, 
    formData.customerEmail, 
    formData.customerPhone,
    formData.carDetails?.make,
    formData.carDetails?.model,
    formData.carDetails?.year,
    touched,
    onValidationChange
  ]);

 
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
   
    setTouched(prev => ({ ...prev, [name]: true }));
    
  
    if (name === 'customerPhone') {
      const cleanValue = value.replace(/\D/g, '');
      const limitedValue = cleanValue.slice(0, 10);
      
      handleChange({
        target: {
          name: name,
          value: limitedValue
        }
      });
      return;
    }

 
    if (name.startsWith('car')) {
      handleChange(e);
      return;
    }

    
    handleChange(e);
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  // Format phone number for display
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return '';
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length > 6) {
      return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
    } else if (cleanPhone.length > 3) {
      return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3)}`;
    }
    return cleanPhone;
  };


  const validateAllRequiredFields = () => {
    const requiredFields = [
      'customerName', 'customerEmail', 'customerPhone', 
      'carMake', 'carModel', 'carYear'
    ];
    
    const newTouched = {};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    return Object.keys(errors).length === 0;
  };

 
  useEffect(() => {
    if (formData.validateForm) {
      validateAllRequiredFields();
    }
  }, [formData.validateForm]);

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Customer Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
          </div>

          {/* Customer Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customerName"
              placeholder="Enter full name"
              value={formData.customerName || ''}
              onChange={handleFieldChange}
              onBlur={() => handleBlur('customerName')}
              className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none ${
                errors.customerName 
                  ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            />
            {errors.customerName && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                <span>{errors.customerName}</span>
              </div>
            )}
            {!errors.customerName && formData.customerName && touched.customerName && (
              <div className="mt-1 text-green-600 text-sm">
                ✓ Valid customer name
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="customerPhone"
              placeholder="Enter 10-digit phone number"
              value={formatPhoneForDisplay(formData.customerPhone)}
              onChange={handleFieldChange}
              onBlur={() => handleBlur('customerPhone')}
              className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none ${
                errors.customerPhone 
                  ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            />
            {errors.customerPhone && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                <span>{errors.customerPhone}</span>
              </div>
            )}
            {!errors.customerPhone && formData.customerPhone && touched.customerPhone && (
              <div className="mt-1 text-green-600 text-sm">
                ✓ Valid phone number
              </div>
            )}
          </div>

          {/* Email Address */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="customerEmail"
              placeholder="Enter email address"
              value={formData.customerEmail || ''}
              onChange={handleFieldChange}
              onBlur={() => handleBlur('customerEmail')}
              className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none ${
                errors.customerEmail 
                  ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            />
            {errors.customerEmail && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                <span>{errors.customerEmail}</span>
              </div>
            )}
            {!errors.customerEmail && formData.customerEmail && touched.customerEmail && (
              <div className="mt-1 text-green-600 text-sm">
                ✓ Valid email address
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Car className="text-green-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Car Make */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Make <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="carMake"
                placeholder="Toyota, Honda..."
                value={formData.carDetails?.make || ''}
                onChange={handleFieldChange}
                onBlur={() => handleBlur('carMake')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none ${
                  errors.carMake 
                    ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                required
              />
              {errors.carMake && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle size={14} />
                  <span>{errors.carMake}</span>
                </div>
              )}
              {!errors.carMake && formData.carDetails?.make && touched.carMake && (
                <div className="mt-1 text-green-600 text-sm">
                  ✓ Valid car make
                </div>
              )}
            </div>
            
            {/* Car Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="carModel"
                placeholder="Camry, Civic..."
                value={formData.carDetails?.model || ''}
                onChange={handleFieldChange}
                onBlur={() => handleBlur('carModel')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none ${
                  errors.carModel 
                    ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                required
              />
              {errors.carModel && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle size={14} />
                  <span>{errors.carModel}</span>
                </div>
              )}
              {!errors.carModel && formData.carDetails?.model && touched.carModel && (
                <div className="mt-1 text-green-600 text-sm">
                  ✓ Valid car model
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Car Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="carYear"
                placeholder="2020"
                min="1900"
                max="2026"
                value={formData.carDetails?.year || ''}
                onChange={handleFieldChange}
                onBlur={() => handleBlur('carYear')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all outline-none ${
                  errors.carYear 
                    ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                required
              />
              {errors.carYear && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle size={14} />
                  <span>{errors.carYear}</span>
                </div>
              )}
              {!errors.carYear && formData.carDetails?.year && touched.carYear && (
                <div className="mt-1 text-green-600 text-sm">
                  ✓ Valid car year
                </div>
              )}
            </div>
            
            {/* Car Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                name="carType"
                value={formData.carDetails?.type || ''}
                onChange={handleFieldChange}
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
                value={formData.carDetails?.color || ''}
                onChange={handleFieldChange}
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
                value={formData.carDetails?.licensePlate || ''}
                onChange={handleFieldChange}
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
              Service Type <span className="text-red-500">*</span>
            </label>
            <select
              name="serviceType"
              value={formData.serviceType || ''}
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
                    checked={formData.addOns?.includes(addon) || false}
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
                value={formData.duration || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.price || ''}
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
              value={formData.notes || ''}
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
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date || ''}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Slot <span className="text-red-500">*</span>
            </label>
            <select
              name="timeSlot"
              value={formData.timeSlot || ''}
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
                value={formData.location || ''}
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
              value={formData.status || 'Pending'}
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

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-red-600" size={16} />
            <h4 className="text-red-800 font-medium">Please fix the following errors:</h4>
          </div>
          <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              error && <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookingFormSections;