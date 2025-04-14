import React, { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

const BookList = ({ onBorrow }) => {
  const { books, loading } = useBlockchain();
  const toast = useToast();
  const [expandedBookId, setExpandedBookId] = useState(null);

  const handleBorrow = async (bookId) => {
    try {
      await onBorrow(bookId);
      toast.success('Book borrowed successfully!');
    } catch (error) {
      toast.error(`Failed to borrow book: ${error.message}`);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="premium-spinner"></div>
        <span className="ml-3 text-gray-600">Loading library catalog...</span>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 px-4"
      >
        <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Library Catalog Empty</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          No books are available in the library yet. The admin can add books to start building the collection.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fade-in"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          <span className="gradient-text">Library Catalog</span>
        </h2>
        <div className="flex items-center">
          <div className="bg-indigo-50 rounded-full px-3 py-1 text-sm text-indigo-700">
            {books.length} Book{books.length !== 1 ? 's' : ''} Available
          </div>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container} 
        initial="hidden" 
        animate="show"
      >
        {books.map((book) => (
          <motion.div
            key={book.id}
            variants={item}
            whileHover={{ y: -5 }}
            className="premium-card book-card overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between mb-3">
                <span className={`status-badge ${book.availableCopies > 0 ? 'status-available' : 'status-borrowed'}`}>
                  {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                </span>
                <span className="text-sm text-gray-500">ID: {book.id}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-4">by {book.author}</p>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-500">{book.copies} Total Copies</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-sm text-gray-500">{book.availableCopies} Available</span>
                </div>
              </div>
              
              <button
                onClick={() => handleBorrow(book.id)}
                disabled={book.availableCopies === 0}
                className={`w-full premium-button ${book.availableCopies > 0 ? 'premium-button-primary' : 'bg-gray-300 cursor-not-allowed text-white'}`}
              >
                {book.availableCopies > 0 ? 'Borrow Now' : 'Currently Unavailable'}
              </button>
              
              <button 
                onClick={() => setExpandedBookId(expandedBookId === book.id ? null : book.id)}
                className="w-full mt-3 text-indigo-600 text-sm hover:text-indigo-800 focus:outline-none"
              >
                {expandedBookId === book.id ? 'Show Less' : 'More Details'}
              </button>

              {expandedBookId === book.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 pt-3 border-t border-gray-100"
                >
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium text-gray-700">Availability:</span>{' '}
                    {book.availableCopies} of {book.copies} copies available
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Borrowed:</span>{' '}
                    {book.copies - book.availableCopies} copies currently borrowed
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default BookList; 