const { userModel } = require('../Models/user.model');
const { transactionModel } = require('../Models/transaction.model');
const bcrypt = require("bcrypt");
require("dotenv").config();

// Deposite 
const deposit = async (req, res) => {
  const { accountNumber, pin, amount } = req.body;

  try {
    const user = await userModel.findOne({ accountNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isLogedIn == false) return res.status(401).json({ message: "Please Login !" })

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ message: 'Account is locked.' });
    }

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) return res.status(401).json({ message: 'Invalid PIN' });
    if (amount < 0) return res.status(400).json({ message: 'Deposit amount cannot be negative.Please enter a valid amount' })

    user.balance += amount;
    await user.save();

    const transaction = new transactionModel({
      userId: user._id,
      type: 'deposit',
      amount,
      balanceAfter: user.balance,
      sender: user.username,
      recipient: user.username
    });
    await transaction.save();

    res.status(200).json({ message: 'Deposit successful', balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Error processing deposit', error });
  }
};

//Withdrawl

const withdraw = async (req, res) => {
  const { accountNumber, pin, amount } = req.body;

  try {
    const user = await userModel.findOne({ accountNumber });
    const Bank = await userModel.findOne({accountNumber:"BANK-5927666"});

    if(!Bank) return res.json({message:"Bank not found"});

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isLogedIn == false) return res.status(401).json({ message: "Please Login !" })

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ message: 'Account is locked.' });
    }

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) return res.status(401).json({ message: 'Invalid PIN' });
    if (amount < 0) return res.status(400).json({ message: 'Withdrawl amount cannot be negative.Please enter a valid amount' })
    // calculate applicable fee wich will be 3% of each requested amount
    let applicableFee=Math.floor(amount*0.03);//changes
    let totalAmount=amount+applicableFee;//changes
    if (user.balance < totalAmount) { //changes
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    user.balance -= totalAmount;
    await user.save();

    Bank.balance +=applicableFee;
    Bank.save();

    const transaction = new transactionModel({
      userId: user._id,
      type: 'withdrawal',
      amount,
      applicableFee,
      balanceAfter: user.balance,
    });
    await transaction.save();

    // Bank transaction tracking
    const BankTransaction = new transactionModel({
      userId: Bank._id,
      type: 'deposit',
      amount:applicableFee,
      balanceAfter: Bank.balance,
      sender:user.username
    });
    await BankTransaction.save();

    res.status(200).json({ message: 'Withdrawal successful', balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Error processing withdrawal', error });
  }
};

// transfer money
const transfer = async (req, res) => {
  const { senderAccountNumber, pin, recipientAccountNumber, amount } = req.body;


  try {
    const sender = await userModel.findOne({ accountNumber: senderAccountNumber });
    const recipient = await userModel.findOne({ accountNumber: recipientAccountNumber });
    const Bank = await userModel.findOne({accountNumber:"BANK-5927666"});

    if (!sender) return res.status(404).json({ message: 'Invalid Sender' });
    if (!recipient) return res.status(404).json({ message: 'Invalid Recipient' });
    if (sender.isLogedIn == false) return res.status(401).json({ message: "Please Login !" })

    if (sender.lockUntil && sender.lockUntil > Date.now()) {
      return res.status(403).json({ message: 'Sender account is locked.' });
    }
    if (recipient.lockUntil && recipient.lockUntil > Date.now()) {
      return res.status(403).json({ message: 'Recipient account is locked.' });
    }
    if (amount < 0) return res.status(400).json({ message: 'Transaction amount cannot be negative.Please enter a valid amount' })


    const isMatch = await bcrypt.compare(pin, sender.pin);
    if (!isMatch) return res.status(401).json({ message: 'Invalid PIN' });

     // calculate applicable fee wich will be 3% of each requested amount
     let applicableFee=Math.floor(amount*0.03);//changes
     let totalAmount=amount+applicableFee;//changes
    if (sender.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    sender.balance -= totalAmount;
    recipient.balance += amount;
    Bank.balance += applicableFee;

    await sender.save();
    await recipient.save();
    await Bank.save();

    const senderTransaction = new transactionModel({
      userId: sender._id,
      type: 'transfer',
      amount: -amount,
      applicableFee,
      balanceAfter: sender.balance,
      sender: sender.username,
      recipient: recipient.username,
    });
    await senderTransaction.save();

    const recipientTransaction = new transactionModel({
      userId: recipient._id,
      type: 'deposit',
      amount,
      balanceAfter: recipient.balance,
      sender: sender.username,
      recipient: recipient.username
    });
    await recipientTransaction.save();

    const BankTransaction = new transactionModel({
      userId: Bank._id,
      type: 'deposit',
      amount:applicableFee,
      balanceAfter: Bank.balance,
      sender: sender.username,
      recipient: Bank.username
    });
    await BankTransaction.save();

    res.status(200).json({ message: 'Transfer successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing transfer', error: error.message });
  }
};

// transaction details
const getAccountStatement = async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await transactionModel.find({ userId }).sort({ date: -1 });

    if (!transactions.length) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving statement', err: error.message });
    console.log(error);
  }
}

//user details
const userdetails=async(req,res)=>{
   res.status(200).json({user:req.user});
}

module.exports = { deposit, withdraw, transfer, getAccountStatement ,userdetails}
