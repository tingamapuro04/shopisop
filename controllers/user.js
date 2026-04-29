import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { uploadFileToS3, getImageUrl } from "../utils/file_upload.js";

let updatedUsers = [];
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    for(let user of users) {
      let new_user = user.toJSON();
      if (user.profilePicture) {
        new_user.profilePicture = await getImageUrl(user.profilePicture);
        updatedUsers.push(new_user);
      } else {
        updatedUsers.push(new_user);
      }
    }
    res.status(200).json(updatedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// create a new user and hash the password before saving to the database
export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const profilePicture = req.file ? await uploadFileToS3(req.file) : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      profilePicture: profilePicture,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// login a user and return a JWT token
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get a user by id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let new_user = user.toJSON();
    if (user.profilePicture) {
      new_user.profilePicture = await getImageUrl(user.profilePicture);
      return res.status(200).json(new_user);
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
