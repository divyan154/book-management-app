import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { LogOut, Plus } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/auth');
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 
              className="text-xl font-bold text-gray-900 cursor-pointer"
              onClick={() => navigate('/books')}
            >
              Library Manager
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/books/add')}
              className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Book
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}