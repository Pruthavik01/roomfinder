import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import AddRoom from './AddRoom';

export default function Dashboard() {
  const { session, profile } = useAuth();
  const [rooms, setRooms] = useState([]);

  const fetchOwnerRooms = async () => {
    if (!session) return;
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('owner', session.user.id)
      .order('created_at', { ascending:false });
    setRooms(data || []);
  };

  useEffect(() => { fetchOwnerRooms(); }, [session]);

  return (
    <div style={{ padding:20 }}>
      <h2>Owner Dashboard</h2>
      <p>Welcome, {profile?.username}</p>

      <AddRoom user={session.user} onRoomAdded={fetchOwnerRooms} />

      <h3>Your Listings</h3>
      {rooms.map(r => (
        <div key={r.id} style={{ border:'1px solid #ddd', padding:10, marginBottom:10 }}>
          <h4>{r.title}</h4>
          <p>{r.location} • ₹{r.rent}</p>
        </div>
      ))}
    </div>
  );
}
