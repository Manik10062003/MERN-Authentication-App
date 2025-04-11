import mongoose from "mongoose"; // Keep ES6 import syntax

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ✅ Fixed typo & corrected `required`
  email: { type: String, required: true, unique: true }, // ✅ Added `unique: true`
  password: { type: String, required: true }, // ✅ Fixed `required`
  verifyotp: { type: String, default: "" },
  verifyotpexpireat: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
