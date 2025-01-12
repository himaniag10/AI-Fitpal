import React, { useState } from 'react';
import { testBackend } from '../api/api'; // Import API function from the API folder

const TestBackend = () => {
  const [message, setMessage] = useState('');

  const handleTest = async () => {
    try {
      const data = await testBackend();
      setMessage(data.message); // Expecting a `message` key in backend response
    } catch (error) {
      setMessage('Error connecting to the backend.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Backend Connection</h1>
      <button
        onClick={handleTest}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Connection
      </button>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};

export default TestBackend;
