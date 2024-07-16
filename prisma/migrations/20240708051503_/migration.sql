-- AlterEnum
ALTER TYPE "AnswerType" ADD VALUE 'Rating';

-- AlterTable
ALTER TABLE "UserAnswer" ADD COLUMN     "ratingVal" INTEGER;
