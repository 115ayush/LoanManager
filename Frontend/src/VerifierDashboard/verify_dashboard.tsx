// src/VerifierDashboard/verify_dashboard.tsx
import { useState, useEffect, MouseEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import { getAllApplications, reviewLoan } from '../services/utils';
import { AttachMoney, People, LocalAtm } from '@mui/icons-material';

import { Loan, LoanStatus } from "../types"; // Import types

type DashboardCardProps = {
  icon: JSX.Element;
  title: string;
  value: number | string;
  color: string;
};

const DashboardCard = ({ icon, title, value, color }: DashboardCardProps) => (
  <Card sx={{ height: '100%', backgroundColor: color }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
      {icon}
      <Box sx={{ ml: 2 }}>
        <Typography variant="h6" component="div" color="white">
          {title}
        </Typography>
        <Typography variant="h4" component="div" color="white">
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const statusColors: { [key in LoanStatus]: string } = {
  pending: '#FFA000',
  approved: '#4CAF50',
  rejected: '#F44336',
  under_review: '#2196F3'
};

const VerifierDashboard = () => {
  const [applications, setApplications] = useState<Loan[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<LoanStatus | ''>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getAllApplications();
        const loans = response?.loans.map((loan) => ({
          ...loan,
          status: ['pending', 'approved', 'rejected', 'under_review'].includes(loan.status)
            ? (loan.status as LoanStatus)
            : 'pending' // Fallback to 'pending' if status is unknown
        }));
        setApplications(loans);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  const handleReviewClick = (event: MouseEvent<HTMLButtonElement>, loanId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedLoanId(loanId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusSelect = (status: LoanStatus) => {
    setSelectedStatus(status);
    setAnchorEl(null);
    setOpenDialog(true);
  };

  const handleConfirmStatusChange = async () => {
    if (selectedStatus) { // Ensure status is not an empty string
      try {
        await reviewLoan(selectedLoanId, selectedStatus);
        setOpenDialog(false);
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app._id === selectedLoanId ? { ...app, status: selectedStatus as LoanStatus } : app
          )
        );
      } catch (error) {
        console.error('Error reviewing loan:', error);
      }
    } else {
      console.error('Invalid status selected');
    }
  };

  // Calculate totals based on approved loans
  const totalLoans = applications.length; // Total applications
  const approvedLoans = applications.filter(app => app.status === 'approved');
  const borrowers = approvedLoans.length; // Total approved borrowers
  const cashDisbursed = approvedLoans.reduce((acc, app) => acc + app.loanAmount, 0); // Total approved cash amount


 
  return (
    <Box sx={{ margin:5 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Verifier Dashboard</Typography>
         
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <DashboardCard icon={<AttachMoney sx={{ fontSize: 40, color: 'white' }} />} title="LOANS" value={totalLoans} color="#1b5e20" />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard icon={<People sx={{ fontSize: 40, color: 'white' }} />} title="BORROWERS" value={borrowers} color="#0d47a1" />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard icon={<LocalAtm sx={{ fontSize: 40, color: 'white' }} />} title="CASH DISBURSED" value={`$${cashDisbursed.toLocaleString()}`} color="#b71c1c" />
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
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
                        <TableCell>${app.loanAmount}</TableCell>
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
                            size="small"
                            onClick={(event) => handleReviewClick(event, app._id)}
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
          </Grid>
        </Grid>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusSelect('pending')}>Pending</MenuItem>
        <MenuItem onClick={() => handleStatusSelect('approved')}>Approved</MenuItem>
        <MenuItem onClick={() => handleStatusSelect('rejected')}>Rejected</MenuItem>
        <MenuItem onClick={() => handleStatusSelect('under_review')}>Under Review</MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status of this loan to "{selectedStatus}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmStatusChange} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default
 VerifierDashboard;
