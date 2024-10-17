import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./Home";
import Login from "./Auth/login";
import Register from "./Auth/register";
import ProtectedUser from "./protectedUser";
import LoanApplicationForm from "./Form/form";
import UserDashboard from "./userDashboard/userDashBoard";
import VerifierDashboard from "./VerifierDashboard/verify_dashboard";
import AdminDashboard from "./AdminDashboard/admin_dashboard";
import Navbar from './navbar'; // Import your Navbar component

const Main = () => {
    const location = useLocation(); // Get the current location

    // Check if the current path is one where the navbar should be hidden
    const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            {!hideNavbar && <Navbar />} {/* Conditionally render the Navbar */}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/loan-application" element={<ProtectedUser><LoanApplicationForm/></ProtectedUser>} />
                <Route path="/userDashboard" element={<ProtectedUser><UserDashboard /></ProtectedUser>} />
                <Route path="/verifier-dashboard" element={<ProtectedUser><VerifierDashboard /></ProtectedUser>} />
                <Route path="/admin-dashboard" element={<ProtectedUser><AdminDashboard/></ProtectedUser>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default Main;
