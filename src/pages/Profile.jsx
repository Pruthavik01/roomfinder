import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { UserCircle, Moon, Sun, Save, User, Phone, Briefcase } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

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
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
            <UserCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Your Profile</h2>
            <p className="text-sm text-gray-600">Manage your account settings</p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>
      
      <Card className="p-6">
        <form onSubmit={save} className="space-y-5">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile?.username?.[0]?.toUpperCase() || form.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
          
          <Input
            icon={User}
            label="Username"
            value={form.username}
            onChange={e=>setForm({...form,username:e.target.value})}
            placeholder="Your username"
          />
          
          <Input
            icon={Phone}
            label="Phone Number"
            value={form.phone}
            onChange={e=>setForm({...form,phone:e.target.value})}
            placeholder="+91 9876543210"
          />
          
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" />
              Role
            </label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.role}
              onChange={e=>setForm({...form,role:e.target.value})}
            >
              <option value="finder">Finder - Looking for rooms</option>
              <option value="owner">Owner - List your property</option>
            </select>
          </div>
          
          <Button 
            type="submit" 
            variant="primary"
            size="lg"
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
