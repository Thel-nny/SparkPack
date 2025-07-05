import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";

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
            status: "SUBMITTED" as any,
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
        phoneNum,
        password: hashedPassword,
        role,
      },
    });

    // If role is CUSTOMER, create ClientDetails record
    if (role === "CUSTOMER") {
      const { streetAddress, country, city, province, postalCode, declarationAccuracy } = await req.json();

      await prisma.clientDetails.create({
        data: {
          userId: user.id,
          streetAddress: streetAddress || '',
          country: country || '',
          city: city || '',
          province: province || '',
          postalCode: postalCode || '',
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
