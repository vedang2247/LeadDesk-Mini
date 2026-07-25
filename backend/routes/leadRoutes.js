const express = require('express');
const Lead = require('../models/lead');
const checkforAuthentication = require('../middleware/authMiddleware'); 

const router = express.Router();

// 1. Create a Lead (Public Route)
router.post('/', async (req, res) => {
    try {
        const { name, email, budgetRange, message } = req.body;

        if (!name || !email || !budgetRange || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newLead = await Lead.create({
            name,
            email,
            budgetRange,
            message
        });

        return res.status(201).json({ msg: "Lead created successfully", lead: newLead });
    } catch (err) {
        console.error("Error creating lead:", err);
        return res.status(500).json({ error: "Database Error!" });
    }
});

router.get('/', checkforAuthentication, async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const leads = await Lead.find(query).sort({ createdAt: -1 });
        
        return res.status(200).json(leads);
    } catch (err) {
        console.error("Error fetching leads:", err);
        return res.status(500).json({ error: "Database Error!" });
    }
});

router.patch('/:id/status', checkforAuthentication, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['New', 'Contacted', 'Closed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const updatedLead = await Lead.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedLead) {
            return res.status(404).json({ error: "Lead not found" });
        }

        return res.status(200).json({ msg: "Status updated successfully", lead: updatedLead });
    } catch (err) {
        console.error("Error updating lead status:", err);
        return res.status(500).json({ error: "Database Error!" });
    }
});

module.exports = router;