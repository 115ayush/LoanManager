import mongoose, { Document, Schema } from 'mongoose';

// Define the structure for a Loan document
interface ILoan extends Document {
  fullName: string;
  loanAmount: number;
  loanTenure: number;
  employmentStatus: string;
  reasonForLoan: string;
  employmentAddress: string;
  hasReadInformation: boolean;
  agreeToDisclosure: boolean;
  userId: mongoose.Schema.Types.ObjectId; // Reference to the User model
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
}

// Create the Loan schema
const loanSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  loanTenure: { type: Number, required: true },
  employmentStatus: { type: String, required: true },
  reasonForLoan: { type: String, required: true },
  employmentAddress: { type: String, required: true },
  hasReadInformation: { type: Boolean, required: true },
  agreeToDisclosure: { type: Boolean, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Create and export the Loan model
const Loan = mongoose.model<ILoan>('Loan', loanSchema);
export default Loan;
