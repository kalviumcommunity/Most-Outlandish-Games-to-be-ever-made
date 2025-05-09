const express = require("express");
const User = require("./userSchema");
const userRouter = express.Router();

userRouter.post("/register", async (request, response) => {
    const { name, email, password } = request.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).send({ message: "User already exists" });
        }
        const newUser = new User({ name, email, password });
        await newUser.save();
        response.status(201).send({ message: "User registered successfully" });
    } catch (error) {
        console.log(error)
        response.status(500).send({ message: "Internal server error" });
    }
});

userRouter.post("/login", async (request, response) => {
    const { email, password } = request.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return response.status(400).send({ message: "Invalid credentials" });
        }
        // Send user data back (excluding password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email
        };
        response.status(200).send({ message: "Login successful", user: userData });
    } catch (error) {
        console.log(error)
        response.status(500).send({ message: "Internal server error" });
    }
});

userRouter.get("/allUsers", async (request, response) => {
    try {
        const allUsers = await User.find();
        response.status(200).send({ message: "Users retrieved successfully", users: allUsers });
    } catch (error) {
        console.log(error)
        response.status(500).send({ message: "Internal server error" });
    }
});

// Add this new route to get all users
userRouter.get('/all', async (req, res) => {
    try {
        // Only fetch necessary fields, exclude sensitive data like password
        const users = await User.find({}, { name: 1, email: 1 });
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = userRouter;