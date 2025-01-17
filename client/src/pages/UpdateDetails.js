import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UpdateDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    feet: "",
    inches: "",
    weight: "",
    fitnessLevel: "",
    dietaryPreferences: "",
    goals: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/signup");
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        navigate("/signup");
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/signup");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "feet" || name === "inches") {
      const currentFeet = name === "feet" ? value : formData.feet;
      const currentInches = name === "inches" ? value : formData.inches;
      
      if (currentFeet && currentInches) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          height: `${currentFeet}'${currentInches}"` 
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.feet || !formData.inches) {
      setError("Please select both feet and inches for height");
      setLoading(false);
      return;
    }

    const requiredFields = ['age', 'weight', 'fitnessLevel', 'dietaryPreferences', 'goals'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    if (emptyFields.length > 0) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const apiPayload = {
      age: formData.age,
      height: formData.height, 
      weight: formData.weight,
      fitnessLevel: formData.fitnessLevel,
      dietaryPreferences: formData.dietaryPreferences,
      goals: formData.goals
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/update-details",
        apiPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`,
          },
        }
      );
      console.log('Update response:', response.data); 
      if (response.data.success || response.status === 200) {
        alert("Profile updated successfully!");
        navigate("/profile");
      }
    } catch (error) {
      console.error('Error details:', error.response?.data); 
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        navigate("/signup");
      } else {
        setError(
          error.response?.data?.message ||
            "An error occurred while updating your profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Update Details
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <select
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Age</option>
          {Array.from({ length: 83 }, (_, i) => (
            <option key={i} value={i + 18}>
              {i + 18}
            </option>
          ))}
        </select>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height
          </label>
          <div className="flex space-x-2">
            <select
              name="feet"
              value={formData.feet}
              onChange={handleChange}
              className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Feet</option>
              {Array.from({ length: 8 }, (_, i) => i + 4).map((feet) => (
                <option key={feet} value={feet}>
                  {feet} ft
                </option>
              ))}
            </select>

            <select
              name="inches"
              value={formData.inches}
              onChange={handleChange}
              className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Inches</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {i}"
                </option>
              ))}
            </select>
          </div>
        </div>

        <select
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Weight (in kg)</option>
          {Array.from({ length: 101 }, (_, i) => (
            <option key={i} value={i + 30}>
              {i + 30} kg
            </option>
          ))}
        </select>

        <select
          name="fitnessLevel"
          value={formData.fitnessLevel}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Fitness Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          name="dietaryPreferences"
          value={formData.dietaryPreferences}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Dietary Preferences</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Keto">Keto</option>
        </select>

        <select
          name="goals"
          value={formData.goals}
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Goals</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Improved Fitness">Improved Fitness</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded-lg focus:outline-none`}
        >
          {loading ? "Updating..." : "Update Details"}
        </button>
      </form>
    </div>
  );
};

export default UpdateDetails;