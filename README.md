# TRIFIT-Bank-Account-System
## Backend Deployment link
[BACKEND LINK](https://trifit-bank-account-system.onrender.com)

## Overview  
The Banking Application is a secure, user-friendly platform for managing personal banking operations. It offers a comprehensive set of features such as user registration, deposits, withdrawals, internal transfers, account statements, and account locking to ensure secure and efficient financial management.  

## Features  
### 1. User Registration  
- Register with a unique username and a secure 4-digit PIN.  
- Optional initial deposit; defaults to 0 if not provided.  
- Generates a unique account number in the format BANK-xxxxxxx.  
- Secure PIN storage using bcryptjs hashing.  
- Maintains a transaction history for every user.  

### 2. User Login  
- Login using username and PIN.  
- Tracks failed login attempts and locks the account for 24 hours after 3 failed attempts.  
- Provides transaction history upon successful login.  
- JWT token-based authentication.  

### 3. Deposit  
- Deposit money into the account (if not locked).  
- Validates PIN before updating balance.  
- Records deposit transactions in the user's history.  

### 4. Withdraw  
- Withdraw funds from the account (if not locked).  
- Ensures sufficient balance before processing the transaction.  
- Updates balance and records the withdrawal transaction.  

### 5. Internal Transfer  
- Transfer money to another user's account.  
- Validates recipient account existence and PIN.  
- Updates balances for both sender and recipient, and records the transaction in their histories.  

### 6. Account Locking  
- Locks account for 24 hours after 3 failed login attempts.  
- Restricts all transactions during the lock period.  
- Automatically unlocks after 24 hours.  

### 7. Logout  
- Secure session termination by invalidating the JWT token.  

### 8. Account Statement  
- View detailed transaction history, including deposits, withdrawals, and transfers.  
- Includes transaction type, amount, timestamp, and updated balance.  

## Technologies Used  
- *Backend*: Node.js, Express.js  
- *Database*: MongoDB  
- *Frontend*:  HTML-CSS-JavaScript  
- *Authentication*: JSON Web Token (JWT)  
- *Security*: bcryptjs for PIN hashing  

## APIs Endpoints
| Method | Endpoint      | Description           | Authentication |
|--------|---------------|-----------------------|----------------|
| POST   | user/register   | Register a new user   | No             |
| POST   | user/login      | Login to the system   | No             |
| POST   | user/deposit    | Deposit money         | Yes            |
| POST   | user/withdraw   | Withdraw money        | Yes            |
| POST   | user/transfer   | Transfer money        | Yes            |
| GET    | user/statement  | View transaction history | Yes        |
| POST   | user/logout     | Logout from the system | Yes            |

## Author
Developed by[Kamlesh Das]
Contact[daskamlesh677@gmail.com]


