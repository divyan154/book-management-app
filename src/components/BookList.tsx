import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../types';

interface BookListProps {
  books: Book[];
}

export function BookList({ books }: BookListProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          onClick={() => navigate(`/books/${book.id}`)}
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-sm text-gray-500 mt-2">Genre: {book.genre}</p>
            <div className="mt-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  book.is_available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {book.is_available ? 'Available' : 'Checked Out'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}