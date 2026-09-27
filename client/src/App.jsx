import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Classes from './pages/Classes';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import Results from './pages/Results';
import Fees from './pages/Fees';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route
        path="/students"
        element={
          <PrivateRoute roles={['admin', 'teacher']}>
            <Students />
          </PrivateRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <PrivateRoute roles={['admin']}>
            <Teachers />
          </PrivateRoute>
        }
      />
      <Route
        path="/classes"
        element={
          <PrivateRoute roles={['admin', 'teacher']}>
            <Classes />
          </PrivateRoute>
        }
      />
      <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
      <Route path="/exams" element={<PrivateRoute><Exams /></PrivateRoute>} />
      <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
      <Route
        path="/fees"
        element={
          <PrivateRoute roles={['admin', 'student']}>
            <Fees />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
