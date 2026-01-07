import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import Auth from './components/Auth';
import AddRoom from './components/AddRoom';
import ImageUpload from './components/ImageUpload';


function App() {
  const [session, setSession] = useState(null);
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


  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    fetchRooms();

    return () => listener.subscription.unsubscribe();
  }, []);

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


  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) return <Auth />;

  const getImageUrl = (path) => {
    const { data } = supabase.storage
      .from('room-images')
      .getPublicUrl(path);

    return data.publicUrl;
  };


  return (
    <div style={{ padding: 20 }}>
      <h1>Room Finder</h1>
      <button onClick={logout}>Logout</button>

      <AddRoom user={session.user} onRoomAdded={fetchRooms} />
      <h3>Search Rooms</h3>

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
        placeholder="Property Type (1 BHK, 2 Bed)"
        value={filters.propertyType}
        onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
      />

      <input
        placeholder="Tenant Preference"
        value={filters.tenantPreference}
        onChange={(e) => setFilters({ ...filters, tenantPreference: e.target.value })}
      />


      <h3>Available Rooms</h3>
      {rooms.map((room) => (
        <div key={room.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <h4>{room.title}</h4>
          <p>📍 {room.location}</p>
          <p>💰 ₹{room.rent}</p>
          <p>🏠 {room.property_type}</p>
          <p>👥 {room.tenant_preference}</p>
          <p>📞 {room.contact_number}</p>
          {room.owner === session.user.id && (
            <ImageUpload roomId={room.id} onDone={fetchRooms} />
          )}

          {
            room.room_images && room.room_images.length > 0 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                {room.room_images.map((img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img.image_path)}
                    alt="room"
                    style={{
                      width: 120,
                      height: 90,
                      objectFit: 'cover',
                      borderRadius: 6,
                      border: '1px solid #ccc'
                    }}
                  />
                ))}
              </div>
            )
          }
          {room.owner === session.user.id && (
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
              Edit Room
            </button>
          )}


          {room.owner === session.user.id && (
            <button
              style={{ marginTop: 10, background: 'red', color: 'white' }}
              onClick={async () => {
                const confirmDelete = window.confirm('Delete this room?');
                if (!confirmDelete) return;

                const { error } = await supabase
                  .from('rooms')
                  .delete()
                  .eq('id', room.id);

                if (error) {
                  alert(error.message);
                } else {
                  fetchRooms();
                }
              }}
            >
              Delete Room
            </button>
          )}

          {editingRoomId === room.id && room.owner === session.user.id && (
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
              style={{ marginTop: 10 }}
            >
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Title"
                required
              />
              <br />

              <input
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="Location"
                required
              />
              <br />

              <input
                type="number"
                value={editForm.rent}
                onChange={(e) => setEditForm({ ...editForm, rent: e.target.value })}
                placeholder="Rent"
                required
              />
              <br />

              <input
                value={editForm.property_type}
                onChange={(e) =>
                  setEditForm({ ...editForm, property_type: e.target.value })
                }
                placeholder="Property Type"
                required
              />
              <br />

              <input
                value={editForm.tenant_preference}
                onChange={(e) =>
                  setEditForm({ ...editForm, tenant_preference: e.target.value })
                }
                placeholder="Tenant Preference"
                required
              />
              <br />

              <input
                value={editForm.contact_number}
                onChange={(e) =>
                  setEditForm({ ...editForm, contact_number: e.target.value })
                }
                placeholder="Contact Number"
              />
              <br />

              <button type="submit">Save</button>
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
  );
}

export default App;
