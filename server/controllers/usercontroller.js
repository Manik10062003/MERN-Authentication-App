import userModel from "../models/usermodels.js";

export const getUserData = async (req, res) => {
    try {
        
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID not provided" 
            });
        }

        const user = await userModel.findById(userId).select('-password -__v');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            userData: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        });
        
    } catch (error) {
        console.error("Error in getUserData:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error",
            error: error.message 
        });
    }
}