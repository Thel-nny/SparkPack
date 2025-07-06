import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { UserRole } from "@prisma/client"; // ✅ Import the enum

export async function GET(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const { searchParams } = new URL(req.url);

      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const skip = (page - 1) * limit;

      // ✅ Correct usage of Prisma enum
      const whereClause =
        userRole === "ADMIN"
          ? { customer: { is: { role: UserRole.CUSTOMER } } }
          : {
              customerId: userId,
              customer: { is: { role: UserRole.CUSTOMER } },
            };

      const applications = await prisma.application.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          pet: {
            select: {
              id: true,
              petName: true,
              species: true,
              breed: true,
            },
          },
          claims: true,
          payments: true,
        },
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.application.count({ where: whereClause });

      return NextResponse.json({
        success: true,
        data: {
          applications,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req); // ✅ Ensure to call the returned function with req
}

export async function POST(req: NextRequest) {
  return await (await withAuth(async (req: NextRequest) => {
    try {
      const body = await req.json();

      // Destructure form data
      const { client, pet, product, payment } = body;

      if (!client || !client.email) {
        return NextResponse.json(
          { success: false, error: "Client information with email is required" },
          { status: 400 }
        );
      }

      // Validate required product fields
      if (!product || !product.productName) {
        return NextResponse.json(
          { success: false, error: "Product name is required" },
          { status: 400 }
        );
      }
      if (!product.planType) {
        return NextResponse.json(
          { success: false, error: "Plan type is required" },
          { status: 400 }
        );
      }
      if (!product.reimbursementRate || isNaN(parseFloat(product.reimbursementRate))) {
        return NextResponse.json(
          { success: false, error: "Valid reimbursement rate is required" },
          { status: 400 }
        );
      }
      if (!product.deductible || isNaN(parseFloat(product.deductible))) {
        return NextResponse.json(
          { success: false, error: "Valid deductible is required" },
          { status: 400 }
        );
      }
      if (!product.startDate || isNaN(new Date(product.startDate).getTime())) {
        return NextResponse.json(
          { success: false, error: "Valid start date is required" },
          { status: 400 }
        );
      }

      // Check if user exists, if not create user with role CUSTOMER
      let user = await prisma.user.findUnique({
        where: { email: client.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: client.email,
            firstName: client.firstName,
            lastName: client.lastName,
            phoneNum: client.phoneNumber,
            role: 'CUSTOMER',
            clientDetails: {
              create: {
                title: client.title, // Assuming title is part of client object
                firstName: client.firstName,
                middleName: client.middleName,
                lastName: client.lastName,
                dob: new Date(client.dob),
                pob: client.pob,
                gender: client.gender,
                phoneNumber: client.phoneNumber,
                email: client.email,
                streetAddress: client.streetAddress,
                country: client.country,
                city: client.city,
                province: client.province,
                postalCode: client.postalCode,
                declarationAccuracy: client.declarationAccuracy,
              },
            },
          },
        });
      } else {
        // Update clientDetails if user exists
        await prisma.clientDetails.upsert({
          where: { userId: user.id },
          update: {
            title: client.title, // Removed title field as it does not exist in DB schema
            firstName: client.firstName,
            middleName: client.middleName,
            lastName: client.lastName,
            dob: new Date(client.dob),
            pob: client.pob,
            gender: client.gender,
            phoneNumber: client.phoneNumber,
            email: client.email,
            streetAddress: client.streetAddress,
            country: client.country,
            city: client.city,
            province: client.province,
            postalCode: client.postalCode,
            declarationAccuracy: client.declarationAccuracy,
          },
          create: {
            userId: user.id,
            title: client.title, // Removed title field as it does not exist in DB schema
            firstName: client.firstName,
            middleName: client.middleName,
            lastName: client.lastName,
            dob: new Date(client.dob),
            pob: client.pob,
            gender: client.gender,
            phoneNumber: client.phoneNumber,
            email: client.email,
            streetAddress: client.streetAddress,
            country: client.country,
            city: client.city,
            province: client.province,
            postalCode: client.postalCode,
            declarationAccuracy: client.declarationAccuracy,
          },
        });
      }

      // Create or update pet
      let petRecord = await prisma.pet.findFirst({
        where: {
          ownerId: user.id,
          petName: pet.petName,
        },
      });

      // Normalize species to uppercase to match enum values
      const normalizedSpecies = pet.species ? pet.species.toUpperCase() : null;

      // Parse weight to float if provided
      const parsedWeight = pet.weight ? parseFloat(pet.weight) : null;

      if (!petRecord) {
        // Normalize vaccinationStatus to match enum values
        const normalizedVaccinationStatus = pet.vaccinationStatus ? pet.vaccinationStatus.toUpperCase().replace(/[- ]/g, '_') : null;

        petRecord = await prisma.pet.create({
          data: {
            ownerId: user.id,
            petName: pet.petName,
            dobOrAdoptionDate: pet.dobOrAdoptionDate ? new Date(pet.dobOrAdoptionDate) : null,
            estimatedAge: pet.estimatedAge ? parseInt(pet.estimatedAge) : null,
            weight: parsedWeight,
            gender: pet.gender,
            species: normalizedSpecies,
            otherSpecies: pet.otherSpecies,
            breed: pet.breed,
            otherBreed: pet.otherBreed,
            microchipNumber: pet.microchipNumber,
            colorMarkings: pet.colorMarkings,
            spayedNeutered: pet.spayedNeutered === 'true' || pet.spayedNeutered === true,
            vaccinationStatus: normalizedVaccinationStatus,
            lifestyle: pet.lifestyle,
            chronicIllness: pet.chronicIllness,
            chronicIllnessExplanation: pet.chronicIllnessExplanation,
            surgeryHistory: pet.surgeryHistory,
            surgeryHistoryExplanation: pet.surgeryHistoryExplanation,
            recurringConditions: pet.recurringConditions,
            recurringConditionsExplanation: pet.recurringConditionsExplanation,
            onMedication: pet.onMedication,
            onMedicationExplanation: pet.onMedicationExplanation,
            vetName: pet.vetName,
            vetClinicName: pet.vetClinicName,
            clinicPhoneNumber: pet.clinicPhoneNumber,
            clinicAddress: pet.clinicAddress,
            lastVetVisitDate: pet.lastVetVisitDate ? new Date(pet.lastVetVisitDate) : null,
          },
        });
      } else {
        // Normalize vaccinationStatus to match enum values
        const normalizedVaccinationStatus = pet.vaccinationStatus ? pet.vaccinationStatus.toUpperCase().replace(/[- ]/g, '_') : null;

        petRecord = await prisma.pet.update({
          where: { id: petRecord.id },
          data: {
            dobOrAdoptionDate: pet.dobOrAdoptionDate ? new Date(pet.dobOrAdoptionDate) : null,
            estimatedAge: pet.estimatedAge ? parseInt(pet.estimatedAge) : null,
            weight: parsedWeight,
            gender: pet.gender,
            species: normalizedSpecies,
            otherSpecies: pet.otherSpecies,
            breed: pet.breed,
            otherBreed: pet.otherBreed,
            microchipNumber: pet.microchipNumber,
            colorMarkings: pet.colorMarkings,
            spayedNeutered: pet.spayedNeutered === 'true' || pet.spayedNeutered === true,
            vaccinationStatus: normalizedVaccinationStatus,
            lifestyle: pet.lifestyle,
            chronicIllness: pet.chronicIllness,
            chronicIllnessExplanation: pet.chronicIllnessExplanation,
            surgeryHistory: pet.surgeryHistory,
            surgeryHistoryExplanation: pet.surgeryHistoryExplanation,
            recurringConditions: pet.recurringConditions,
            recurringConditionsExplanation: pet.recurringConditionsExplanation,
            onMedication: pet.onMedication,
            onMedicationExplanation: pet.onMedicationExplanation,
            vetName: pet.vetName,
            vetClinicName: pet.vetClinicName,
            clinicPhoneNumber: pet.clinicPhoneNumber,
            clinicAddress: pet.clinicAddress,
            lastVetVisitDate: pet.lastVetVisitDate ? new Date(pet.lastVetVisitDate) : null,
          },
        });
      }

      // Create application
      const { v4: uuidv4 } = await import('uuid');
      const application = await prisma.application.create({
        data: {
          customerId: user.id,
          petId: petRecord.id,
          policyNumber: uuidv4(),
          planType: product.planType,
          reimbursement: parseFloat(product.reimbursementRate),
          // Defensive parsing to remove non-numeric characters before parseFloat
          deductible: parseFloat(product.deductible.replace(/[^0-9.-]+/g, '')),
          coverageAmount: parseFloat(product.coverageAmount.replace(/[^0-9.-]+/g, '')),
          startDate: product.startDate ? new Date(product.startDate) : new Date(),
          coverageLength: product.coverageLength ? parseInt(product.coverageLength) : null,
          donationPercentage: product.donationPercentage ? parseFloat(product.donationPercentage) : null,
          paymentFrequency: product.paymentFrequency,
          selectedAddOns: {
            create: product.selectedAddOns.map((addon: { name: string; price: number; type: string }) => ({
              name: addon.name,
              price: addon.price,
              type: addon.type,
            })),
          },
        },
        include: {
          customer: true,
          pet: true,
          selectedAddOns: true,
        },
      });

      // Create payment
      await prisma.payment.create({
        data: {
          amount: parseFloat(product.coverageAmount.replace(/[^0-9.-]+/g, '')) || 0,
          paymentDate: new Date(),
          paymentMethod: payment.paymentMethod,
          cardNumber: payment.cardNumber,
          cardName: payment.cardName,
          expiryDate: payment.expiryDate,
          cvv: payment.cvv,
          bankName: payment.bankName,
          accountNumber: payment.accountNumber,
          accountName: payment.accountName,
          gcashNumber: payment.gcashNumber,
          gcashName: payment.gcashName,
          transactionId: payment.transactionId,
          status: 'COMPLETED',
          application: {
            connect: { id: application.id }
          }
        },
      });

      return NextResponse.json({
        success: true,
        data: application,
        message: "Application created successfully",
      });
    } catch{
      console.error("Error creating application:");
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req); // <-- Call the returned function with req
}
