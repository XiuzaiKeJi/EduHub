-- CreateTable
CREATE TABLE "TeachingPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "objectives" TEXT,
    "semester" TEXT,
    "academicYear" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TeachingPlan_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeachingPlanProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "weekNumber" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "completionRate" REAL NOT NULL DEFAULT 0,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TeachingPlanProgress_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TeachingPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeachingPlanResource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER,
    "format" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TeachingPlanResource_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TeachingPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TeachingPlan_courseId_idx" ON "TeachingPlan"("courseId");

-- CreateIndex
CREATE INDEX "TeachingPlanProgress_planId_idx" ON "TeachingPlanProgress"("planId");

-- CreateIndex
CREATE INDEX "TeachingPlanProgress_status_idx" ON "TeachingPlanProgress"("status");

-- CreateIndex
CREATE INDEX "TeachingPlanResource_planId_idx" ON "TeachingPlanResource"("planId");
