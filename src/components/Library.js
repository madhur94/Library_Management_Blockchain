import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlockchain } from '../context/BlockchainContext';
import { useToast } from '../context/ToastContext';
import { registerUser, borrowBook, returnBook } from '../utils/contract';
import BookList from './BookList';
import BookForm from './BookForm';
import BorrowingsList from './BorrowingsList';
import ConnectWallet from './ConnectWallet';

const Library = () => {
  const { 
    loading, 
    error, 
    connected, 
    userAddress, 
    isRegistered, 
    isAdmin,
    refreshBooks
  } = useBlockchain();
  
  const [activeTab, setActiveTab] = useState('books');
  const [registering, setRegistering] = useState(false);
  const toast = useToast();
  
  // Handle user registration
  const handleRegister = async () => {
    try {
      setRegistering(true);
      const result = await registerUser();
      if (result.success) {
        toast.success('Registration successful! Welcome to the Blockchain Library.');
        window.location.reload(); // Reload to update registration status
      } else {
        toast.error(`Registration failed: ${result.error}`);
      }
    } catch (err) {
      console.error('Error registering user:', err);
      toast.error(`Registration failed: ${err.message}`);
    } finally {
      setRegistering(false);
    }
  };
  
  // Handle borrowing a book
  const handleBorrow = async (bookId) => {
    try {
      const result = await borrowBook(bookId);
      if (result.success) {
        toast.success('Book borrowed successfully');
        refreshBooks();
      } else {
        toast.error(`Failed to borrow book: ${result.error}`);
      }
    } catch (err) {
      console.error('Error borrowing book:', err);
      toast.error(`Failed to borrow book: ${err.message}`);
    }
  };
  
  // Handle returning a book
  const handleReturn = async (bookId) => {
    try {
      const result = await returnBook(bookId);
      if (result.success) {
        toast.success('Book returned successfully');
        refreshBooks();
      } else {
        toast.error(`Failed to return book: ${result.error}`);
      }
    } catch (err) {
      console.error('Error returning book:', err);
      toast.error(`Failed to return book: ${err.message}`);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="premium-spinner"></div>
        <p className="mt-4 text-gray-600">Connecting to blockchain...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-10 px-4"
      >
        <div className="inline-block p-4 rounded-full bg-red-50 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Connection Error</h3>
        <p className="text-red-500 mb-4 max-w-md mx-auto">{error}</p>
        <ConnectWallet />
      </motion.div>
    );
  }
  
  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <ConnectWallet />
      </motion.div>
    );
  }
  
  if (!isRegistered) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card max-w-md mx-auto p-8 text-center"
      >
        <div className="inline-block p-4 rounded-full bg-indigo-50 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the Library</h2>
        <p className="mb-6 text-gray-600">To borrow books, you need to register as a library member. Registration is free and only takes a moment.</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6 overflow-hidden text-left">
          <p className="text-xs text-gray-500 mb-1">Your Ethereum Address</p>
          <p className="font-mono text-sm text-gray-700 truncate">{userAddress}</p>
        </div>
        <button
          onClick={handleRegister}
          disabled={registering}
          className={`premium-button premium-button-primary w-full ${registering ? 'opacity-70' : ''}`}
        >
          {registering ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </span>
          ) : 'Register Now'}
        </button>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="premium-card p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div className="flex-1 mb-4 md:mb-0">
          <div className="bg-indigo-50 rounded-lg p-3 inline-block">
            <p className="text-xs text-gray-500 mb-1">Connected as</p>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 pulse"></div>
              <p className="font-mono text-sm text-gray-700 truncate max-w-xs">{userAddress}</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
              {/* {isAdmin ? 'Admin' : 'Member'} */}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          <button
            onClick={() => setActiveTab('books')}
            className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === 'books' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Browse Books
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('borrowings')}
            className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === 'borrowings' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              My Borrowings
            </span>
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setActiveTab('add')}
              className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeTab === 'add' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Book
              </span>
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <AnimatePresence mode="wait">
          {activeTab === 'books' && (
            <motion.div
              key="books"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BookList onBorrow={handleBorrow} />
            </motion.div>
          )}
          
          {activeTab === 'borrowings' && (
            <motion.div
              key="borrowings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BorrowingsList onReturn={handleReturn} />
            </motion.div>
          )}
          
          {activeTab === 'add' && isAdmin && (
            <motion.div
              key="add"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BookForm onAddSuccess={refreshBooks} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Library; 