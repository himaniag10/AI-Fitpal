import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode"; // Ensure this is installed with npm

const UpdateDetails = () => {
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    fitnessLevel: "",
    dietaryPreferences: "",
    goals: "",
  });

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user ID from token (or a global state management)
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setUserId(decoded.id);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/update-details",
        { userId, ...formData }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Update Details</h2>
        
        <input
          type="text"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="text"
          name="height"
          value={formData.height}
          onChange={handleChange}
          placeholder="Height"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Weight"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="text"
          name="fitnessLevel"
          value={formData.fitnessLevel}
          onChange={handleChange}
          placeholder="Fitness Level"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="text"
          name="dietaryPreferences"
          value={formData.dietaryPreferences}
          onChange={handleChange}
          placeholder="Dietary Preferences"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="text"
          name="goals"
          value={formData.goals}
          onChange={handleChange}
          placeholder="Goals"
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          Update Details
        </button>
      </form>
    </div>
  );
};

export default UpdateDetails;
