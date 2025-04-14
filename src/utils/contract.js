import { ethers } from 'ethers';

// ABI from the compiled contract
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "author",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "copies",
        "type": "uint256"
      }
    ],
    "name": "BookAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "bookId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "borrowDate",
        "type": "uint256"
      }
    ],
    "name": "BookBorrowed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "bookId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "returnDate",
        "type": "uint256"
      }
    ],
    "name": "BookReturned",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "bookIdCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "books",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "author",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "copies",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "availableCopies",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "registeredUsers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userAddresses",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userBorrowings",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "bookId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "borrowDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "returnDate",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "returned",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_author",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_copies",
        "type": "uint256"
      }
    ],
    "name": "addBook",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_bookId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_author",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_copies",
        "type": "uint256"
      }
    ],
    "name": "updateBook",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_bookId",
        "type": "uint256"
      }
    ],
    "name": "borrowBook",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_bookId",
        "type": "uint256"
      }
    ],
    "name": "returnBook",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllBooks",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "author",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "copies",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "availableCopies",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          }
        ],
        "internalType": "struct LibraryManagement.Book[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getUserBorrowings",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "bookId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "borrowDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "returnDate",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "returned",
            "type": "bool"
          }
        ],
        "internalType": "struct LibraryManagement.Borrowing[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_bookId",
        "type": "uint256"
      }
    ],
    "name": "isBookAvailable",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_bookId",
        "type": "uint256"
      }
    ],
    "name": "getBookDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "author",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "copies",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "availableCopies",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllUsers",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract address from the deployment
const contractAddress = '0x9bDA6cBFef2D02A13ADa4e35d2743A6c5D937667';

let libraryContract = null;
let signer = null;

// Initialize contract connection - modified to prevent auto-connection
export const initializeContract = async (forceConnect = false) => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install it to use this app.');
    }

    // Clear existing connection on startup
    if (!forceConnect && localStorage.getItem('shouldConnect') !== 'true') {
      console.log("Initial load - not auto-connecting");
      return { success: false, error: 'Not connected - manual connection required' };
    }

    // We don't need to request accounts again if already requested in the Connect button
    // but we'll check if accounts are available
    let accounts;
    try {
      accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0 && forceConnect) {
        // Only request if forcing connection and no accounts available
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      if (accounts.length === 0) {
        throw new Error('No accounts available. Please connect MetaMask.');
      }
    } catch (err) {
      console.error("Error getting accounts:", err);
      return { success: false, error: 'Failed to access your MetaMask accounts' };
    }

    // Create a provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Get the signer
    signer = await provider.getSigner();
    
    // Create contract instance
    libraryContract = new ethers.Contract(contractAddress, contractABI, signer);
    
    // Save connection state
    localStorage.setItem('shouldConnect', 'true');
    
    return { success: true, contract: libraryContract, userAddress: await signer.getAddress() };
  } catch (error) {
    console.error('Error initializing contract:', error);
    return { success: false, error: error.message };
  }
};

// Function to explicitly disconnect
export const disconnectWallet = () => {
  // Clear all connection-related state
  localStorage.removeItem('shouldConnect');
  localStorage.removeItem('connectSuccessful');
  
  // Add a disconnect timestamp to enforce fresh connection
  localStorage.setItem('disconnectedAt', Date.now().toString());
  
  // Clear contract state
  libraryContract = null;
  signer = null;
  
  // Reload to show connect page
  window.location.reload();
};

// Check if user is registered
export const isUserRegistered = async () => {
  try {
    if (!libraryContract) await initializeContract();
    const userAddress = await signer.getAddress();
    return await libraryContract.registeredUsers(userAddress);
  } catch (error) {
    console.error('Error checking user registration:', error);
    return false;
  }
};

// Register user
export const registerUser = async () => {
  try {
    if (!libraryContract) await initializeContract();
    const tx = await libraryContract.registerUser();
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: error.message };
  }
};

// Add a book (admin only)
export const addBook = async (title, author, copies) => {
  try {
    if (!libraryContract) await initializeContract();
    const tx = await libraryContract.addBook(title, author, copies);
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error('Error adding book:', error);
    return { success: false, error: error.message };
  }
};

// Update a book (admin only)
export const updateBook = async (bookId, title, author, copies) => {
  try {
    if (!libraryContract) await initializeContract();
    const tx = await libraryContract.updateBook(bookId, title, author, copies);
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error('Error updating book:', error);
    return { success: false, error: error.message };
  }
};

// Borrow a book
export const borrowBook = async (bookId) => {
  try {
    if (!libraryContract) await initializeContract();
    const tx = await libraryContract.borrowBook(bookId);
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error('Error borrowing book:', error);
    return { success: false, error: error.message };
  }
};

// Return a book
export const returnBook = async (bookId) => {
  try {
    if (!libraryContract) await initializeContract();
    const tx = await libraryContract.returnBook(bookId);
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error('Error returning book:', error);
    return { success: false, error: error.message };
  }
};

// Get all books
export const getAllBooks = async () => {
  try {
    if (!libraryContract) await initializeContract();
    const books = await libraryContract.getAllBooks();
    
    // Format books data
    return books.map(book => ({
      id: Number(book.id),
      title: book.title,
      author: book.author,
      copies: Number(book.copies),
      availableCopies: Number(book.availableCopies)
    }));
  } catch (error) {
    console.error('Error getting all books:', error);
    return [];
  }
};

// Get user borrowings
export const getUserBorrowings = async () => {
  try {
    if (!libraryContract) await initializeContract();
    const borrowings = await libraryContract.getUserBorrowings();
    
    // Format borrowings data
    return borrowings.map(borrowing => ({
      bookId: Number(borrowing.bookId),
      borrowDate: new Date(Number(borrowing.borrowDate) * 1000),
      returnDate: borrowing.returnDate > 0 ? new Date(Number(borrowing.returnDate) * 1000) : null,
      returned: borrowing.returned
    }));
  } catch (error) {
    console.error('Error getting user borrowings:', error);
    return [];
  }
};

// Check if user is admin
export const isAdmin = async () => {
  try {
    if (!libraryContract) await initializeContract();
    const admin = await libraryContract.admin();
    const userAddress = await signer.getAddress();
    return admin.toLowerCase() === userAddress.toLowerCase();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    if (!libraryContract) await initializeContract();
    return await libraryContract.getAllUsers();
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}; 