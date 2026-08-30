import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentComplaintListPage } from './pages/student/StudentComplaintListPage';
import { StudentNewComplaintPage } from './pages/student/StudentNewComplaintPage';
import { StudentComplaintDetailPage } from './pages/student/StudentComplaintDetailPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminComplaintListPage } from './pages/admin/AdminComplaintListPage';
import { AdminComplaintDetailPage } from './pages/admin/AdminComplaintDetailPage';
import { AdminDepartmentsPage } from './pages/admin/AdminDepartmentsPage';
import { AdminStaffPage } from './pages/admin/AdminStaffPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Student Protected routes */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboardPage />} />
              <Route path="complaints" element={<StudentComplaintListPage />} />
              <Route path="complaints/new" element={<StudentNewComplaintPage />} />
              <Route path="complaints/:id" element={<StudentComplaintDetailPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
              <Route index element={<Navigate to="/student/dashboard" replace />} />
            </Route>

            {/* Admin Protected routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="complaints" element={<AdminComplaintListPage />} />
              <Route path="complaints/:id" element={<AdminComplaintDetailPage />} />
              <Route path="departments" element={<AdminDepartmentsPage />} />
              <Route path="staff" element={<AdminStaffPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
