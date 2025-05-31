const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function generateReferralCode() {
  return crypto.randomBytes(3).toString('hex');
}

exports.register = async (req, res) => {
  try {
    const { email, password, referralCode } = req.body;

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (!referrer) return res.status(400).json({ message: 'Invalid referral code' });
      referredBy = referralCode;
    }

    const newUser = new User({
      email,
      password,
      referralCode: generateReferralCode(),
      referredBy,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered', userId: newUser._id, referralCode: newUser.referralCode });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already registered' });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, userId: user._id, referralCode: user.referralCode, successfulReferrals: user.successfulReferrals });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
