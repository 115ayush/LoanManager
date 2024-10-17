import { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Box, Dialog, DialogTitle, DialogActions,
  DialogContent, DialogContentText, Select, MenuItem, FormControl, InputLabel, Chip,
  Tab, Tabs
} from '@mui/material';

import { getAllApplications, reviewLoan, getAllUsers } from '../services/utils';
import { Loan, LoanStatus,User } from "../types";

const statusColors: { [key in LoanStatus]: string } = {
  pending: '#FFA000',
  approved: '#4CAF50',
  rejected: '#F44336',
  under_review: '#2196F3'
};

const AdminDashboard = () => {
  const [applications, setApplications] = useState<Loan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tabValue, setTabValue] = useState(0);
  
  // Loan management states
  const [selectedLoanId, setSelectedLoanId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<LoanStatus | ''>('');
  const [openLoanDialog, setOpenLoanDialog] = useState<boolean>(false);



  useEffect(() => {
    const fetchApplicationsAndUsers = async () => {
      try {
        const loanResponse = await getAllApplications();
        const loans = loanResponse?.loans.map((loan) => ({
          ...loan,
          status: ['pending', 'approved', 'rejected', 'under_review'].includes(loan.status)
            ? (loan.status as LoanStatus)
            : 'pending'
        }));
        setApplications(loans);

        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchApplicationsAndUsers();
  }, []);

  const handleReviewClick = (loanId: string) => {
    setSelectedLoanId(loanId);
    setOpenLoanDialog(true);
  };

  const handleConfirmStatusChange = async () => {
    if (selectedStatus) {
      try {
        await reviewLoan(selectedLoanId, selectedStatus);
        setOpenLoanDialog(false);
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app._id === selectedLoanId ? { ...app, status: selectedStatus as LoanStatus } : app
          )
        );
      } catch (error) {
        console.error('Error reviewing loan:', error);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUserRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const totalLoans = applications.length;
  const approvedLoans = applications.filter(app => app.status === 'approved');
  const borrowers = approvedLoans.length;
  const cashDisbursed = approvedLoans.reduce((acc, app) => acc + app.loanAmount, 0);
  const totalUsers = users.length;
  const totalAdmins = users.filter(user => user.role === 'admin').length;
  const totalVerifiers = users.filter(user => user.role === 'verifier').length;

 

  return (
    <Box sx={{ flexGrow: 1,marginTop:5 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, backgroundColor: '#1b5e20', color: 'white' }}>
              <Typography component="h2" variant="h6" gutterBottom>
                Total Loans
              </Typography>
              <Typography component="p" variant="h4">
                {totalLoans}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, backgroundColor: '#4CAF50', color: 'white' }}>
              <Typography component="h2" variant="h6" gutterBottom>
                Approved Borrowers
              </Typography>
              <Typography component="p" variant="h4">
                {borrowers}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, backgroundColor: '#b71c1c', color: 'white' }}>
              <Typography component="h2" variant="h6" gutterBottom>
                Total Cash Disbursed
              </Typography>
              <Typography component="p" variant="h4">
                ${cashDisbursed.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, backgroundColor: '#2196F3', color: 'white' }}>
              <Typography component="h2" variant="h6" gutterBottom>
                Total Users
              </Typography>
              <Typography component="p" variant="h4">
                {totalUsers}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, backgroundColor: '#FFC107', color: 'white' }}>
              <Typography component="h2" variant="h6" gutterBottom>
                Total Admins
              </Typography>
              <Typography component="p" variant="h4">
                {totalAdmins}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, backgroundColor: '#673AB7', color: 'white' }}>
              <Typography component="h2" variant="h6" gutterBottom>
                Total Verifiers
              </Typography>
              <Typography component="p" variant="h4">
                {totalVerifiers}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ width: '100%', typography: 'body1', mt: 4 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} aria-label="admin tabs">
            <Tab label="Loan Applications" />
        
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Loan Applications
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Loan Tenure</TableCell>
                    <TableCell>Employment Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell>{app.fullName}</TableCell>
                      <TableCell>${app.loanAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={app.status}
                          sx={{
                            backgroundColor: statusColors[app.status],
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>{app.loanTenure} months</TableCell>
                      <TableCell>{app.employmentStatus}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleReviewClick(app._id)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

      
      </Container>

      {/* Loan Review Dialog */}
      <Dialog open={openLoanDialog} onClose={() => setOpenLoanDialog(false)}>
        <DialogTitle>Review Loan Application</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the status of the loan application.
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as LoanStatus)}
            >
              <MenuItem value="approved">Approve</MenuItem>
              <MenuItem value="rejected">Reject</MenuItem>
              <MenuItem value="under_review">Under Review</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoanDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmStatusChange} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

    
    
    </Box>
  );
};

export default AdminDashboard;