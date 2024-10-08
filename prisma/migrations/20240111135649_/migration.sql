-- AlterTable
ALTER TABLE "PaperInfo" ADD COLUMN     "created_by" TEXT;

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "plan_id" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "plan_price" INTEGER NOT NULL,
    "plan_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "image" TEXT,
    "school_name" TEXT,
    "is_subject" BOOLEAN NOT NULL DEFAULT false,
    "subscribed_date" TEXT,
    "plan_id" TEXT,
    "plan_validity" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAttempt" (
    "id" SERIAL NOT NULL,
    "attemptId" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "paper_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "StudentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptedAnswer" (
    "id" SERIAL NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "paper_id" TEXT NOT NULL,
    "question_number" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "AttemptedAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_plan_id_key" ON "Plan"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_student_id_key" ON "Student"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAttempt_attemptId_key" ON "StudentAttempt"("attemptId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("plan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttempt" ADD CONSTRAINT "StudentAttempt_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttempt" ADD CONSTRAINT "StudentAttempt_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "PaperInfo"("paperId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptedAnswer" ADD CONSTRAINT "AttemptedAnswer_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "StudentAttempt"("attemptId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptedAnswer" ADD CONSTRAINT "AttemptedAnswer_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "PaperInfo"("paperId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptedAnswer" ADD CONSTRAINT "AttemptedAnswer_question_number_paper_id_fkey" FOREIGN KEY ("question_number", "paper_id") REFERENCES "questionInfo"("question_number", "PaperNum") ON DELETE RESTRICT ON UPDATE CASCADE;
