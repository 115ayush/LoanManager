import { useContext } from "react";
import { AdminContext } from "../App";
import {
  Button,
  TextField,
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Link as MuiLink,
  Grid,
  Divider,
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { loginUser } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginFormData {
  email: string;
  password: string;
}

function Login() {
  const { register, handleSubmit, formState, setError, clearErrors } = useForm<LoginFormData>();
  const { errors } = formState;
  const { setUser } = useContext(AdminContext);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginUser(data.email, data.password);
      if (response?.user) {
        const user = response.user;
        setUser(user);
        toast.success("Login successful", { autoClose: 2000 });
        navigate(user.role === "user" ? "/" : `/${user.role}-dashboard`);
      } else if (response?.status === 401) {
        setError("email", { type: "manual", message: "Invalid credentials" });
        toast.error("Invalid credentials", { autoClose: 2000 });
      } else {
        toast.error("An unknown error occurred", { autoClose: 2000 });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login", { autoClose: 2000 });
    } finally {
      setTimeout(() => clearErrors("email"), 2000);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ pt: 8 }}>
      <ToastContainer />
      <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message as string | undefined}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              maxLength: {
                value: 16,
                message: "Password must not exceed 16 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message as string | undefined}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}
          >
            Sign In
          </Button>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" align="center">
            Don't have an account?{' '}
            <MuiLink component={Link} to="/register" variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Register
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
