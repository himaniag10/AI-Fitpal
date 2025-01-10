import React from 'react';
import 'animate.css'; // Import Animate.css
import fitnessImage from '../assets/fitness.jpg'; // Ensure the image is present in the assets folder
import profileLogo from '../assets/profile-user.png'; // Replace with your logo path

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-indigo-100 via-white to-blue-50 min-h-screen text-gray-800 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-indigo-500 shadow-lg animate__animated animate__fadeInDown">
        <h1 className="text-3xl font-bold text-white">FitPal</h1>
        <nav>
          <ul className="flex space-x-6 text-lg font-medium">
            <li>
              <a
                href="/signup"
                className="text-white hover:text-indigo-200 transition duration-300"
              >
                SignUp|Login
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:opacity-80 transition duration-300">
                <img
                  src={profileLogo}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-10 flex-grow">
        <img
          src={fitnessImage}
          alt="Fitness"
          className="w-full h-72 object-cover animate__animated animate__zoomIn"
        />
        <div className="mt-6">
          <h2 className="text-4xl font-semibold text-indigo-600 animate__animated animate__fadeInUp">
            Welcome to FitPal
          </h2>
          <p className="mt-4 text-lg text-gray-700 animate__animated animate__fadeInUp animate__delay-1s">
            Your ultimate AI-powered fitness and health companion. Join us to
            achieve your goals with personalized plans tailored just for you!
          </p>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-10 bg-indigo-50">
        <h3 className="text-3xl font-bold text-center text-indigo-600 mb-6 animate__animated animate__fadeInUp">
          Our Goals
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="w-60 p-4 bg-white shadow-md rounded-lg text-center animate__animated animate__fadeInLeft">
            <h4 className="text-xl font-semibold text-gray-800">Weight Management</h4>
            <p className="mt-2 text-gray-600">
              Customized plans for losing, gaining, or maintaining weight.
            </p>
          </div>
          <div className="w-60 p-4 bg-white shadow-md rounded-lg text-center animate__animated animate__fadeInUp">
            <h4 className="text-xl font-semibold text-gray-800">Improved Fitness</h4>
            <p className="mt-2 text-gray-600">
              Get stronger and fitter with curated workouts.
            </p>
          </div>
          <div className="w-60 p-4 bg-white shadow-md rounded-lg text-center animate__animated animate__fadeInRight">
            <h4 className="text-xl font-semibold text-gray-800">Healthy Lifestyle</h4>
            <p className="mt-2 text-gray-600">
              Build sustainable habits for long-term health and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* User Reviews Section */}
      <section className="py-10 bg-white">
        <h3 className="text-3xl font-bold text-center text-indigo-600 mb-6 animate__animated animate__fadeInUp">
          What Our Users Say
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="w-80 p-4 bg-indigo-100 shadow-md rounded-lg animate__animated animate__zoomIn">
            <p className="text-lg italic text-gray-700">
              "FitPal completely transformed my fitness journey! The personalized
              plans and support are outstanding." - <strong>Komal Joshi</strong>
            </p>
          </div>
          <div className="w-80 p-4 bg-indigo-100 shadow-md rounded-lg animate__animated animate__zoomIn animate__delay-1s">
            <p className="text-lg italic text-gray-700">
              "I love how easy it is to track my progress and stick to my goals.
              Highly recommended!" - <strong>Gunjan Jeena</strong>
            </p>
          </div>
          <div className="w-80 p-4 bg-indigo-100 shadow-md rounded-lg animate__animated animate__zoomIn animate__delay-2s">
            <p className="text-lg italic text-gray-700">
              "Amazing platform! It feels like having a personal trainer 24/7." - <strong>Himani Agarwal</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-500 text-white py-4 text-center animate__animated animate__fadeInUp">
        <p className="text-sm">
          © 2025 FitPal. All Rights Reserved. |{' '}
          <a
            href="/contact"
            className="underline hover:text-indigo-200 transition duration-300"
          >
            Contact Us
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
