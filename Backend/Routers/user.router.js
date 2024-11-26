const express = require('express');
const { register,login, logout } = require('../Controllers/user.controller');
const{deposit,withdraw,transfer,getAccountStatement, userdetails}=require("../Controllers/bank.controller");
const { authenticate } = require('../Middlewares/authentication');
const router = express.Router();

/** POST Methods */
/**
 * @openapi
 * '/user/register':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Register a new user account.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - pin
 *              - initialDeposit
 *            properties:
 *              username:
 *                type: string
 *                description: The unique username for the user.
 *                example: johndoe
 *              pin:
 *                type: string
 *                description: A 4-digit secure PIN for the user's account.
 *                example: "7688"
 *              initialDeposit:
 *                type: number
 *                description: Initial deposit amount for the account. Cannot be negative.
 *                example: 100
 *     responses:
 *      201:
 *        description: User successfully registered.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: User registered successfully
 *                accountNumber:
 *                  type: string
 *                  description: Generated account number for the user.
 *                  example: BANK-1234567
 *      400:
 *        description: Bad Request - Validation failed.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Deposit amount cannot be negative. Please enter a valid amount
 *     
 *      500:
 *        description: Server Error - Something went wrong during registration.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Server error(error in registration!)
 *                err:
 *                  type: string
 *                  example: Error message details
 */


// Registration
router.post('/register', register);

/** POST Methods */
/**
 * @openapi
 * '/user/login':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Authenticate(Login) a user and provide an access token.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - pin
 *            properties:
 *              username:
 *                type: string
 *                description: The username of the user.
 *                example: johndoe
 *              pin:
 *                type: string
 *                description: A 4-digit PIN for the user's account.
 *                example: "7688"
 *     responses:
 *      200:
 *        description: Login successful.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  type: object
 *                  description: Details of the logged-in user.
 *                  properties:
 *                    username:
 *                      type: string
 *                      example: johndoe
 *                    accountNumber:
 *                      type: string
 *                      example: BANK-1234567
 *                token:
 *                  type: string
 *                  description: JWT access token.
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                message:
 *                  type: string
 *                  example: Login successful
 *      400:
 *        description: Bad Request - Invalid PIN format.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Pin should be of 4 digits
 *      401:
 *        description: Unauthorized - Invalid credentials.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Invalid credentials
 *      403:
 *        description: Forbidden - Account locked due to too many failed attempts.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Account locked due to too many failed attempts.
 *      404:
 *        description: Not Found - User does not exist.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: User not found
 *      500:
 *        description: Server Error - Internal error occurred.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Server error
 */

// Login
router.post('/login',login);
/**
 * @openapi
 * /user/deposit:
 *   post:
 *     tags:
 *       - Bank Controller 
 *     summary: Deposit money into the user's account.
 *     description: Allows a user to deposit money into their account after verifying their PIN and account details.
 *     security:
 *       - bearerAuth: [] # Requires JWT authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - pin
 *               - amount
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: The account number of the user.
 *                 example: BANK-8741149
 *               pin:
 *                 type: string
 *                 description: The 4-digit PIN of the user.
 *                 example: "7688"
 *               amount:
 *                 type: number
 *                 description: The amount to deposit (must be a positive value).
 *                 example: 1000
 *     responses:
 *       200:
 *         description: Deposit successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deposit successful
 *                 balance:
 *                   type: number
 *                   example: 5000
 *       400:
 *         description: Bad Request - Invalid input, such as negative deposit amount.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deposit amount cannot be negative. Please enter a valid amount.
 *       401:
 *         description: Unauthorized - User is not logged in or invalid PIN.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid PIN
 *       403:
 *         description: Forbidden - Account is locked.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account is locked.
 *       404:
 *         description: Not Found - Account number does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error processing deposit
 *                 error:
 *                   type: string
 */

// Deposit
router.post('/deposit', authenticate, deposit);

/**
 * @openapi
 * /user/withdraw:
 *   post:
 *     tags:
 *       - Bank Controller
 *     summary: Withdraw money from the user's account.
 *     description: Allows a user to withdraw money from their account after verifying their PIN and account details. A 3% fee is applied to each withdrawal request.
 *     security:
 *       - bearerAuth: [] # Requires JWT authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - pin
 *               - amount
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: The account number of the user.
 *                 example: BANK-8741149
 *               pin:
 *                 type: string
 *                 description: The 4-digit PIN of the user.
 *                 example: "7688"
 *               amount:
 *                 type: number
 *                 description: The amount to withdraw (must be a positive value).
 *                 example: 200
 *     responses:
 *       200:
 *         description: Withdrawal successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Withdrawal successful
 *                 balance:
 *                   type: number
 *                   example: 4500
 *       400:
 *         description: Bad Request - Invalid input, insufficient balance, or negative withdrawal amount.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Withdrawl amount cannot be negative. Please enter a valid amount
 *       401:
 *         description: Unauthorized - User is not logged in or invalid PIN.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid PIN
 *       403:
 *         description: Forbidden - Account is locked.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account is locked.
 *       404:
 *         description: Not Found - Account number does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error processing withdrawal
 *                 error:
 *                   type: string
 */

