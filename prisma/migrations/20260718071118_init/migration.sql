-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "habit" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "coachingStyle" TEXT NOT NULL,
    "ageGroup" TEXT,
    "occupation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "DailyCheckIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "mood" TEXT NOT NULL,
    "stressLevel" INTEGER NOT NULL,
    "sleepQuality" INTEGER NOT NULL,
    "energyLevel" INTEGER NOT NULL,
    "currentUrge" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "triggers" TEXT NOT NULL,
    "reflection" TEXT,
    "completedGoal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BehaviorAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checkInId" TEXT NOT NULL,
    "behaviorSummary" TEXT NOT NULL,
    "emotionalAnalysis" TEXT NOT NULL,
    "triggerAnalysis" TEXT NOT NULL,
    "confidenceScore" INTEGER NOT NULL,
    "reasoning" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BehaviorAnalysis_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "DailyCheckIn" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiskPrediction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checkInId" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "factors" JSONB NOT NULL,
    "confidence" INTEGER NOT NULL,
    "reasoning" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RiskPrediction_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "DailyCheckIn" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoachingPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checkInId" TEXT NOT NULL,
    "motivationalMessage" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "personalizedSuggestion" TEXT NOT NULL,
    "replacementActivity" JSONB NOT NULL,
    "microGoal" JSONB NOT NULL,
    "reflectionQuestion" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoachingPlan_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "DailyCheckIn" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "totalCheckIns" INTEGER NOT NULL DEFAULT 0,
    "successfulDays" INTEGER NOT NULL DEFAULT 0,
    "moodTrend" JSONB NOT NULL DEFAULT [],
    "riskTrend" JSONB NOT NULL DEFAULT [],
    "habitFrequency" JSONB NOT NULL DEFAULT [],
    "achievements" JSONB NOT NULL DEFAULT [],
    "weeklyReflections" JSONB NOT NULL DEFAULT [],
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AIInsight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "actionable" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SmartNudge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "delivered" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "BehaviorAnalysis_checkInId_key" ON "BehaviorAnalysis"("checkInId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskPrediction_checkInId_key" ON "RiskPrediction"("checkInId");

-- CreateIndex
CREATE UNIQUE INDEX "CoachingPlan_checkInId_key" ON "CoachingPlan"("checkInId");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_key" ON "Progress"("userId");
