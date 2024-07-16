/*
  Warnings:

  - Made the column `question_text_secondary` on table `Questionnaire` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Questionnaire" ALTER COLUMN "question_text_secondary" SET NOT NULL;

-- AlterTable
ALTER TABLE "QuestionsOption" ALTER COLUMN "option_val_secondary" DROP NOT NULL;
