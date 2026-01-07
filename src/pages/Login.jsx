import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password
    });
    if (error) setMessage(error.message);
    else navigate('/');
  };

  return (
    <div style={{ padding:20, maxWidth:420, margin:'0 auto' }}>
      <h2>Login</h2>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      <br/><br/>
      <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
      <br/><br/>
      <button onClick={submit}>Login</button>
      <p style={{color:'red'}}>{message}</p>
    </div>
  );
}
