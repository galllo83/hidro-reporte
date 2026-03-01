import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './modules/auth/presentation/LoginPage';
import { RegisterPage } from './modules/auth/presentation/RegisterPage';
import { DashboardPage } from './modules/dashboard/presentation/DashboardPage';
import { HomePage } from './modules/home/presentation/HomePage';
import { MyReportsPage } from './modules/report/presentation/MyReportsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-reports" element={<MyReportsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
