const express = require('express');
const { register,login, logout } = require('../Controllers/user.controller');
const{deposit,withdraw,transfer,getAccountStatement, userdetails}=require("../Controllers/bank.controller");
const { authenticate } = require('../Middlewares/authentication');
const router = express.Router();

// Registration
router.post('/register', register);

// Login
router.post('/login',login);

// Deposit
router.post('/deposit', authenticate, deposit);

// Withdraw
router.post('/withdraw', authenticate, withdraw);

// Transfer
router.post('/transfer', authenticate, transfer);

// Logout
router.post('/logout', authenticate, logout);

// Account Statement
router.get('/statement', authenticate, getAccountStatement);

//User Details
router.get("/user-details",authenticate,userdetails)

router.get("/p", authenticate, (req, res) => {
    res.json({ message: "You are authenticated", user: req.user });
});

module.exports = {router};