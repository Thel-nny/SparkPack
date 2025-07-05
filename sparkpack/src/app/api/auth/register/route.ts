import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

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

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstName: username,
        email,
        phoneNum,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({ message: "Registration successful." }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}