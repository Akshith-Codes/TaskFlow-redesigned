import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/userModel.js";
import BoardModel from "../models/boardModel.js";
import ListModel from "../models/ListModel.js";

const createDefaultBoardsAndLists = async (userId) => {
  const defaultBoards = [
    { title: "Professional", owner: userId, members: [userId], isDefault: true },
    { title: "Personal", owner: userId, members: [userId], isDefault: true },
  ];
  const createdBoards = await BoardModel.insertMany(defaultBoards);
  const defaultLists = [];
  createdBoards.forEach((board) => {
    defaultLists.push(
      { title: "Today", boardId: board._id, order: 1 },
      { title: "This Week", boardId: board._id, order: 2 },
      { title: "Later", boardId: board._id, order: 3 }
    );
  });
  await ListModel.insertMany(defaultLists);
};

// REGISTER
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password required" });

    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name, email, password: hashedPassword, isVerified: true,
    });

    await createDefaultBoardsAndLists(user._id);

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    next(err);
  }
};

// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    next(err);
  }
};

// LOGOUT
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};