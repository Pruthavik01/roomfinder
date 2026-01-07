import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const { session, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ username:'', phone:'', role:'' });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (profile) setForm({ username: profile.username || '', phone: profile.phone || '', role: profile.role || '' });
  }, [profile]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const save = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profiles').update(form).eq('id', session.user.id);
    if (error) alert(error.message); else { alert('Saved'); refreshProfile(); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-3" style={{ maxWidth:600 }}>
      <div className="flex justify-end mb-3">
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">Your Profile</h2>
      </div>
      <form onSubmit={save} className="card">
        <input
          className="w-full mb-3 p-2 border rounded"
          value={form.username}
          onChange={e=>setForm({...form,username:e.target.value})}
          placeholder="Username"
        /><br/>
        <input
          className="w-full mb-3 p-2 border rounded"
          value={form.phone}
          onChange={e=>setForm({...form,phone:e.target.value})}
          placeholder="Phone"
        /><br/>
        <select
          className="w-full mb-3 p-2 border rounded"
          value={form.role}
          onChange={e=>setForm({...form,role:e.target.value})}
        >
          <option value="finder">Finder</option>
          <option value="owner">Owner</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold">Save</button>
      </form>
    </div>
  );
}
