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
  const [isDownloading, setIsDownloading] = useState(false);
  
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

  // Enhanced invoice generation function
  const generateInvoiceHTML = (booking) => {
    const currentDate = new Date().toLocaleDateString();
    const invoiceNumber = `INV-${booking.id || '000'}-${Date.now().toString().slice(-6)}`;
    
    // Calculate pricing details
    const subtotal = parseFloat(booking.price || 0);
    const taxRate = 0.18; // 18% GST
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - ${invoiceNumber}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: #fff;
            }
            
            .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px;
                background: white;
            }
            
            .invoice-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 3px solid #3b82f6;
            }
            
            .company-info {
                flex: 1;
            }
            
            .company-name {
                font-size: 28px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 5px;
            }
            
            .company-details {
                color: #6b7280;
                font-size: 14px;
            }
            
            .invoice-title {
                text-align: right;
                flex: 1;
            }
            
            .invoice-title h1 {
                font-size: 36px;
                color: #1e40af;
                margin-bottom: 10px;
            }
            
            .invoice-number {
                color: #6b7280;
                font-size: 14px;
            }
            
            .invoice-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-bottom: 40px;
            }
            
            .section {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #3b82f6;
            }
            
            .section h3 {
                color: #1e40af;
                margin-bottom: 15px;
                font-size: 16px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            
            .detail-row:last-child {
                margin-bottom: 0;
            }
            
            .label {
                color: #6b7280;
                font-weight: 500;
            }
            
            .value {
                color: #1f2937;
                font-weight: 600;
            }
            
            .service-details {
                margin-bottom: 30px;
            }
            
            .service-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .service-table th {
                background: #3b82f6;
                color: white;
                padding: 15px;
                text-align: left;
                font-weight: 600;
            }
            
            .service-table td {
                padding: 15px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .service-table tbody tr:hover {
                background: #f8fafc;
            }
            
            .amount-summary {
                margin-top: 30px;
                background: #f8fafc;
                padding: 25px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }
            
            .amount-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                padding: 5px 0;
            }
            
            .amount-row.total {
                border-top: 2px solid #3b82f6;
                padding-top: 15px;
                margin-top: 15px;
                font-weight: bold;
                font-size: 18px;
                color: #1e40af;
            }
            
            .status-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .status-confirmed { background: #dcfce7; color: #166534; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-cancelled { background: #fee2e2; color: #b91c1c; }
            .status-completed { background: #dbeafe; color: #1e40af; }
            
            .footer {
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
            }
            
            .payment-info {
                background: #fef7cd;
                padding: 20px;
                border-radius: 8px;
                margin-top: 30px;
                border-left: 4px solid #f59e0b;
            }
            
            .payment-info h4 {
                color: #92400e;
                margin-bottom: 10px;
            }
            
            @media print {
                .invoice-container {
                    padding: 20px;
                }
                
                body {
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                }
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <!-- Header -->
            <div class="invoice-header">
                <div class="company-info">
                    <div class="company-name">ASBL CAR WASH</div>
                    <div class="company-details">
                        123 Business Street<br>
                        Jaipur, Rajasthan 302001<br>
                        Phone: +91 98765 43210<br>
                        Email: billing@asblcarwash.com<br>
                        GST: 08ABCDE1234F1Z5
                    </div>
                </div>
                <div class="invoice-title">
                    <h1>INVOICE</h1>
                    <div class="invoice-number">${invoiceNumber}</div>
                    <div class="invoice-number">Date: ${currentDate}</div>
                </div>
            </div>

            <!-- Invoice Details -->
            <div class="invoice-details">
                <div class="section">
                    <h3>Bill To</h3>
                    <div class="detail-row">
                        <span class="label">Customer Name:</span>
                        <span class="value">${booking.customerName || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Email:</span>
                        <span class="value">${booking.email || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Phone:</span>
                        <span class="value">${booking.phone || 'N/A'}</span>
                    </div>
                    ${booking.address ? `
                    <div class="detail-row">
                        <span class="label">Address:</span>
                        <span class="value">${booking.address}</span>
                    </div>` : ''}
                </div>

                <div class="section">
                    <h3>Booking Details</h3>
                    <div class="detail-row">
                        <span class="label">Booking ID:</span>
                        <span class="value">#${booking.id || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Service Date:</span>
                        <span class="value">${booking.date || 'TBD'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Time Slot:</span>
                        <span class="value">${booking.timeSlot || 'TBD'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Status:</span>
                        <span class="value">
                            <span class="status-badge status-${booking.status?.toLowerCase() || 'pending'}">${booking.status || 'Pending'}</span>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Service Details -->
            <div class="service-details">
                <div class="section">
                    <h3>Service Information</h3>
                    <table class="service-table">
                        <thead>
                            <tr>
                                <th>Service Description</th>
                                <th>Duration</th>
                                <th>Location</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>${booking.serviceName || booking.title || 'Service Booking'}</strong><br>
                                    <small>${booking.description || 'Professional service booking'}</small>
                                </td>
                                <td>${booking.duration ? booking.duration + ' mins' : 'Standard'}</td>
                                <td>${booking.location || 'TBD'}</td>
                                <td>₹${subtotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Amount Summary -->
            <div class="amount-summary">
                <div class="amount-row">
                    <span>Subtotal:</span>
                    <span>₹${subtotal.toFixed(2)}</span>
                </div>
                <div class="amount-row">
                    <span>GST (18%):</span>
                    <span>₹${taxAmount.toFixed(2)}</span>
                </div>
                <div class="amount-row total">
                    <span>Total Amount:</span>
                    <span>₹${totalAmount.toFixed(2)}</span>
                </div>
            </div>

            <!-- Payment Information -->
            <div class="payment-info">
                <h4>Payment Information</h4>
                <p><strong>Payment Status:</strong> ${booking.paymentStatus || 'Pending'}</p>
                <p><strong>Payment Method:</strong> ${booking.paymentMethod || 'To be confirmed'}</p>
                ${booking.transactionId ? `<p><strong>Transaction ID:</strong> ${booking.transactionId}</p>` : ''}
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>Thank you for choosing BookingPro!</p>
                <p>For any queries, please contact us at support@bookingpro.com</p>
                <p><em>This is a computer-generated invoice and does not require a signature.</em></p>
            </div>
        </div>
    </body>
    </html>
    `;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      console.log('Generating invoice for booking:', booking);
      
      // Generate the invoice HTML
      const invoiceHTML = generateInvoiceHTML(booking);
      
      // Create a new window for printing/PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocked. Please allow popups for this site to download invoices.');
      }

      // Write the HTML content
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();

      // Wait for content to load
      printWindow.onload = () => {
        // Trigger print dialog
        printWindow.print();
        
        // Close the window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };

      // Alternative: Create downloadable HTML file
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${booking.id || 'booking'}-${Date.now()}.html`;
      
      // Temporarily add to DOM and click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      console.log('Invoice generated successfully');
      
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    const bookingDetails = `
Booking Details:
ID: ${booking.id}
Service: ${booking.serviceName || booking.title || 'Service Booking'}
Date: ${booking.date || 'TBD'}
Time: ${booking.timeSlot || 'TBD'}
Location: ${booking.location || 'TBD'}
Amount: ₹${booking.price || '0'}
Status: ${booking.status || 'Pending'}
    `.trim();

    if (navigator.share) {
      navigator.share({
        title: 'Booking Details',
        text: bookingDetails,
        url: window.location.href
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(bookingDetails).then(() => {
        alert('Booking details copied to clipboard!');
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = bookingDetails;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Booking details copied to clipboard!');
    }
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
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center transition-colors text-sm whitespace-nowrap flex-shrink-0"
          >
            <Download className={`w-4 h-4 mr-1 sm:mr-2 ${isDownloading ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">{isDownloading ? 'Generating...' : 'Download'}</span>
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