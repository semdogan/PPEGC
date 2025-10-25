-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CLINICIAN',
    "institution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "tumorOncoTree" TEXT NOT NULL,
    "icd10" TEXT,
    "stage" TEXT NOT NULL,
    "histology" TEXT,
    "ageBand" TEXT NOT NULL,
    "careContext" TEXT NOT NULL,
    "msiTmb" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MolecularFinding" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "gene" TEXT NOT NULL,
    "hgvs_p" TEXT,
    "hgvs_c" TEXT,
    "variantClass" TEXT,
    "pathway" TEXT,
    "build" TEXT NOT NULL,
    "assay" TEXT NOT NULL,
    "vafBin" TEXT,
    "sampleSite" TEXT,

    CONSTRAINT "MolecularFinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TherapyLine" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "line" INTEGER NOT NULL,
    "drugs" TEXT NOT NULL,
    "bestResponse" TEXT NOT NULL,
    "durationBin" TEXT NOT NULL,
    "toxicityBin" TEXT NOT NULL,

    CONSTRAINT "TherapyLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutcomeTag" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "OutcomeTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Narrative" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "clinicalQuestion" TEXT,
    "exceptionalAspect" TEXT,
    "timelineText" TEXT,
    "mtbDiscussed" BOOLEAN NOT NULL DEFAULT false,
    "impactSummary" TEXT,
    "sensitivityScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "Narrative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataGovernance" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "sharingTier" TEXT NOT NULL,
    "allowedUses" TEXT,
    "license" TEXT,
    "allowCommercial" BOOLEAN NOT NULL DEFAULT false,
    "allowMLNarrative" BOOLEAN NOT NULL DEFAULT false,
    "academicOnly" BOOLEAN NOT NULL DEFAULT true,
    "embargoUntil" TIMESTAMP(3),
    "ethicsRef" TEXT,
    "lastReviewedAt" TIMESTAMP(3),

    CONSTRAINT "DataGovernance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isModeratorNote" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "caseId" TEXT,
    "userId" TEXT,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "meta" TEXT,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Case_tumorOncoTree_stage_createdAt_idx" ON "Case"("tumorOncoTree", "stage", "createdAt");

-- CreateIndex
CREATE INDEX "MolecularFinding_gene_idx" ON "MolecularFinding"("gene");

-- CreateIndex
CREATE INDEX "MolecularFinding_hgvs_p_idx" ON "MolecularFinding"("hgvs_p");

-- CreateIndex
CREATE INDEX "MolecularFinding_hgvs_c_idx" ON "MolecularFinding"("hgvs_c");

-- CreateIndex
CREATE UNIQUE INDEX "Narrative_caseId_key" ON "Narrative"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "DataGovernance_caseId_key" ON "DataGovernance"("caseId");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MolecularFinding" ADD CONSTRAINT "MolecularFinding_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapyLine" ADD CONSTRAINT "TherapyLine_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutcomeTag" ADD CONSTRAINT "OutcomeTag_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Narrative" ADD CONSTRAINT "Narrative_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataGovernance" ADD CONSTRAINT "DataGovernance_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
