import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Book } from '../types';

export function AddBook() {
  const navigate = useNavigate();
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    genre: '',
    is_available: true
  });

  async function handleAddBook(e: React.FormEvent) {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('books')
      .insert([newBook])
      .select();

    if (error) {
      console.error('Error adding book:', error);
    } else {
      navigate('/books');
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Add New Book</h2>
      <form onSubmit={handleAddBook} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Genre</label>
          <input
            type="text"
            value={newBook.genre}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Add Book
          </button>
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}