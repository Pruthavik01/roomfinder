import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import ImageUpload from "./ImageUpload";

function BodyScrollLock({ isLocked }) {
  useEffect(() => {
    const original = document.body.style.overflow;
    if (isLocked) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isLocked]);

  return null;
}

import {
  SearchIcon,
  LocationIcon,
  PriceIcon,
  PhoneIcon,
  RoomIcon,
} from "../components/Icons";
import {
  Search,
  MapPin,
  DollarSign,
  Phone,
  Users,
  Edit2,
  Trash2,
  Save,
  X,
  Home,
  Image as ImageIcon,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function HomePage() {
  const { session } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    minRent: "",
    maxRent: "",
    propertyType: "",
    tenantPreference: "",
  });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editForm, setEditForm] = useState({});

  /* ---------------- FETCH ROOMS ---------------- */
  const fetchRooms = async () => {
    let query = supabase
      .from("rooms")
      .select(
        `
      *,
      room_images ( image_path )
    `
      )
      .order("created_at", { ascending: false });

    /* 🔹 Location (case-insensitive, partial) */
    if (filters.location.trim()) {
      query = query.ilike("location", `%${filters.location.trim()}%`);
    }

    /* 🔹 Min Rent */
    if (filters.minRent) {
      query = query.gte("rent", Number(filters.minRent));
    }

    /* 🔹 Max Rent */
    if (filters.maxRent) {
      query = query.lte("rent", Number(filters.maxRent));
    }

    /* 🔹 Property Type (case-insensitive, partial) */
    if (filters.propertyType.trim()) {
      query = query.ilike("property_type", `%${filters.propertyType.trim()}%`);
    }

    /* 🔹 Tenant Preference (case-insensitive, partial) */
    if (filters.tenantPreference.trim()) {
      query = query.ilike(
        "tenant_preference",
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
    const { data } = supabase.storage.from("room-images").getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            Available Rooms
          </h1>
          <p className="text-sm text-gray-600">
            Discover your perfect rental space
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
          <Search className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-600">
            {rooms.length}
          </span>
          <span className="text-sm text-gray-600">listings</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Search & Filter</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Input
            icon={MapPin}
            placeholder="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters({
                ...filters,
                location: e.target.value,
              })
            }
          />
          <Input
            icon={DollarSign}
            type="number"
            placeholder="Min Rent (₹)"
            value={filters.minRent}
            onChange={(e) =>
              setFilters({
                ...filters,
                minRent: e.target.value,
              })
            }
          />
          <Input
            icon={DollarSign}
            type="number"
            placeholder="Max Rent (₹)"
            value={filters.maxRent}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxRent: e.target.value,
              })
            }
          />
          <Input
            icon={Home}
            placeholder="Property Type"
            value={filters.propertyType}
            onChange={(e) =>
              setFilters({
                ...filters,
                propertyType: e.target.value.toLowerCase(),
              })
            }
          />
          <Input
            icon={Users}
            placeholder="Tenant Preference"
            value={filters.tenantPreference}
            onChange={(e) =>
              setFilters({
                ...filters,
                tenantPreference: e.target.value.toLowerCase(),
              })
            }
          />
        </div>
      </Card>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} hover className="overflow-hidden group">
            {/* Images */}
            {room.room_images?.length > 0 ? (
              <div className="relative h-40 overflow-hidden">
                <img
                  src={getImageUrl(room.room_images[0].image_path)}
                  alt="room"
                  className="w-full h-full object-cover block group-hover:scale-110 transition-transform duration-300"
                />

                {/* Image count badge */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-gray-700">
                    {room.room_images.length}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* Body */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-gray-900 line-clamp-1 flex-1">
                  {room.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ₹{room.rent}
                </div>
                <span className="text-xs text-gray-500">/month</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span className="truncate">{room.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Home className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <span>{room.property_type}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Users className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span>{room.tenant_preference}</span>
                </div>
                {room.contact_number && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    <span>{room.contact_number}</span>
                  </div>
                )}
              </div>

              {/* Owner actions */}
              {session && room.owner === session.user.id && (
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      setEditingRoomId(room.id);
                      setEditForm({
                        title: room.title,
                        location: room.location,
                        rent: room.rent,
                        property_type: room.property_type,
                        tenant_preference: room.tenant_preference,
                        contact_number: room.contact_number,
                      });
                    }}
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1"
                    onClick={async () => {
                      if (!window.confirm("Delete this room?")) return;
                      await supabase.from("rooms").delete().eq("id", room.id);
                      fetchRooms();
                    }}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            {/* Edit Form */}
            {editingRoomId === room.id && session && room.owner === session.user.id && (
              <>
                {/* Overlay (covers whole viewport) */}
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center"
                  aria-modal="true"
                  role="dialog"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setEditingRoomId(null);
                  }}
                >
                  {/* Semi-opaque dark layer + backdrop blur */}
                  <div
                    className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                    onClick={() => setEditingRoomId(null)}
                  />

                  {/* Modal panel */}
                  <div
                    className="relative z-10 w-full max-w-lg mx-4 bg-white/95 rounded-lg shadow-xl border border-gray-200 p-6
                   transform transition-all duration-200
                   sm:mx-0"
                    onClick={(e) => e.stopPropagation()} // prevent overlay click from closing when clicking inside modal
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Edit room</h3>
                      <button
                        type="button"
                        aria-label="Close"
                        className="text-gray-500 hover:text-gray-700 ml-2"
                        onClick={() => setEditingRoomId(null)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const { error } = await supabase
                          .from("rooms")
                          .update(editForm)
                          .eq("id", room.id);
                        if (error) {
                          alert(error.message);
                        } else {
                          alert("Room updated successfully");
                          setEditingRoomId(null);
                          fetchRooms();
                        }
                      }}
                      className="space-y-3"
                    >
                      <Input
                        value={editForm.title || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        placeholder="Title"
                        required
                      />
                      <Input
                        icon={MapPin}
                        value={editForm.location || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, location: e.target.value })
                        }
                        placeholder="Location"
                        required
                      />
                      <Input
                        icon={DollarSign}
                        type="number"
                        value={editForm.rent || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, rent: e.target.value })
                        }
                        placeholder="Rent"
                        required
                      />
                      <Input
                        icon={Home}
                        value={editForm.property_type || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            property_type: e.target.value,
                          })
                        }
                        placeholder="Property Type"
                        required
                      />
                      <Input
                        icon={Users}
                        value={editForm.tenant_preference || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            tenant_preference: e.target.value,
                          })
                        }
                        placeholder="Tenant Preference"
                        required
                      />
                      <Input
                        icon={Phone}
                        value={editForm.contact_number || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            contact_number: e.target.value,
                          })
                        }
                        placeholder="Contact Number"
                      />
                      <div className="flex gap-2 pt-2">
                        <Button type="submit" size="sm" variant="primary" className="flex-1">
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="flex-1"
                          onClick={() => setEditingRoomId(null)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Body scroll lock while modal open */}
                {typeof window !== "undefined" && (
                  <BodyScrollLock isLocked={true} />
                )}
              </>
            )}

          </Card>
        ))}
      </div>
      {rooms.length === 0 && (
        <Card className="py-16">
          <div className="text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-1">No rooms found</p>
            <p className="text-sm text-gray-500">
              Try adjusting your filters or check back later
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
