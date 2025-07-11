/*
  Warnings:

  - The `status` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `progressStatus` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatusSimplified" AS ENUM ('SUBMITTED', 'APPROVED', 'DECLINED', 'ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "status",
ADD COLUMN     "status" "ApplicationStatusSimplified" NOT NULL DEFAULT 'SUBMITTED',
DROP COLUMN "progressStatus",
ADD COLUMN     "progressStatus" "ApplicationStatusSimplified" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "ApplicationProgressStatus";

-- DropEnum
DROP TYPE "ApplicationStatus";

-- DropEnum
DROP TYPE "applicationsstatus";

-- DropEnum
DROP TYPE "submittedstatus";
