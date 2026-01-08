import React from 'react';
import { ChevronDown, MapPin, DollarSign, Calendar, Clock } from 'lucide-react';
import { Card } from './ui/Card';

export default function RoomCard({ room, expanded, onExpand }) {
  return (
    <Card
      hover
      className={`cursor-pointer transition-all duration-200 ${
        expanded ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={onExpand}
      tabIndex={0}
      aria-expanded={expanded}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-gray-900 mb-1 truncate">{room.title}</h4>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="text-xs text-gray-600 truncate">{room.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ₹{room.rent}
              </span>
              <span className="text-xs text-gray-500">/month</span>
            </div>
          </div>
          <div className={`p-1.5 rounded-lg bg-gray-100 transition-all ${expanded ? 'bg-blue-100' : ''}`}>
            <ChevronDown 
              className={`w-4 h-4 text-gray-600 transition-transform ${expanded ? 'rotate-180 text-blue-600' : ''}`}
            />
          </div>
        </div>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {room.description && (
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-gray-900">Description:</span> {room.description}
              </div>
            )}
            <div className="flex flex-wrap gap-3 text-xs">
              {room.available_from && (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span><span className="font-medium">Available:</span> {new Date(room.available_from).toLocaleDateString()}</span>
                </div>
              )}
              {room.created_at && (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span><span className="font-medium">Posted:</span> {new Date(room.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
