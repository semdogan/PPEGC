export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import prisma from '@/lib/prisma';

function timeAgo(ts: string | Date) {
  const t = typeof ts === 'string' ? new Date(ts) : ts;
  const diffMs = Date.now() - t.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return `${days} d ago`;
}

export default async function FeedPage() {
  const cases = await prisma.case.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      findings: true,
      outcomeTags: true,
      therapies: true,
      narrative: true,
      createdBy: true, // if available
    },
  });

  return (
    <main className="container">
      <header className="header">
        <h1>PEGCC — Recent Cases</h1>
        <a className="primaryLink" href="/quick-case">+ Submit a case</a>
      </header>

      {cases.length === 0 ? (
        <p className="muted">No cases yet. Submit your first on the Quick Case page.</p>
      ) : (
        <ul className="grid">
          {cases.map(c => {
            const title = c.title ?? `${c.tumorOncoTree} • ${c.findings[0]?.gene ?? '—'}`;
            const submittedAt = c.createdAt;
            const alias = (c as any).createdBy?.alias ?? (c as any).createdBy?.institution ?? 'Clinician';

            return (
              <li key={c.id} className="card">
                <div className="cardHeader">
                  <div className="cardTitle">{title}</div>
                  <div className="meta">
                    <span>Submitted {new Date(submittedAt).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short'})}</span>
                    <span className="dot">•</span>
                    <span>{timeAgo(submittedAt)}</span>
                    <span className="dot">•</span>
                    <span>by {alias}</span>
                  </div>
                </div>

                {c.outcomeTags?.length > 0 && (
                  <div className="tags">
                    {c.outcomeTags.map(t => (
                      <span key={t.id} className="tag">{t.tag}</span>
                    ))}
                  </div>
                )}

                {c.narrative?.impactSummary && (
                  <p className="summary">{c.narrative.impactSummary}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
