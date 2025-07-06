import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const url = new URL(req.url);
      const pathSegments = url.pathname.split('/');
      const petId = pathSegments[pathSegments.length - 1];

      const pet = await prisma.pet.findUnique({
        where: { id: petId },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          applications: {
            include: {
              claims: {
                orderBy: { createdAt: 'desc' },
              },
              payments: {
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      });

      if (!pet) {
        return NextResponse.json(
          { success: false, error: "Pet not found" },
          { status: 404 }
        );
      }

      // Check access permissions
      if (userRole !== 'ADMIN' && pet.ownerId !== userId) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: pet,
      });
    } catch (error) {
      console.error("Error fetching pet:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}

export async function PUT(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const url = new URL(req.url);
      const pathSegments = url.pathname.split('/');
      const petId = pathSegments[pathSegments.length - 1];

      const body = await req.json();

      // Find the pet
      const existingPet = await prisma.pet.findUnique({
        where: { id: petId },
      });

      if (!existingPet) {
        return NextResponse.json(
          { success: false, error: "Pet not found" },
          { status: 404 }
        );
      }

      // Check access permissions
      if (userRole !== 'ADMIN' && existingPet.ownerId !== userId) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }

      const pet = await prisma.pet.update({
        where: { id: petId },
        data: {
          petName: body.name,
          species: body.species,
          breed: body.breed,
          dobOrAdoptionDate: body.dateOfBirth,
          gender: body.gender,
          weight: body.weight,
          // medicalConditions: body.medicalConditions,
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          applications: {
            include: {
              claims: true,
              payments: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: pet,
        message: "Pet updated successfully",
      });
    } catch (error) {
      console.error("Error updating pet:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}

export async function DELETE(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const url = new URL(req.url);
      const pathSegments = url.pathname.split('/');
      const petId = pathSegments[pathSegments.length - 1];

      // Find the pet
      const pet = await prisma.pet.findUnique({
        where: { id: petId },
      });

      if (!pet) {
        return NextResponse.json(
          { success: false, error: "Pet not found" },
          { status: 404 }
        );
      }
      // Check access permissions
      if (userRole !== 'ADMIN' && pet.ownerId !== userId) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }

      await prisma.pet.delete({
        where: { id: petId },
      });

      return NextResponse.json({
        success: true,
        message: "Pet deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting pet:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}
