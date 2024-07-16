/*
  Warnings:

  - You are about to drop the `UserAnswerOption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `optionId` to the `UserAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAnswerOption" DROP CONSTRAINT "UserAnswerOption_questionOptionId_fkey";

-- DropForeignKey
ALTER TABLE "UserAnswerOption" DROP CONSTRAINT "UserAnswerOption_userAnswerId_fkey";

-- AlterTable
ALTER TABLE "UserAnswer" ADD COLUMN     "optionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserAnswerOption";

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "QuestionsOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
