import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';
import MainPage from "./pages/MainPage.tsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;