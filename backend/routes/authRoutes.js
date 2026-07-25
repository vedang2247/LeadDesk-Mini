const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const admin = require('../models/admin');

const router = express.Router();

async function hashPassword(plainPassword) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
}

router.post('/register', async (req, res) => {
    try {
        const body = req.body;
        if (!body.username || !body.password) return res.status(400).json({ error: "Error occured" });
        const found = await admin.findOne({ username: body.username });
        if (found) return res.status(409).json({ error: "User Exists" });
        const hashedPassword = await hashPassword(body.password);
        const newAdmin = await admin.create({
            username: body.username,
            password: hashedPassword,
        })
        return res.status(201).json({ msg: "Admin Created Successfully" });
    }
    catch (err) {
        console.error("DB Error!", err);
        return res.status(500).json({ msg: "Database Error!" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const body = req.body;
        
        if (!body.username || !body.password) return res.status(400).json({ error: "Missing credentials" });
        
        const existingAdmin = await admin.findOne({ username: body.username });
        if (!existingAdmin) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(body.password, existingAdmin.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid password" });
        
        const token = jwt.sign(
            { id: existingAdmin._id, username: existingAdmin.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JS from reading the cookie
            maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        });
        
        return res.status(200).json({ msg: "Login successful" });
    } 
    catch (err) {
        console.error("DB Error!", err);
        return res.status(500).json({ msg: "Database Error!" });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ msg: "Logged out successfully" });
});

module.exports = router;