import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn as LoginIcon, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

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
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4">
          <LoginIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Welcome Back</h2>
        <p className="text-sm text-gray-600">Sign in to your RoomFinder account</p>
      </div>
      
      <Card className="p-6 sm:p-8 shadow-xl">
        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-5">
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
            placeholder="Enter your password"
            value={form.password}
            onChange={e=>setForm({...form,password:e.target.value})}
            required
          />
          
          {message && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
          >
            <LoginIcon className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
