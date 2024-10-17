import { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { submitLoanApplication } from '../services/utils'; // Adjust the path accordingly
import { AdminContext } from '../App';

// Define the LoanApplicationData interface
interface LoanApplicationData {
  userId: string;
  fullName: string;
  loanAmount: string; // Keep as string for form input
  loanTenure: string; // Keep as string for form input
  employmentStatus: string;
  reasonForLoan: string;
  employmentAddress: string;
  hasReadInformation: boolean;
  agreeToDisclosure: boolean;
}

// Define the LoanData interface for submission
interface LoanData {
  userId: string;
  fullName: string;
  loanAmount: number;
  loanTenure: number;
  employmentStatus: string;
  reasonForLoan: string;
  employmentAddress: string;
  hasReadInformation: boolean;
  agreeToDisclosure: boolean;
}

const LoanApplicationForm = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<LoanApplicationData>({
    defaultValues: {
      userId: '',
      fullName: '',
      loanAmount: '',
      loanTenure: '',
      employmentStatus: '',
      reasonForLoan: '',
      employmentAddress: '',
      hasReadInformation: false,
      agreeToDisclosure: false,
    }
  });

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useContext(AdminContext);
  const userId = user?._id || '';
  const navigate = useNavigate(); // Initialize useNavigate

  const onSubmit = async (data: LoanApplicationData) => {
    setLoading(true);
    try {
      // Convert loanAmount and loanTenure to numbers before submitting
      const loanData: LoanData = {
        ...data,
        userId,
        loanAmount: Number(data.loanAmount),
        loanTenure: Number(data.loanTenure),
      };

      await submitLoanApplication(loanData);
      setOpenSnackbar(true);
      
      // Reset the form fields
      reset();
      
      // Redirect to /userDashboard
      navigate('/userDashboard');
    } catch (error) {
      console.error('Error submitting loan application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Apply for a Loan
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: "Full name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="loanAmount"
              control={control}
              rules={{
                required: "Loan amount is required",
                validate: (value) => Number(value) > 0 || "Loan amount must be a positive number"
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Loan Amount"
                  variant="outlined"
                  type="number"
                  error={!!errors.loanAmount}
                  helperText={errors.loanAmount?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="loanTenure"
              control={control}
              rules={{
                required: "Loan tenure is required",
                validate: (value) => Number.isInteger(Number(value)) && Number(value) > 0 || "Loan tenure must be a positive integer"
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Loan Tenure (in months)"
                  variant="outlined"
                  type="number"
                  error={!!errors.loanTenure}
                  helperText={errors.loanTenure?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="employmentStatus"
              control={control}
              rules={{ required: "Employment status is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Employment Status"
                  variant="outlined"
                  error={!!errors.employmentStatus}
                  helperText={errors.employmentStatus?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="reasonForLoan"
              control={control}
              rules={{ required: "Reason for loan is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Reason for Loan"
                  variant="outlined"
                  multiline
                  rows={4}
                  error={!!errors.reasonForLoan}
                  helperText={errors.reasonForLoan?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="employmentAddress"
              control={control}
              rules={{ required: "Employment address is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Employment Address"
                  variant="outlined"
                  error={!!errors.employmentAddress}
                  helperText={errors.employmentAddress?.message}
                />
              )}
            />
          </Grid>
          {/* Checkbox Controls */}
          {/* Remove Checkbox Controls for simplicity */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              type="submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Your Loan is under review!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default LoanApplicationForm;
