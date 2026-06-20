<img width="1696" height="706" alt="Login Arch" src="https://github.com/user-attachments/assets/6ca7bcf6-4b65-4444-804b-ad3ffd408cc3" />




# 📊 Expense Tracker API

A robust, secure, and fully functional RESTful API built to track personal expenses. This backend service handles user authentication, secure data storage, and provides endpoints for full CRUD operations and financial analytics.

##  Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (Raw SQL queries via `pg` driver)
* **Authentication:** JSON Web Tokens (JWT) & `bcrypt` for password hashing

##  Features
* **Secure Authentication:** User registration and stateful login with JWT-based route protection.
* **Data Isolation:** Middleware ensures users can only access, edit, or delete their own transaction records.
* **Full CRUD Functionality:** Create, Read, Update, and Delete endpoints for financial transactions.
* **Data Analytics:** Custom SQL aggregation (SUM, MAX, COUNT) to instantly calculate total spending and highest expenses natively on the database layer.

##  Local Setup & Installation

### Prerequisites
* Node.js installed
* PostgreSQL installed and running locally

### 1. Clone the repository
```bash
git clone [https://github.com/TechEraSzn/Expense-Tracker-API.git](https://github.com/TechEraSzn/Expense-Tracker-API.git)
cd Expense-Tracker-API




 API Endpoints
Authentication
POST /api/auth/register - Register a new user

POST /api/auth/login - Log in and receive a JWT

Transactions (Requires Bearer Token)
POST /api/transactions/ - Add a new expense

GET /api/transactions/ - Get all expenses for the logged-in user

GET /api/transactions/analytics - Get total spent, transaction count, and highest expense

PUT /api/transactions/:id - Update a specific expense

DELETE /api/transactions/:id - Delete a specific expense