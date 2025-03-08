-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "PresentationJob" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
