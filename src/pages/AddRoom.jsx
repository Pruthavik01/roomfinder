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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
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
        } else {
            alert('Room added. Now upload images.');
            onRoomAdded();
        }
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

            <input name="property_type" placeholder="Property Type (1 BHK, 2 Bed)" value={form.property_type} onChange={handleChange} required />
            <br /><br />

            <input name="tenant_preference" placeholder="Tenant Preference" value={form.tenant_preference} onChange={handleChange} required />
            <br /><br />

            <input name="contact_number" placeholder="Contact Number" value={form.contact_number} onChange={handleChange} />
            <br /><br />

            <button type="submit">Add Room</button>
        </form>
    );
}
