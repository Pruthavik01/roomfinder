import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import ImageUpload from './ImageUpload';

export default function Home() {
  const { session } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    minRent: '',
    maxRent: '',
    propertyType: '',
    tenantPreference: ''
  });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editForm, setEditForm] = useState({});

  /* ---------------- FETCH ROOMS ---------------- */
  const fetchRooms = async () => {
    let query = supabase
      .from('rooms')
      .select(`
        *,
        room_images ( image_path )
      `)
      .order('created_at', { ascending: false });

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.minRent) {
      query = query.gte('rent', filters.minRent);
    }
    if (filters.maxRent) {
      query = query.lte('rent', filters.maxRent);
    }
    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }
    if (filters.tenantPreference) {
      query = query.eq('tenant_preference', filters.tenantPreference);
    }

    const { data, error } = await query;
    if (!error) setRooms(data || []);
  };

  useEffect(() => {
    fetchRooms();
  }, [filters]);

  /* ---------------- IMAGE URL ---------------- */
  const getImageUrl = (path) => {
    const { data } = supabase.storage
      .from('room-images')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Available Rooms</h1>

      {/* 🔍 Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Rent"
          value={filters.minRent}
          onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Rent"
          value={filters.maxRent}
          onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
        />
        <input
          placeholder="Property Type"
          value={filters.propertyType}
          onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
        />
        <input
          placeholder="Tenant Preference"
          value={filters.tenantPreference}
          onChange={(e) =>
            setFilters({ ...filters, tenantPreference: e.target.value })
          }
        />
      </div>

      {/* 🏠 Rooms */}
      {rooms.map((room) => (
        <div
          key={room.id}
          style={{
            border: '1px solid #ddd',
            padding: 15,
            marginBottom: 15,
            borderRadius: 8
          }}
        >
          <h3>{room.title}</h3>
          <p>📍 {room.location}</p>
          <p>💰 ₹{room.rent}</p>
          <p>🏠 {room.property_type}</p>
          <p>👥 {room.tenant_preference}</p>
          <p>📞 {room.contact_number}</p>

          {/* Images */}
          {room.room_images?.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
              {room.room_images.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img.image_path)}
                  alt="room"
                  style={{
                    width: 140,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 6
                  }}
                />
              ))}
            </div>
          )}

          {/* Owner Controls */}
          {session && room.owner === session.user.id && (
            <>
              <ImageUpload roomId={room.id} onDone={fetchRooms} />

              <button
                style={{ marginTop: 10, marginRight: 10 }}
                onClick={() => {
                  setEditingRoomId(room.id);
                  setEditForm({
                    title: room.title,
                    location: room.location,
                    rent: room.rent,
                    property_type: room.property_type,
                    tenant_preference: room.tenant_preference,
                    contact_number: room.contact_number
                  });
                }}
              >
                Edit
              </button>

              <button
                style={{ background: 'red', color: 'white' }}
                onClick={async () => {
                  if (!window.confirm('Delete this room?')) return;
                  await supabase.from('rooms').delete().eq('id', room.id);
                  fetchRooms();
                }}
              >
                Delete
              </button>
            </>
          )}

          {/* Edit Form */}
          {editingRoomId === room.id && session && room.owner === session.user.id && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await supabase.from('rooms').update(editForm).eq('id', room.id);
                setEditingRoomId(null);
                fetchRooms();
              }}
              style={{ marginTop: 10 }}
            >
              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
              />
              <input
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
              <input
                type="number"
                value={editForm.rent}
                onChange={(e) =>
                  setEditForm({ ...editForm, rent: e.target.value })
                }
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingRoomId(null)}>
                Cancel
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}
