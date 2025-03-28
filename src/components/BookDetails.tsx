import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Book } from '../types';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';

export function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState<Book | null>(null);

  useEffect(() => {
    fetchBook();
  }, [id]);

  async function fetchBook() {
    if (!id) return;

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching book:', error);
      navigate('/books');
    } else {
      setBook(data);
      setEditedBook(data);
    }
  }

  async function handleUpdateBook(e: React.FormEvent) {
    e.preventDefault();
    if (!editedBook) return;

    const { error } = await supabase
      .from('books')
      .update({
        title: editedBook.title,
        author: editedBook.author,
        genre: editedBook.genre,
        is_available: editedBook.is_available
      })
      .eq('id', editedBook.id);

    if (error) {
      console.error('Error updating book:', error);
    } else {
      setBook(editedBook);
      setIsEditing(false);
    }
  }

  async function handleDeleteBook() {
    if (!book || !window.confirm('Are you sure you want to delete this book?')) return;

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', book.id);

    if (error) {
      console.error('Error deleting book:', error);
    } else {
      navigate('/books');
    }
  }

  async function toggleAvailability() {
    if (!book) return;

    const { data, error } = await supabase
      .from('books')
      .update({ is_available: !book.is_available })
      .eq('id', book.id)
      .select();

    if (error) {
      console.error('Error updating availability:', error);
    } else {
      setBook(data[0]);
      if (editedBook) {
        setEditedBook(data[0]);
      }
    }
  }

  if (!book || !editedBook) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/books')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Books
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDeleteBook}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdateBook} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={editedBook.title}
              onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              value={editedBook.author}
              onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <input
              type="text"
              value={editedBook.genre}
              onChange={(e) => setEditedBook({ ...editedBook, genre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditedBook(book);
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{book.title}</h2>
            <p className="text-xl text-gray-600 mt-2">by {book.author}</p>
          </div>
          <div>
            <p className="text-gray-600"><span className="font-semibold">Genre:</span> {book.genre}</p>
            <p className="text-gray-600"><span className="font-semibold">ID:</span> {book.id}</p>
          </div>
          <button
            onClick={toggleAvailability}
            className={`px-4 py-2 rounded-lg font-medium ${
              book.is_available
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            {book.is_available ? 'Available' : 'Checked Out'}
          </button>
        </div>
      )}
    </div>
  );
}