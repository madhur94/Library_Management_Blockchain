import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  initializeContract, 
  isUserRegistered, 
  isAdmin as checkIsAdmin,
  getAllBooks as fetchAllBooks
} from '../utils/contract';

// Create context
const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [books, setBooks] = useState([]);

  // Initialize the blockchain connection
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if we recently disconnected - if so, don't auto-connect
        const disconnectedAt = localStorage.getItem('disconnectedAt');
        const wasRecentlyDisconnected = disconnectedAt && 
          (Date.now() - parseInt(disconnectedAt)) < 1000 * 60 * 10; // 10 minutes
        
        if (wasRecentlyDisconnected) {
          console.log("Recently disconnected - not auto-connecting");
          setLoading(false);
          setConnected(false);
          return;
        }
        
        // Check if we just connected successfully (from connect wallet page)
        const connectSuccessful = localStorage.getItem('connectSuccessful');
        const shouldConnect = localStorage.getItem('shouldConnect') === 'true';
        
        // If we just successfully connected, use force connect
        const useForceConnect = connectSuccessful === 'true' || shouldConnect;
        
        // Attempt to connect
        const result = await initializeContract(useForceConnect);
        
        if (result.success) {
          console.log("Blockchain connection successful");
          setConnected(true);
          setUserAddress(result.userAddress);
          
          // Clear connection successful flag if it exists
          if (connectSuccessful === 'true') {
            localStorage.removeItem('connectSuccessful');
          }
          
          // Check if user is registered
          const registered = await isUserRegistered();
          setIsRegistered(registered);
          
          // Check if user is admin
          const admin = await checkIsAdmin();
          setIsAdmin(admin);
          
          // Fetch books
          const allBooks = await fetchAllBooks();
          setBooks(allBooks);
        } else {
          console.log("Not connecting:", result.error);
          setConnected(false);
          
          // Don't set an error if user hasn't connected yet
          if (result.error !== 'Not connected - manual connection required') {
            setError(result.error);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Error initializing blockchain:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accounts => {
        if (accounts.length > 0) {
          // Don't reload - just update state and check registration
          init();
        } else {
          setConnected(false);
          setUserAddress('');
          localStorage.removeItem('shouldConnect');
          // Force reload to ensure clean state
          window.location.reload();
        }
      });
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        // Always reload on chain changes to prevent state inconsistency
        window.location.reload();
      });
    }
    
    // Cleanup listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  // Refresh books list
  const refreshBooks = async () => {
    try {
      const allBooks = await fetchAllBooks();
      setBooks(allBooks);
    } catch (err) {
      console.error('Error refreshing books:', err);
    }
  };

  // Context value
  const contextValue = {
    loading,
    error,
    connected,
    userAddress,
    isRegistered,
    isAdmin,
    books,
    refreshBooks
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};

// Custom hook to use the blockchain context
export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}; 