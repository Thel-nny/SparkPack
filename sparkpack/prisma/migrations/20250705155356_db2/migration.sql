/*
  Warnings:

  - You are about to drop the column `coverageLimit` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `premiumAmount` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `medicalConditions` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Pet` table. All the data in the column will be lost.
  - Added the required column `reimbursement` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `ClientDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `ClientDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `ClientDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `ClientDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `ClientDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `ClientDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pob` to the `ClientDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petName` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spayedNeutered` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaccinationStatus` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VacStatus" AS ENUM ('UP_TO_DATE', 'NOT_VACCINATED', 'PARTIALLY_VACCINATED');

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "coverageLimit",
DROP COLUMN "premiumAmount",
ADD COLUMN     "coverageAmount" DOUBLE PRECISION,
ADD COLUMN     "coverageLength" INTEGER,
ADD COLUMN     "donationPercentage" DOUBLE PRECISION,
ADD COLUMN     "paymentFrequency" TEXT,
ADD COLUMN     "reimbursement" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ClientDetails" ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "pob" TEXT NOT NULL,
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "accountName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "cardName" TEXT,
ADD COLUMN     "cardNumber" TEXT,
ADD COLUMN     "cvv" TEXT,
ADD COLUMN     "expiryDate" TEXT,
ADD COLUMN     "gcashName" TEXT,
ADD COLUMN     "gcashNumber" TEXT;

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "dateOfBirth",
DROP COLUMN "medicalConditions",
DROP COLUMN "name",
DROP COLUMN "weight",
ADD COLUMN     "chronicIllness" TEXT,
ADD COLUMN     "chronicIllnessExplanation" TEXT,
ADD COLUMN     "clinicAddress" TEXT,
ADD COLUMN     "clinicPhoneNumber" TEXT,
ADD COLUMN     "colorMarkings" TEXT,
ADD COLUMN     "dobOrAdoptionDate" TIMESTAMP(3),
ADD COLUMN     "estimatedAge" INTEGER,
ADD COLUMN     "lastVetVisitDate" TIMESTAMP(3),
ADD COLUMN     "lifestyle" TEXT,
ADD COLUMN     "microchipNumber" TEXT,
ADD COLUMN     "onMedication" TEXT,
ADD COLUMN     "onMedicationExplanation" TEXT,
ADD COLUMN     "otherBreed" TEXT,
ADD COLUMN     "otherSpecies" TEXT,
ADD COLUMN     "petName" TEXT NOT NULL,
ADD COLUMN     "recurringConditions" TEXT,
ADD COLUMN     "recurringConditionsExplanation" TEXT,
ADD COLUMN     "spayedNeutered" BOOLEAN NOT NULL,
ADD COLUMN     "surgeryHistory" TEXT,
ADD COLUMN     "surgeryHistoryExplanation" TEXT,
ADD COLUMN     "vaccinationStatus" "VacStatus" NOT NULL,
ADD COLUMN     "vetClinicName" TEXT,
ADD COLUMN     "vetName" TEXT;

-- CreateTable
CREATE TABLE "SelectedAddOn" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "SelectedAddOn_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SelectedAddOn" ADD CONSTRAINT "SelectedAddOn_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
