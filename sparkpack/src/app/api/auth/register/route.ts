import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";
import { ApplicationStatusSimplified } from "@prisma/client";
import nodemailer from "nodemailer";

async function sendWelcomeEmail(toEmail: string, username: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"SparkPack Support" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Welcome to SparkPack",
    text: `Hello ${username},\n\nThank you for registering at SparkPack! We're excited to have you on board.`,
    html: `<p>Hello <strong>${username}</strong>,</p><p>Thank you for registering at SparkPack! We're excited to have you on board.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, role, phoneNum } = await req.json();

    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (role !== "CUSTOMER" && role !== "ADMIN") {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    // If role is CUSTOMER and user is not admin, check if email matches a submitted application
    if (role === "CUSTOMER") {
      // Check if request is from admin by token
      const token = await getToken({ req });
      const isAdmin = token?.role === "ADMIN";

      if (!isAdmin) {
        // Check if there is a submitted application with this email
        const submittedApplication = await prisma.application.findFirst({
          where: {
        status: ApplicationStatusSimplified.SUBMITTED,
            customer: {
              email: email,
            },
          },
        });

        if (!submittedApplication) {
          return NextResponse.json({ error: "No submitted application found for this email." }, { status: 403 });
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName: username,
        email,
        phoneNum: phoneNum || "N/A",
        password: hashedPassword,
        role,
      },
    });

    // Send welcome email after user creation
    try {
      await sendWelcomeEmail(email, username);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    // If role is CUSTOMER, create ClientDetails record
    if (role === "CUSTOMER") {
      const {
        firstName,
        lastName,
        dob,
        pob,
        gender,
        phoneNumber,
        email: clientEmail,
        streetAddress,
        country,
        city,
        province,
        postalCode,
        declarationAccuracy,
      } = await req.json();

      await prisma.clientDetails.create({
        data: {
          userId: user.id,
          firstName: firstName || "N/A",
          lastName: lastName || "N/A",
          dob: dob ? new Date(dob) : new Date("1970-01-01"),
          pob: pob || "N/A",
          gender: gender || "N/A",
          phoneNumber: phoneNumber || "N/A",
          email: clientEmail || "N/A",
          streetAddress: streetAddress || "N/A",
          country: country || "N/A",
          city: city || "N/A",
          province: province || "N/A",
          postalCode: postalCode || "N/A",
          declarationAccuracy: declarationAccuracy || false,
        },
      });
    }

    return NextResponse.json({ message: "Registration successful." }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
