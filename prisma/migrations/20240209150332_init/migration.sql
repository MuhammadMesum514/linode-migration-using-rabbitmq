/*
  Warnings:

  - You are about to drop the column `standardId` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `standardId` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `standardId` on the `Topic` table. All the data in the column will be lost.
  - Added the required column `subject_id` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_standardId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_standardId_fkey";

-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_standardId_fkey";

-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "standardId",
ADD COLUMN     "subject_id" INTEGER default null;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "standardId";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "board" TEXT default NULL,
ADD COLUMN     "created_by" TEXT default NULL,
ADD COLUMN     "standard" TEXT default NULL;

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "standardId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_by" TEXT default NULL;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_standard_id_fkey" FOREIGN KEY ("standard_id") REFERENCES "Standard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_subject_id_standard_id_board_id_fkey" FOREIGN KEY ("subject_id", "standard_id", "board_id") REFERENCES "Subject"("id", "standard_id", "board_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_standard_id_fkey" FOREIGN KEY ("standard_id") REFERENCES "Standard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_standard_id_fkey" FOREIGN KEY ("standard_id") REFERENCES "Standard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
