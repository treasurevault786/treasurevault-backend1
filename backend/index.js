js
const express = require('express');
const mongoose = require('mongoose');
constcors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('YOUR_MONGODB_ATLAS_URI');

constUserSchema = new mongoose.Schema({
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

app.listen(5000, () =>console.log('API running'));
```
