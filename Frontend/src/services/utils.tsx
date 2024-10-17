import axios from "axios";

// Define the type for loan application data
interface LoanData {
  loanAmount: number;
  fullName: string;
  loanTenure: number;
  employmentStatus: string;
  reasonForLoan: string;
  employmentAddress: string;
}

// Define the type for loans response
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

// Type for the loan application response, modify based on your API response
interface LoanApplicationResponse {
  message: string;
  loanId: string;
}
interface ReviewLoanResponse {
  message: string;
  loan: Loan; 
}
const baseURL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_PROD
    : import.meta.env.VITE_BACKEND_DEV;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to submit a loan application
export const submitLoanApplication = async (loanData: LoanData): Promise<LoanApplicationResponse> => {
  try {
    const response = await axiosInstance.post('/loan-application', loanData);
    return response.data as LoanApplicationResponse; // Specify the return type
  } catch (error) {
    console.error('Error submitting loan application:', error);
    throw error;
  }
};

// Function to get all loans
export const getAllLoans = async (userId: string): Promise<GetAllLoansResponse> => {
  try {
    const response = await axiosInstance.get(`/getAllLoans/${userId}`);
    return response.data as GetAllLoansResponse; // Ensure the response type matches
  } catch (error) {
    console.error('Error fetching loans:', error);
    throw error;
  }
};
export const getAllApplications = async (): Promise<GetAllLoansResponse> => {
  try {
    const response = await axiosInstance.get(`/getAllLoans`);
    return response.data as GetAllLoansResponse; // Ensure the response type matches
  } catch (error) {
    console.error('Error fetching loans:', error);
    throw error;
  }
};
export const reviewLoan = async (loanId: string, status: string): Promise<ReviewLoanResponse> => {
  try {
    console.log(loanId,"loanid")
    const response = await axiosInstance.patch('/review-loan', { loanId, status });
    return response.data as ReviewLoanResponse; // Return the response data with the correct type
  } catch (error) {
    console.error('Error reviewing loan:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export const getAllUsers = async (): Promise<any> => {
  try {console.log("getallusers")
    const response = await axiosInstance.get(`/getAllUsers`);
    return response.data ; // Ensure the response type matches
  } catch (error) {
    console.error('Error fetching user information:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

// Function to delete a user
export const deleteUser = async (userId: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/delete/${userId}`);
    return response.data; // Assuming the response contains a message
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error; // Rethrow the error for handling in the component
  }
};



export const updateUserRole = async (userId: string, newRole: string) => {
  try {
    const response = await axiosInstance.patch(`editUser/${userId}`, { role: newRole });

    // Handle success
    console.log('User updated successfully:', response.data);
    return response.data; // Return the updated user data
  } catch (error) {
    // Handle errors
    console.error('Error updating user role:');
    throw error; // Re-throw the error for further handling if needed
  }
};