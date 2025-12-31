import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import { Student } from "../model/Student.js";
import { Teacher } from "../model/Teacher.js";
import JWT from "../middleware/JWT.js";

async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await Student.findOne({ email });
    let type = "student";

    if (!user) {
      user = await Teacher.findOne({ email });
      type = "teacher";
    }

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = JWT.generateToken({ email: user.email });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ user, type, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function Signup(req, res) {
  try {
    const { name, email, pno, dob, password, type } = req.body;

    if (!name || !email || !pno || !dob || !password || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });

    if (existingStudent || existingTeacher) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let newUser;

    if (type === "student") {
      newUser = await Student.create({ name, email, pno, dob, password });
    } else if (type === "teacher") {
      newUser = await Teacher.create({ name, email, pno, dob, password });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function ForgotPassword(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await Student.findOneAndUpdate(
      { email },
      { password },
      { new: true }
    );

    if (!user) {
      user = await Teacher.findOneAndUpdate(
        { email },
        { password },
        { new: true }
      );
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("ForgotPassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function EditUserDetails(req, res) {
  try {
    const { email, name, pno, dob } = req.body;

    if (!email || !name || !pno || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await Student.findOneAndUpdate(
      { email },
      { name, pno, dob },
      { new: true }
    );

    if (!user) {
      user = await Teacher.findOneAndUpdate(
        { email },
        { name, pno, dob },
        { new: true }
      );
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User details updated", user });
  } catch (err) {
    console.error("EditUserDetails error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function SendMail(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!process.env.EMAIL || !process.env.PASSWORD) {
      console.error("Missing EMAIL or PASSWORD env vars");
      return res.status(500).json({ message: "Mail service not configured" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    console.log("OTP sent to:", email);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (err) {
    console.error("SendMail error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
}

const UserController = {
  Login,
  Signup,
  ForgotPassword,
  EditUserDetails,
  SendMail,
};

export default UserController;
