import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hasedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hasedPassword,
      },
      select: {
        id: true,
      },
    });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target.includes("email")) {
      return res.status(400).json({ message: "User already exists!" });
    }
    res.status(400).json({ message: error.message || "Something went wrong!" });
  } finally {
    await prisma.$disconnect();
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      select: {
        id: true,
        password: true,
      },
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("User does not exist!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password!");
    }

    res
      .status(200)
      .json({ message: "User logged in successfully", userId: user.id });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong!" });
  } finally {
    await prisma.$disconnect();
  }
};
