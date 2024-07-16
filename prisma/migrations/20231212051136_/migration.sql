/*
  Warnings:

  - You are about to drop the column `option_val_ass` on the `QuestionsOption` table. All the data in the column will be lost.
  - You are about to drop the column `option_val_eng` on the `QuestionsOption` table. All the data in the column will be lost.
  - Added the required column `option_val_primary` to the `QuestionsOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_val_secondary` to the `QuestionsOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionsOption" DROP COLUMN "option_val_ass",
DROP COLUMN "option_val_eng",
ADD COLUMN     "option_val_primary" TEXT NOT NULL,
ADD COLUMN     "option_val_secondary" TEXT NOT NULL;
