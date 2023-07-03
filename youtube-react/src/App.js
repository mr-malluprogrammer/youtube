import './css/App.css';
import Login from './pages/Login'
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import React from 'react'
import { Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Routes>

        <Route path='/' element={<Home />} />
        <Route index path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='*' element={<NoPage />} />
      </Routes>
    </div>
  );
}

export default App;