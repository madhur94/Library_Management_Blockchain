import React from 'react';
import './App.css';
import './premium.css';
import { BlockchainProvider } from './context/BlockchainContext';
import { ToastProvider } from './context/ToastContext';
import Library from './components/Library';
import { motion } from 'framer-motion';

function App() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Improved decorative elements with better positioning */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="fixed top-80 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-0 right-60 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      
      <BlockchainProvider>
        <ToastProvider>
          <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
            <motion.header 
              className="mb-12 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Fixed title bubble with centered alignment */}
              <div className="inline-flex justify-center items-center relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 blur-xl opacity-40 rounded-full transform scale-110"></div>
                <h1 className="text-5xl font-bold relative px-12 py-4">
                  <span className="gradient-text">Blockchain Library</span>
                </h1>
              </div>
              
              {/* Centered divider */}
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full my-5"></div>
              
              <motion.p 
                className="text-gray-600 max-w-xl mx-auto text-lg mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                A decentralized library management system powered by blockchain technology.
                Borrow books with complete transparency and security.
              </motion.p>
            </motion.header>
            
            <main>
              <Library />
            </main>
            
            <footer className="mt-20 pb-8 text-center text-gray-500 text-sm">
              <div className="max-w-lg mx-auto border-t border-gray-200 pt-8">
                <p>© {currentYear} Blockchain Library Management System</p>
                <p className="mt-2">All transactions are securely recorded on the blockchain.</p>
              </div>
            </footer>
          </div>
        </ToastProvider>
      </BlockchainProvider>
      
      {/* Enhanced blob animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 17s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2.5s;
        }
        .animation-delay-4000 {
          animation-delay: 5s;
        }
      `}</style>
    </div>
  );
}

export default App;
