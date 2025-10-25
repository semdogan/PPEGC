// app/feed/page.tsx
import prisma from '@/lib/prisma';

export default async function FeedPage() {
  const items = await prisma.case.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { findings: true, therapies: true, outcomeTags: true, narrative: true },
  });

  return (
    <div className="card">
      <h1>Latest Cases</h1>
      <div className="card-list">
        {items.length === 0 && <p className="note">No cases yet.</p>}
        {items.map((c) => (
          <div key={c.id} className="card">
            <strong>{c.tumorOncoTree}</strong> • <strong>{c.findings?.[0]?.gene || 'GENE'}</strong> {c.findings?.[0]?.hgvs_p || ''}
            <div className="meta">Created: {new Date(c.createdAt).toLocaleString()}</div>
            {c.narrative?.impactSummary && <p style={{ marginTop: 8 }}>{c.narrative.impactSummary}</p>}
            <div className="chips" style={{ marginTop: 8 }}>
              {c.outcomeTags?.map((t: any, i: number) => (<span key={i} className="chip">{t.tag}</span>))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
