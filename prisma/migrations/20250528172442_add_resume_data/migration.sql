/*
Warnings:

- Added the required column `resume_data` to the `candidates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "candidates"
ADD COLUMN "resume_data" JSONB NOT NULL DEFAULT '{}';