-- CreateTable
CREATE TABLE "PresentationJob" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PresentationJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PresentationJob" ADD CONSTRAINT "PresentationJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
