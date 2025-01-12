import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    });
    setError('');
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setLoading(false);
        setError('Email and password are required for login.');
        return;
      }
    } else {
      if (!formData.name || !formData.email || !formData.username || !formData.password) {
        setLoading(false);
        setError('All fields are required for signup.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setLoading(false);
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setLoading(false);
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    const endpoint = isLogin
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/signup';

    const body = isLogin
      ? JSON.stringify({
          email: formData.email,
          password: formData.password,
        })
      : JSON.stringify({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });

    console.log('Sending data:', body); 

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        console.log('Response:', result);
        navigate('/profile'); // Redirect to profile on success
      } else {
        console.error('Server Error:', result);
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during request:', error);
      setError('Failed to connect to the server!');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? 'Login' : 'Signup'}
        </h2>
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                  placeholder="Choose a unique username"
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="Enter your password"
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="Re-enter your password"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg flex items-center justify-center"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Signup'}
          </button>
        </form>
        <button
          onClick={handleToggle}
          className="w-full text-sm text-teal-600 hover:underline mt-4"
        >
          {isLogin ? 'Create an account' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Signup;
