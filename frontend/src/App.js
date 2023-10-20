import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ProfilePage from './components/ProfilePage';
//import AboutPage from './components/AboutPage'; // Hypothetical public page
//import ContactPage from './components/ContactPage'; // Hypothetical public page
import PrivateRoute from './PrivateRoute'; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
