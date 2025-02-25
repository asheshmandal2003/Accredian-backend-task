import { prisma } from "../config/prisma.js";
import { sendMail } from "../utils/mail.js";

export const refer = async (req, res) => {
  try {
    const { email } = req.body;
    const { id: referrerId } = req.params;

    if (!referrerId) {
      return res.status(400).json({ message: "Referrer ID is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: referrerId },
      select: { email: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Referrer not found" });
    }

    const existingReferral = await prisma.referral.findFirst({
      where: { email, referrerId },
    });

    if (user.email === email) {
      return res.status(400).json({ message: "You cannot refer yourself" });
    }

    if (existingReferral) {
      return res.status(400).json({ message: "User already referred" });
    }

    await prisma.referral.create({
      data: { email, referrerId },
    });

    await sendMail(email, user.email);

    res.status(201).json({ message: "User referred successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong!" });
  }
};
