import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const { session, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ username:'', phone:'', role:'' });

  useEffect(() => {
    if (profile) setForm({ username: profile.username || '', phone: profile.phone || '', role: profile.role || '' });
  }, [profile]);

  const save = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profiles').update(form).eq('id', session.user.id);
    if (error) alert(error.message); else { alert('Saved'); refreshProfile(); }
  };

  return (
    <div style={{ padding:20, maxWidth:600 }}>
      <h2>Your Profile</h2>
      <form onSubmit={save}>
        <input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} /><br/><br/>
        <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /><br/><br/>
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="finder">Finder</option>
          <option value="owner">Owner</option>
        </select>
        <br/><br/>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
