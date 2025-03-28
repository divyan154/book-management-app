import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { BookList } from '../components/BookList';
import { Book } from '../types';
import { Plus, Search } from 'lucide-react';

export function BooksPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState<'author' | 'id'>('author');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchTerm, searchBy, books]);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  }

  const filterBooks = () => {
    if (!searchTerm) {
      setFilteredBooks(books);
      return;
    }

    const filtered = books.filter(book => {
      if (searchBy === 'author') {
        return book.author.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return book.id.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
    setFilteredBooks(filtered);
  };

  async function fetchBooks() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');
      
      if (error) {
        throw error;
      }

      setBooks(data || []);
      setFilteredBooks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Library Books</h1>
        <button
          onClick={() => navigate('/books/add')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Book
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search by ${searchBy}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value as 'author' | 'id')}
            className="block rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="author">Author</option>
            <option value="id">Book ID</option>
          </select>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books found. Add some books to get started!</p>
        </div>
      ) : (
        <BookList books={filteredBooks} />
      )}
    </div>
  );
}