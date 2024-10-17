// src/types.ts
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

export type Loan = {
  _id: string;
  fullName: string;
  loanAmount: number;
  status: LoanStatus;
  loanTenure: number;
  employmentStatus: string;
};
export type User = {
  _id: string;
  email: string;
role:string
  
};