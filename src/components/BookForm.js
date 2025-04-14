import React, { useState } from 'react';
import { addBook } from '../utils/contract';

const BookForm = ({ onAddSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    copies: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'copies' ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate inputs
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.author.trim()) {
        throw new Error('Author is required');
      }
      if (formData.copies <= 0) {
        throw new Error('Number of copies must be greater than 0');
      }

      // Add book to blockchain
      const result = await addBook(
        formData.title.trim(),
        formData.author.trim(),
        formData.copies
      );

      if (result.success) {
        setSuccess(true);
        setFormData({
          title: '',
          author: '',
          copies: 1
        });
        
        // Refresh books list
        if (onAddSuccess) {
          onAddSuccess();
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Book</h2>
      
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          Book added successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Enter book title"
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="author" className="block mb-1 font-medium">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Enter author name"
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="copies" className="block mb-1 font-medium">
            Number of Copies
          </label>
          <input
            type="number"
            id="copies"
            name="copies"
            value={formData.copies}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            min="1"
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default BookForm; 