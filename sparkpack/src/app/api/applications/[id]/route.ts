import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

function generateTempPassword(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function sendTempPasswordEmail(toEmail: string, tempPassword: string, firstName: string) {
  // Configure the transporter with your SMTP settings
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"SparkPack Support" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Your Temporary Password",
    text: `Hello ${firstName},\n\nYour application has been received. Your temporary password is: ${tempPassword}\n\nPlease log in and change your password as soon as possible.\n\nBest regards,\nSparkPack Team`,
  };

  await transporter.sendMail(mailOptions);
}

export async function GET(req: NextRequest) {
  return (
    await withAuth(
      async (req: NextRequest, userId: string, userRole: string) => {
        try {
          // Extract applicationId from URL pathname to avoid query params or trailing slashes issues
          const url = new URL(req.url);
          const paths = url.pathname.split("/");
          const applicationId = paths[paths.length - 1] || paths[paths.length - 2];
          if (!applicationId) {
            return NextResponse.json(
              { success: false, error: "Missing application ID" },
              { status: 400 }
            );
          }

          const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
              customer: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
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
                },
              },
              claims: { orderBy: { createdAt: "desc" } },
              payments: { orderBy: { createdAt: "desc" } },
            },
          });

          if (!application) {
            return NextResponse.json(
              { success: false, error: "Application not found" },
              { status: 404 }
            );
          }

          if (
            userRole !== "ADMIN" &&
            application.customerId !== userId
          ) {
            return NextResponse.json(
              { success: false, error: "Forbidden" },
              { status: 403 }
            );
          }

          return NextResponse.json({ success: true, data: application });
        } catch (error) {
          console.error("Error fetching application:", error);
          return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
          );
        }
      }
    )
  )(req);
}


export async function PUT(req: NextRequest) {
  return withAuth(
    async (req: NextRequest, userId: string, userRole: string) => {
      try {
        // Extract applicationId from URL pathname to avoid query params or trailing slashes issues
        const url = new URL(req.url);
        const paths = url.pathname.split("/");
        const applicationId = paths[paths.length - 1] || paths[paths.length - 2];
        if (!applicationId) {
          return NextResponse.json(
            { success: false, error: "Missing application ID" },
            { status: 400 }
          );
        }

        const body = await req.json();

        const existingApplication = await prisma.application.findUnique({
          where: { id: applicationId },
        });

        if (!existingApplication) {
          return NextResponse.json(
            { success: false, error: "Application not found" },
            { status: 404 }
          );
        }

        if (
          userRole !== "ADMIN" &&
          existingApplication.customerId !== userId
        ) {
          return NextResponse.json(
            { success: false, error: "Forbidden" },
            { status: 403 }
          );
        }

        const updateData: any = {};

        // Validate and parse numeric fields
        if (body.premiumAmount !== undefined) {
          const premium = parseFloat(body.premiumAmount);
          if (isNaN(premium)) {
            return NextResponse.json(
              { success: false, error: "Invalid premiumAmount value" },
              { status: 400 }
            );
          }
          updateData.premiumAmount = premium;
        }
        if (body.deductible !== undefined) {
          const deductible = parseFloat(body.deductible);
          if (isNaN(deductible)) {
            return NextResponse.json(
              { success: false, error: "Invalid deductible value" },
              { status: 400 }
            );
          }
          updateData.deductible = deductible;
        }
        if (body.coverageLimit !== undefined) {
          const coverageLimit = parseFloat(body.coverageLimit);
          if (isNaN(coverageLimit)) {
            return NextResponse.json(
              { success: false, error: "Invalid coverageLimit value" },
              { status: 400 }
            );
          }
          updateData.coverageLimit = coverageLimit;
        }
        if (body.endDate !== undefined) {
          const date = new Date(body.endDate);
          if (isNaN(date.getTime())) {
            return NextResponse.json(
              { success: false, error: "Invalid endDate value" },
              { status: 400 }
            );
          }
          updateData.endDate = date;
        }

        if (userRole === "ADMIN" && body.status !== undefined) {
          // Restrict status updates for submitted applications to allowed statuses
          const allowedStatusesForSubmitted = [
            "SUBMITTED",
            "APPROVED",
            "DECLINED",
            "ACTIVE",
            "INACTIVE",
          ];
          // Check current status before restricting
          if (
            existingApplication.status === "SUBMITTED" &&
            !allowedStatusesForSubmitted.includes(body.status)
          ) {
            return NextResponse.json(
              {
                success: false,
                error: "Invalid status value for submitted application",
              },
              { status: 400 }
            );
          }
          // If status is updated to APPROVED, also update progressStatus to ACTIVE
          if (body.status === "APPROVED") {
            updateData.progressStatus = "ACTIVE";
          }
          updateData.status = body.status;
        }

        const application = await prisma.application.update({
          where: { id: applicationId },
          data: updateData,
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            pet: {
              select: { id: true, petName: true, species: true, breed: true },
            },
            claims: true,
            payments: true,
          },
        });

        // Generate temporary password
        const tempPassword = generateTempPassword();

        // Hash the temporary password
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Update the user's password in the database
        await prisma.user.update({
          where: { id: application.customer.id },
          data: { password: hashedPassword },
        });

        // Send the temporary password email
        await sendTempPasswordEmail(
          application.customer.email,
          tempPassword,
          application.customer.firstName || ""
        );

        return NextResponse.json({
          success: true,
          data: application,
          message: "Application updated and temporary password sent",
        });
      } catch (error) {
        console.error("Error updating application:", error);
        return NextResponse.json(
          { success: false, error: "Internal server error" },
          { status: 500 }
        );
      }
    }
  )(req);
}
