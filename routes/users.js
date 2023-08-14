const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");
const verify = require("./verifyToken");

// UPDATE USER

router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    const userPassword = req.body.password;
    if (userPassword) {
      encryptPassword = CryptoJS.AES.encrypt(
        userPassword,
        process.env.SEC_KEY
      ).toString("");
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("Invalid! You are not allow to update!");
  }
});

// DELETE USER

router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted!");
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(403).json("Invalid! You are not allow to delete!");
  }
});

// GET USER

router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL USER
router.get("/", verify, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    const user = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(user);
  } else {
    res.status(403).json("Invalid! You are not allow to access all users.");
  }
});

// GET USER STATS

// In MongoDB, aggregation operations process the data records/documents and return computed results. It collects values from various documents and groups them together and then performs different types of operations on that grouped data like sum, average, minimum, maximum, etc to return a computed result.

router.get("/stats", async (req, res) => {
  const today = new Date();
  const latYear = today.setFullYear(today.setFullYear() - 1);

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
