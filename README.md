Loan Manager Application
This Loan Manager Application is developed for CreditSea's Full Stack Intern assignment. The main objective is to integrate a user application form with a dashboard that displays statistics, utilizing TypeScript and Node.js for backend development and MongoDB for user data management.

🚀 Live Demo
Explore the live application here: CreditSea Loan Manager

👤 User Roles and Access
The application supports multiple user roles for enhanced functionality and security:

User Roles

Login Credentials
Use the provided email addresses and passwords to log in according to your assigned role. The system will direct users to their respective dashboards.

📂 Project Structure
The project consists of two main components:

Frontend: Built with React and Vite, providing a user-friendly interface for loan application submissions.
Backend: Developed using Node.js with TypeScript, processing form data, storing it in MongoDB, and updating the dashboard with real-time statistics.
🛠️ Features
Form Submission: Users can complete and submit loan application forms.
Dashboard: Displays real-time statistics based on submitted applications.
Backend Logic: Manages multiple user inputs, connects to MongoDB, and updates dashboard data.
Responsive Design: Optimized for various device sizes, based on Figma designs.
🖥️ Tech Stack
Frontend: React, Vite
Backend: Node.js, TypeScript
Database: MongoDB
Design: Figma
📁 How to Run the Project Locally
Clone the Repository

bash
Copy code
git clone [GitHub Repository Link]
cd loan-manager-app
Install Dependencies

For Frontend:
bash
Copy code
cd frontend
npm install
npm run dev
For Backend:
bash
Copy code
cd backend
npm install
npm run dev
Environment Variables

Create a .env file in the backend folder with your MongoDB connection string and other necessary variables:
env
Copy code
MONGO_URI=your-mongodb-connection-string
PORT=5000
Run the Application

Start both the frontend and backend servers:
bash
Copy code

# Frontend

npm run dev

# Backend

npm start
📊 Dashboard Statistics
The dashboard provides real-time statistics about loan applications, including:

Total number of applications.
Breakdown of applications by loan amount and status (approved, rejected, pending).
Dynamic updates for each new form submission.
Feel free to modify any part further or let me know if you need additional changes!
