-- CreateTable
CREATE TABLE "TacoBell" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "osmId" TEXT NOT NULL,
    "name" TEXT,
    "brand" TEXT,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postcode" TEXT,
    "lat" REAL NOT NULL,
    "lon" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Apartment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "osmId" TEXT NOT NULL,
    "name" TEXT,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postcode" TEXT,
    "lat" REAL NOT NULL,
    "lon" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ApartmentProximity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tacoBellId" INTEGER NOT NULL,
    "apartmentId" INTEGER NOT NULL,
    "distanceM" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApartmentProximity_tacoBellId_fkey" FOREIGN KEY ("tacoBellId") REFERENCES "TacoBell" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ApartmentProximity_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TacoBell_osmId_key" ON "TacoBell"("osmId");

-- CreateIndex
CREATE UNIQUE INDEX "Apartment_osmId_key" ON "Apartment"("osmId");

-- CreateIndex
CREATE INDEX "ApartmentProximity_tacoBellId_idx" ON "ApartmentProximity"("tacoBellId");

-- CreateIndex
CREATE INDEX "ApartmentProximity_apartmentId_idx" ON "ApartmentProximity"("apartmentId");

-- CreateIndex
CREATE INDEX "ApartmentProximity_distanceM_idx" ON "ApartmentProximity"("distanceM");

-- CreateIndex
CREATE UNIQUE INDEX "ApartmentProximity_tacoBellId_apartmentId_key" ON "ApartmentProximity"("tacoBellId", "apartmentId");
