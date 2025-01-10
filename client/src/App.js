import React from 'react';
import './styles/tailwind.css';
import {BrowserRouter,Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; // Correct path for Home page
import SignUp from './pages/SignUp'; // Make sure this matches the file name and case
import About from './pages/About'; // Make sure this matches the actual file name
import Contact from './pages/Contact'; // Make sure this matches the actual file name
import 'animate.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
