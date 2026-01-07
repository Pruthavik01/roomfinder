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

        /* 🔹 Location (case-insensitive, partial) */
        if (filters.location.trim()) {
            query = query.ilike('location', `%${filters.location.trim()}%`);
        }

        /* 🔹 Min Rent */
        if (filters.minRent) {
            query = query.gte('rent', Number(filters.minRent));
        }

        /* 🔹 Max Rent */
        if (filters.maxRent) {
            query = query.lte('rent', Number(filters.maxRent));
        }

        /* 🔹 Property Type (case-insensitive, partial) */
        if (filters.propertyType.trim()) {
            query = query.ilike(
                'property_type',
                `%${filters.propertyType.trim()}%`
            );
        }

        /* 🔹 Tenant Preference (case-insensitive, partial) */
        if (filters.tenantPreference.trim()) {
            query = query.ilike(
                'tenant_preference',
                `%${filters.tenantPreference.trim()}%`
            );
        }

        const { data, error } = await query;

        if (error) {
            console.error(error);
        } else {
            setRooms(data || []);
        }
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
            {/* 🔍 Filters */}
            <div
                style={{
                    display: 'flex',
                    gap: 12,
                    flexWrap: 'wrap',
                    marginBottom: 24
                }}
            >
                <input
                    placeholder="Location"
                    value={filters.location}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            location: e.target.value
                        })
                    }
                />

                <input
                    type="number"
                    placeholder="Min Rent"
                    value={filters.minRent}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            minRent: e.target.value
                        })
                    }
                />

                <input
                    type="number"
                    placeholder="Max Rent"
                    value={filters.maxRent}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            maxRent: e.target.value
                        })
                    }
                />

                <input
                    placeholder="Property Type (1 BHK, 2 Bed)"
                    value={filters.propertyType}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            propertyType: e.target.value.toLowerCase()
                        })
                    }
                />

                <input
                    placeholder="Tenant Preference (Family, Bachelor)"
                    value={filters.tenantPreference}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            tenantPreference: e.target.value.toLowerCase()
                        })
                    }
                />
            </div>

            <div className="room-grid">
                {rooms.map((room) => (
                    <div key={room.id} className="room-card">

                        {/* Images */}
                        {room.room_images?.length > 0 && (
                            <div className="room-card-images">
                                {room.room_images.slice(0, 3).map((img, i) => (
                                    <img
                                        key={i}
                                        src={getImageUrl(img.image_path)}
                                        alt="room"
                                    />
                                ))}
                            </div>
                        )}

                        {/* Body */}
                        <div className="room-card-body">
                            <div className="room-title">{room.title}</div>
                            <div className="room-price">₹ {room.rent}</div>

                            <div className="room-meta">
                                <span>📍 {room.location}</span>
                                <span>🏠 {room.property_type}</span>
                                <span>👥 {room.tenant_preference}</span>
                                <span>📞 {room.contact_number}</span>
                            </div>

                            {/* Owner actions */}
                            {session && room.owner === session.user.id && (
                                <div className="room-actions">
                                    <button
                                        className="btn-edit"
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
                                        className="btn-delete"
                                        onClick={async () => {
                                            if (!window.confirm('Delete this room?')) return;
                                            await supabase.from('rooms').delete().eq('id', room.id);
                                            fetchRooms();
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* ✏️ Edit Form */}
                        {editingRoomId === room.id && session && room.owner === session.user.id && (
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();

                                    const { error } = await supabase
                                        .from('rooms')
                                        .update(editForm)
                                        .eq('id', room.id);

                                    if (error) {
                                        alert(error.message);
                                    } else {
                                        alert('Room updated successfully');
                                        setEditingRoomId(null);
                                        fetchRooms();
                                    }
                                }}
                                style={{ marginTop: 14 }}
                            >
                                <input
                                    value={editForm.title || ''}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, title: e.target.value })
                                    }
                                    placeholder="Title"
                                    required
                                />
                                <br /><br />

                                <input
                                    value={editForm.location || ''}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, location: e.target.value })
                                    }
                                    placeholder="Location"
                                    required
                                />
                                <br /><br />

                                <input
                                    type="number"
                                    value={editForm.rent || ''}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, rent: e.target.value })
                                    }
                                    placeholder="Rent"
                                    required
                                />
                                <br /><br />

                                <input
                                    value={editForm.property_type || ''}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, property_type: e.target.value })
                                    }
                                    placeholder="Property Type"
                                    required
                                />
                                <br /><br />

                                <input
                                    value={editForm.tenant_preference || ''}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, tenant_preference: e.target.value })
                                    }
                                    placeholder="Tenant Preference"
                                    required
                                />
                                <br /><br />

                                <input
                                    value={editForm.contact_number || ''}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, contact_number: e.target.value })
                                    }
                                    placeholder="Contact Number"
                                />
                                <br /><br />

                                <button type="submit" className="btn-edit">
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingRoomId(null)}
                                    style={{ marginLeft: 10 }}
                                >
                                    Cancel
                                </button>
                            </form>
                        )}

                    </div>
                ))}
            </div>

        </div>
    );
}
