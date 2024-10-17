import { Container, Typography, Box, Card, CardContent, CardActions, Button } from '@mui/material';
import { AttachMoney, Dashboard } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useContext } from 'react';
import { AdminContext } from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#032505', // dark green
    },
    secondary: {
      main: '#f57c00', // Orange
    },
    background: {
      default: '#e8f5e9', // Light green
    },
  },
});

// Define a type for the user context
interface User {
  role: 'user' | 'admin' | 'verifier';
}

const Homepage: React.FC = () => {
  const { user } = useContext(AdminContext) as { user: User };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          width: '100%',
          padding: 2,
        }}
      >
        <Container
          component="main"
          maxWidth={false}
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.main }}
          >
            Welcome to CreditSea
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              width: '100%',
              justifyContent: 'center',
              mb: 6,
            }}
          >
            {user?.role === "user" && (
              <Card
                elevation={4}
                sx={{
                  width: { xs: '100%', md: '30%' },
                  maxWidth: '350px',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" align="center">
                    Apply for  Loan
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Get started with your loan application today. 
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    size="large"
                    startIcon={<AttachMoney />}
                    component={RouterLink}
                    to="/loan-application"
                    variant="contained"
                    sx={{
                      bgcolor: '#4caf50', // Light green
                      color: '#fff', // White text
                      '&:hover': {
                        bgcolor: '#2e7d32', // Dark green on hover
                      },
                    }}
                    fullWidth
                  >
                    Start Application
                  </Button>
                </CardActions>
              </Card>
            )}

            <Card
              elevation={4}
              sx={{
                width: { xs: '100%', md: '30%' },
                maxWidth: '350px',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" align="center">
                  Check Your Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  View your loan status and account information .
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  size="large"
                  startIcon={<Dashboard />}
                  component={RouterLink}
                  to={
                    user?.role === 'admin'
                      ? '/admin-dashboard'
                      : user?.role === 'verifier'
                      ? '/verifier-dashboard'
                      : '/userDashboard'
                  }
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{
                    '&:hover': {
                      bgcolor: '#ef6c00', // Darker orange on hover
                    },
                  }}
                >
                  Go to Dashboard
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Homepage;
