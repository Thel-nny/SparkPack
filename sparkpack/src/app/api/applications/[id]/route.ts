import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const applicationId = req.url.split("/").pop();

      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          pet: {
            select: {
              id: true,
              petName: true,
              species: true,
              breed: true,
              dobOrAdoptionDate: true,
              gender: true,
              weight: true,
              // medicalConditions: true, // Removed because it does not exist in PetSelect type
            },
          },
          claims: { orderBy: { createdAt: "desc" } },
          payments: { orderBy: { createdAt: "desc" } },
        },
      });

      if (!application) {
        return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
      }

      if (userRole !== "ADMIN" && application.customerId !== userId) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }

      return NextResponse.json({ success: true, data: application });
    } catch (error) {
      console.error("Error fetching application:", error);
      return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
  }))(req);
}

function generateFakePassword(length = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function PUT(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const applicationId = req.url.split("/").pop();
      const body = await req.json();

      const existingApplication = await prisma.application.findUnique({
        where: { id: applicationId },
      });

      if (!existingApplication) {
        return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
      }

      if (userRole !== "ADMIN" && existingApplication.customerId !== userId) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }

      // Prepare update data with validation and defaults
      const updateData: any = {};

      if (body.premiumAmount !== undefined) {
        updateData.premiumAmount = parseFloat(body.premiumAmount);
      }
      if (body.deductible !== undefined) {
        updateData.deductible = parseFloat(body.deductible);
      }
      if (body.coverageLimit !== undefined) {
        updateData.coverageLimit = parseFloat(body.coverageLimit);
      }
      if (body.endDate !== undefined) {
        updateData.endDate = new Date(body.endDate);
      }
      if (userRole === "ADMIN" && body.status !== undefined) {
        updateData.status = body.status === "SUBMITTED" ? "SUBMITTED" : body.status;
      }

      // If status is being set to SUBMITTED, generate password and send email
      let tempPassword: string | null = null;
      if (updateData.status === "SUBMITTED") {
        tempPassword = generateFakePassword();

        // Hash the password
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Update user's password in the database
        await prisma.user.update({
          where: { id: existingApplication.customerId },
          data: { password: hashedPassword },
        });

        // Generate email verification token
        const crypto = await import("crypto");
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry

        await prisma.verificationToken.create({
          data: {
            identifier: existingApplication.customerId,
            token: verificationToken,
            expires,
          },
        });

        // Send email with temporary password and verification link
        const customer = await prisma.user.findUnique({
          where: { id: existingApplication.customerId },
        });

        if (customer && customer.email) {
          const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}&id=${customer.id}`;
          const emailText = `Dear ${customer.firstName || "Customer"},\n\nYour application has been submitted successfully. Your temporary password is: ${tempPassword}\n\nPlease verify your email by clicking the following link:\n${verificationUrl}\n\nPlease log in and change your password as soon as possible.\n\nBest regards,\nYour Company`;
          await sendEmail(customer.email, "Your Temporary Password and Email Verification", emailText);
        }
      }

      const application = await prisma.application.update({
        where: { id: applicationId },
        data: updateData,
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          pet: {
            select: { id: true, petName: true, species: true, breed: true },
          },
          claims: true,
          payments: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: application,
        message: tempPassword
          ? "Application updated successfully and temporary password sent via email"
          : "Application updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating application:", error.message, error.stack);
      return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
    }
  }))(req);
}
