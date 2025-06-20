const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace this with your actual MongoDB connection string or use an environment variable
mongoose.connect(process.env.MONGO_URI || 'YOUR_MONGODB_ATLAS_URI', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  wallet: String,
  referrer: String,
  referrals: Number,
  earnings: Number,
  tier: String
});

const User = mongoose.model('User', UserSchema);

app.post('/register', async (req, res) => {
  const { wallet, referrer } = req.body;
  let user = await User.findOne({ wallet });

  if (!user) {
    await User.create({ wallet, referrer, referrals: 0, earnings: 0, tier: 'L1' });

    if (referrer) {
      await User.updateOne({ wallet: referrer }, { $inc: { referrals: 1 } });
    }
  }

  res.send({ status: 'ok' });
});

app.get('/user/:wallet', async (req, res) => {
  const user = await User.findOne({ wallet: req.params.wallet });
  res.send(user || {});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
