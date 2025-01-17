import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Retrieved token from localStorage:", token?.substring(0, 20) + "...");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);
        headers.append('Content-Type', 'application/json');

        headers.forEach((value, name) => {
          console.log(`${name}: ${value}`);
        });

        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: 'GET',
          headers: headers
        });

        console.log("Response status:", response.status);
        
        const contentType = response.headers.get("content-type");
        let data;
        
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
          console.log("Response data:", data);
        } else {
          const text = await response.text();
          console.log("Response text:", text);
          data = { message: text };
        }

        if (!response.ok) {
          throw new Error(data.message || `Server responded with ${response.status}`);
        }

        setUserData(data);
      } catch (err) {
        console.error("Error in profile fetch:", err);
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-blue-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-600 p-4 bg-red-50 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {/* Profile Header */}
      <div className="bg-blue-600 text-white py-6 px-4 rounded mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileField label="Name" value={userData.name || "Not provided"} />
        <ProfileField label="Username" value={userData.username || "Not provided"} />
        <ProfileField label="Email" value={userData.email || "Not provided"} />
        <ProfileField label="Age" value={userData.age || "Not provided"} />
        <ProfileField 
          label="Weight" 
          value={userData.weight ? `${userData.weight} kg` : "Not provided"} 
        />
        <ProfileField label="Height" value={userData.height || "Not provided"} />
        <ProfileField 
          label="Dietary Preferences" 
          value={userData.dietaryPreferences || "Not provided"} 
        />
        <ProfileField label="Goals" value={userData.goals || "Not provided"} />
      </div>

      {/* Get Insights Button */}
      <div className="fixed bottom-4 right-4">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => navigate("/insights")}
        >
          Get Insights
        </button>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="p-4 bg-white shadow rounded">
    <div className="font-medium text-gray-600 mb-1">{label}:</div>
    <div>{value}</div>
  </div>
);

export default Profile;
