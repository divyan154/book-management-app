import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';
import { BooksPage } from './pages/BooksPage';
import { BookDetails } from './components/BookDetails';
import { AddBook } from './components/AddBook';
import { Auth } from './components/Auth';
import { Navbar } from './components/Navbar';


function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);


  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {user && <Navbar />}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/books" replace />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/auth"
              element={user ? <Navigate to="/books" replace /> : <Auth />}
            />
            <Route
              path="/books"
              element={user ? <BooksPage /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/books/add"
              element={user ? <AddBook /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/books/:id"
              element={user ? <BookDetails /> : <Navigate to="/auth" replace />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
