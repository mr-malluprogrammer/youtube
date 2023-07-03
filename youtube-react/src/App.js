import './css/App.css';
import Login from './pages/Login'
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from 'react-auth-kit';
import ForgotPassword from './pages/ForgotPassword';
function App() {
  return (
    <div className="App">
      <Routes>

        <Route path='/' element={<RequireAuth loginPath='/login'><Home /></RequireAuth>} />
        <Route index path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgotpassword' exact element={<ForgotPassword />} />
        <Route path='*' element={<NoPage />} />
      </Routes>
    </div>
  );
}

export default App;