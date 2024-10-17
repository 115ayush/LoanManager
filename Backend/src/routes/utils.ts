// src/routes/loanRoutes.ts
import { Router } from 'express';
import { submitLoanApplication, getLoansByUserId, getAllLoans, reviewLoan } from '../controllers/loanApplications.js';

const loanRouter = Router();

// Endpoint for submitting a loan application
loanRouter.post('/loan-application', submitLoanApplication);

// Endpoint for fetching loan applications by user ID (admin functionality)
loanRouter.get('/loans/user/:userId', getLoansByUserId);

// Endpoint for fetching all loan applications
loanRouter.get('/loans', getAllLoans);

// Endpoint for reviewing a loan application
loanRouter.patch('/loans/review', reviewLoan);

export default loanRouter;
