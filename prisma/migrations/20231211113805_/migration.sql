/*
  Warnings:

  - You are about to drop the column `question` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `optionVal` on the `QuestionsOption` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `kiosk-admins` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `question_text_primary` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_text_secondary` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_val_ass` to the `QuestionsOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_val_eng` to the `QuestionsOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "kiosk-admins" DROP CONSTRAINT "kiosk-admins_kioskId_fkey";

-- AlterTable
ALTER TABLE "Questionnaire" DROP COLUMN "question",
ADD COLUMN     "question_text_primary" TEXT NOT NULL,
ADD COLUMN     "question_text_secondary" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuestionsOption" DROP COLUMN "optionVal",
ADD COLUMN     "option_val_ass" TEXT NOT NULL,
ADD COLUMN     "option_val_eng" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "name" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "kiosk-admins";
