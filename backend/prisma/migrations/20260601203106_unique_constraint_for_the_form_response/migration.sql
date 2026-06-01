/*
  Warnings:

  - A unique constraint covering the columns `[form_id,application_id]` on the table `FormResponse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FormResponse_form_id_application_id_key" ON "FormResponse"("form_id", "application_id");
