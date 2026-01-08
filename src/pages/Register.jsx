import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

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
    // navigate to login with state message
    navigate('/login', { state: { info: 'Please confirm your email. A confirmation email has been sent.' } });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Create Account</h2>
        <p className="text-sm text-gray-600">Join RoomFinder today</p>
      </div>
      
      <Card className="p-6 sm:p-8 shadow-xl">
        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-4">
          <Input
            icon={User}
            label="Username"
            placeholder="Choose a username"
            value={form.username}
            onChange={e=>setForm({...form,username:e.target.value})}
            required
          />
          
          <Input
            icon={Phone}
            label="Phone Number"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={e=>setForm({...form,phone:e.target.value})}
          />
          
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.role}
              onChange={e=>setForm({...form,role:e.target.value})}
            >
              <option value="finder">Finder - Looking for rooms</option>
              <option value="owner">Owner - List your property</option>
            </select>
          </div>
          
          <Input
            icon={Mail}
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={form.email}
            onChange={e=>setForm({...form,email:e.target.value})}
            required
          />
          
          <Input
            icon={Lock}
            type="password"
            label="Password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={e=>setForm({...form,password:e.target.value})}
            required
          />
          
          {message && (
            <div className={`flex items-center gap-2 p-3 text-sm rounded-lg border ${
              message.includes('success') 
                ? 'text-green-700 bg-green-50 border-green-200' 
                : 'text-red-700 bg-red-50 border-red-200'
            }`}>
              {message.includes('success') ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create Account
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
