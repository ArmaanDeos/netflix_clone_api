const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");



// REGISTER 
router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SEC_KEY).toString("")
    });

    try {
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(error)
    }
});


// LOGIN

router.post('/login', async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email });
        const userPassword = req.body.password;
        !user && res.status(401).json("Wrong username or password!")

        const dcrptPass = CryptoJS.AES.decrypt(user.password, process.env.SEC_KEY);
        const originalPassword = dcrptPass.toString(CryptoJS.enc.Utf8);

        originalPassword !== userPassword && res.status(401).json("Wrong username or password!");

        // Jwt Auth 
        const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SEC_KEY, { expiresIn: '5d' })

        const { password, ...others } = user._doc

        res.status(200).json({ ...others, accessToken });

    } catch (error) {
        res.status(500).json(error)

    }
})


module.exports = router