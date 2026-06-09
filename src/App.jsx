import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Projects from './pages/Projects';
import Kanban from './pages/Kanban';
import Analytics from './pages/Analytics';
import { AuthContext } from './context/AuthProvider';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#1c1c1c] text-white">Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
      />

      <Route 
        path="/register" 
        element={!user ? <Register /> : <Navigate to="/dashboard" replace />} 
      />
      
      <Route 
        path="/dashboard/*" 
        element={
          user ? (
            user.role === 'Admin' ? <AdminDashboard /> : <EmployeeDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />

      <Route 
        path="/projects" 
        element={
          user ? <Projects /> : <Navigate to="/" replace />
        } 
      />

      <Route 
        path="/kanban" 
        element={
          user ? <Kanban /> : <Navigate to="/" replace />
        } 
      />

      <Route 
        path="/analytics" 
        element={
          user ? <Analytics /> : <Navigate to="/" replace />
        } 
      />
    </Routes>
  );
};

export default App;