import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css'
import Transactions from './pages/Transactions';
import EditTransaction from './pages/EditTransactions';

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route 
          path="/transactions" 
          element={
            
              <Transactions />
            
          } 
        />

        <Route 
          path="/transactions/edit/:id" 
          element={
            
              <EditTransaction />
            
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
