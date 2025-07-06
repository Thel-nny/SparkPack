import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { PetDetails } from "@/types/formData";
import { VacStatus } from "@prisma/client";

const PetSpecies = {
  DOG: "DOG",
  CAT: "CAT",
  OTHER: "OTHER",
} as const;

type PetSpecies = typeof PetSpecies[keyof typeof PetSpecies];

export async function GET(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      const whereClause = userRole === 'ADMIN' ? {} : { ownerId: userId };

      const pets = await prisma.pet.findMany({
        where: whereClause,
        skip,
        take: limit,
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
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.pet.count({ where: whereClause });

      return NextResponse.json({
        success: true,
        data: {
          pets,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching pets:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}

export async function POST(req: NextRequest) {
  return await (await withAuth(async (req: NextRequest, userId: string) => {
    try {
      const body: PetDetails = await req.json();

      // Validate required fields
      if (!body.petName || !body.species) {
        return NextResponse.json(
          { success: false, error: "Pet name and species are required" },
          { status: 400 }
        );
      }

      const pet = await prisma.pet.create({
        data: {
          ownerId: userId,
          petName: body.petName,
          species: PetSpecies[body.species.toUpperCase() as keyof typeof PetSpecies],
          otherSpecies: body.otherSpecies,
          breed: body.breed,
          otherBreed: body.otherBreed,
          dobOrAdoptionDate: body.dobOrAdoptionDate ? new Date(body.dobOrAdoptionDate) : null,
          estimatedAge: body.estimatedAge ? parseInt(body.estimatedAge) : null,
          gender: body.gender,
          weight: body.weight ? parseFloat(body.weight) : null,
          microchipNumber: body.microchipNumber,
          colorMarkings: body.colorMarkings,
          spayedNeutered: body.spayedNeutered === 'Yes',
          vaccinationStatus: body.vaccinationStatus as VacStatus,
          lifestyle: body.lifestyle,
          chronicIllness: body.chronicIllness,
          chronicIllnessExplanation: body.chronicIllnessExplanation,
          surgeryHistory: body.surgeryHistory,
          surgeryHistoryExplanation: body.surgeryHistoryExplanation,
          recurringConditions: body.recurringConditions,
          recurringConditionsExplanation: body.recurringConditionsExplanation,
          onMedication: body.onMedication,
          onMedicationExplanation: body.onMedicationExplanation,
          vetName: body.vetName,
          vetClinicName: body.vetClinicName,
          clinicPhoneNumber: body.clinicPhoneNumber,
          clinicAddress: body.clinicAddress,
          lastVetVisitDate: body.lastVetVisitDate ? new Date(body.lastVetVisitDate) : null,
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
        },
      });

      return NextResponse.json({
        success: true,
        data: pet,
        message: "Pet created successfully",
      });
    } catch (error) {
      console.error("Error creating pet:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}
