import { Request, Response } from 'express';
import LoanModel from '../models/loan.js'; // Import the Loan model
import { z, ZodError } from 'zod';
import mongoose from 'mongoose'; // Import mongoose for error handling

// Type guard for identifying Zod validation errors
const isZodError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};

// Type guard for identifying Mongoose errors
const isMongooseError = (error: unknown): error is mongoose.Error => {
  return error instanceof mongoose.Error;
};

// Function to handle loan application submission
export const submitLoanApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const loanData = req.body; // Extract loan data from request body

    // Create a new loan application
    const createdLoan = await LoanModel.create(loanData);

    res.status(201).json({
      message: 'Loan application submitted successfully',
      applicationId: createdLoan._id, // Provide the ID of the newly created document
      status: createdLoan.status,
    });
  } catch (error) {
    if (isZodError(error)) {
      res.status(400).json({
        message: 'Loan application data is invalid',
        errors: error.errors,
      });
    } else if (isMongooseError(error)) {
      console.error('Mongoose error while submitting loan application:', error);
      res.status(500).json({
        message: 'Error occurred while processing the loan application',
        details: error.message, // Optionally include error details
      });
    } else {
      console.error('Unexpected error during loan application submission:', error);
      res.status(500).json({
        message: 'An unexpected error occurred while processing your application',
      });
    }
  }
};

// Function to fetch loans by user ID
export const getLoansByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId; // Get user ID from request parameters
    console.log(userId);

    const userLoans = await LoanModel.find({ userId }); // Retrieve loans for the user
    console.log(userLoans);

    if (userLoans.length === 0) {
      res.status(404).json({
        message: 'No loan applications found for the specified user.',
      });
      return;
    }

    res.status(200).json({
      message: 'Successfully retrieved loan applications.',
      loans: userLoans,
    });
  } catch (error) {
    if (isMongooseError(error)) {
      console.error('Mongoose error while fetching loans:', error);
      res.status(500).json({
        message: 'Error occurred while fetching loan applications',
        details: error.message, // Optionally include error details
      });
    } else {
      console.error('Unexpected error while fetching loans:', error);
      res.status(500).json({
        message: 'An unexpected error occurred while fetching loan applications.',
      });
    }
  }
};

// Function to fetch all loan applications
export const getAllLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const allLoans = await LoanModel.find(); // Retrieve all loans
    console.log(allLoans);

    if (allLoans.length === 0) {
      res.status(404).json({
        message: 'No loan applications available.',
      });
      return;
    }

    res.status(200).json({
      message: 'Successfully retrieved all loan applications.',
      loans: allLoans,
    });
  } catch (error) {
    if (isMongooseError(error)) {
      console.error('Mongoose error while fetching all loans:', error);
      res.status(500).json({
        message: 'Error occurred while fetching all loan applications.',
        details: error.message, // Optionally include error details
      });
    } else {
      console.error('Unexpected error while fetching all loans:', error);
      res.status(500).json({
        message: 'An unexpected error occurred while fetching all loan applications.',
      });
    }
  }
};

// Function to review a loan application
export const reviewLoan = async (req: Request, res: Response): Promise<void> => {
  const { loanId, status } = req.body; // Extract loanId and status from request body

  try {
    // Update the loan application status by ID
    const updatedLoan = await LoanModel.findByIdAndUpdate(
      loanId,
      { status },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedLoan) {
      res.status(404).json({ message: 'Loan application not found.' });
      return; // Exit the function after sending the response
    }

    res.status(200).json({
      message: 'Loan application reviewed successfully.',
      loan: updatedLoan, // Return the updated loan information
    });
  } catch (error) {
    if (isMongooseError(error)) {
      console.error('Mongoose error while reviewing loan:', error);
      res.status(500).json({
        message: 'Error occurred while reviewing the loan.',
        details: error.message, // Optionally include error details
      });
    } else {
      console.error('Unexpected error while reviewing loan:', error);
      res.status(500).json({
        message: 'An unexpected error occurred while reviewing the loan.',
      });
    }
  }
};
