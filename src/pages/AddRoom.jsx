import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MapPin, DollarSign, Home, Users, Phone, Upload as UploadIcon } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function AddRoom({ user, onRoomAdded }) {
  const [form, setForm] = useState({
    title: '',
    location: '',
    rent: '',
    property_type: '',
    tenant_preference: '',
    contact_number: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    /* 1️⃣ Create room */
    const { data: room, error } = await supabase
      .from('rooms')
      .insert({
        owner: user.id,
        title: form.title,
        location: form.location,
        rent: form.rent,
        property_type: form.property_type,
        tenant_preference: form.tenant_preference,
        contact_number: form.contact_number
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    /* 2️⃣ Upload image (optional but recommended) */
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${room.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('room-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      /* 3️⃣ Save image path in room_images table */
      const { error: imageError } = await supabase
        .from('room_images')
        .insert({
          room_id: room.id,
          image_path: filePath
        });

      if (imageError) {
        alert(imageError.message);
        setLoading(false);
        return;
      }
    }

    alert('Room added successfully');
    setForm({
      title: '',
      location: '',
      rent: '',
      property_type: '',
      tenant_preference: '',
      contact_number: ''
    });
    setImageFile(null);

    setLoading(false);
    onRoomAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="title"
          label="Room Title"
          placeholder="e.g., Cozy 1 BHK Apartment"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Input
          icon={MapPin}
          name="location"
          label="Location"
          placeholder="City, Area"
          value={form.location}
          onChange={handleChange}
          required
        />
        <Input
          icon={DollarSign}
          name="rent"
          type="number"
          label="Monthly Rent (₹)"
          placeholder="15000"
          value={form.rent}
          onChange={handleChange}
          required
        />
        <Input
          icon={Home}
          name="property_type"
          label="Property Type"
          placeholder="1 BHK, 2 Bed, Studio"
          value={form.property_type}
          onChange={handleChange}
          required
        />
        <Input
          icon={Users}
          name="tenant_preference"
          label="Tenant Preference"
          placeholder="Family, Bachelor, Working Professional"
          value={form.tenant_preference}
          onChange={handleChange}
          required
        />
        <Input
          icon={Phone}
          name="contact_number"
          label="Contact Number"
          placeholder="+91 9876543210"
          value={form.contact_number}
          onChange={handleChange}
        />
      </div>

      <div>
        <Input
          icon={UploadIcon}
          type="file"
          accept="image/*"
          label="Room Image"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        {imageFile && (
          <p className="mt-1 text-xs text-gray-600">Selected: {imageFile.name}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        isLoading={loading}
        variant="primary"
        size="lg"
        className="w-full"
      >
        <UploadIcon className="w-4 h-4 mr-2" />
        {loading ? 'Adding Room...' : 'Add Room Listing'}
      </Button>
    </form>
  );
}
