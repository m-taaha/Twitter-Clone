import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generatingTokenandSetCookies } from "../lib/utils/gerateTokens.js";

const signUp = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    //exitinguish user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // extingemail
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "password should be at least 6 characters" });
    }
    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
      followers: [],
      following: [],
    });

    //generating tokens function and cookies
    if (newUser) {
      generatingTokenandSetCookies(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        coverImage: newUser.coverImage,
        profileImage: newUser.profileImage,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error("SingUp error:", error);
    res.status(500).json({
      error: "An error occurred during sign up",
    });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    //Check if User Exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Invalid user or password" });
    }

    //Compare Password usig bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(404).json({ error: "Invalid user or password" });
    }

    generatingTokenandSetCookies(user._id, res);

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      coverImage: user.coverImage,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "An error occurred during login",
    });
  }
};
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { myAge: 0 });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "An error occurred during logout",
    });
  }
};

export { signUp, login, logout };
