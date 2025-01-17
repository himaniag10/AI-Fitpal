import React from 'react';
import './styles/tailwind.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import UpdateDetails from './pages/UpdateDetails';
import TestBackend from './pages/TestBackend'; 
import 'animate.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/update-details" element={<UpdateDetails />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/test-backend" element={<TestBackend />} /> 
        <Route path="*" element={<div>Page Not Found</div>} /> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;
