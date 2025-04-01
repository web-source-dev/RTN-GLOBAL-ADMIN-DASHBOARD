import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CssBaseline } from '@mui/material';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminOverview from './components/admin/Overview';
import AdminUsers from './components/admin/Users';
import AdminBlogs from './components/admin/Blogs';
import AdminJobs from './components/admin/Jobs';
import AdminNewsletter from './components/admin/Newsletter';
import ChatDashboard from './components/admin/ChatDashboard';
import AdminSupport from './components/admin/Support';
import ManageConsultation from './components/admin/ManageConsultation';
import CreateBlog from './components/blog/CreateBlog';
import ManageBlog from './components/blog/ManageBlog';

const App = () => {
  return (
    <AuthProvider>
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
        <Route path="/blog/create" element={
                    <ProtectedRoute adminOnly>
                      <CreateBlog />
                    </ProtectedRoute>
                  } />
                  <Route path="/blog/edit/:id" element={
                    <ProtectedRoute adminOnly>
                      <CreateBlog />
                    </ProtectedRoute>
                  } />
                  <Route path="/blog/manage" element={
                    <ProtectedRoute adminOnly>
                      <ManageBlog />
                    </ProtectedRoute>
                  } />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="chat" element={<ChatDashboard />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="consultation" element={<ManageConsultation />} />
            </Route>
        </Routes>
      </Router>
    </ThemeProvider>
    </AuthProvider>
  );
};

export default App;