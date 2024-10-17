import { Button, TextField, Container, Box, Typography, Paper, Avatar, Link } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useForm, SubmitHandler } from "react-hook-form";
import { registerUser } from "../services/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../App";
import { useContext } from "react";

interface RegistrationFormData {
  email: string;
  password: string;
}

function Registration() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegistrationFormData>();
  const navigate = useNavigate();
  const { setUser } = useContext(AdminContext);

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    try {
      const response = await registerUser(data.email, data.password);
      if (response?.user) {
        setUser(response.user);
        toast.success("Registration successful", { autoClose: 2000 });
        navigate("/");
      } else if (response?.status === 400) {
        setError("email", { type: "manual", message: response.message });
        toast.error(response?.message, { autoClose: 2000 });
      } else {
        toast.error("An unknown error occurred", { autoClose: 2000 });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration", { autoClose: 2000 });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <ToastContainer />
      <Paper elevation={8} sx={{ mt: 10, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '16px' }}>
        <Avatar sx={{ m: 1, bgcolor: '#1976D2', width: 56, height: 56 }}> {/* Color updated */}
          <PersonAddIcon sx={{ color: 'white' }} /> {/* White icon for contrast */}
        </Avatar>
        <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Create an Account
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          Please fill in the details to register.
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
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
            helperText={errors.email?.message}
            sx={{ borderRadius: '8px' }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
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
            helperText={errors.password?.message}
            sx={{ borderRadius: '8px' }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, borderRadius: '8px' }}
          >
            Register
          </Button>
          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Link href="/login" variant="body2" sx={{ ml: 1 }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Registration;
