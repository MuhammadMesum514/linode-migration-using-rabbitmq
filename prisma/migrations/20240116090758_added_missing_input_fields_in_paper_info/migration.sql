-- AlterTable
ALTER TABLE "PaperInfo" ALTER COLUMN "ci_file_size" DROP DEFAULT,
ALTER COLUMN "ci_updated_at" DROP DEFAULT,
ALTER COLUMN "ci_updated_by" DROP DEFAULT,
ALTER COLUMN "insert_file_size" DROP DEFAULT,
ALTER COLUMN "insert_updated_at" DROP DEFAULT,
ALTER COLUMN "insert_updated_by" DROP DEFAULT,
ALTER COLUMN "ms_file_size" DROP DEFAULT,
ALTER COLUMN "ms_updated_at" DROP DEFAULT,
ALTER COLUMN "ms_updated_by" DROP DEFAULT,
ALTER COLUMN "qp_file_size" DROP DEFAULT,
ALTER COLUMN "qp_updated_at" DROP DEFAULT,
ALTER COLUMN "qp_updated_by" DROP DEFAULT;
