import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

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
    <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
      <h3>Add Room</h3>

      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <br /><br />

      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
      <br /><br />

      <input name="rent" type="number" placeholder="Rent" value={form.rent} onChange={handleChange} required />
      <br /><br />

      <input name="property_type" placeholder="Property Type" value={form.property_type} onChange={handleChange} required />
      <br /><br />

      <input name="tenant_preference" placeholder="Tenant Preference" value={form.tenant_preference} onChange={handleChange} required />
      <br /><br />

      <input name="contact_number" placeholder="Contact Number" value={form.contact_number} onChange={handleChange} />
      <br /><br />

      {/* 🖼 Image input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      <br /><br />

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Room'}
      </button>
    </form>
  );
}
