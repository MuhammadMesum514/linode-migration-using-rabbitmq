/*
  Warnings:

  - Added the required column `user_id` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "user_id" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Standard" (
    "id" SERIAL NOT NULL  ,
    "name" TEXT DEFAULT NULL,
    "board_id" TEXT DEFAULT NULL,

    CONSTRAINT "Standard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL ,
    "name" TEXT DEFAULT NULL,
    "code" TEXT DEFAULT NULL,
    "standard_id" INTEGER NOT NULL DEFAULT 0,
    "board_id" TEXT DEFAULT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL ,
    "name" TEXT DEFAULT NULL,
    "subject_id" INTEGER NOT NULL DEFAULT 0,
    "standard_id" INTEGER NOT NULL DEFAULT 0,
    "board_id" TEXT DEFAULT NULL,
    "standardId" INTEGER,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL NOT NULL ,
    "name" TEXT DEFAULT NULL,
    "section_id" INTEGER,
    "standard_id" INTEGER NOT NULL DEFAULT 0,
    "board_id" TEXT DEFAULT NULL,
    "standardId" INTEGER,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" SERIAL NOT NULL ,
    "name" TEXT DEFAULT NULL,
    "topic_number" INTEGER NOT NULL DEFAULT 0,
    "chapter_id" INTEGER NOT NULL DEFAULT 0,
    "standard_id" INTEGER NOT NULL DEFAULT 0,
    "board_id" TEXT DEFAULT NULL,
    "standardId" INTEGER,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperNumbers" (
    "id" SERIAL NOT NULL ,
    "paper_number" INTEGER NOT NULL DEFAULT 0,
    "standard_id" INTEGER NOT NULL DEFAULT 0,
    "board_id" TEXT DEFAULT NULL,

    CONSTRAINT "PaperNumbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" SERIAL NOT NULL ,
    "variant_number" INTEGER NOT NULL DEFAULT 0,
    "standard_id" INTEGER NOT NULL DEFAULT 0,
    "board_id" TEXT DEFAULT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Standard_id_board_id_key" ON "Standard"("id", "board_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_id_standard_id_board_id_key" ON "Subject"("id", "standard_id", "board_id");

-- CreateIndex
CREATE UNIQUE INDEX "Section_id_standard_id_board_id_key" ON "Section"("id", "standard_id", "board_id");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_id_standard_id_board_id_key" ON "Chapter"("id", "standard_id", "board_id");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_id_board_id_key" ON "Variant"("id", "board_id");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Standard" ADD CONSTRAINT "Standard_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "Board"("board_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_standard_id_board_id_fkey" FOREIGN KEY ("standard_id", "board_id") REFERENCES "Standard"("id", "board_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_subject_id_standard_id_board_id_fkey" FOREIGN KEY ("subject_id", "standard_id", "board_id") REFERENCES "Subject"("id", "standard_id", "board_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_section_id_standard_id_board_id_fkey" FOREIGN KEY ("section_id", "standard_id", "board_id") REFERENCES "Section"("id", "standard_id", "board_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_chapter_id_standard_id_board_id_fkey" FOREIGN KEY ("chapter_id", "standard_id", "board_id") REFERENCES "Chapter"("id", "standard_id", "board_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperNumbers" ADD CONSTRAINT "PaperNumbers_standard_id_board_id_fkey" FOREIGN KEY ("standard_id", "board_id") REFERENCES "Standard"("id", "board_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_standard_id_board_id_fkey" FOREIGN KEY ("standard_id", "board_id") REFERENCES "Standard"("id", "board_id") ON DELETE RESTRICT ON UPDATE CASCADE;
