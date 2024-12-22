import { Router } from 'express';
import { userRouter } from './user';
import { adminRouter } from './admin';
import { spaceRouter } from './space';
import { SignupSchema } from '../../types';
import { SigninSchema } from '../../types';
import client from "@repo/db/client"
import { hash, compare } from "../../scrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import express from "express";

export const router = Router();

router.use(express.json());

router.post('/signup', async (req, res) => {
  const parsedData = SignupSchema.safeParse(req.body);

  if (!parsedData.success) {
    console.error('Validation error details:', parsedData.error);
    res.status(400).json({ message: "Validation Error", error: parsedData.error });
    return;
  }

  const { username, password, type } = parsedData.data;

  try {
    // Check if username already exists
    const existingUser = await client.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    const hashedPassword = await hash(password);

    // Create user in database
    const user = await client.user.create({
      data: {
        username,
        password: hashedPassword,
        role: type === "admin" ? "Admin" : "User",
      },
    });

    res.status(201).json({
      userId: user.id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/signin', async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: "Validation Error", error: parsedData.error });
    return;
  }

  const { username, password } = parsedData.data;

  try {
    const user = await client.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      res.status(403).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Added expiration for better security
    );

    res.json({
      message: "User signed in successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/elements', async (req, res) => {
  const elements = await client.element.findMany();

  res.json({elements: elements.map((element) => ({
    id: element.id,
    imageUrl: element.imageUrl,
    height: element.height,
    width: element.width,
    static: element.static,
  }))});
});

router.get('/avatars', async (req, res) => {
  try {
    const avatars = await client.avatar.findMany();

    res.json({
      avatars: avatars.map((avatar) => ({
        id: avatar.id,
        imageUrl: avatar.imageUrl,
        name: avatar.name,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching avatars." });
  }
});

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/space", spaceRouter);
