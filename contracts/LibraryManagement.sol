// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LibraryManagement {
    // Struct to store book information
    struct Book {
        uint256 id;
        string title;
        string author;
        uint256 copies;
        uint256 availableCopies;
        bool exists;
    }
    
    // Struct to store borrowing information
    struct Borrowing {
        uint256 bookId;
        uint256 borrowDate;
        uint256 returnDate;
        bool returned;
    }
    
    // Admin address
    address public admin;
    
    // Book ID counter
    uint256 public bookIdCounter;
    
    // Mapping from book ID to book details
    mapping(uint256 => Book) public books;
    
    // Mapping from user address to array of borrowed books
    mapping(address => Borrowing[]) public userBorrowings;
    
    // Mapping to track registered users
    mapping(address => bool) public registeredUsers;
    
    // List of all users
    address[] public userAddresses;
    
    // Events
    event BookAdded(uint256 indexed id, string title, string author, uint256 copies);
    event BookBorrowed(address indexed user, uint256 indexed bookId, uint256 borrowDate);
    event BookReturned(address indexed user, uint256 indexed bookId, uint256 returnDate);
    event UserRegistered(address indexed user);
    
    // Modifier to ensure only admin can call certain functions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    // Modifier to ensure only registered users can call certain functions
    modifier onlyRegisteredUser() {
        require(registeredUsers[msg.sender], "Only registered users can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        bookIdCounter = 1;
    }
    
    // Function to register a new user
    function registerUser() external {
        require(!registeredUsers[msg.sender], "User is already registered");
        
        registeredUsers[msg.sender] = true;
        userAddresses.push(msg.sender);
        
        emit UserRegistered(msg.sender);
    }
    
    // Function to add a new book (admin only)
    function addBook(string memory _title, string memory _author, uint256 _copies) external onlyAdmin {
        require(_copies > 0, "Number of copies must be greater than 0");
        
        books[bookIdCounter] = Book({
            id: bookIdCounter,
            title: _title,
            author: _author,
            copies: _copies,
            availableCopies: _copies,
            exists: true
        });
        
        emit BookAdded(bookIdCounter, _title, _author, _copies);
        bookIdCounter++;
    }
    
    // Function to update book details (admin only)
    function updateBook(uint256 _bookId, string memory _title, string memory _author, uint256 _copies) external onlyAdmin {
        require(books[_bookId].exists, "Book does not exist");
        
        // Calculate how many copies are currently borrowed
        uint256 borrowedCopies = books[_bookId].copies - books[_bookId].availableCopies;
        
        // Ensure new copies are at least equal to borrowed copies
        require(_copies >= borrowedCopies, "Cannot reduce copies below number of borrowed books");
        
        books[_bookId].title = _title;
        books[_bookId].author = _author;
        books[_bookId].copies = _copies;
        books[_bookId].availableCopies = _copies - borrowedCopies;
    }
    
    // Function to borrow a book
    function borrowBook(uint256 _bookId) external onlyRegisteredUser {
        require(books[_bookId].exists, "Book does not exist");
        require(books[_bookId].availableCopies > 0, "No copies available");
        
        // Check if user has already borrowed this book and not returned
        Borrowing[] storage borrowings = userBorrowings[msg.sender];
        for (uint256 i = 0; i < borrowings.length; i++) {
            if (borrowings[i].bookId == _bookId && !borrowings[i].returned) {
                revert("You have already borrowed this book and not returned it");
            }
        }
        
        // Create new borrowing record
        userBorrowings[msg.sender].push(Borrowing({
            bookId: _bookId,
            borrowDate: block.timestamp,
            returnDate: 0,
            returned: false
        }));
        
        // Update available copies
        books[_bookId].availableCopies--;
        
        emit BookBorrowed(msg.sender, _bookId, block.timestamp);
    }
    
    // Function to return a book
    function returnBook(uint256 _bookId) external onlyRegisteredUser {
        require(books[_bookId].exists, "Book does not exist");
        
        Borrowing[] storage borrowings = userBorrowings[msg.sender];
        
        // Find the borrowing record
        bool found = false;
        for (uint256 i = 0; i < borrowings.length; i++) {
            if (borrowings[i].bookId == _bookId && !borrowings[i].returned) {
                borrowings[i].returned = true;
                borrowings[i].returnDate = block.timestamp;
                found = true;
                
                // Update available copies
                books[_bookId].availableCopies++;
                
                emit BookReturned(msg.sender, _bookId, block.timestamp);
                break;
            }
        }
        
        require(found, "You have not borrowed this book or have already returned it");
    }
    
    // Function to get all books
    function getAllBooks() external view returns (Book[] memory) {
        uint256 count = 0;
        
        // Count existing books
        for (uint256 i = 1; i < bookIdCounter; i++) {
            if (books[i].exists) {
                count++;
            }
        }
        
        Book[] memory allBooks = new Book[](count);
        uint256 index = 0;
        
        // Fill array with existing books
        for (uint256 i = 1; i < bookIdCounter; i++) {
            if (books[i].exists) {
                allBooks[index] = books[i];
                index++;
            }
        }
        
        return allBooks;
    }
    
    // Function to get user borrowing history
    function getUserBorrowings() external view onlyRegisteredUser returns (Borrowing[] memory) {
        return userBorrowings[msg.sender];
    }
    
    // Function to check if a book is available
    function isBookAvailable(uint256 _bookId) external view returns (bool) {
        require(books[_bookId].exists, "Book does not exist");
        return books[_bookId].availableCopies > 0;
    }
    
    // Function to get book details
    function getBookDetails(uint256 _bookId) external view returns (
        string memory title,
        string memory author,
        uint256 copies,
        uint256 availableCopies
    ) {
        require(books[_bookId].exists, "Book does not exist");
        Book storage book = books[_bookId];
        return (book.title, book.author, book.copies, book.availableCopies);
    }
    
    // Function to get all registered users (admin only)
    function getAllUsers() external view onlyAdmin returns (address[] memory) {
        return userAddresses;
    }
} 