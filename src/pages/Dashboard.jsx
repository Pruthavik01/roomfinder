import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import AddRoom from './AddRoom';
import RoomCard from '../components/RoomCard';

export default function Dashboard() {
  const { session, profile } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

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
    <div className="max-w-7xl mx-auto px-4 py-3">
      <h2 className="text-2xl font-bold mb-2">Owner Dashboard</h2>
      <p className="mb-3">Welcome, {profile?.username}</p>

      <AddRoom user={session.user} onRoomAdded={fetchOwnerRooms} />

      <h3 className="font-semibold mb-3 mt-8">Your Listings</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {rooms.map(r => (
          <RoomCard
            key={r.id}
            room={r}
            expanded={selectedRoom === r.id}
            onExpand={() => setSelectedRoom(selectedRoom === r.id ? null : r.id)}
          />
        ))}
      </div>
    </div>
  );
}