// Withdraw
router.post('/withdraw', authenticate, withdraw);

/**
 * @openapi
 * /user/transfer:
 *   post:
 *     tags:
 *       - Bank Controller
 *     summary: Transfer money between accounts.
 *     description: Allows a user to transfer money from their account to another account. A 3% fee is applied to the transfer amount.
 *     security:
 *       - bearerAuth: [] # Requires JWT authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderAccountNumber
 *               - pin
 *               - recipientAccountNumber
 *               - amount
 *             properties:
 *               senderAccountNumber:
 *                 type: string
 *                 description: The sender's account number.
 *                 example: BANK-8741149
 *               pin:
 *                 type: string
 *                 description: The 4-digit PIN of the sender.
 *                 example: "7688"
 *               recipientAccountNumber:
 *                 type: string
 *                 description: The recipient's account number.
 *                 example: BANK-3253945
 *               amount:
 *                 type: number
 *                 description: The amount to transfer (must be a positive value).
 *                 example: 100
 *     responses:
 *       200:
 *         description: Transfer successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transfer successful
 *       400:
 *         description: Bad Request - Invalid input, insufficient balance, or negative transfer amount.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction amount cannot be negative. Please enter a valid amount
 *       401:
 *         description: Unauthorized - User is not logged in or invalid PIN.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid PIN
 *       403:
 *         description: Forbidden - Account is locked.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sender account is locked.
 *       404:
 *         description: Not Found - Sender or recipient account number is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid Sender
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error processing transfer
 *                 error:
 *                   type: string
 */

// Transfer
router.post('/transfer', authenticate, transfer);

/** POST Methods */
/**
 * @openapi
 * '/user/logout':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Logout a user by blacklisting the current token and updating their status.
 *     security:
 *      - bearerAuth: [] # JWT authentication
 *     responses:
 *      200:
 *        description: Logout successful.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Logged out successfully
 *      401:
 *        description: Unauthorized - Missing or invalid token.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Authorization token missing or invalid
 *      500:
 *        description: Server Error - Internal error occurred.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Server error..
 */

// Logout
router.post('/logout', authenticate, logout);

/**
 * @openapi
 * /user/statement:
 *   get:
 *     tags:
 *       - Bank Controller
 *     summary: Retrieve account statement.
 *     description: Fetches the transaction history of the authenticated user, sorted in descending order by date.
 *     security:
 *       - bearerAuth: [] # Requires JWT authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved account statement.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique transaction ID.
 *                         example: 63f912a73f9170a3d8201e3b
 *                       userId:
 *                         type: string
 *                         description: ID of the user associated with the transaction.
 *                         example: 63f90f3f5a9381d7641b123c
 *                       type:
 *                         type: string
 *                         description: Type of the transaction (e.g., deposit, withdrawal, transfer).
 *                         example: withdrawal
 *                       amount:
 *                         type: number
 *                         description: Amount involved in the transaction.
 *                         example: 100
 *                       applicableFee:
 *                         type: number
 *                         description: Transaction fee applied (if any).
 *                         example: 3
 *                       balanceAfter:
 *                         type: number
 *                         description: Account balance after the transaction.
 *                         example: 500
 *                       sender:
 *                         type: string
 *                         description: Sender's username (for transfers).
 *                         example: johndoe
 *                       recipient:
 *                         type: string
 *                         description: Recipient's username (for transfers).
 *                         example: janedoe
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time of the transaction.
 *                         example: 2024-11-26T14:23:05.000Z
 *       404:
 *         description: No transactions found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No transactions found
 *       401:
 *         description: Unauthorized - User is not logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is not logged in.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving statement
 *                 err:
 *                   type: string
 */

// Account Statement
router.get('/statement', authenticate, getAccountStatement);

/**
 * @openapi
 * /user/user-details:
 *   get:
 *     tags:
 *       - Bank Controller
 *     summary: Retrieve authenticated user details.
 *     description: Fetches details of the currently authenticated user.
 *     security:
 *       - bearerAuth: [] # Requires JWT authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique user ID.
 *                       example: 63f90f3f5a9381d7641b123c
 *                     username:
 *                       type: string
 *                       description: Username of the authenticated user.
 *                       example: johndoe
 *                     accountNumber:
 *                       type: string
 *                       description: User's account number.
 *                       example: BANK-1234567
 *                     balance:
 *                       type: number
 *                       description: User's account balance.
 *                       example: 5000
 *                     isLogedIn:
 *                       type: boolean
 *                       description: Login status of the user.
 *                       example: true
 *                     lockUntil:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       description: Time until the account is locked, if applicable.
 *                       example: null
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is not logged in.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

//User Details
router.get("/user-details",authenticate,userdetails)

router.get("/p", authenticate, (req, res) => {
    res.json({ message: "You are authenticated", user: req.user });
});

module.exports = {router};