-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'Student';
ALTER TYPE "Role" ADD VALUE 'Teacher';

-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "board_id" TEXT NOT NULL,
    "board_name" TEXT NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperInfo" (
    "id" SERIAL NOT NULL,
    "board_id" TEXT NOT NULL,
    "subject_code" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "standard_type" TEXT NOT NULL,
    "Subject_name" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "exam_session" TEXT,
    "exam_year" TEXT,
    "paper_number" TEXT,
    "exam_variant" TEXT,
    "attempt_time" TEXT,
    "qp_url" TEXT,
    "qp_name" TEXT,
    "ms_url" TEXT,
    "ms_name" TEXT,
    "ci_url" TEXT,
    "ci_name" TEXT,
    "insert_url" TEXT,
    "insert_name" TEXT,
    "notes_url" TEXT,
    "video_url" TEXT,
    "worksheet_url" TEXT,

    CONSTRAINT "PaperInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paper_question" (
    "question_number" TEXT NOT NULL,
    "PaperNum" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paper_question_pkey" PRIMARY KEY ("question_number","PaperNum")
);

-- CreateTable
CREATE TABLE "questionInfo" (
    "unique_question_id" TEXT NOT NULL,
    "question_number" TEXT NOT NULL,
    "PaperNum" TEXT NOT NULL,
    "chapter_name" TEXT,
    "question_image" TEXT,
    "answer_image" TEXT,
    "question_topics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "question_subTopics" TEXT[],
    "question_year" TEXT,
    "question_difficulty_level" TEXT,
    "correct_answer" TEXT,
    "imageCordinates" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "question_text" TEXT,
    "notes_url" TEXT,
    "video_url" TEXT,
    "worksheet_url" TEXT,

    CONSTRAINT "questionInfo_pkey" PRIMARY KEY ("question_number","PaperNum")
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_board_id_key" ON "Board"("board_id");

-- CreateIndex
CREATE UNIQUE INDEX "PaperInfo_paperId_key" ON "PaperInfo"("paperId");

-- CreateIndex
CREATE UNIQUE INDEX "questionInfo_unique_question_id_key" ON "questionInfo"("unique_question_id");

-- AddForeignKey
ALTER TABLE "PaperInfo" ADD CONSTRAINT "PaperInfo_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "Board"("board_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paper_question" ADD CONSTRAINT "paper_question_PaperNum_fkey" FOREIGN KEY ("PaperNum") REFERENCES "PaperInfo"("paperId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paper_question" ADD CONSTRAINT "paper_question_question_number_PaperNum_fkey" FOREIGN KEY ("question_number", "PaperNum") REFERENCES "questionInfo"("question_number", "PaperNum") ON DELETE RESTRICT ON UPDATE CASCADE;
