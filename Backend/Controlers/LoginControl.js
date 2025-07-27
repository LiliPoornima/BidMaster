const User = require("../Model/UserModel");

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        // Extract role from username (e.g., "seller_john" → "seller")
        const role = username.split("_")[0];

        res.status(200).json({ 
            success: true, 
            user: { _id: user._id, name: user.name, username: user.username,email: user.email, role,
                
             } 
        });
        
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { loginUser };
