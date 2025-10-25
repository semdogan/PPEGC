import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function basicPhiScan(s: string) {
  const patterns = [
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    /\b(\+?\d[\d\s\-()]{7,})\b/,
    /\b(0?[1-9]|[12][0-9]|3[01])[\/-](0?[1-9]|1[0-2])[\/-](\d{4})\b/,
    /\b(Mr|Mrs|Ms|Dr)\.?\s+[A-Z][a-z]+/
  ];
  return patterns.some((re) => re.test(s));
}

export async function GET() {
  const rows = await prisma.case.findMany({
    orderBy: { createdAt: 'desc' }, take: 20,
    include: { findings: true, therapies: true, outcomeTags: true, narrative: true }
  });
  return NextResponse.json({ ok: true, cases: rows });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { tumor, gene, hgvs, outcome, response, duration, toxicity, summary, attest } = body || {} as any;
  if (!attest)  return NextResponse.json({ ok: false, error: 'Attestation required' }, { status: 400 });
  if (!tumor || !gene) return NextResponse.json({ ok: false, error: 'Tumor and gene are required' }, { status: 400 });

  const text = [summary, outcome, hgvs].filter(Boolean).join(' ');
  if (text && basicPhiScan(text)) {
    return NextResponse.json({ ok: false, error: 'Text appears to contain PHI. Use month–year, no names/places.' }, { status: 400 });
  }

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo.submitter@pegcc.local' },
    update: {},
    create: { email: 'demo.submitter@pegcc.local', name: 'PEGCC Demo', role: 'CLINICIAN' }
  });

  const created = await prisma.case.create({
    data: {
      tumorOncoTree: String(tumor),
      stage: 'Unknown',
      histology: null,
      ageBand: 'Unknown',
      careContext: 'Metastatic',
      msiTmb: 'Unknown',
      createdById: demoUser.id,
      findings: gene ? { create: [{ gene: String(gene).toUpperCase(), hgvs_p: hgvs || null, build: 'GRCh38', assay: 'Panel' }] } : undefined,
      narrative: summary ? { create: { clinicalQuestion: null, exceptionalAspect: outcome || null, timelineText: null, mtbDiscussed: false, impactSummary: summary, sensitivityScore: 0.2 } } : undefined,
      outcomeTags: outcome ? { create: [{ tag: String(outcome) }] } : undefined,
      governance: { create: { sharingTier: 'Community', academicOnly: true, allowCommercial: false, allowMLNarrative: false, license: 'PEGCC-Data-DUA-1.0' } }
    }
  });

  return NextResponse.json({ ok: true, id: created.id });
}
