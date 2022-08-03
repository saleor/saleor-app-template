-- CreateTable
CREATE TABLE "AppRegistration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domain" TEXT NOT NULL,
    "token" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AppRegistration_domain_key" ON "AppRegistration"("domain");
