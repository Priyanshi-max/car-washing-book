import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => {
  if (!rating) return <span className="text-gray-400 text-sm">No rating</span>;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating})</span>
    </div>
  );
};

export default StarRating;
