const { userModel } = require('../Models/user.model');
const { transactionModel } = require('../Models/transaction.model');
const bcrypt = require("bcrypt");

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
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isLogedIn == false) return res.status(401).json({ message: "Please Login !" })

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ message: 'Account is locked.' });
    }

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) return res.status(401).json({ message: 'Invalid PIN' });
    if (amount < 0) return res.status(400).json({ message: 'Withdrawl amount cannot be negative.Please enter a valid amount' })

    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= amount;
    await user.save();

    const transaction = new transactionModel({
      userId: user._id,
      type: 'withdrawal',
      amount,
      balanceAfter: user.balance,
    });
    await transaction.save();

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

    if (!sender || !recipient) return res.status(404).json({ message: 'Invalid users' });
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

    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();

    const senderTransaction = new transactionModel({
      userId: sender._id,
      type: 'transfer',
      amount: -amount,
      balanceAfter: sender.balance,
      sender: sender.username,
      recipient: recipient.username,
    });
    await senderTransaction.save();

    const recipientTransaction = new transactionModel({
      userId: recipient._id,
      type: 'transfer',
      amount,
      balanceAfter: recipient.balance,
      sender: sender.username,
      recipient: recipient.username
    });
    await recipientTransaction.save();

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
