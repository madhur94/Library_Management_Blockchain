# Blockchain Library Management System

A decentralized library management system built on blockchain technology. The system allows users to register, borrow, and return books, while administrators can add and manage the book inventory.

## Features

- **Blockchain-based**: All transactions are stored on the blockchain for transparency and security
- **User Registration**: Users can register to the system
- **Book Management**: Admins can add, update, and manage books
- **Borrowing System**: Users can borrow and return books
- **Real-time Updates**: All changes are reflected in real-time on the blockchain

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Blockchain**: Ethereum, Solidity
- **Web3 Integration**: ethers.js

## Prerequisites

- Node.js (v14 or later)
- NPM or Yarn
- MetaMask browser extension
- Access to an Ethereum network (local, testnet, or mainnet)

## Setup and Installation

1. **Clone the repository**:

```bash
git clone <repository-url>
cd blockchain-library-management
```

2. **Install dependencies**:

```bash
npm install
```

3. **Compile and deploy the smart contract**:

You need to compile and deploy the Solidity smart contract `LibraryManagement.sol` to your chosen Ethereum network using tools like Truffle, Hardhat, or Remix.

4. **Update contract address and ABI**:

After deploying the smart contract, update the contract address and ABI in `src/utils/contract.js`.

5. **Start the development server**:

```bash
npm start
```

6. **Build for production**:

```bash
npm run build
```

## Usage

1. **Connect your MetaMask wallet** to the application
2. **Register** as a library user
3. **Browse available books** and borrow them
4. **Return books** when you're done reading
5. **Admins** can add new books and manage inventory

## Smart Contract Functions

- `registerUser()`: Register a new user
- `addBook(title, author, copies)`: Add a new book (admin only)
- `updateBook(bookId, title, author, copies)`: Update book details (admin only)
- `borrowBook(bookId)`: Borrow a book
- `returnBook(bookId)`: Return a borrowed book
- `getAllBooks()`: Get all available books
- `getUserBorrowings()`: Get user's borrowing history

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Ethereum community
- React.js and Tailwind CSS community
- All contributors to this project
