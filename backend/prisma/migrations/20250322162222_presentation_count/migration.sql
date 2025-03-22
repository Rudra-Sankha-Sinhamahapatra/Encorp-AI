-- CreateTable
CREATE TABLE "PresentationCount" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PresentationCount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PresentationCount_userId_idx" ON "PresentationCount"("userId");

-- CreateIndex
CREATE INDEX "PresentationCount_createdAt_idx" ON "PresentationCount"("createdAt");

-- AddForeignKey
ALTER TABLE "PresentationCount" ADD CONSTRAINT "PresentationCount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
