import React from 'react';

export default function RoomCard({ room, expanded, onExpand }) {
  return (
    <div
      className={`card cursor-pointer transition-all duration-200 ${expanded ? 'ring-2 ring-blue-600 scale-105 z-10' : ''}`}
      onClick={onExpand}
      tabIndex={0}
      aria-expanded={expanded}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <h4 className="text-xl font-bold mb-2">{room.title}</h4>
      <p className="text-gray-600">{room.location} • <span className="font-semibold text-blue-600">₹{room.rent}</span></p>
      {expanded && (
        <div className="mt-4">
          <div><b>Description:</b> {room.description || 'No description provided.'}</div>
          <div><b>Available from:</b> {room.available_from ? new Date(room.available_from).toLocaleDateString() : 'N/A'}</div>
          <div><b>Posted:</b> {room.created_at ? new Date(room.created_at).toLocaleString() : 'N/A'}</div>
          {/* Add more fields if needed */}
        </div>
      )}
      <span
        style={{
          position: 'absolute',
          top: 12,
          right: 18,
          fontSize: 22,
          color: 'var(--muted-text)',
          userSelect: 'none',
          pointerEvents: 'none'
        }}
      >
        {expanded ? '▲' : '▼'}
      </span>
    </div>
  );
}
