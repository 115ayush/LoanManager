import { useEffect, useState, useContext } from 'react';
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Divider,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getAllLoans } from '../services/utils'; // Adjust the import path accordingly
import { AdminContext } from '../App';

interface Loan {
  _id: string;
  loanAmount: number;
  fullName: string;
  loanTenure: number;
  employmentStatus: string;
  reasonForLoan: string;
  employmentAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface GetAllLoansResponse {
  loans: Loan[];
}

const Dashboard: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { user } = useContext(AdminContext);
  let userId = user?._id || '';

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const data: GetAllLoansResponse | null = await getAllLoans(userId);

        if (data?.loans && data.loans.length > 0) {
          setLoans(data.loans);
          setError(''); // Reset error if data is fetched
        } else {
          setLoans([]); // Ensure loans are empty if none are found
          setError('You have not applied for any loans yet.');
        }
      } catch (error) {
        setError('Failed to fetch loans. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchLoans();
    }
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold" color="green">
        Your Loan Applications
      </Typography>

      {error && loans.length === 0 && (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2, backgroundColor: '#fdecea', color: '#d32f2f' }}>
            <Typography variant="body1" color="error" align="center">
              {error}
            </Typography>
          </Paper>
        </Box>
      )}

      {!error && loans.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No loan history available.</Typography>
        </Paper>
      )}

      {loans.length > 0 && !error && (
        <Grid container spacing={3}>
          {loans.map((loan) => (
            <Grid item xs={12} key={loan._id}>
              <Card sx={{ boxShadow: 3 }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                      <Typography variant="h6">
                        Loan Amount: ₹{loan.loanAmount}
                      </Typography>
                      <Chip label={loan.status} color={getStatusColor(loan.status)} size="small" />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Loan Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <List disablePadding>
                        <ListItem>
                          <ListItemText primary="Full Name" secondary={loan.fullName} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Loan Tenure" secondary={`${loan.loanTenure} months`} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Employment Status" secondary={loan.employmentStatus} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Reason for Loan" secondary={loan.reasonForLoan} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Employment Address" secondary={loan.employmentAddress} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Application Date" secondary={formatDate(loan.createdAt)} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Last Updated" secondary={formatDate(loan.updatedAt)} />
                        </ListItem>
                      </List>
                    </CardContent>
                  </AccordionDetails>
                </Accordion>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
