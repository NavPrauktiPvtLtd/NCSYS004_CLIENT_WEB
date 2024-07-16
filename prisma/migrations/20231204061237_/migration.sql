-- AlterTable
ALTER TABLE "Questionnaire" ADD COLUMN     "kioskClientId" TEXT;

-- AddForeignKey
ALTER TABLE "Questionnaire" ADD CONSTRAINT "Questionnaire_kioskClientId_fkey" FOREIGN KEY ("kioskClientId") REFERENCES "KioskClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
