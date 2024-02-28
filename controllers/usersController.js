const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

//@desc Register a user
//@route GET /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const{username, email, password} = req.body;
    if(!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPass,
    });
    if(user){
        res.status(201).json({
            _id: user.id, email: user.email
        });
    } else{
        res.status(400);
        throw new Error("user data is not valid");   
    }
    res.json({ message: "Register the user"});
});

//@desc Login user
//@route GET /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error("All Fields are mandatory");
    }
    const user = await User.findOne({ email });
    //compare password
    if(user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            },
        }, process.env.ACCESS_TOKEN_SALT,
        {   
            expiresIn: "50m"
        });
        res.status(200).json({ accessToken });
    }else {
        res.status(400);
        throw new Error("Email or password not valid");
    }
});

//@desc get current user
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = {loginUser,registerUser, currentUser}
