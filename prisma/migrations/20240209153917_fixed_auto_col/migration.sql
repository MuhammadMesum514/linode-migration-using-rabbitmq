/*
  Warnings:

  - Made the column `name` on table `Chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `board_id` on table `Chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject_id` on table `Chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `board_id` on table `PaperNumbers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Section` required. This step will fail if there are existing NULL values in that column.
  - Made the column `board_id` on table `Section` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Standard` required. This step will fail if there are existing NULL values in that column.
  - Made the column `board_id` on table `Standard` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Subject` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `Subject` required. This step will fail if there are existing NULL values in that column.
  - Made the column `board_id` on table `Subject` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Topic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `board_id` on table `Topic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `board_id` on table `Variant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chapter" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "standard_id" DROP DEFAULT,
ALTER COLUMN "board_id" SET NOT NULL,
ALTER COLUMN "subject_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "PaperNumbers" ALTER COLUMN "paper_number" DROP DEFAULT,
ALTER COLUMN "standard_id" DROP DEFAULT,
ALTER COLUMN "board_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "subject_id" DROP DEFAULT,
ALTER COLUMN "standard_id" DROP DEFAULT,
ALTER COLUMN "board_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Standard" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "board_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "user_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "standard_id" DROP DEFAULT,
ALTER COLUMN "board_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Topic" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "topic_number" DROP DEFAULT,
ALTER COLUMN "chapter_id" DROP DEFAULT,
ALTER COLUMN "standard_id" DROP DEFAULT,
ALTER COLUMN "board_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Variant" ALTER COLUMN "variant_number" DROP DEFAULT,
ALTER COLUMN "standard_id" DROP DEFAULT,
ALTER COLUMN "board_id" SET NOT NULL;
