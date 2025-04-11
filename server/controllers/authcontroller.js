import dotenv from "dotenv";
dotenv.config();

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/usermodels.js";
import transporter from "../config/nodemailer.js";

export const registered = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Details required" });
  }

  try {
    const existinguser = await userModel.findOne({ email });
    if (existinguser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedpass = await bcryptjs.hash(password, 12);
    const user = new userModel({ name, email, password: hashedpass });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // ❌ NOT true in local dev
      sameSite: "strict", // ✅ Best for localhost
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome To Mern-Auth",
      text: `Hello ${name}, your account has been created successfully.`,
    });

    return res.json({ success: true, message: "Register success" });
  } catch (error) {
    console.error("Error in registration:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Details required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

   res.cookie("token", token, {
     httpOnly: true,
     secure: false, // ❌ NOT true in local dev
     sameSite: "strict", // ✅ Best for localhost
     maxAge: 7 * 24 * 60 * 60 * 1000,
   });


    return res.json({ success: true, message: "Login success" });
  } catch (error) {
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logout success" });
  } catch (error) {
    return res.json({ success: false, message: "Something went wrong" });
  }
};

export const verifyotp = async (req, res) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.json({ success: false, message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);
    user.verifyotp = OTP;
    user.verifyotpexpireat = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP for account verification is ${OTP}`,
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in verifyotp:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;
  if (!userId || !OTP) {
    return res.json({ success: false, message: "Details required" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.verifyotp || user.verifyotp.toString() !== OTP.toString()) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyotpexpireat < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyotp = "";
    user.verifyotpexpireat = 0;
    await user.save();

    return res.json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const isauthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "Authenticated" });
  } catch (error) {
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const sendresetotp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);
    user.resetOtp = OTP;
    user.resetotpexpireat = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${OTP}`,
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in sendresetotp:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const resetpassword = async (req, res) => {
  const { email, OTP, newpassword } = req.body;
  if (!email || !OTP || !newpassword) {
    return res.json({ success: false, message: "Details required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetOtp !== OTP || user.resetOtp === "") {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetotpexpireat < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    const hashedpass = await bcryptjs.hash(newpassword, 12);
    user.password = hashedpass;
    user.resetOtp = "";
    user.resetotpexpireat = 0;
    await user.save();

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetpassword:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};
