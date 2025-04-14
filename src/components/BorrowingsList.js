import React, { useState, useEffect } from 'react';
import { getUserBorrowings, getAllBooks } from '../utils/contract';

const BorrowingsList = ({ onReturn }) => {
  const [borrowings, setBorrowings] = useState([]);
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Load borrowings and books
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load user borrowings
        const userBorrowings = await getUserBorrowings();
        
        // Load all books to get titles
        const allBooks = await getAllBooks();
        
        // Create a books lookup object
        const booksMap = {};
        allBooks.forEach(book => {
          booksMap[book.id] = book;
        });
        
        setBooks(booksMap);
        setBorrowings(userBorrowings);
      } catch (err) {
        console.error('Error loading borrowings:', err);
        setError('Failed to load borrowings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading borrowings...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (borrowings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">You have not borrowed any books yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Borrowings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Book ID</th>
              <th className="py-2 px-4 border-b text-left">Title</th>
              <th className="py-2 px-4 border-b text-left">Borrow Date</th>
              <th className="py-2 px-4 border-b text-left">Return Date</th>
              <th className="py-2 px-4 border-b text-center">Status</th>
              <th className="py-2 px-4 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowings.map((borrowing, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{borrowing.bookId}</td>
                <td className="py-2 px-4 border-b">
                  {books[borrowing.bookId]?.title || `Book #${borrowing.bookId}`}
                </td>
                <td className="py-2 px-4 border-b">
                  {formatDate(borrowing.borrowDate)}
                </td>
                <td className="py-2 px-4 border-b">
                  {borrowing.returnDate ? formatDate(borrowing.returnDate) : '-'}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      borrowing.returned
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {borrowing.returned ? 'Returned' : 'Borrowed'}
                  </span>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {!borrowing.returned && (
                    <button
                      onClick={() => onReturn(borrowing.bookId)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowingsList; 