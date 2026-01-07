import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email:'', password:'', username:'', phone:'', role:'finder' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    setMessage('');
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { username: form.username, phone: form.phone, role: form.role } }
    });
    if (error) {
      if (error.message.toLowerCase().includes('already')) setMessage('User already exists. Please login.');
      else setMessage(error.message);
      return;
    }
    setMessage('Signup success. Check your email to verify.');
    // navigate to login or let user verify first
    navigate('/login');
  };

  return (
    <div style={{ padding:20, maxWidth:420, margin:'0 auto' }}>
      <h2>Register</h2>
      <input placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} />
      <br/><br/>
      <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
      <br/><br/>
      <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
        <option value="finder">Finder</option>
        <option value="owner">Owner</option>
      </select>
      <br/><br/>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      <br/><br/>
      <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
      <br/><br/>
      <button onClick={submit}>Sign Up</button>
      <p style={{color:'red'}}>{message}</p>
    </div>
  );
}
