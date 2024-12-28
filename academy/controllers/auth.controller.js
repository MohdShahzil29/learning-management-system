import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisConfig from "../config/redis.js";
import Academy from "../model/academy.model.js";

export const registerAcademy = async (req, res) => {
  try {
    const { name, email, password, address, phone, website } = req.body;
    // validate
    if (!name || !email || !password || !address || !phone || !website) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const academy = await Academy.findOne({ where: { email } });
    
    if (academy) {
      return res.status(400).json({ message: "Academy already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new academy record
    const newAcademy = await Academy.create({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      website,
    });

    res.status(201).json({
      message: "Academy registered successfully",
      academy: {
        id: newAcademy.id,
        name: newAcademy.name,
        email: newAcademy.email,
        address: newAcademy.address,
        phone: newAcademy.phone,
        website: newAcademy.website,
      },
    });
  } catch (error) {
    console.error("Error registering academy:", error);
    res.status(500).json({ message: "Error registering academy", error });
  }
};

export const loginAcademy = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Find the academy by email
    const academy = await Academy.findOne({ where: { email } });

    if (!academy) {
      return res.status(404).json({ message: "Academy not found" });
    }

    // Validate the password
    const isPasswordValid = bcrypt.compareSync(password, academy.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: academy.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Cache academy data in Redis
    const cacheKey = `academy:${academy.id}`;
    const cacheData = {
      id: academy.id,
      name: academy.name,
      email: academy.email,
      address: academy.address,
      phone: academy.phone,
      website: academy.website,
    };

    await redisConfig.set(cacheKey, JSON.stringify(cacheData), "EX", 3600);

    // Set token in an HttpOnly cookie
    res
      .cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
      })
      .status(200)
      .json({ message: "Login successful", token, academy });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};
