import React from 'react';
import './styles/tailwind.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Contact from './pages/Contact';
import TestBackend from './pages/TestBackend'; // Import TestBackend page
import 'animate.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        <Route path="/test-backend" element={<TestBackend />} /> {/* New Route */}
        <Route path="*" element={<div>Page Not Found</div>} /> {/* Fallback Route */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
