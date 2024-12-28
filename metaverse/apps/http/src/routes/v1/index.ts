import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SigninSchema, SignupSchema } from "../../types";
import {hash, compare} from "../../scrypt";
import client from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config";

export const router = Router();

router.post("/signup", async (req, res) => {
    const parsedData = SignupSchema.safeParse(req.body);

    // If validation fails, return a 400 error with a message
    if (!parsedData.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed. Please check your input data."
        });
        return
    }

    const hashedPassword = await hash(parsedData.data.password)

     try {
        // Create the user in the database
        const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "admin" ? "Admin" : "User",  // Assigning the role
            }
        });

        // Send a success response with the user's ID
        res.status(200).json({
            success: true,
            message: "Signup successful! Welcome aboard.",
            userId: user.id,
        });
    } catch (e) {
        // Handle the case where the user already exists
        res.status(400).json({
            success: false,
            message: "User already exists. Please choose a different username.",
        });
    }
})

router.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  try {
    // Find the user by username
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" }); // Use 404 for not found
      return;
    }

    // Check if the password matches
    const isValid = await compare(parsedData.data.password, user.password);

    if (!isValid) {
      res.status(401).json({ message: "Invalid password" }); // Use 401 for unauthorized
      return;
    }

    // Generate JWT token with 1-hour expiration
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_PASSWORD,
      { expiresIn: "1h" } // Set expiration time
    );

    res.status(200).json({
      token,
      message: "Sign-in successful",
    });
  } catch (e) {
    console.error("Error during sign-in:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/elements", async (req, res) => {
    const elements = await client.element.findMany()

    res.json({elements: elements.map(e => ({
        id: e.id,
        imageUrl: e.imageUrl,
        width: e.width,
        height: e.height,
        static: e.static
    }))})
})

router.get("/avatars", async (req, res) => {
    const avatars = await client.avatar.findMany()
    res.json({avatars: avatars.map(x => ({
        id: x.id,
        imageUrl: x.imageUrl,
        name: x.name
    }))})
})

router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin", adminRouter)
