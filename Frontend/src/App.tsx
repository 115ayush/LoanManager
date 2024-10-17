import "./App.css";
import { useEffect, useState, createContext, Dispatch, SetStateAction } from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./routes";
import { fetchCredentials, AuthResponse } from "./services/auth";
import { CircularProgress, Container } from "@mui/material";
import 'slick-carousel/slick/slick.css'; // Import slick carousel styles
import 'slick-carousel/slick/slick-theme.css';

// Define the context type for Admin context
interface AdminContextType {
  user: AuthResponse['user'] | null; // Current user data
  setUser: Dispatch<SetStateAction<AuthResponse['user'] | null>>; // Function to update user data
}

// Create the Admin context
const AdminContext = createContext<AdminContextType>({
  user: null, // Default user state
  setUser: () => null, // Default setUser function
});

function App() {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null); // User state
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch user credentials on component mount
  useEffect(() => {
    setIsLoading(true);
    fetchCredentials().then((response) => {
      if (response) {
        console.log(response); // Log user response for debugging
        setUser(response); // Update user state
      }
      setIsLoading(false); // Update loading state
    });
  }, []);

  return (
    <AdminContext.Provider value={{ user, setUser }}>
      {isLoading ? (
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Container>
      ) : (
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      )}
    </AdminContext.Provider>
  );
}

// Export the AdminContext and default App component
export { AdminContext };
export default App;
