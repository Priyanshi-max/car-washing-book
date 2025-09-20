import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle },
    Confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
    Completed: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
    Cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
  };

  const config = statusConfig[status] || statusConfig.Pending;
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};

export default StatusBadge;
