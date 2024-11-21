const {userModel} = require('../Models/user.model');
const {transactionModel} = require('../Models/transaction.model');
const{blacklistModel}=require("../Models/blacklist.model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();


//.............User registration.............

const register = async (req, res) => {
  const { username, pin, initialDeposit} = req.body;
  console.log(initialDeposit,username,pin)

  try {
    // Check for existing username
    const existingUser = await userModel.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    // Hash the PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    // Generate account number
    const accountNumber = `BANK-${Math.floor(1000000 + Math.random() * 9000000)}`;

    // Create new user
    const user = new userModel({
      username,
      pin: hashedPin,
      accountNumber,
      balance: initialDeposit,
    });

    await user.save();

    // Log initial deposit as a transaction
    if (initialDeposit > 0) {
      const balanceAfter=initialDeposit;
      const transaction = new transactionModel({
        userId: user._id,
        type: 'deposit',
        amount: initialDeposit,
        balanceAfter

      });
      await transaction.save();
    }

    res.status(201).json({ message: 'User registered successfully', accountNumber });
  } catch (error) {
    res.status(500).json({ message: 'Server error(error in registration!)',err:error.message });
  }
};

//...........User Login................

const login = async (req, res) => {
  const { username, pin } = req.body;

  try {
    const user = await userModel.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });


    // Check lock status
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ message: 'Account is locked. Try again later.' });
    }



    // Verify PIN
    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      user.failedAttempts += 1;
      if (user.failedAttempts >= 3) {
        user.lockUntil = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();
        return res.status(403).json({ message: 'Account locked due to too many failed attempts.' });
      }
      await user.save();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset failed attempts
    user.failedAttempts = 0;
    user.lockUntil = undefined;
    user.isLogedIn=true;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id,username:user.username }, process.env.JWT_S_KEY, { expiresIn: '1h' });
    // Generate refresh token
    const refresh_token=jwt.sign({id:user._id,username:user.username},process.env.JWT_S_KEY2,{expiresIn:'24h'})

    // Store token in cookies
    res.cookie("token",token);
    res.cookie("refresh_token",refresh_token);

    res.status(200).json({ token,refresh_token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

//.........User Logout...........
const logout=async(req,res)=>{
     const{id,username}=req.user;
    try {
         
        const token= req.headers.authorization?.split(" ")[1];;
        const blacklistedToken=new blacklistModel({token})
        await blacklistedToken.save();

        const user= await userModel.findOne({_id:id,username});
        user.isLogedIn=false;
        await user.save();

        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error..")
    }
}

module.exports={register,login,logout}

