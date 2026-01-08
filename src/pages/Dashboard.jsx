import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import AddRoom from './AddRoom';
import RoomCard from '../components/RoomCard';
import { LayoutDashboard, Home as HomeIcon, TrendingUp, PlusCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function Dashboard() {
  const { session, profile } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAddRoom, setShowAddRoom] = useState(false);

  const fetchOwnerRooms = async () => {
    if (!session) return;
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('owner', session.user.id)
      .order('created_at', { ascending: false });
    setRooms(data || []);
  };

  useEffect(() => { fetchOwnerRooms(); }, [session]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Owner Dashboard</h2>
            <p className="text-sm text-gray-600">Welcome back, <span className="font-semibold text-gray-900">{profile?.username || 'Owner'}</span></p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-700 mb-1">Total Listings</p>
              <p className="text-2xl font-bold text-blue-900">{rooms.length}</p>
            </div>
            <HomeIcon className="w-8 h-8 text-blue-600 opacity-60" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-indigo-700 mb-1">Active Rooms</p>
              <p className="text-2xl font-bold text-indigo-900">{rooms.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-indigo-600 opacity-60" />
          </div>
        </Card>
        <Card
          onClick={() => setShowAddRoom(prev => !prev)}
          className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-700 mb-1">Add New</p>
              <p className="text-2xl font-bold text-purple-900">+</p>
            </div>
            <PlusCircle
              className={`w-8 h-8 text-purple-600 opacity-60 transition-transform ${showAddRoom ? "rotate-45" : ""
                }`}
            />
          </div>
        </Card>

      </div>

      {showAddRoom && (
        <Card className="mb-6 p-5">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              Add New Room Listing
            </h3>
          </div>
          <AddRoom
            user={session.user}
            onRoomAdded={() => {
              fetchOwnerRooms();
              setShowAddRoom(false); // auto-close after add
            }}
          />
        </Card>
      )}


      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HomeIcon className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Your Listings</h3>
        </div>
        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{rooms.length} rooms</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map(r => (
          <RoomCard
            key={r.id}
            room={r}
            expanded={selectedRoom === r.id}
            onExpand={() => setSelectedRoom(selectedRoom === r.id ? null : r.id)}
            className="dark:bg-gray-900 dark:border-gray-700"
          />
        ))}
      </div>
      {rooms.length === 0 && (
        <Card className="py-16 dark:bg-gray-900 dark:border-gray-700">
          <div className="text-center">
            <HomeIcon className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No listings yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Add your first room listing above to get started</p>
          </div>
        </Card>
      )}
    </div>
  );
}
