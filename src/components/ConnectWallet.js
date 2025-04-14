import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { initializeContract } from '../utils/contract';
import { useToast } from '../context/ToastContext';

const ConnectWallet = () => {
  const [connecting, setConnecting] = useState(false);
  const toast = useToast();

  const handleConnect = async () => {
    try {
      setConnecting(true);
      
      // Check if MetaMask exists
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }
      
      // Get disconnect timestamp to check if this is a fresh connection attempt
      const disconnectedAt = localStorage.getItem('disconnectedAt');
      const wasRecentlyDisconnected = disconnectedAt && 
        (Date.now() - parseInt(disconnectedAt)) < 1000 * 60 * 10; // 10 minutes
      
      // Force disconnect from MetaMask if recently disconnected
      if (wasRecentlyDisconnected) {
        try {
          // This will help reset MetaMask's connection state
          await window.ethereum._handleDisconnect();
        } catch (e) {
          // Some MetaMask versions don't support this, which is fine
          console.log("MetaMask doesn't support programmatic disconnect");
        }
      }
      
      // Clear the disconnect timestamp
      localStorage.removeItem('disconnectedAt');
      
      // Request account access directly - this will force MetaMask to show the popup
      await window.ethereum.request({ 
        method: 'eth_requestAccounts',
        // Force user interaction 
        params: [{
          eth_accounts: {}
        }]
      });
      
      // Then initialize the contract after user has approved access
      const result = await initializeContract(true);
      
      if (result.success) {
        // Set a flag to track successful connection
        localStorage.setItem('connectSuccessful', 'true');
        
        // Reload page after connection to update the UI
        window.location.reload();
      } else {
        throw new Error(result.error || "Failed to initialize contract");
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(`Failed to connect wallet: ${error.message}`);
      setConnecting(false);
    }
  };
  
  // Check if we've just connected successfully
  useEffect(() => {
    const connectSuccessful = localStorage.getItem('connectSuccessful');
    if (connectSuccessful === 'true') {
      // Clear the flag
      localStorage.removeItem('connectSuccessful');
      // Force a refresh of the app state
      window.location.reload();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="premium-card p-8 max-w-md mx-auto text-center relative"
    >
      {/* Decorative background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      
      <div className="relative z-10">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(79, 70, 229, 0.7)',
                  '0 0 0 10px rgba(79, 70, 229, 0)',
                  '0 0 0 0 rgba(79, 70, 229, 0)'
                ]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2
              }}
              className="w-20 h-20 rounded-full flex items-center justify-center bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </motion.div>
          </div>
          <motion.h2 
            className="text-3xl font-bold mb-2 text-gray-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Secure Blockchain Library
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
        </div>
        
        <motion.p 
          className="mb-8 text-gray-600 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Connect your wallet to borrow books, track your borrowings, and participate in our decentralized library system.
        </motion.p>
        
        <motion.button
          onClick={handleConnect}
          disabled={connecting}
          whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(79, 70, 229, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="premium-button premium-button-primary w-full py-3 mb-6 relative overflow-hidden group"
        >
          <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          {connecting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect MetaMask
            </span>
          )}
        </motion.button>
        
        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center p-2 bg-indigo-50 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              Make sure you have MetaMask installed
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center p-2 bg-purple-50 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              Your data is secured on the blockchain
            </p>
          </div>
        </div>
        
        {/* Animated dots */}
        <div className="absolute bottom-4 right-4 flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="w-2 h-2 rounded-full bg-indigo-500"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ConnectWallet; 